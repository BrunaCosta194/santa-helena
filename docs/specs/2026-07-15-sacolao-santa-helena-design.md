# Sacolão Santa Helena — Documento de Design (Spec)

> **Status:** estrutura aprovada · **Data:** 2026-07-15
> **Cliente:** Joice (dona do Sacolão Santa Helena)
> **Dev:** Bruna Costa (full-stack)
> **Base:** fork adaptado do projeto **doceria-bruna** (mesmo motor)

Sistema de pedidos online para um sacolão/hortifruti — "um iFood do mercado". Hoje a
Joice manda a lista do dia por WhatsApp; o sistema passa a ser o lugar onde ela publica
**o que tem hoje e as promoções**, e o cliente faz o pedido por lá. Vende de tudo:
frutas, verduras/legumes, **temperos, polpas de fruta e saladas prontas**. Pagamento
na entrega (online numa fase seguinte). Login opcional com base de clientes visível para
o cliente (próprio histórico) e para a Joice (lista + histórico).

Identidade: **Sacolão Santa Helena** · lema *"Qualidade · Frescor · Economia"*.

---

## 1. Decisões tomadas (brainstorm)

| Tema | Decisão |
|------|---------|
| Origem | **Fork do doceria-bruna** (Vite + Supabase + n8n/Evolution) |
| Plataforma | Site responsivo (web), mobile-first |
| Venda | **Mista**: por `kg` (cliente escolhe 0,5 / 1 / 1,5 kg…) **ou** por unidade (maço, pote, pacote, bandeja) |
| Peso | Cobra a **quantidade escolhida** (kg × preço); Joice acerta na entrega se pesar diferente |
| Lista do dia | **Liga/desliga por produto** (`disponivel_hoje`) + edição rápida de preço. Sem estoque no MVP |
| Ofertas | **Preço promocional** por produto; home destaca "Ofertas do dia" |
| Catálogo | Home = ofertas + navegação por **categoria**. Categorias: Frutas, Verduras, Temperos, Polpas, Saladas (editáveis no painel; "Ofertas" é dinâmica) |
| Clientes | Tela nova no painel: **lista + histórico** (contato, endereço, nº de pedidos, total gasto) |
| Frete | **Por bairro/região** (reaproveitado do doceria) |
| Pagamento | **Na entrega** no MVP; **pelo app** na fase 2 |
| Login | Email + **Google** + "meus pedidos" (reaproveitado) |
| Aviso de pedido | **WhatsApp** da Joice via n8n + Evolution API (reaproveitado) |

---

## 2. Identidade visual (opção A — "fresco e claro")

Base **clara** (creme/branco) pra as frutas e verduras "saltarem"; verde-escuro como cor
de marca no topo/rodapé e botões; limão para frescor/ofertas; dourado como detalhe.

**Paleta (extraída do logo):**

| Uso | Cor |
|-----|-----|
| Verde marca (header, botões, rodapé) | `#123B1E` |
| Verde escuro (badge) | `#0E2A16` |
| Limão (frescor, destaques, categoria ativa) | `#8CC63F` |
| Dourado (detalhes) | `#E6C33C` |
| Creme (fundo/base) | `#F6F8F0` |
| Oferta (etiquetas) | `#E0492E` |
| Cesta / tom quente | `#9C6B3B` |

> **Placeholders:** usar o logo atual (print do WhatsApp) e fotos de hortifruti de exemplo
> até a Joice enviar o **logo original em alta** e as **fotos reais dos produtos**. O
> sistema deve deixar a troca trivial (logo em um asset central; foto por produto no
> Storage). O visual final deve ser lapidado com a skill **`frontend-design`**.

---

## 3. Modelo de dados (mudanças vs doceria)

- **categorias** — `id, nome, icone, ordem, ativo` (ex: Frutas, Verduras, Temperos,
  Polpas, Saladas). "Ofertas" **não** é categoria: é uma visão dinâmica (produtos com
  `preco_promocional`).
- **produtos** — `id, categoria_id, nome, descricao, foto_url, ativo, criado_em`
  - `tipo_venda` — `'kg'` | `'unidade'`
  - `unidade_medida` — rótulo exibido: `kg`, `maço`, `pote`, `pacote`, `bandeja`, `unidade`
  - `preco` — por kg ou por unidade, conforme `tipo_venda`
  - `preco_promocional` — **nullable**; quando preenchido, o produto entra em "Ofertas"
  - `disponivel_hoje` — **bool**; a Joice liga/desliga a cada dia
- **zonas_entrega** — `id, nome_bairro, valor_frete, ativo` *(igual doceria)*
- **perfis** — `id, nome, telefone, endereco, papel ('cliente'|'admin'),
  desconto_1a_compra_usado, criado_em`
- **pedidos** — `id, cliente_id (nullable), nome_contato, telefone, tipo_entrega
  ('entrega'|'retirada'), zona_id, endereco, frete_valor, subtotal, desconto_valor,
  total, forma_pagamento ('entrega'|'online'), status, observacoes, criado_em`
  - `status`: `novo` → `em_separacao` → `a_caminho` → `entregue` (+ `cancelado`)
- **itens_pedido** — `id, pedido_id, produto_id, nome_snapshot, tipo_venda_snapshot,
  unidade_snapshot, quantidade (decimal — kg ou nº de unidades), preco_unit, subtotal`
- **configuracoes** — linha única: `whatsapp_joice, desconto_1a_compra_pct (opcional),
  ...`

**Removido do doceria:** `sob_encomenda` / encomenda-com-data, variações (sabor/tamanho),
versículo. **Aberto (confirmar com a Joice):** manter o desconto de 1ª compra? Vem herdado
e configurável — **default desligado** até ela decidir.

---

## 4. Telas

**Loja (público)**
1. **Home** — busca, chips de categoria, **Ofertas do dia** em destaque, e o catálogo
   por categoria (Frutas, Verduras, Temperos, Polpas, Saladas)
2. **Categoria / catálogo** — grade de produtos filtrável por categoria + busca
3. **Produto** — foto, descrição, seleção de **quantidade** (passos de kg para itens por
   peso; quantidade de unidades para os demais), preço atualiza
4. **Carrinho** — itens, quantidades, subtotal
5. **Checkout** — contato, entrega (zona → frete) ou retirada, pagamento (na entrega)
6. **Confirmação** — resumo do pedido

**Conta (cliente)**
7. **Cadastro / Login** (email + Google)
8. **Meus pedidos** — histórico do próprio cliente

**Painel (só Joice, protegido)**
9. **Pedidos** — lista + detalhe, mudar status
10. **Produtos** — CRUD, foto, `tipo_venda`/`unidade_medida`, **liga/desliga do dia** e
    **preço promocional** (edição rápida pra rotina diária)
11. **Categorias** — CRUD
12. **Clientes** — **nova**: lista com contato, endereço, nº de pedidos, total gasto e
    histórico
13. **Zonas de entrega** — CRUD bairro → frete
14. **Configurações** — WhatsApp da Joice, (opcional) % de desconto

---

## 5. O que se reaproveita do doceria (sem reescrever)

Auth (email + Google) · carrinho (Context + localStorage) · checkout (pagamento na
entrega) · pedidos + status no painel · frete por bairro · Edge Function `criar-pedido`
(preço calculado no servidor) · fluxo WhatsApp (n8n + Evolution API) · fallback mock sem
Supabase · RLS (cliente vê só o próprio pedido; painel exige `papel='admin'`).

---

## 6. Fases de entrega

**Fase 1 — MVP**
- Home (ofertas + catálogo por categoria) e páginas de produto com venda mista (kg/unid.)
- Carrinho + checkout (pagamento na entrega) + frete por bairro
- Login opcional + "meus pedidos"
- Painel: produtos (liga/desliga + preço + promoção), categorias, pedidos, **clientes**,
  zonas, configurações
- Aviso de pedido por WhatsApp
- Identidade visual A aplicada (com placeholders de logo/fotos)

**Fase 2 — depois**
- Pagamento **pelo app** (gateway — ex: Mercado Pago) na Edge Function
- **Remarketing** (n8n reoferece pelo histórico)
- Possíveis extras: controle de estoque/quantidade, cupons

---

## 7. Tratamento de erros (pontos de atenção)

- **Preço no servidor:** a Edge Function `criar-pedido` recalcula subtotal/frete/total a
  partir dos IDs e da quantidade — nunca confia no total do navegador. Se `preco_promocional`
  existe e o produto está `disponivel_hoje`, usa o preço promocional.
- **Produto indisponível** (`disponivel_hoje=false` ou `ativo=false`) no checkout → bloquear.
- **Quantidade inválida** (kg ≤ 0, passo inválido) → validar no servidor.
- **Falha no webhook do WhatsApp** não derruba o pedido (grava primeiro; notifica async).

---

## 8. Testes

- **Unitário:** cálculo de total por `kg` (quantidade × preço) e por unidade; aplicação de
  `preco_promocional`; frete por zona.
- **Integração:** `criar-pedido` (visitante e logado); RLS (cliente não vê pedido de
  outro; não-admin não acessa painel/clientes).
- **E2E (feliz):** montar pedido com item por kg + item por unidade → checkout →
  confirmação; pedido aparece no painel e dispara WhatsApp.

---

## 9. Fora de escopo (por ora)

- App nativo · pagamento online (fase 2) · controle de estoque · programa de pontos.
