import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { precoAtual } from "../lib/formato";

const CarrinhoContexto = createContext(null);
const CHAVE = "sacolao-carrinho";

export function ProvedorCarrinho({ children }) {
  const [itens, setItens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
  }, [itens]);

  // Adiciona o produto ao carrinho. Cada produto aparece uma vez — se já
  // estiver lá, soma a quantidade (kg ou unidades) à existente.
  function adicionar(produto, { quantidade = 1 } = {}) {
    const precoUnit = precoAtual(produto);
    setItens((atual) => {
      const existente = atual.find((i) => i.produto_id === produto.id);
      if (existente) {
        return atual.map((i) =>
          i.produto_id === produto.id
            ? { ...i, quantidade: i.quantidade + quantidade, preco_unit: precoUnit }
            : i,
        );
      }
      return [
        ...atual,
        {
          produto_id: produto.id,
          nome: produto.nome,
          foto_url: produto.foto_url,
          tipo_venda: produto.tipo_venda,
          unidade_medida: produto.unidade_medida,
          preco_unit: precoUnit,
          quantidade,
        },
      ];
    });
  }

  // Aplica um delta na quantidade (kg: ±0,5; unidade: ±1). Remove se zerar.
  function mudarQuantidade(produtoId, delta) {
    setItens((atual) =>
      atual
        .map((i) =>
          i.produto_id === produtoId
            ? { ...i, quantidade: Number((i.quantidade + delta).toFixed(3)) }
            : i,
        )
        .filter((i) => i.quantidade > 0),
    );
  }

  function definirQuantidade(produtoId, quantidade) {
    setItens((atual) =>
      atual
        .map((i) =>
          i.produto_id === produtoId
            ? { ...i, quantidade: Number(quantidade) || 0 }
            : i,
        )
        .filter((i) => i.quantidade > 0),
    );
  }

  function remover(produtoId) {
    setItens((atual) => atual.filter((i) => i.produto_id !== produtoId));
  }

  function limpar() {
    setItens([]);
  }

  const subtotal = useMemo(
    () => itens.reduce((s, i) => s + i.preco_unit * i.quantidade, 0),
    [itens],
  );

  // Para o badge do cabeçalho: quantos "itens diferentes" há no carrinho.
  const quantidadeTotal = useMemo(() => itens.length, [itens]);

  const valor = {
    itens,
    subtotal,
    quantidadeTotal,
    adicionar,
    mudarQuantidade,
    definirQuantidade,
    remover,
    limpar,
  };

  return (
    <CarrinhoContexto.Provider value={valor}>
      {children}
    </CarrinhoContexto.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContexto);
  if (!ctx)
    throw new Error("useCarrinho precisa estar dentro de <ProvedorCarrinho>");
  return ctx;
}
