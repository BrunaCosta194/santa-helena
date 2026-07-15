// Dados de exemplo (mock) enquanto o Supabase não está conectado.
// Estrutura espelha o modelo do spec (seção 3) — venda mista.

export const configuracoes = {
  whatsapp_joice: "5599999999999",
  desconto_1a_compra_pct: 0,
};

export const categorias = [
  { id: "cat-frutas",   nome: "Frutas",   icone: "🍎", ordem: 1, ativo: true },
  { id: "cat-verduras", nome: "Verduras", icone: "🥬", ordem: 2, ativo: true },
  { id: "cat-temperos", nome: "Temperos", icone: "🌿", ordem: 3, ativo: true },
  { id: "cat-polpas",   nome: "Polpas",   icone: "🧊", ordem: 4, ativo: true },
  { id: "cat-saladas",  nome: "Saladas",  icone: "🥗", ordem: 5, ativo: true },
];

// Fotos: placeholders coloridos por gradiente (SVG data URI) — trocados por
// fotos reais do Storage depois. Um tom fresco por produto.
function foto(cor1, cor2, emoji) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${cor1}'/><stop offset='1' stop-color='${cor2}'/>
    </linearGradient></defs>
    <rect width='800' height='800' fill='url(%23g)'/>
    <text x='50%' y='54%' font-size='320' text-anchor='middle' dominant-baseline='middle'>${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/%23/g, "#")}`;
}

export const produtos = [
  // Frutas
  {
    id: "p-banana",
    categoria_id: "cat-frutas",
    nome: "Banana prata",
    descricao: "Docinha, ideal para vitaminas e lanches.",
    foto_url: foto("#F6F8F0", "#8CC63F", "🍌"),
    tipo_venda: "kg",
    unidade_medida: "kg",
    preco: 6.99,
    preco_promocional: 4.99,
    disponivel_hoje: true,
    ativo: true,
  },
  {
    id: "p-maca",
    categoria_id: "cat-frutas",
    nome: "Maçã gala",
    descricao: "Crocante e refrescante, da última safra.",
    foto_url: foto("#F6F8F0", "#E0492E", "🍎"),
    tipo_venda: "kg",
    unidade_medida: "kg",
    preco: 9.9,
    preco_promocional: null,
    disponivel_hoje: true,
    ativo: true,
  },
  {
    id: "p-mamao",
    categoria_id: "cat-frutas",
    nome: "Mamão papaia",
    descricao: "Bem maduro, ótimo para o café da manhã.",
    foto_url: foto("#F6F8F0", "#E6C33C", "🥭"),
    tipo_venda: "unidade",
    unidade_medida: "unidade",
    preco: 5.5,
    preco_promocional: null,
    disponivel_hoje: true,
    ativo: true,
  },

  // Verduras
  {
    id: "p-alface",
    categoria_id: "cat-verduras",
    nome: "Alface crespa",
    descricao: "Folhas fresquinhas, colhidas hoje.",
    foto_url: foto("#F6F8F0", "#8CC63F", "🥬"),
    tipo_venda: "unidade",
    unidade_medida: "maço",
    preco: 3.5,
    preco_promocional: 2.99,
    disponivel_hoje: true,
    ativo: true,
  },
  {
    id: "p-tomate",
    categoria_id: "cat-verduras",
    nome: "Tomate italiano",
    descricao: "Firme, cor viva — ótimo para molhos e saladas.",
    foto_url: foto("#F6F8F0", "#E0492E", "🍅"),
    tipo_venda: "kg",
    unidade_medida: "kg",
    preco: 8.9,
    preco_promocional: null,
    disponivel_hoje: true,
    ativo: true,
  },
  {
    id: "p-cenoura",
    categoria_id: "cat-verduras",
    nome: "Cenoura",
    descricao: "Doce e crocante, sem defeitos.",
    foto_url: foto("#F6F8F0", "#E6C33C", "🥕"),
    tipo_venda: "kg",
    unidade_medida: "kg",
    preco: 5.9,
    preco_promocional: null,
    disponivel_hoje: true,
    ativo: true,
  },

  // Temperos
  {
    id: "p-cebolinha",
    categoria_id: "cat-temperos",
    nome: "Cebolinha",
    descricao: "Cheirinho fresco, cortada na hora.",
    foto_url: foto("#F6F8F0", "#8CC63F", "🌿"),
    tipo_venda: "unidade",
    unidade_medida: "maço",
    preco: 2.5,
    preco_promocional: null,
    disponivel_hoje: true,
    ativo: true,
  },
  {
    id: "p-alho",
    categoria_id: "cat-temperos",
    nome: "Alho descascado",
    descricao: "Já pronto para usar — pote de 200g.",
    foto_url: foto("#F6F8F0", "#9C6B3B", "🧄"),
    tipo_venda: "unidade",
    unidade_medida: "pote",
    preco: 12.0,
    preco_promocional: 9.9,
    disponivel_hoje: true,
    ativo: true,
  },

  // Polpas
  {
    id: "p-polpa-acerola",
    categoria_id: "cat-polpas",
    nome: "Polpa de acerola",
    descricao: "Pacote com 10 unidades de 100g.",
    foto_url: foto("#F6F8F0", "#E0492E", "🧊"),
    tipo_venda: "unidade",
    unidade_medida: "pacote",
    preco: 15.0,
    preco_promocional: null,
    disponivel_hoje: true,
    ativo: true,
  },
  {
    id: "p-polpa-maracuja",
    categoria_id: "cat-polpas",
    nome: "Polpa de maracujá",
    descricao: "Pacote com 10 unidades de 100g.",
    foto_url: foto("#F6F8F0", "#E6C33C", "🧊"),
    tipo_venda: "unidade",
    unidade_medida: "pacote",
    preco: 18.0,
    preco_promocional: null,
    disponivel_hoje: false,
    ativo: true,
  },

  // Saladas
  {
    id: "p-salada-mista",
    categoria_id: "cat-saladas",
    nome: "Salada mista pronta",
    descricao: "Alface, rúcula, tomate e cenoura — bandeja 250g.",
    foto_url: foto("#F6F8F0", "#8CC63F", "🥗"),
    tipo_venda: "unidade",
    unidade_medida: "bandeja",
    preco: 12.9,
    preco_promocional: null,
    disponivel_hoje: true,
    ativo: true,
  },
  {
    id: "p-salada-frutas",
    categoria_id: "cat-saladas",
    nome: "Salada de frutas",
    descricao: "Mamão, banana, maçã e uva — bandeja 300g.",
    foto_url: foto("#F6F8F0", "#E6C33C", "🍓"),
    tipo_venda: "unidade",
    unidade_medida: "bandeja",
    preco: 14.9,
    preco_promocional: 11.9,
    disponivel_hoje: true,
    ativo: true,
  },
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
