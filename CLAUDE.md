# CLAUDE.md — Sacolão Santa Helena

Contexto para o Claude Code continuar este projeto. **Leia o spec antes de mudar
comportamento significativo:**
[`docs/specs/2026-07-15-sacolao-santa-helena-design.md`](docs/specs/2026-07-15-sacolao-santa-helena-design.md).

## O que é

Pedidos online para um **sacolão/hortifruti** ("iFood do mercado"). A dona, **Joice**,
publica o que tem hoje e as promoções; o cliente pede pelo site. Vende frutas, verduras,
legumes, saladas prontas, bebidas, ovos e guloseimas. Pagamento na entrega (online é fase
2). Login opcional, com base de clientes visível para o cliente (próprio histórico) e
para a Joice (lista + histórico). Marca: **Sacolão Santa Helena** —
*"Qualidade · Frescor · Economia"*.

> **Nota:** o spec (seção 1) lista as categorias originais planejadas (Frutas, Verduras,
> Temperos, Polpas, Saladas). O catálogo real que a Joice mandou não usa Temperos/Polpas
> e trouxe categorias novas (Legumes, Bebidas, Ovos, Guloseimas) — ver seção "Catálogo
> real" abaixo. O spec ficou desatualizado nesse ponto; as categorias vivas são as do
> `dados-exemplo.js`.

## Redesign 2026-07-15 — "cara de quitanda"

O visual original era literalmente o `index.css` do doceria remapeado (fonte Fraunces
serifada, aliases `--rosa-*`/`--salvia-*` etc.) — lia como confeitaria elegante, não
feira. Trocado via pesquisa na skill `ui-ux-pro-max` (produto "Grocery", estilo Flat
Design) + logo real da Joice.

**O que mudou:**
- **Logo real** aplicado em `frontend/src/assets/logo.png`, usado em `Cabecalho.jsx`,
  `Rodape.jsx` e `PainelLayout.jsx` via a classe global `.marca__selo`.
  *(Atualizado em 2026-07-20 — ver "Logo e favicon oficiais" abaixo.)*
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
- Emoji decorativo no **hero** (`.hero__foto` 🍎🥬🍅 em `Catalogo.jsx`) e textos tipo
  "Feito no capricho 🥬" — ainda placeholder. Os **cards de produto já usam foto real**
  (ver "Fotos do catálogo" abaixo); o hero não.
- Aliases CSS antigos do doceria (`--rosa-*`, `--salvia-*`, `--lavanda-*`, `--cacau-*`)
  continuam remapeados pra paleta nova — não foram removidos, ~69 usos em 10 arquivos;
  seguro porque a indireção já existia, mas seria uma limpeza futura de nome.

**Servidor de dev:** `npm run dev --prefix frontend -- --port 5176` já testado, roda em
modo mock (sem `.env`) mostrando catálogo/ofertas normalmente. Entrada
`sacolao-frontend` adicionada em `~/.claude/skills/.claude/launch.json` pra preview.

> A skill `ui-ux-pro-max` usada nessa pesquisa foi **desinstalada** depois a pedido da
> Bruna ("muito ruim") — não tentar invocá-la em sessões futuras.

## Catálogo real (2026-07-16)

`frontend/src/lib/dados-exemplo.js` trocou de 12 produtos fictícios pra **~84 produtos
reais** que a Joice mandou por WhatsApp (preços e itens do dia a dia dela). Categorias
viraram 7: **Frutas, Verduras, Legumes, Saladas (prontos), Bebidas, Ovos, Guloseimas**
(as 3 últimas são novas, Temperos/Polpas saíram por não ter item real). A função `item()`
no arquivo monta cada produto (reduz repetição); tem parâmetro opcional
`precoPromocional` pro item entrar em "Ofertas do dia".

5 itens têm promoção ativa pra "Ofertas do dia" não ficar vazio: Banana prata (4,99),
Abacaxi pérola (7,90), Alface crespa (2,99), Tomate italiano (4,49), Cenoura (6,49).
Trocar/adicionar promoções é só editar `precoPromocional` no mock (ou, com Supabase
ligado, pelo painel → Produtos).

**Assunções feitas ao importar a lista da Joice (conferir com ela):**
- **Morango**: sem unidade especificada na lista → botei "caixa" R$13,90.
- **Melão picado**: ela mandou 2 preços diferentes (15,00 e 14,90 bandeja) → mantidos
  como 2 itens separados (`p-melao-picado-cuba` e `p-melao-picado-bandeja`); pode ser
  erro de digitação dela.
- **Abóbora cabotiá descascada**: sem unidade clara → botei por kg R$9,90.
- "Bala de gola" (provável erro de digitação) → corrigido pra "Bala de goma".
- Nota dela de "pedidos grandes de frutas picadas, com 1 dia de antecedência" foi só pro
  texto da `descricao` dos itens de fruta picada — sistema não tem agendamento de pedido
  (`sob_encomenda` foi removido do modelo no spec original, seção 3).

> `supabase/migrations/20260715120200_seed.sql` **ainda tem o catálogo fictício antigo**
> (5 categorias, 12 produtos) — só o mock do frontend foi atualizado. Ao ligar o
> Supabase de verdade, escrever um novo seed (ou script de import) com o catálogo real
> antes de ir pro ar, senão o banco fica com dados de exemplo enquanto o site mockado
> mostra outra coisa.

## Home / cards da loja (2026-07-16)

Mudanças de UX na home a pedido da Bruna, depois de ver print no celular:

- **Card sem navegação:** `ProdutoCard.jsx` não é mais `<Link>` pra `/produto/:id` — é
  `<article>` estático. Cliente adiciona direto no card, sem sair da tela. A rota
  `produto/:id` (`Produto.jsx`) continua existindo mas **nada mais linka pra ela**.
- **Adicionar com quantidade:** primeiro toque no "+" soma 1 passo (`passoQuantidade()`
  de `lib/formato.js` — ver "Passo de peso" abaixo pros valores atuais). A partir daí o
  botão vira um stepper `− quantidade +` embutido no card (lê/escreve direto no
  `CarrinhoContexto`), sem precisar abrir o carrinho pra ajustar.
- **Favoritos:** `loja/FavoritosContexto.jsx` (novo) — localStorage `sacolao-favoritos`,
  mesmo padrão do `CarrinhoContexto`. Coração no canto da foto em todo `ProdutoCard`.
  Não tem tela de "meus favoritos" ainda, só o toggle.
- **Ofertas do dia:** virou **carrossel horizontal** (`Catalogo.css`
  `.ofertas__carrossel` / `.ofertas__item`), cards no tamanho compacto (`compacta`),
  scroll-snap, scrollbar escondida. Antes era grid 2×2 que empilhava vertical.
- **Catálogo do dia:** cards compactos (`compacta`, sem descrição) em vez do card grande
  original — reduz scroll numa lista de ~84 itens. *(O layout do `compacta` foi
  refeito em 2026-07-20 — ver "Card do catálogo" abaixo.)*
- **Hierarquia dos títulos invertida:** "Ofertas do dia" / "Catálogo do dia" agora são o
  texto grande (`.secao-titulo`); o texto que antes era o `<h2>` grande virou subtítulo
  pequeno abaixo (`.secao-subtitulo`).
- `.filtros` (chips de categoria) ganhou `margin-bottom` — estava colado nos cards.

## Fotos, logo e card do catálogo (2026-07-20)

### Fotos do catálogo (84 imagens)

Os placeholders de gradiente+emoji saíram. Cada produto agora tem foto em
`frontend/public/produtos/<id>.jpg` (800×800, JPEG q82) e o mock monta
``foto_url: `/produtos/${id}.jpg` `` direto no `item()` de `dados-exemplo.js` — o nome do
arquivo **é o `id` do produto**, então basta trocar o `.jpg` mantendo o nome pra trocar
uma foto.

As imagens foram **geradas por IA**, não são fotos reais da loja da Joice. O gerador está
fora do repo, em `~/Downloads/gerador-imagem/gerador_pollinations.py` (Pollinations/Flux,
grátis, sem chave de API). Ele reaproveita a lista de produtos do script antigo do Gemini
e tem um dicionário PT→EN: **o Flux erra feio com nome de produto em português**
("cebolas roxas" virou outra coisa), então o prompt de estilo é em inglês e cada produto
tem tradução. O script pula arquivos que já existem — apagar o `.jpg` e rodar de novo
regenera só aquele.

> **Fotos de Bebidas são o ponto fraco:** o Flux não desenha marca (Coca/Fanta/Sprite),
> então saíram latas/garrafas genéricas — a de cola inclusive com cor errada. Trocar por
> foto real quando der. Frutas brasileiras raras (caqui, atemoia, ponkan) saíram
> aproximadas.

> **Ao ligar o Supabase:** essas fotos são servidas do `public/` do frontend e só existem
> porque o **mock** aponta pra elas. Com `.env` configurado, `foto_url` passa a vir da
> tabela `produtos` — se o seed não tiver esses caminhos, o catálogo fica sem imagem. Ou
> semear `foto_url = '/produtos/<id>.jpg'`, ou subir as imagens pro bucket `produtos` do
> Storage e usar a URL pública.

### Logo e favicon oficiais

A Joice mandou o logo em alta (PDF, badge circular verde). Dele saíram, com máscara
circular e **cantos transparentes**:

- `frontend/src/assets/logo.png` (512px) — header, rodapé, painel
- `frontend/public/favicon.png` (256px) e `apple-touch-icon.png` (180px)

Como o PNG agora é o selo circular completo (e não mais um print com fundo preto), o
`transform: scale(1.42)` do `.marca__selo img` virou **`scale(1.02)`** (só o suficiente
pra esconder a borda suave da máscara). `public/favicon.svg` e `icons.svg` continuam lá
mas o `index.html` só linka o `favicon.png` e o `apple-touch-icon.png`.

### Passo de peso (250g / 100g)

A pedido da Joice, quem vende por peso anda de **250g em 250g**:

- `passoQuantidade()`: `kg` → **0,25** (era 0,5); `unidade` → 1.
- Produtos por **100g** (`unidade_medida === "100g"`, ex.: alho, gengibre, uva granel,
  amendoim) são `tipo_venda: "unidade"` onde **cada unidade = 100g**; andam de 100g em
  100g naturalmente.
- `formatarQuantidade()` mostra peso em grama abaixo de 1kg e em kg acima:
  `250 g → 500 g → 750 g → 1 kg → 1,25 kg`. Os itens de 100g usam a mesma função
  (`quantidade × 0,1` kg), então mostram `100 g → 200 g → … → 1 kg`.
- `formatarQuantidadeCurta()` (nova) é usada **só no stepper do card compacto**: abrevia
  a unidade (`2 un`, `1 bdj`, `1 cx`). Sem isso "2 unidades" não cabe no card estreito do
  celular e empurra o botão "+" pra fora. O carrinho/resumo continua com o nome cheio.

> **A Edge Function valida o mesmo passo.** `PASSO_KG` em
> `supabase/functions/criar-pedido/index.ts` foi pra `0.25` junto. Se mudar o passo no
> frontend, **mudar lá também** — senão o servidor recusa o pedido com "Quantidade
> inválida".

### Oferta com cara de oferta

Card em promoção agora mostra **"De ~~R$ 9,50~~ / Por R$ 7,90"**, com o valor novo em
vermelho (`--oferta`). No `ProdutoCard.jsx` o bloco de preço ganha
`produto-card__precos--oferta`, `__preco--oferta` e um `<span class="__por">`.

> Detalhe de CSS que já mordeu: a regra base `.produto-card__preco` (cor verde) aparece
> **depois** no arquivo, então `.produto-card__preco--oferta` sozinho perdia por ordem de
> declaração. Por isso a regra vermelha é `.produto-card__preco.produto-card__preco--oferta`
> (2 classes).

### Ofertas do dia em toda categoria

O carrossel de ofertas só aparecia no filtro "Tudo". Agora aparece em qualquer categoria
e some só na aba "🔥 Ofertas" (onde a grade abaixo já lista as mesmas ofertas):
`ofertas.length > 0 && filtro !== OFERTAS` em `Catalogo.jsx`. No carrossel os cards são
verticais com nome/preço centralizados (escopo `.ofertas__item`).

### Card do catálogo — responsivo

O público compra **pelo celular** e não pode rolar muito. O `compacta` é mobile-first:

- **Celular (<640px):** linha — foto 72px à esquerda, texto à direita, 2 colunas na grade.
  Card ~135px, ~10 produtos por tela.
- **Desktop (≥640px):** card vertical, foto quadrada full-width (246px em 4 colunas).

Três armadilhas resolvidas aí, todas fáceis de reintroduzir:

1. **`min-width: 0` no `.produto-card__corpo`.** Item flex não encolhe por padrão
   (`min-width: auto`): sem isso o conteúdo vazava pra fora do card e o
   `overflow: hidden` **cortava o botão "+"** — dava pra adicionar, mas não aumentar.
2. **A foto usa `align-self: stretch` + `aspect-ratio: auto` no celular.** Travada em
   72px de altura num card de 135px, sobrava um bloco vazio embaixo (parecia
   desalinhado). O bloco `@media (min-width: 640px)` **precisa restaurar
   `aspect-ratio: 1/1`, `align-self: auto` e `min-height: 0`** — sem isso a foto do
   desktop fica achatada (246×72).
3. **Nome com altura fixa de 2 linhas** (`-webkit-line-clamp: 2` + `min-height`) pra
   manter a fileira alinhada.

### Nomes de produto encurtados

Nome com mais de ~18 caracteres não cabe em 2 linhas no card do celular (a coluna de
texto tem ~74px). 15 nomes foram encurtados em `dados-exemplo.js`; **o que saiu do nome
foi pra `descricao`** (ex.: "Garrafa retornável.", "Bandeja com 30 ovos extra branco.").

`Cheiro-verde` · `Ovos 30un` · `Cabotiá descascada` · `Coca-Cola 2L` · `Coca-Cola Zero 2L`
· `Fanta Laranja 2L` · `Salada de frutas` · `Uva higienizada` · `Melão picado bdj` ·
`Abóbora p/ doce` · `Amendoim temperado` · `Amendoim c/ casca` · `Amendoim (pote)` ·
`Jujuba e bala`

> Os nomes originais vieram da lista da Joice no WhatsApp. **Conferir com ela** se algum
> encurtado conflita com o jeito que ela chama o produto. Ao adicionar produto novo,
> manter o nome curto (≤ ~18 caracteres) ou ele trunca no celular.

### Rolagem horizontal no celular (corrigida)

Bug antigo: `.ofertas` usava `padding: 1rem 0 0.5rem`, que **zerava o padding lateral do
`.container`**. O `.ofertas__carrossel` compensa esse padding com margem negativa pra
sangrar até a borda — sem o padding, ele estourava ~35px e o site inteiro rolava pro
lado. Agora `.ofertas` só define `padding-top`/`padding-bottom`. **Não voltar a usar
`padding` shorthand nessa classe.**

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
- Identidade visual A aplicada em `frontend/src/index.css`, já com os ajustes do
  redesign "cara de quitanda": verde `#123B1E`, limão `#8CC63F`, creme kraft
  `#F7F1E3`, oferta vermelho-tijolo `#C0392B` (era `#E0492E`), dourado `#E6C33C`.

**Pendências pra ir pro ar:**
- Configurar `.env` no `frontend/` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  (sem isso, tudo roda em modo mock — o painel mostra tela "Supabase ainda não
  conectado").
- Rodar as migrations no projeto Supabase.
- Subir a Edge Function `criar-pedido` e setar os secrets no Supabase:
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `N8N_WEBHOOK_URL`.
- Configurar o n8n + Evolution API pra escutar o webhook e mandar mensagem no
  WhatsApp da Joice (`configuracoes.whatsapp_joice`).
- ~~Logo em alta~~ **feito** (2026-07-20). Fotos dos produtos: as 84 atuais são
  **geradas por IA** e servidas do `public/` — quando a Joice mandar foto real, subir
  pelo painel (vai pro Storage) ou trocar o `.jpg` mantendo o nome do `id`. Prioridade:
  as 7 de **Bebidas**, que saíram genéricas.
- **Semear `foto_url` no banco** (ou migrar as imagens pro Storage) antes de ligar o
  Supabase, senão o catálogo real fica sem foto — ver nota em "Fotos do catálogo".
- Promover uma conta pra `admin` no Supabase (`update perfis set papel = 'admin'
  where id = '<uuid>'`) pra acessar o painel.

## Como rodar

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Sem `.env`, roda com o catálogo real da Joice (~84 produtos, 7 categorias) do mock. Com
`.env` configurado, usa o Supabase real (que ainda tem o seed fictício antigo — ver nota
acima). O toggle é `lib/supabase.js` → `supabaseConfigurado`.

## Estrutura

```
sacolao-santa-helena/
├── CLAUDE.md
├── README.md
├── docs/specs/                          # spec (fonte da verdade)
├── frontend/
│   ├── index.html                       # meta + fontes Google + favicon
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── produtos/<id>.jpg            # 84 fotos do catálogo (nome = id do produto)
│   │   ├── favicon.png                  # logo circular 256px
│   │   └── apple-touch-icon.png         # logo circular 180px
│   └── src/
│       ├── App.jsx                      # rotas
│       ├── main.jsx
│       ├── index.css                    # design system (paleta A)
│       ├── loja/
│       │   ├── Catalogo.jsx             # hero + Ofertas (carrossel) + catálogo por categoria
│       │   ├── Produto.jsx              # seletor de quantidade (kg / unidade) — sem link de card
│       │   ├── Carrinho.jsx
│       │   ├── Checkout.jsx
│       │   ├── Confirmacao.jsx
│       │   ├── CarrinhoContexto.jsx     # localStorage: "sacolao-carrinho"
│       │   └── FavoritosContexto.jsx    # localStorage: "sacolao-favoritos"
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
│           ├── dados-exemplo.js         # catálogo real da Joice (~84 produtos, 7 categorias)
│           ├── admin.js                 # CRUD do painel
│           ├── api.js                   # invoca Edge Function criar-pedido
│           └── formato.js               # moeda, precoAtual, estaEmOferta, passoQuantidade,
│                                        # formatarQuantidade, formatarQuantidadeCurta
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
  unidade_medida ('kg'|'maço'|'pote'|'pacote'|'bandeja'|'unidade'|...), preco,
  preco_promocional (nullable), disponivel_hoje, ativo` — o catálogo real da Joice
  também usa `'100g'` e `'caixa'` como `unidade_medida` (rótulo livre, exibido como
  "por 100g" / "por caixa"; não é um enum fechado no código, só convenção do spec).
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
- Kg vai em passo de **0,25** (250g); unidade em passo de **1**. Validado no cliente
  (`passoQuantidade()`) **e** no servidor (`PASSO_KG` na Edge Function) — os dois
  precisam bater, senão o pedido é recusado.

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
