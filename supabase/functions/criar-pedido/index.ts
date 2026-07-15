// ============================================================
// Edge Function: criar-pedido
// Fonte de verdade do preço. Recalcula subtotal, frete e desconto
// no servidor a partir dos IDs enviados, grava o pedido e dispara
// o webhook do n8n (assíncrono — falha dele não derruba o pedido).
//
// Modelo do Sacolão: venda mista (kg | unidade). Se preco_promocional
// estiver preenchido, ele é usado. Só entram produtos ativos e
// disponivel_hoje = true.
// ============================================================

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

interface ItemEntrada {
  produto_id: string;
  quantidade: number; // kg (0.5, 1, 1.5…) ou nº de unidades
}

interface Corpo {
  itens: ItemEntrada[];
  contato: { nome: string; telefone: string; endereco?: string };
  tipo_entrega: "entrega" | "retirada";
  zona_id?: string | null;
  observacoes?: string;
}

// Passo mínimo por tipo de venda. Evita quantidades absurdas
// (ex.: 0.001 kg) e mantém o preço arredondado.
const PASSO_KG = 0.5;
const PASSO_UNIDADE = 1;

function quantidadeValida(qtd: number, tipo: string): boolean {
  if (!Number.isFinite(qtd) || qtd <= 0) return false;
  const passo = tipo === "kg" ? PASSO_KG : PASSO_UNIDADE;
  // Tolerância p/ ponto flutuante (ex.: 1.5 / 0.5 = 3.0000000000000004).
  const razao = qtd / passo;
  return Math.abs(razao - Math.round(razao)) < 1e-6;
}

function arredondar2(v: number): number {
  return Math.round(v * 100) / 100;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ erro: "Método não permitido" }, 405);
  }

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // Cliente com o JWT do usuário (se logado) — só para descobrir quem é.
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUsuario = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
  } = await supabaseUsuario.auth.getUser();
  const clienteId = user?.id ?? null;

  // Cliente admin (service_role) para ler preços e gravar — ignora RLS.
  const db = createClient(url, serviceKey);

  let corpo: Corpo;
  try {
    corpo = await req.json();
  } catch {
    return json({ erro: "Corpo inválido" }, 400);
  }

  if (!corpo?.itens?.length) {
    return json({ erro: "O carrinho está vazio." }, 400);
  }
  if (!corpo.contato?.nome?.trim() || !corpo.contato?.telefone?.trim()) {
    return json({ erro: "Informe nome e telefone." }, 400);
  }

  // — Recalcula cada item a partir do banco —
  const itensGravar: {
    produto_id: string;
    nome_snapshot: string;
    tipo_venda_snapshot: string;
    unidade_snapshot: string;
    quantidade: number;
    preco_unit: number;
    subtotal: number;
  }[] = [];
  let subtotal = 0;

  for (const item of corpo.itens) {
    const { data: produto } = await db
      .from("produtos")
      .select(
        "id, nome, tipo_venda, unidade_medida, preco, preco_promocional, ativo, disponivel_hoje",
      )
      .eq("id", item.produto_id)
      .single();

    if (!produto || !produto.ativo || !produto.disponivel_hoje) {
      return json(
        { erro: `"${produto?.nome ?? "Um dos produtos"}" não está mais disponível hoje.` },
        409,
      );
    }

    const qtd = Number(item.quantidade);
    if (!quantidadeValida(qtd, produto.tipo_venda)) {
      const passo = produto.tipo_venda === "kg" ? "0,5" : "1";
      return json(
        { erro: `Quantidade inválida para "${produto.nome}" (passo de ${passo}).` },
        400,
      );
    }

    const precoBase = Number(produto.preco);
    const precoPromo = produto.preco_promocional != null
      ? Number(produto.preco_promocional)
      : null;
    const precoUnit = precoPromo != null && precoPromo < precoBase
      ? precoPromo
      : precoBase;

    const subItem = arredondar2(precoUnit * qtd);
    subtotal += subItem;

    itensGravar.push({
      produto_id: produto.id,
      nome_snapshot: produto.nome,
      tipo_venda_snapshot: produto.tipo_venda,
      unidade_snapshot: produto.unidade_medida,
      quantidade: qtd,
      preco_unit: precoUnit,
      subtotal: subItem,
    });
  }

  subtotal = arredondar2(subtotal);

  // — Frete —
  let freteValor = 0;
  if (corpo.tipo_entrega === "entrega") {
    if (!corpo.zona_id) return json({ erro: "Selecione o bairro." }, 400);
    if (!corpo.contato.endereco?.trim()) {
      return json({ erro: "Informe o endereço de entrega." }, 400);
    }
    const { data: zona } = await db
      .from("zonas_entrega")
      .select("id, valor_frete, ativo")
      .eq("id", corpo.zona_id)
      .single();
    if (!zona || !zona.ativo) {
      return json({ erro: "Bairro indisponível para entrega." }, 409);
    }
    freteValor = Number(zona.valor_frete);
  }

  // — Desconto de 1ª compra (opcional, default 0%) —
  let descontoValor = 0;
  let aplicarDesconto = false;
  if (clienteId) {
    const { data: perfil } = await db
      .from("perfis")
      .select("desconto_1a_compra_usado")
      .eq("id", clienteId)
      .single();
    if (perfil && !perfil.desconto_1a_compra_usado) {
      const { data: config } = await db
        .from("configuracoes")
        .select("desconto_1a_compra_pct")
        .eq("id", 1)
        .single();
      const pct = Number(config?.desconto_1a_compra_pct ?? 0);
      if (pct > 0) {
        descontoValor = arredondar2((subtotal * pct) / 100);
        aplicarDesconto = descontoValor > 0;
      }
    }
  }

  const total = Math.max(0, arredondar2(subtotal + freteValor - descontoValor));

  // — Grava o pedido —
  const { data: pedido, error: erroPedido } = await db
    .from("pedidos")
    .insert({
      cliente_id: clienteId,
      nome_contato: corpo.contato.nome.trim(),
      telefone: corpo.contato.telefone.trim(),
      tipo_entrega: corpo.tipo_entrega,
      zona_id: corpo.tipo_entrega === "entrega" ? corpo.zona_id : null,
      endereco:
        corpo.tipo_entrega === "entrega" ? corpo.contato.endereco?.trim() : null,
      frete_valor: freteValor,
      subtotal,
      desconto_valor: descontoValor,
      total,
      forma_pagamento: "entrega",
      status: "novo",
      observacoes: corpo.observacoes?.trim() || null,
    })
    .select("id, numero, total, subtotal, frete_valor, desconto_valor, criado_em")
    .single();

  if (erroPedido || !pedido) {
    return json({ erro: "Não foi possível gravar o pedido." }, 500);
  }

  const { error: erroItens } = await db.from("itens_pedido").insert(
    itensGravar.map((i) => ({
      pedido_id: pedido.id,
      produto_id: i.produto_id,
      nome_snapshot: i.nome_snapshot,
      tipo_venda_snapshot: i.tipo_venda_snapshot,
      unidade_snapshot: i.unidade_snapshot,
      quantidade: i.quantidade,
      preco_unit: i.preco_unit,
      subtotal: i.subtotal,
    })),
  );

  if (erroItens) {
    // Reverte o pedido para não deixar registro órfão.
    await db.from("pedidos").delete().eq("id", pedido.id);
    return json({ erro: "Não foi possível gravar os itens do pedido." }, 500);
  }

  // Marca o desconto como usado (não bloqueia o pedido em caso de falha).
  if (aplicarDesconto && clienteId) {
    await db
      .from("perfis")
      .update({ desconto_1a_compra_usado: true })
      .eq("id", clienteId);
  }

  // — Webhook do n8n: assíncrono e tolerante a falha —
  const webhook = Deno.env.get("N8N_WEBHOOK_URL");
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedido_id: pedido.id,
          numero: pedido.numero,
          nome: corpo.contato.nome,
          telefone: corpo.contato.telefone,
          total,
          tipo_entrega: corpo.tipo_entrega,
          status: "novo",
          itens: itensGravar.map((i) => ({
            nome: i.nome_snapshot,
            quantidade: i.quantidade,
            unidade: i.unidade_snapshot,
            preco_unit: i.preco_unit,
            subtotal: i.subtotal,
          })),
        }),
      });
    } catch (e) {
      console.error("Falha ao chamar webhook do n8n:", e);
    }
  }

  return json({
    pedido: {
      id: pedido.id,
      numero: pedido.numero,
      subtotal,
      frete_valor: freteValor,
      desconto_valor: descontoValor,
      total,
      criado_em: pedido.criado_em,
    },
  });
});
