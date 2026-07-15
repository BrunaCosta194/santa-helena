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

// Passo mínimo por tipo de venda: kg vai de 0,5 em 0,5; unidade de 1 em 1.
export function passoQuantidade(tipoVenda) {
  return tipoVenda === "kg" ? 0.5 : 1;
}

export function quantidadeInicial(tipoVenda) {
  return tipoVenda === "kg" ? 1 : 1;
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
  if (tipoVenda === "kg") {
    const texto = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: q % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 2,
    }).format(q);
    return `${texto} kg`;
  }
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
