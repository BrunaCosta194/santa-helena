-- ============================================================
-- Sacolão Santa Helena — Schema (seção 3 do spec)
-- Modelo de venda mista (kg | unidade), preço promocional,
-- disponivel_hoje (liga/desliga do dia). Sem variações.
-- ============================================================

create extension if not exists "pgcrypto";

-- — Categorias (Frutas, Verduras, Temperos, Polpas, Saladas...) —
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  icone text,
  ordem int not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- — Produtos (venda mista: kg ou unidade) —
create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references public.categorias (id) on delete set null,
  nome text not null,
  descricao text,
  foto_url text,
  tipo_venda text not null default 'unidade'
    check (tipo_venda in ('kg', 'unidade')),
  unidade_medida text not null default 'unidade'
    check (unidade_medida in ('kg', 'maço', 'pote', 'pacote', 'bandeja', 'unidade')),
  preco numeric(10, 2) not null check (preco >= 0),
  preco_promocional numeric(10, 2) check (preco_promocional is null or preco_promocional >= 0),
  disponivel_hoje boolean not null default true,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);
create index if not exists idx_produtos_categoria on public.produtos (categoria_id);
create index if not exists idx_produtos_disponivel on public.produtos (disponivel_hoje) where ativo;

-- — Zonas de entrega (bairro → frete) —
create table if not exists public.zonas_entrega (
  id uuid primary key default gen_random_uuid(),
  nome_bairro text not null,
  valor_frete numeric(10, 2) not null check (valor_frete >= 0),
  ativo boolean not null default true
);

-- — Perfis (1:1 com auth.users) —
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  telefone text,
  endereco text,
  papel text not null default 'cliente' check (papel in ('cliente', 'admin')),
  desconto_1a_compra_usado boolean not null default false,
  criado_em timestamptz not null default now()
);

-- — Pedidos —
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero bigint generated always as identity,
  cliente_id uuid references auth.users (id) on delete set null,
  nome_contato text not null,
  telefone text not null,
  tipo_entrega text not null check (tipo_entrega in ('entrega', 'retirada')),
  zona_id uuid references public.zonas_entrega (id) on delete set null,
  endereco text,
  frete_valor numeric(10, 2) not null default 0,
  subtotal numeric(10, 2) not null,
  desconto_valor numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  forma_pagamento text not null default 'entrega' check (forma_pagamento in ('entrega', 'online')),
  status text not null default 'novo'
    check (status in ('novo', 'em_separacao', 'a_caminho', 'entregue', 'cancelado')),
  observacoes text,
  criado_em timestamptz not null default now()
);
create index if not exists idx_pedidos_cliente on public.pedidos (cliente_id);
create index if not exists idx_pedidos_status on public.pedidos (status);

-- — Itens do pedido (snapshot imutável) —
-- quantidade é decimal para permitir kg (0.5, 1.0, 1.5…) e unidades (1, 2, 3…)
create table if not exists public.itens_pedido (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  produto_id uuid references public.produtos (id) on delete set null,
  nome_snapshot text not null,
  tipo_venda_snapshot text not null check (tipo_venda_snapshot in ('kg', 'unidade')),
  unidade_snapshot text not null,
  quantidade numeric(10, 3) not null check (quantidade > 0),
  preco_unit numeric(10, 2) not null,
  subtotal numeric(10, 2) not null
);
create index if not exists idx_itens_pedido on public.itens_pedido (pedido_id);

-- — Configurações (linha única) —
create table if not exists public.configuracoes (
  id int primary key default 1 check (id = 1),
  whatsapp_joice text,
  desconto_1a_compra_pct numeric(5, 2) not null default 0,
  atualizado_em timestamptz not null default now()
);

-- — Cria o perfil automaticamente quando um usuário se cadastra —
-- Compatível com email/senha (metadata "nome") e Google (full_name/name).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'nome',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
