# CLAUDE.md — Sacolão Santa Helena

Contexto para o Claude Code continuar este projeto. **Leia o spec antes de mudar
comportamento significativo:**
[`docs/specs/2026-07-15-sacolao-santa-helena-design.md`](docs/specs/2026-07-15-sacolao-santa-helena-design.md).

## O que é

Pedidos online para um **sacolão/hortifruti** ("iFood do mercado"). A dona, **Joice**,
publica o que tem hoje e as promoções; o cliente pede pelo site. Vende frutas, verduras,
**temperos, polpas e saladas prontas**. Pagamento na entrega (online é fase 2). Login
opcional, com base de clientes visível para o cliente (próprio histórico) e para a Joice
(lista + histórico). Marca: **Sacolão Santa Helena** — *"Qualidade · Frescor · Economia"*.

## Redesign 2026-07-15 — "cara de quitanda"

O visual original era literalmente o `index.css` do doceria remapeado (fonte Fraunces
serifada, aliases `--rosa-*`/`--salvia-*` etc.) — lia como confeitaria elegante, não
feira. Trocado via pesquisa na skill `ui-ux-pro-max` (produto "Grocery", estilo Flat
Design) + logo real da Joice.

**O que mudou:**
- **Logo real** aplicado: `frontend/src/assets/logo.png` (print do WhatsApp da Joice,
  fundo preto ao redor do círculo). Usado em `Cabecalho.jsx`, `Rodape.jsx` e
  `PainelLayout.jsx` via a classe global `.marca__selo` — círculo com
  `object-fit:cover` + `transform:scale(1.42)` pra cortar o preto do print e sobrar só
  o selo verde. **Quando a Joice mandar a arte original (idealmente com fundo
  transparente), trocar o arquivo e pode remover o `scale(1.42)`.**
- **Tipografia:** `Fraunces` (serifada) → **Nunito** (peso 800/900) nos títulos —
  `--fonte-display` em `index.css`. Corpo continua Hanken Grotesk. Import trocado em
  `index.html`.
- **Paleta:** verde do logo mantido (`--verde-marca #123B1E`); fundo `--creme` e
  `--creme-quente` esquentados pra tom kraft (`#F7F1E3`/`#EFE6D0`, eram pastel-esverdeados);
  `--oferta` mudou de laranja-doceria pra vermelho-tijolo de feira (`#C0392B`); `--tinta-*`
  (texto) esquentado; `--linha` (bordas) tom kraft. Novo par `--ambar`/`--ambar-escuro`
  (`#D97706`) disponível pra destaques quentes (ex: "ver tudo ›"), ainda pouco usado.
- **Chips de categoria** (`Catalogo.css` `.filtro`): de pill translúcida → bloco
  `--r-sm`, fonte Nunito 800 — "bate mais firme", menos "confeitaria".
- Itálico removido de todo lugar que usava `<em>` no nome da marca / título do hero
  (era Fraunces italic, cursiva de doceria); agora só cor de destaque, sem itálico.

**Ainda não mexido (fora do escopo pedido, ficou como estava):**
- Ícones de emoji como ícone funcional em `PainelLayout.jsx` (itens de nav: 🧾🥬🗂️👥🛵⚙️) —
  o `ui-ux-pro-max` recomenda SVG (Heroicons/Lucide) no lugar; painel é interno da Joice,
  baixa prioridade vs. a loja pro cliente.
- Emoji decorativo (placeholder de foto no hero, "Feito no capricho 🥬", etc.) — mantido
  de propósito como placeholder até ter fotos reais dos produtos.
- Aliases CSS antigos do doceria (`--rosa-*`, `--salvia-*`, `--lavanda-*`, `--cacau-*`)
  continuam remapeados pra paleta nova — não foram removidos, ~69 usos em 10 arquivos;
  seguro porque a indireção já existia, mas seria uma limpeza futura de nome.

**Servidor de dev:** `npm run dev --prefix frontend -- --port 5176` já testado, roda em
modo mock (sem `.env`) mostrando catálogo/ofertas normalmente. Entrada
`sacolao-frontend` adicionada em `~/.claude/skills/.claude/launch.json` pra preview.

## Estado atual

Fork do **doceria-bruna** já foi feito e o MVP (Fase 1) está **implementado**. O que
existe hoje:

- `frontend/` — SPA Vite + React 19, roteamento pronto, camada de dados com fallback
  mock (roda sem Supabase), auth (email + Google), carrinho, checkout, confirmação,
  painel completo (Pedidos, Produtos do dia, Categorias, Clientes, Zonas, Configurações).
- `supabase/migrations/` — schema do modelo misto (kg/unidade), RLS, seed com 5
  categorias e 12 produtos de exemplo, storage bucket `produtos`.
- `supabase/functions/criar-pedido/` — Edge Function que recalcula preço no servidor
  (usa `preco_promocional` quando presente, valida `disponivel_hoje`).
- Identidade visual A (verde `#123B1E`, limão `#8CC63F`, creme `#F6F8F0`, oferta
  `#E0492E`) aplicada em `frontend/src/index.css`.

**Pendências pra ir pro ar:**
- Configurar `.env` no `frontend/` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  (sem isso, tudo roda em modo mock — o painel mostra tela "Supabase ainda não
  conectado").
- Rodar as migrations no projeto Supabase.
- Subir a Edge Function `criar-pedido` e setar os secrets no Supabase:
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `N8N_WEBHOOK_URL`.
- Configurar o n8n + Evolution API pra escutar o webhook e mandar mensagem no
  WhatsApp da Joice (`configuracoes.whatsapp_joice`).
- Trocar placeholders quando a Joice enviar o **logo em alta** (asset central) e
  as **fotos reais** dos produtos (via upload no painel — vão pro Storage).
- Promover uma conta pra `admin` no Supabase (`update perfis set papel = 'admin'
  where id = '<uuid>'`) pra acessar o painel.

## Como rodar

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Sem `.env`, roda com dados de exemplo (12 produtos do mock). Com `.env` configurado,
usa o Supabase real. O toggle é `lib/supabase.js` → `supabaseConfigurado`.

## Estrutura

```
sacolao-santa-helena/
├── CLAUDE.md
├── README.md
├── docs/specs/                          # spec (fonte da verdade)
├── frontend/
│   ├── index.html                       # meta + fontes Google
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                      # rotas
│       ├── main.jsx
│       ├── index.css                    # design system (paleta A)
│       ├── loja/
│       │   ├── Catalogo.jsx             # hero + Ofertas + catálogo por categoria
│       │   ├── Produto.jsx              # seletor de quantidade (kg / unidade)
│       │   ├── Carrinho.jsx
│       │   ├── Checkout.jsx
│       │   ├── Confirmacao.jsx
│       │   └── CarrinhoContexto.jsx     # localStorage: "sacolao-carrinho"
│       ├── conta/
│       │   ├── AuthContexto.jsx         # supabase auth + perfil
│       │   ├── Entrar.jsx               # email + Google
│       │   └── MeusPedidos.jsx
│       ├── painel/
│       │   ├── PainelLayout.jsx
│       │   ├── PainelPedidos.jsx        # status: novo/em_separacao/a_caminho/entregue/cancelado
│       │   ├── PainelProdutos.jsx       # edição rápida (liga/desliga + preço + promoção)
│       │   ├── PainelCategorias.jsx     # CRUD
│       │   ├── PainelClientes.jsx       # lista + histórico
│       │   ├── PainelZonas.jsx
│       │   └── PainelConfig.jsx         # whatsapp_joice + % desconto
│       ├── componentes/                 # Cabecalho, Rodape, Botao, ProdutoCard, RotaProtegida, Layout
│       └── lib/
│           ├── supabase.js              # cliente + flag supabaseConfigurado
│           ├── dados.js                 # leitura pública (com fallback mock)
│           ├── dados-exemplo.js         # mock de 12 produtos
│           ├── admin.js                 # CRUD do painel
│           ├── api.js                   # invoca Edge Function criar-pedido
│           └── formato.js               # moeda, precoAtual, estaEmOferta,
│                                        # formatarQuantidade, passoQuantidade
└── supabase/
    ├── config.toml
    ├── migrations/
    │   ├── 20260715120000_schema.sql    # tabelas + trigger de perfil
    │   ├── 20260715120100_rls.sql       # RLS + helper eh_admin()
    │   ├── 20260715120200_seed.sql      # categorias, zonas, produtos
    │   └── 20260715120300_storage.sql   # bucket "produtos"
    └── functions/
        ├── _shared/cors.ts
        └── criar-pedido/index.ts        # recalcula preço no servidor
```

## Modelo de dados (resumo)

- **categorias**: `id, nome, icone, ordem, ativo`
- **produtos**: `id, categoria_id, nome, descricao, foto_url, tipo_venda ('kg'|'unidade'),
  unidade_medida ('kg'|'maço'|'pote'|'pacote'|'bandeja'|'unidade'), preco,
  preco_promocional (nullable), disponivel_hoje, ativo`
- **zonas_entrega**: `id, nome_bairro, valor_frete, ativo`
- **perfis**: `id, nome, telefone, endereco, papel ('cliente'|'admin'), desconto_1a_compra_usado`
- **pedidos**: `id, numero, cliente_id, nome_contato, telefone, tipo_entrega, zona_id,
  endereco, frete_valor, subtotal, desconto_valor, total, forma_pagamento, status,
  observacoes, criado_em` — status: `novo → em_separacao → a_caminho → entregue`
  (+ `cancelado`)
- **itens_pedido**: `id, pedido_id, produto_id, nome_snapshot, tipo_venda_snapshot,
  unidade_snapshot, quantidade (decimal), preco_unit, subtotal`
- **configuracoes** (linha única): `id=1, whatsapp_joice, desconto_1a_compra_pct`

## Regras importantes (não violar)

- **Preço é calculado no servidor** (`criar-pedido`): usa `preco_promocional` se
  presente; kg = quantidade × preço. Nunca confiar no total do navegador.
- Só entram no pedido produtos com `ativo=true` **e** `disponivel_hoje=true`.
- Itens do pedido guardam **snapshot** (nome, tipo_venda, unidade, preço) — histórico
  imutável mesmo se o produto sumir do catálogo.
- Segredos (Supabase service role, Evolution API) **nunca** no frontend — só nas Edge
  Functions e no n8n.
- Aviso de WhatsApp é **assíncrono**: grava o pedido primeiro; falha no webhook
  não derruba o pedido.
- Kg vai em passo de **0,5**; unidade em passo de **1**. Validado no cliente e no
  servidor (Edge Function).

## Fluxo do WhatsApp (n8n + Evolution API)

A Edge Function `criar-pedido` faz `POST` no `N8N_WEBHOOK_URL` com o resumo (número,
nome, telefone, total, itens). O n8n monta a mensagem e envia pela Evolution API ao
número da Joice (`configuracoes.whatsapp_joice`, só dígitos com DDI 55). Fase 2:
avisar o cliente na mudança de status + remarketing.

## Escopo

- **Fase 1 (MVP) — implementada:** home (ofertas + catálogo por categoria), produto
  (venda mista), carrinho, checkout (na entrega), frete por bairro, login opcional,
  painel completo (produtos/categorias/pedidos/clientes/zonas/config), aviso WhatsApp,
  identidade A com placeholders.
- **Fase 2:** pagamento pelo app (ex.: Mercado Pago), remarketing, (talvez) estoque.
- **Fora de escopo:** app nativo, fidelidade/pontos.

## Convenções

- Código e UI em **português (pt-BR)**.
- Componentes pequenos e focados; um arquivo, uma responsabilidade.
- Seguir a identidade A do spec (seção 2) e usar a skill `frontend-design` quando for
  lapidar visual.
- Aliases CSS antigos do doceria (`--rosa-*`, `--salvia-*`, `--lavanda-*`, `--cacau-*`)
  ainda existem no `index.css` remapeados para a paleta A — evita reescrever todos os
  CSS específicos. Ao criar CSS novo, prefira os tokens diretos (`--verde-marca`,
  `--limao`, `--oferta`, `--dourado`, `--creme`, `--tinta-*`).
