export function moeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor ?? 0);
}

// Preço atual do produto: usa promocional se estiver preenchido.
export function precoAtual(produto) {
  if (!produto) return 0;
  if (
    produto.preco_promocional != null &&
    Number(produto.preco_promocional) < Number(produto.preco)
  ) {
    return Number(produto.preco_promocional);
  }
  return Number(produto.preco);
}

export function estaEmOferta(produto) {
  return (
    produto?.preco_promocional != null &&
    Number(produto.preco_promocional) < Number(produto.preco)
  );
}

// Passo por tipo de venda: kg vai de 250g em 250g (0,25); unidade de 1 em 1.
// Produtos vendidos por "100g" são tipo_venda "unidade" e andam de 1 em 1,
// onde cada passo = 100g (tratado na formatação).
export function passoQuantidade(tipoVenda) {
  return tipoVenda === "kg" ? 0.25 : 1;
}

export function quantidadeInicial(tipoVenda) {
  return tipoVenda === "kg" ? 0.25 : 1;
}

// Formata um peso em kg de forma legível: abaixo de 1kg mostra em gramas
// ("250 g", "750 g"); a partir de 1kg mostra em kg ("1 kg", "1,25 kg").
function formatarPeso(kg) {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  const texto = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: kg % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(kg);
  return `${texto} kg`;
}

// Rótulo curto pra exibir junto do preço: "por kg", "por maço", "cada".
export function rotuloPreco(tipoVenda, unidadeMedida) {
  if (tipoVenda === "kg") return "por kg";
  if (!unidadeMedida || unidadeMedida === "unidade") return "cada";
  return `por ${unidadeMedida}`;
}

// Formata a quantidade escolhida para exibir no carrinho / resumo.
// "1,5 kg", "2 maços", "3 unidades".
export function formatarQuantidade(quantidade, tipoVenda, unidadeMedida) {
  const q = Number(quantidade);
  // Produtos por peso (kg): exibe em g/kg.
  if (tipoVenda === "kg") return formatarPeso(q);
  // Produtos por 100g: a quantidade é a contagem de porções de 100g.
  if (unidadeMedida === "100g") return formatarPeso(q * 0.1);
  const inteiro = Math.round(q);
  const unidade = unidadeMedida && unidadeMedida !== "unidade"
    ? unidadeMedida
    : "unidade";
  if (inteiro === 1) return `1 ${unidade}`;
  // Plurais simples: adiciona "s" ao final. Cobre bandeja(s), pote(s),
  // pacote(s), maço → maços. "unidade" → "unidades".
  const plural = unidade.endsWith("s") ? unidade : `${unidade}s`;
  return `${inteiro} ${plural}`;
}
