# CLAUDE.md — Sacolão Santa Helena

Contexto para o Claude Code continuar este projeto. **Leia o spec antes de implementar:**
[`docs/specs/2026-07-15-sacolao-santa-helena-design.md`](docs/specs/2026-07-15-sacolao-santa-helena-design.md).

## O que é

Pedidos online para um **sacolão/hortifruti** ("iFood do mercado"). A dona, **Joice**,
publica o que tem hoje e as promoções; o cliente pede pelo site. Vende frutas, verduras,
**temperos, polpas e saladas prontas**. Pagamento na entrega (online é fase 2). Login
opcional, com base de clientes visível para o cliente (próprio histórico) e para a Joice
(lista + histórico). Marca: **Sacolão Santa Helena** — *"Qualidade · Frescor · Economia"*.

## Este projeto é um FORK do doceria-bruna

O motor é o mesmo (Vite + Supabase + n8n/Evolution). **Primeiro passo de implementação:
copiar a base do doceria e adaptar** — não começar do zero.

```
# a partir do projeto doceria (ex.: ~/doceria-bruna)
# copie frontend/ e supabase/ para cá e depois adapte conforme o spec
```

**Reaproveita direto:** auth (email + Google), carrinho, checkout (na entrega), pedidos +
status, frete por bairro, Edge Function `criar-pedido`, fluxo WhatsApp (n8n), fallback mock,
RLS.

**Adapta / cria (ver spec seções 3–5):**
- **Modelo de produto → venda mista:** `tipo_venda` (`kg`|`unidade`), `unidade_medida`
  (kg/maço/pote/pacote/bandeja/unidade), `preco`, `preco_promocional` (nullable),
  `disponivel_hoje` (bool). Itens por kg: cliente escolhe quantidade (0,5/1/1,5…) e cobra
  quantidade × preço.
- **Home:** ofertas do dia + catálogo por **categoria** (Frutas, Verduras, Temperos,
  Polpas, Saladas). "Ofertas" é visão dinâmica (produtos com `preco_promocional`).
- **Painel:** produtos com **liga/desliga do dia + preço + promoção** (edição rápida),
  **Categorias** (CRUD) e **Clientes** (nova tela: lista + histórico).

**Remove do doceria:** encomenda-com-data, variações (sabor/tamanho), versículo, paleta
pastel.

## Identidade visual (opção A — fresco e claro)

Base clara; verde-escuro como marca; limão para ofertas; dourado de detalhe. Paleta:
`#123B1E` (marca), `#0E2A16` (badge), `#8CC63F` (limão), `#E6C33C` (dourado),
`#F6F8F0` (creme/base), `#E0492E` (oferta), `#9C6B3B` (quente).

**Placeholders:** usar o logo do WhatsApp e fotos de exemplo até a Joice enviar o **logo
original em alta** e as **fotos reais**. Deixar a troca trivial (logo num asset central;
foto por produto no Storage). Lapidar o visual com a skill `frontend-design`.

## Stack

- **Frontend:** React + Vite (SPA), mobile-first
- **Backend:** Supabase — Postgres + Auth + Storage + Edge Functions
- **Automação/WhatsApp:** n8n + Evolution API (desacoplado)

## Estrutura de pastas (alvo)

```
sacolao-santa-helena/
├── CLAUDE.md
├── docs/specs/               # spec (fonte da verdade)
├── frontend/src/
│   ├── loja/                 # home, categoria, produto, carrinho, checkout, confirmação
│   ├── conta/                # cadastro, login, meus pedidos
│   ├── painel/               # produtos, categorias, pedidos, clientes, zonas, config
│   ├── componentes/          # design system (verde/claro), compartilhados
│   └── lib/                  # cliente supabase, helpers
└── supabase/
    ├── migrations/           # schema (tabelas do spec, seção 3) + RLS + seed
    └── functions/            # Edge Functions (criar-pedido, etc.)
```

## Como começar

1. **Fork:** copiar `frontend/` e `supabase/` do doceria e renomear/rebrandizar.
2. **Migrations:** ajustar o schema para o modelo misto (seção 3 do spec); seed com as
   categorias (Frutas, Verduras, Temperos, Polpas, Saladas) e alguns produtos de exemplo.
3. **Loja:** home com ofertas + catálogo por categoria; página de produto com seleção de
   quantidade (passo de kg / unidades).
4. **Painel:** edição rápida diária (liga/desliga + preço + promoção); telas Categorias e
   Clientes.
5. **Rebranding:** aplicar a paleta A; trocar logo/fotos por placeholders.
6. (Opcional, recomendado) rodar a skill **`writing-plans`** para gerar o plano detalhado.

## Regras importantes (não violar)

- **Preço é calculado no servidor** (`criar-pedido`): usa `preco` ou `preco_promocional`
  conforme disponibilidade; kg = quantidade × preço. Nunca confiar no total do navegador.
- Só entram no pedido produtos com `ativo=true` **e** `disponivel_hoje=true`.
- Itens do pedido guardam **snapshot** (nome, tipo_venda, unidade, preço) — histórico imutável.
- Segredos (Supabase service role, Evolution API) **nunca** no frontend — só Edge Functions / n8n.
- Aviso de WhatsApp é **assíncrono**: grava o pedido primeiro; falha no webhook não derruba.

## Fluxo do WhatsApp (n8n + Evolution API)

Igual ao doceria: a Edge Function `criar-pedido` faz `POST` num `N8N_WEBHOOK_URL` com o
resumo do pedido; o n8n monta a mensagem e envia pela Evolution API ao número da Joice
(`configuracoes.whatsapp_joice`, só dígitos com DDI). Fase 2: avisar o cliente na mudança
de status + remarketing.

## Escopo

- **Fase 1 (MVP):** home (ofertas + catálogo por categoria), produto (venda mista),
  carrinho, checkout (na entrega), frete por bairro, login opcional, painel completo
  (produtos/categorias/pedidos/clientes/zonas/config), aviso WhatsApp, identidade A.
- **Fase 2:** pagamento pelo app, remarketing, (talvez) estoque.
- **Fora de escopo:** app nativo, fidelidade/pontos.

## Convenções

- Código e UI em **português (pt-BR)**.
- Componentes pequenos e focados; um arquivo, uma responsabilidade.
- Seguir a identidade A do spec (seção 2) e usar a skill `frontend-design`.
