import { Link } from "react-router-dom";
import { moeda, precoAtual, estaEmOferta, rotuloPreco } from "../lib/formato";
import "./ProdutoCard.css";

export default function ProdutoCard({ produto, indice = 0 }) {
  const preco = precoAtual(produto);
  const emOferta = estaEmOferta(produto);
  const indisponivel = !produto.disponivel_hoje;

  return (
    <Link
      to={`/produto/${produto.id}`}
      className={`produto-card surgir ${indisponivel ? "produto-card--esgotado" : ""}`}
      style={{ animationDelay: `${indice * 60}ms` }}
    >
      <div className="produto-card__foto">
        <img src={produto.foto_url} alt={produto.nome} loading="lazy" />
        {emOferta && !indisponivel && (
          <span className="produto-card__selo produto-card__selo--oferta">Oferta</span>
        )}
        {indisponivel && (
          <span className="produto-card__selo produto-card__selo--esgotado">
            Esgotou hoje
          </span>
        )}
      </div>
      <div className="produto-card__corpo">
        <h3 className="produto-card__nome">{produto.nome}</h3>
        <p className="produto-card__desc">{produto.descricao}</p>
        <div className="produto-card__rodape">
          <div className="produto-card__precos">
            {emOferta && (
              <span className="produto-card__preco-antigo">
                {moeda(produto.preco)}
              </span>
            )}
            <span className="produto-card__preco">{moeda(preco)}</span>
            <span className="produto-card__unidade">
              {rotuloPreco(produto.tipo_venda, produto.unidade_medida)}
            </span>
          </div>
          <span className="produto-card__seta" aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}
