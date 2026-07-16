// Dados de exemplo (mock) enquanto o Supabase não está conectado.
// Estrutura espelha o modelo do spec (seção 3) — venda mista.
// Catálogo real repassado pela Joice (WhatsApp) — preços e itens do dia a dia
// do sacolão. Fotos ainda são placeholders até ela mandar as fotos reais.

export const configuracoes = {
  whatsapp_joice: "5599999999999",
  desconto_1a_compra_pct: 0,
};

export const categorias = [
  { id: "cat-frutas",     nome: "Frutas",      icone: "🍎", ordem: 1, ativo: true },
  { id: "cat-verduras",   nome: "Verduras",    icone: "🥬", ordem: 2, ativo: true },
  { id: "cat-legumes",    nome: "Legumes",     icone: "🫑", ordem: 3, ativo: true },
  { id: "cat-saladas",    nome: "Saladas",     icone: "🥗", ordem: 4, ativo: true },
  { id: "cat-bebidas",    nome: "Bebidas",     icone: "🥤", ordem: 5, ativo: true },
  { id: "cat-ovos",       nome: "Ovos",        icone: "🥚", ordem: 6, ativo: true },
  { id: "cat-guloseimas", nome: "Guloseimas",  icone: "🥜", ordem: 7, ativo: true },
];

// Fotos reais: geradas para o catálogo e servidas de /public/produtos/<id>.jpg.
// Os parâmetros `emoji` e `indiceCor` ficam mantidos por compatibilidade com a
// lista abaixo (não usados no visual desde que as fotos entraram).

// Monta um produto com os campos padrão (ativo, sem promoção) — reduz
// repetição já que o catálogo real tem ~80 itens. `precoPromocional` é
// opcional: quando informado, o produto entra em "Ofertas do dia".
function item(id, categoria_id, nome, descricao, emoji, tipo_venda, unidade_medida, preco, indiceCor, disponivel_hoje = true, precoPromocional = null) {
  return {
    id,
    categoria_id,
    nome,
    descricao,
    foto_url: `/produtos/${id}.jpg`,
    tipo_venda,
    unidade_medida,
    preco,
    preco_promocional: precoPromocional,
    disponivel_hoje,
    ativo: true,
  };
}

export const produtos = [
  // — Frutas —
  item("p-caqui-fuyu", "cat-frutas", "Caqui Fuyu", "Fresco, selecionado à mão.", "🍅", "kg", "kg", 12.99, 0),
  item("p-morango", "cat-frutas", "Morango", "Fresco, selecionado à mão. Preço por caixa.", "🍓", "unidade", "caixa", 13.90, 1),
  item("p-atemoia", "cat-frutas", "Atemoia", "Fresca, selecionada à mão.", "🍈", "kg", "kg", 7.99, 2),
  item("p-kiwi", "cat-frutas", "Kiwi", "Fresco, selecionado à mão. Preço por bandeja.", "🥝", "unidade", "bandeja", 15.00, 3),
  item("p-laranja-pera", "cat-frutas", "Laranja Pera", "Fresca, selecionada à mão.", "🍊", "kg", "kg", 2.99, 0),
  item("p-uva-sem-semente", "cat-frutas", "Uva sem semente", "Fresca, selecionada à mão. Preço por bandeja.", "🍇", "unidade", "bandeja", 8.99, 1),
  item("p-laranja-lima", "cat-frutas", "Laranja Lima", "Fresca, selecionada à mão.", "🍊", "kg", "kg", 5.99, 2),
  item("p-manga-palmer", "cat-frutas", "Manga Palmer", "Fresca, selecionada à mão.", "🥭", "kg", "kg", 7.99, 3),
  item("p-banana-prata", "cat-frutas", "Banana prata", "Docinha, ideal para vitaminas e lanches.", "🍌", "kg", "kg", 6.90, 0, true, 4.99),
  item("p-banana-nanica", "cat-frutas", "Banana nanica", "Fresca, selecionada à mão.", "🍌", "kg", "kg", 4.49, 1),
  item("p-pera", "cat-frutas", "Pera", "Fresca, selecionada à mão.", "🍐", "kg", "kg", 13.90, 2),
  item("p-maca-gala", "cat-frutas", "Maçã gala", "Crocante e refrescante, da última safra.", "🍎", "kg", "kg", 5.99, 3),
  item("p-maracuja", "cat-frutas", "Maracujá", "Fresco, selecionado à mão.", "🥭", "kg", "kg", 12.90, 0),
  item("p-limao", "cat-frutas", "Limão", "Fresco, selecionado à mão.", "🍋", "kg", "kg", 4.99, 1),
  item("p-coco-seco", "cat-frutas", "Coco seco", "Fresco, selecionado à mão.", "🥥", "kg", "kg", 7.99, 2),
  item("p-abacaxi-perola", "cat-frutas", "Abacaxi pérola", "Fresco, selecionado à mão.", "🍍", "unidade", "unidade", 9.50, 3, true, 7.90),
  item("p-ponkan", "cat-frutas", "Ponkan", "Fresca, selecionada à mão.", "🍊", "kg", "kg", 2.99, 0),
  item("p-carioquinha", "cat-frutas", "Carioquinha", "Fresca, selecionada à mão.", "🍊", "kg", "kg", 6.99, 1),
  item("p-mexerica-morgote", "cat-frutas", "Mexerica morgote", "Fresca, selecionada à mão.", "🍊", "kg", "kg", 6.99, 2),
  item("p-goiaba", "cat-frutas", "Goiaba", "Fresca, selecionada à mão.", "🍈", "kg", "kg", 6.99, 3),
  item("p-melao", "cat-frutas", "Melão", "Fresco, selecionado à mão.", "🍈", "unidade", "unidade", 9.90, 0),
  item("p-melao-rei", "cat-frutas", "Melão rei", "Fresco, selecionado à mão.", "🍈", "unidade", "unidade", 20.00, 1),
  item("p-abacate", "cat-frutas", "Abacate", "Fresco, selecionado à mão.", "🥑", "kg", "kg", 4.99, 2),
  item("p-mamao-papaya", "cat-frutas", "Mamão papaya", "Bem maduro, ótimo para o café da manhã.", "🥭", "unidade", "unidade", 6.99, 3),
  item("p-mamao-formosa-g", "cat-frutas", "Mamão formosa G", "Fresco, selecionado à mão.", "🥭", "unidade", "unidade", 11.90, 0),
  item("p-uva-granel", "cat-frutas", "Uva granel", "Fresca, selecionada à mão. Preço por 100g.", "🍇", "unidade", "100g", 2.20, 1),

  // — Verduras —
  item("p-repolho", "cat-verduras", "Repolho", "Fresco, colhido hoje.", "🥬", "unidade", "unidade", 7.50, 0),
  item("p-meio-repolho", "cat-verduras", "Repolho (meio)", "Fresco, colhido hoje.", "🥬", "unidade", "unidade", 3.99, 1),
  item("p-brocolis", "cat-verduras", "Brócolis", "Fresco, colhido hoje.", "🥦", "unidade", "unidade", 7.50, 2),
  item("p-coentro", "cat-verduras", "Coentro", "Cheirinho fresco, colhido hoje.", "🌿", "unidade", "unidade", 3.99, 3),
  item("p-salsa", "cat-verduras", "Salsa", "Cheirinho fresco, colhido hoje.", "🌿", "unidade", "unidade", 3.99, 0),
  item("p-alface-crespa", "cat-verduras", "Alface crespa", "Folhas fresquinhas, colhidas hoje.", "🥬", "unidade", "unidade", 3.50, 1, true, 2.99),
  item("p-alface-lisa", "cat-verduras", "Alface lisa", "Folhas fresquinhas, colhidas hoje.", "🥬", "unidade", "unidade", 3.50, 2),
  item("p-alface-mimosa", "cat-verduras", "Alface mimosa", "Folhas fresquinhas, colhidas hoje.", "🥬", "unidade", "unidade", 3.50, 3),
  item("p-escarola", "cat-verduras", "Escarola", "Folhas fresquinhas, colhidas hoje.", "🥬", "unidade", "unidade", 3.50, 0),
  item("p-couve", "cat-verduras", "Couve", "Folhas fresquinhas, colhidas hoje.", "🥬", "unidade", "unidade", 2.50, 1),

  // — Legumes —
  item("p-inhame", "cat-legumes", "Inhame", "Fresco, direto do sacolão.", "🥔", "kg", "kg", 6.99, 2),
  item("p-cara", "cat-legumes", "Cará", "Fresco, direto do sacolão.", "🥔", "kg", "kg", 9.90, 3),
  item("p-abobora-cabotia", "cat-legumes", "Abóbora cabotiá", "Fresca, direto do sacolão.", "🎃", "kg", "kg", 5.99, 0),
  item("p-abobora-seca-doce", "cat-legumes", "Abóbora seca (p/ doce)", "Fresca, direto do sacolão.", "🎃", "kg", "kg", 4.99, 1),
  item("p-abobora-moranga", "cat-legumes", "Abóbora moranga", "Fresca, direto do sacolão.", "🎃", "kg", "kg", 5.99, 2),
  item("p-batata-doce", "cat-legumes", "Batata doce", "Fresca, direto do sacolão.", "🍠", "kg", "kg", 2.99, 3),
  item("p-batata-doce-grande", "cat-legumes", "Batata doce grande", "Fresca, direto do sacolão.", "🍠", "kg", "kg", 6.99, 0),
  item("p-tomate-italiano", "cat-legumes", "Tomate italiano", "Firme, cor viva — ótimo para molhos e saladas.", "🍅", "kg", "kg", 5.99, 1, true, 4.49),
  item("p-batata-lavada", "cat-legumes", "Batata lavada", "Fresca, direto do sacolão.", "🥔", "kg", "kg", 3.49, 2),
  item("p-cebola", "cat-legumes", "Cebola", "Fresca, direto do sacolão.", "🧅", "kg", "kg", 8.49, 3),
  item("p-cebola-roxa", "cat-legumes", "Cebola roxa", "Fresca, direto do sacolão.", "🧅", "kg", "kg", 10.90, 0),
  item("p-pimentao-verde", "cat-legumes", "Pimentão verde", "Fresco, direto do sacolão.", "🫑", "kg", "kg", 12.90, 1),
  item("p-pimentao-colorido", "cat-legumes", "Pimentão colorido", "Fresco, direto do sacolão.", "🫑", "kg", "kg", 14.90, 2),
  item("p-cenoura", "cat-legumes", "Cenoura", "Doce e crocante, sem defeitos.", "🥕", "kg", "kg", 7.99, 3, true, 6.49),
  item("p-chuchu", "cat-legumes", "Chuchu", "Fresco, direto do sacolão.", "🥒", "kg", "kg", 4.99, 0),
  item("p-alho", "cat-legumes", "Alho", "Fresco, direto do sacolão. Preço por 100g.", "🧄", "unidade", "100g", 2.80, 1),
  item("p-beterraba", "cat-legumes", "Beterraba", "Fresca, direto do sacolão.", "🥕", "kg", "kg", 4.99, 2),
  item("p-pepino", "cat-legumes", "Pepino comum", "Fresco, direto do sacolão.", "🥒", "kg", "kg", 8.99, 3),
  item("p-gengibre", "cat-legumes", "Gengibre", "Fresco, direto do sacolão. Preço por 100g.", "🫚", "unidade", "100g", 0.90, 0),
  item("p-abobrinha", "cat-legumes", "Abobrinha", "Fresca, direto do sacolão.", "🥒", "kg", "kg", 3.99, 1),
  item("p-mandioca", "cat-legumes", "Mandioca", "Fresca, direto do sacolão.", "🥔", "kg", "kg", 4.99, 2),
  item("p-mandioca-descascada", "cat-legumes", "Mandioca descascada", "Já pronta pra cozinhar.", "🥔", "kg", "kg", 7.49, 3),

  // — Saladas e prontos —
  item("p-salada-frutas-copo", "cat-saladas", "Salada de frutas (copo 500ml)", "Melão, manga, uva e mamão — copo de 500ml.", "🍇", "unidade", "unidade", 13.50, 0),
  item("p-melao-picado-cuba", "cat-saladas", "Melão picado", "Higienizado e pronto pra consumir. Pedidos grandes: com 1 dia de antecedência.", "🍈", "unidade", "unidade", 15.00, 1),
  item("p-manga-picada", "cat-saladas", "Manga picada", "Higienizada e pronta pra consumir. Preço por bandeja. Pedidos grandes: com 1 dia de antecedência.", "🥭", "unidade", "bandeja", 12.00, 2),
  item("p-uva-picada", "cat-saladas", "Uva sem semente higienizada", "Pronta pra consumir. Preço por bandeja. Pedidos grandes: com 1 dia de antecedência.", "🍇", "unidade", "bandeja", 15.00, 3),
  item("p-abacaxi-picado", "cat-saladas", "Abacaxi picado", "Higienizado e pronto pra consumir. Pedidos grandes: com 1 dia de antecedência.", "🍍", "unidade", "unidade", 16.00, 0),
  item("p-melao-picado-bandeja", "cat-saladas", "Melão picado (bandeja)", "Higienizado e pronto pra consumir. Pedidos grandes: com 1 dia de antecedência.", "🍈", "unidade", "bandeja", 14.90, 1),
  item("p-bandeja-cheiro-verde", "cat-saladas", "Bandeja cheiro-verde (salsa/coentro)", "Pronta pra temperar.", "🌿", "unidade", "bandeja", 7.00, 2),
  item("p-mix-sopa", "cat-saladas", "Mix sopa", "Legumes prontos pra sopa. Preço por bandeja.", "🥕", "unidade", "bandeja", 8.00, 3),
  item("p-abobora-cabotia-desc", "cat-saladas", "Abóbora cabotiá descascada", "Já pronta pra cozinhar.", "🎃", "kg", "kg", 9.90, 0),
  item("p-mix-salada-pote", "cat-saladas", "Mix salada no pote", "Pronta pra consumir. Preço por pote.", "🥗", "unidade", "pote", 12.00, 1),

  // — Bebidas (geladeira) —
  item("p-coca-2l", "cat-bebidas", "Coca-Cola 2L retornável", "Gelada e pronta pra beber.", "🥤", "unidade", "unidade", 10.00, 1),
  item("p-coca-zero-2l", "cat-bebidas", "Coca-Cola Zero 2L retornável", "Gelada e pronta pra beber.", "🥤", "unidade", "unidade", 10.00, 2),
  item("p-fanta-laranja-2l", "cat-bebidas", "Fanta Laranja retornável", "Gelada e pronta pra beber.", "🥤", "unidade", "unidade", 10.00, 3),
  item("p-coca-lata", "cat-bebidas", "Coca-Cola lata 350ml", "Gelada e pronta pra beber.", "🥤", "unidade", "unidade", 5.00, 0),
  item("p-fanta-uva-lata", "cat-bebidas", "Fanta Uva lata 350ml", "Gelada e pronta pra beber.", "🥤", "unidade", "unidade", 5.00, 1),
  item("p-sprite-lata", "cat-bebidas", "Sprite lata 350ml", "Gelada e pronta pra beber.", "🥤", "unidade", "unidade", 5.00, 2),
  item("p-agua-coco", "cat-bebidas", "Água de coco 200ml", "Gelada e pronta pra beber.", "🥥", "unidade", "unidade", 3.00, 3),

  // — Ovos —
  item("p-ovos-bandeja-30", "cat-ovos", "Bandeja com 30 ovos extra branco", "Fresquinhos, direto do produtor.", "🥚", "unidade", "unidade", 20.00, 0),
  item("p-ovos-duzia", "cat-ovos", "Ovos (dúzia)", "Fresquinhos, direto do produtor.", "🥚", "unidade", "unidade", 10.00, 1),
  item("p-ovos-unidade", "cat-ovos", "Ovo branco (unidade)", "Fresquinho, direto do produtor.", "🥚", "unidade", "unidade", 1.50, 2),

  // — Guloseimas —
  item("p-amendoim-verdinho", "cat-guloseimas", "Amendoim verdinho temperado", "Docinho pra adoçar o pedido. Preço por 100g.", "🥜", "unidade", "100g", 2.00, 3),
  item("p-amendoim-torrado", "cat-guloseimas", "Amendoim torrado c/casca", "Docinho pra adoçar o pedido. Preço por 100g.", "🥜", "unidade", "100g", 2.00, 0),
  item("p-jujuba", "cat-guloseimas", "Jujuba", "Docinho pra adoçar o pedido. Preço por 100g.", "🍬", "unidade", "100g", 3.00, 1),
  item("p-bala-goma", "cat-guloseimas", "Bala de goma", "Docinho pra adoçar o pedido. Preço por 100g.", "🍬", "unidade", "100g", 3.00, 2),
  item("p-pote-amendoim", "cat-guloseimas", "Pote amendoim salgado e doce", "Docinho pra adoçar o pedido. Preço por pote.", "🥜", "unidade", "pote", 5.00, 3),
  item("p-pote-jujuba-bala", "cat-guloseimas", "Pote jujuba e bala de goma", "Docinho pra adoçar o pedido. Preço por pote.", "🍬", "unidade", "pote", 5.00, 0),
];

export const zonasEntrega = [
  { id: "z1", nome_bairro: "Centro",            valor_frete: 6,  ativo: true },
  { id: "z2", nome_bairro: "Jardim das Flores", valor_frete: 9,  ativo: true },
  { id: "z3", nome_bairro: "Vila Nova",         valor_frete: 12, ativo: true },
  { id: "z4", nome_bairro: "Bairro Alto",       valor_frete: 15, ativo: true },
];

export function produtoPorId(id) {
  return produtos.find((p) => p.id === id);
}

export function categoriaPorId(id) {
  return categorias.find((c) => c.id === id);
}
