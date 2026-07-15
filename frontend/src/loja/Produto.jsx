import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { carregarProduto, carregarCategoria } from "../lib/dados";
import {
  moeda,
  precoAtual,
  estaEmOferta,
  passoQuantidade,
  quantidadeInicial,
  rotuloPreco,
  formatarQuantidade,
} from "../lib/formato";
import { useCarrinho } from "./CarrinhoContexto";
import Botao from "../componentes/Botao";
import "./Produto.css";

export default function Produto() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { adicionar } = useCarrinho();

  const [produto, setProduto] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    carregarProduto(id).then(async (p) => {
      if (!ativo) return;
      setProduto(p);
      if (p) {
        setQuantidade(quantidadeInicial(p.tipo_venda));
        setCategoria(await carregarCategoria(p.categoria_id));
      }
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) {
    return (
      <div className="container produto-carregando">
        <div className="produto-esqueleto produto-esqueleto--foto" />
        <div className="produto-esqueleto produto-esqueleto--info" />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="container vazio-simples">
        <h2>Produto não encontrado</h2>
        <Botao como="link" para="/" variante="secundario">
          Voltar ao catálogo
        </Botao>
      </div>
    );
  }

  const preco = precoAtual(produto);
  const emOferta = estaEmOferta(produto);
  const indisponivel = !produto.disponivel_hoje;
  const passo = passoQuantidade(produto.tipo_venda);
  const total = preco * quantidade;

  function ajustar(delta) {
    setQuantidade((q) => {
      const nova = Number((q + delta).toFixed(3));
      return nova < passo ? passo : nova;
    });
  }

  function aoAdicionar() {
    if (indisponivel) return;
    adicionar(produto, { quantidade });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2200);
  }

  return (
    <div className="produto-pagina container">
      <nav className="migalhas" aria-label="Você está em">
        <Link to="/">Catálogo</Link>
        <span aria-hidden="true">/</span>
        <span>{categoria?.nome}</span>
      </nav>

      <div className="produto-pagina__grade">
        <div className="produto-pagina__foto surgir">
          {produto.foto_url ? (
            <img src={produto.foto_url} alt={produto.nome} />
          ) : (
            <div className="produto-pagina__sem-foto" aria-hidden="true">🥬</div>
          )}
          {emOferta && !indisponivel && (
            <span className="produto-pagina__selo produto-pagina__selo--oferta">
              Oferta do dia
            </span>
          )}
          {indisponivel && (
            <span className="produto-pagina__selo produto-pagina__selo--esgotado">
              Esgotou hoje
            </span>
          )}
        </div>

        <div
          className="produto-pagina__info surgir"
          style={{ animationDelay: "80ms" }}
        >
          <span className="olho">{categoria?.nome}</span>
          <h1 className="produto-pagina__nome">{produto.nome}</h1>
          <p className="produto-pagina__desc">{produto.descricao}</p>

          <div className="produto-pagina__precos">
            {emOferta && (
              <span className="produto-pagina__preco-antigo">
                {moeda(produto.preco)}
              </span>
            )}
            <span className="produto-pagina__preco">{moeda(preco)}</span>
            <span className="produto-pagina__unidade">
              {rotuloPreco(produto.tipo_venda, produto.unidade_medida)}
            </span>
          </div>

          {produto.tipo_venda === "kg" && (
            <p className="produto-pagina__dica">
              Vendido por peso. Escolha em passos de 500g — a Joice acerta na
              entrega se pesar diferente.
            </p>
          )}

          <div className="produto-pagina__compra">
            <div className="stepper" role="group" aria-label="Quantidade">
              <button
                onClick={() => ajustar(-passo)}
                aria-label="Diminuir"
                disabled={indisponivel || quantidade <= passo}
              >
                −
              </button>
              <span>{formatarQuantidade(quantidade, produto.tipo_venda, produto.unidade_medida)}</span>
              <button
                onClick={() => ajustar(passo)}
                aria-label="Aumentar"
                disabled={indisponivel}
              >
                +
              </button>
            </div>

            <Botao
              variante={adicionado ? "sucesso" : "primario"}
              className="botao--bloco"
              onClick={aoAdicionar}
              disabled={indisponivel}
            >
              {indisponivel
                ? "Indisponível hoje"
                : adicionado
                  ? "Adicionado ✓"
                  : `Adicionar · ${moeda(total)}`}
            </Botao>
          </div>

          <button
            className="produto-pagina__ir-carrinho"
            onClick={() => navegar("/carrinho")}
          >
            Ir para o carrinho →
          </button>
        </div>
      </div>
    </div>
  );
}
