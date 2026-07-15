-- ============================================================
-- Sacolão Santa Helena — Seed inicial (idempotente)
-- Categorias, zonas e produtos de exemplo para o MVP.
-- ============================================================

-- Configuração única
insert into public.configuracoes
  (id, whatsapp_joice, desconto_1a_compra_pct)
values
  (1, '5599999999999', 0)
on conflict (id) do nothing;

-- Categorias (Frutas, Verduras, Temperos, Polpas, Saladas)
insert into public.categorias (id, nome, icone, ordem, ativo) values
  ('11111111-1111-1111-1111-111111111101', 'Frutas',   '🍎', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'Verduras', '🥬', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'Temperos', '🌿', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'Polpas',   '🧊', 4, true),
  ('11111111-1111-1111-1111-111111111105', 'Saladas',  '🥗', 5, true)
on conflict (id) do nothing;

-- Zonas de entrega
insert into public.zonas_entrega (id, nome_bairro, valor_frete, ativo) values
  ('22222222-2222-2222-2222-222222222201', 'Centro',            6,  true),
  ('22222222-2222-2222-2222-222222222202', 'Jardim das Flores', 9,  true),
  ('22222222-2222-2222-2222-222222222203', 'Vila Nova',         12, true),
  ('22222222-2222-2222-2222-222222222204', 'Bairro Alto',       15, true)
on conflict (id) do nothing;

-- Produtos de exemplo (venda mista, com algumas promoções)
insert into public.produtos
  (id, categoria_id, nome, descricao,
   tipo_venda, unidade_medida, preco, preco_promocional, disponivel_hoje, ativo)
values
  -- Frutas
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101',
   'Banana prata', 'Docinha, ideal para vitaminas e lanches.',
   'kg', 'kg', 6.99, 4.99, true, true),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111101',
   'Maçã gala', 'Crocante e refrescante, da última safra.',
   'kg', 'kg', 9.90, null, true, true),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111101',
   'Mamão papaia', 'Bem maduro, ótimo para o café da manhã.',
   'unidade', 'unidade', 5.50, null, true, true),

  -- Verduras
  ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111102',
   'Alface crespa', 'Folhas fresquinhas, colhidas hoje.',
   'unidade', 'maço', 3.50, 2.99, true, true),
  ('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111102',
   'Tomate italiano', 'Firme, cor viva — ótimo para molhos e saladas.',
   'kg', 'kg', 8.90, null, true, true),
  ('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111102',
   'Cenoura', 'Doce e crocante, sem defeitos.',
   'kg', 'kg', 5.90, null, true, true),

  -- Temperos
  ('33333333-3333-3333-3333-333333333307', '11111111-1111-1111-1111-111111111103',
   'Cebolinha', 'Cheirinho fresco, cortada na hora.',
   'unidade', 'maço', 2.50, null, true, true),
  ('33333333-3333-3333-3333-333333333308', '11111111-1111-1111-1111-111111111103',
   'Alho descascado', 'Já pronto para usar, pote de 200g.',
   'unidade', 'pote', 12.00, 9.90, true, true),

  -- Polpas
  ('33333333-3333-3333-3333-333333333309', '11111111-1111-1111-1111-111111111104',
   'Polpa de acerola', 'Pacote com 10 unidades de 100g.',
   'unidade', 'pacote', 15.00, null, true, true),
  ('33333333-3333-3333-3333-333333333310', '11111111-1111-1111-1111-111111111104',
   'Polpa de maracujá', 'Pacote com 10 unidades de 100g.',
   'unidade', 'pacote', 18.00, null, false, true),

  -- Saladas
  ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111105',
   'Salada mista pronta', 'Alface, rúcula, tomate e cenoura — bandeja 250g.',
   'unidade', 'bandeja', 12.90, null, true, true),
  ('33333333-3333-3333-3333-333333333312', '11111111-1111-1111-1111-111111111105',
   'Salada de frutas', 'Mamão, banana, maçã e uva — bandeja 300g.',
   'unidade', 'bandeja', 14.90, 11.90, true, true)
on conflict (id) do nothing;
