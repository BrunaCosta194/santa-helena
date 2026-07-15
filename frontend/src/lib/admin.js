// Operações do painel (exigem sessão de admin — o RLS garante no servidor).
import { supabase } from "./supabase";

// ── Pedidos ──
export async function listarPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*, itens_pedido(*), zonas_entrega(nome_bairro)")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function atualizarStatusPedido(id, status) {
  const { error } = await supabase
    .from("pedidos")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ── Produtos (inclui inativos — só admin enxerga) ──
export async function listarProdutosAdmin() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("nome");
  if (error) throw error;
  return data ?? [];
}

export async function salvarProduto(produto) {
  const registro = {
    categoria_id: produto.categoria_id || null,
    nome: produto.nome,
    descricao: produto.descricao || null,
    foto_url: produto.foto_url || null,
    tipo_venda: produto.tipo_venda,
    unidade_medida: produto.unidade_medida,
    preco: Number(produto.preco) || 0,
    preco_promocional:
      produto.preco_promocional === "" || produto.preco_promocional == null
        ? null
        : Number(produto.preco_promocional),
    disponivel_hoje: Boolean(produto.disponivel_hoje),
    ativo: Boolean(produto.ativo),
  };
  if (produto.id) registro.id = produto.id;

  const { data: salvo, error } = await supabase
    .from("produtos")
    .upsert(registro)
    .select()
    .single();
  if (error) throw error;
  return salvo;
}

// Atualização rápida usada na rotina diária (liga/desliga + preço + promoção).
export async function atualizarProdutoRapido(id, campos) {
  const registro = {};
  if ("disponivel_hoje" in campos)
    registro.disponivel_hoje = Boolean(campos.disponivel_hoje);
  if ("ativo" in campos) registro.ativo = Boolean(campos.ativo);
  if ("preco" in campos) registro.preco = Number(campos.preco) || 0;
  if ("preco_promocional" in campos) {
    registro.preco_promocional =
      campos.preco_promocional === "" || campos.preco_promocional == null
        ? null
        : Number(campos.preco_promocional);
  }
  const { error } = await supabase.from("produtos").update(registro).eq("id", id);
  if (error) throw error;
}

export async function excluirProduto(id) {
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw error;
}

// ── Categorias (CRUD) ──
export async function listarCategoriasAdmin() {
  const { data } = await supabase.from("categorias").select("*").order("ordem");
  return data ?? [];
}

export async function salvarCategoria(categoria) {
  const registro = {
    nome: categoria.nome,
    icone: categoria.icone || null,
    ordem: Number(categoria.ordem) || 0,
    ativo: categoria.ativo ?? true,
  };
  if (categoria.id) registro.id = categoria.id;
  const { error } = await supabase.from("categorias").upsert(registro);
  if (error) throw error;
}

export async function excluirCategoria(id) {
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw error;
}

// ── Clientes (lista + histórico) ──
export async function listarClientes() {
  // Cada linha de perfil vira um cliente. Contamos pedidos e somamos totais
  // a partir da tabela `pedidos` — RLS de admin libera a leitura completa.
  const [{ data: perfis, error }, { data: pedidos }] = await Promise.all([
    supabase
      .from("perfis")
      .select("id, nome, telefone, endereco, papel, criado_em")
      .eq("papel", "cliente")
      .order("criado_em", { ascending: false }),
    supabase.from("pedidos").select("cliente_id, total, criado_em"),
  ]);
  if (error) throw error;

  const porCliente = new Map();
  for (const p of pedidos ?? []) {
    if (!p.cliente_id) continue;
    const atual = porCliente.get(p.cliente_id) ?? {
      pedidos: 0,
      total: 0,
      ultimo: null,
    };
    atual.pedidos += 1;
    atual.total += Number(p.total) || 0;
    if (!atual.ultimo || p.criado_em > atual.ultimo) atual.ultimo = p.criado_em;
    porCliente.set(p.cliente_id, atual);
  }

  return (perfis ?? []).map((c) => {
    const stats = porCliente.get(c.id) ?? { pedidos: 0, total: 0, ultimo: null };
    return { ...c, ...stats };
  });
}

export async function listarPedidosDoCliente(clienteId) {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .eq("cliente_id", clienteId)
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Zonas de entrega ──
export async function listarZonasAdmin() {
  const { data } = await supabase
    .from("zonas_entrega")
    .select("*")
    .order("valor_frete");
  return data ?? [];
}

export async function salvarZona(zona) {
  const registro = {
    nome_bairro: zona.nome_bairro,
    valor_frete: Number(zona.valor_frete) || 0,
    ativo: zona.ativo ?? true,
  };
  if (zona.id) registro.id = zona.id;
  const { error } = await supabase.from("zonas_entrega").upsert(registro);
  if (error) throw error;
}

export async function excluirZona(id) {
  const { error } = await supabase.from("zonas_entrega").delete().eq("id", id);
  if (error) throw error;
}

// ── Configurações ──
export async function salvarConfiguracoes(config) {
  const { error } = await supabase
    .from("configuracoes")
    .update({
      whatsapp_joice: config.whatsapp_joice || null,
      desconto_1a_compra_pct: Number(config.desconto_1a_compra_pct) || 0,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw error;
}

// ── Upload de foto (Storage: bucket "produtos") ──
export async function enviarFotoProduto(file) {
  const ext = file.name.split(".").pop();
  const caminho = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("produtos")
    .upload(caminho, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("produtos").getPublicUrl(caminho);
  return data.publicUrl;
}

// ── Meus pedidos (cliente logado) ──
export async function listarMeusPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
