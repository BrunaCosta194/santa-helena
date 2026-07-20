import {
  moeda,
  precoAtual,
  estaEmOferta,
  rotuloPreco,
  passoQuantidade,
  formatarQuantidade,
  formatarQuantidadeCurta,
} from "../lib/formato";
import { useCarrinho } from "../loja/CarrinhoContexto";
import { useFavoritos } from "../loja/FavoritosContexto";
import "./ProdutoCard.css";

export default function ProdutoCard({ produto, indice = 0, compacta = false }) {
  const { itens, adicionar, mudarQuantidade } = useCarrinho();
  const { ehFavorito, alternar } = useFavoritos();

  const preco = precoAtual(produto);
  const emOferta = estaEmOferta(produto);
  const indisponivel = !produto.disponivel_hoje;
  const favorito = ehFavorito(produto.id);
  const passo = passoQuantidade(produto.tipo_venda);
  const noCarrinho = itens.find((i) => i.produto_id === produto.id);
  const quantidade = noCarrinho?.quantidade ?? 0;

  function aoAdicionar(e) {
    e.preventDefault();
    if (indisponivel) return;
    adicionar(produto, { quantidade: passo });
  }

  function aoAumentar(e) {
    e.preventDefault();
    mudarQuantidade(produto.id, passo);
  }

  function aoDiminuir(e) {
    e.preventDefault();
    mudarQuantidade(produto.id, -passo);
  }

  function aoFavoritar(e) {
    e.preventDefault();
    alternar(produto.id);
  }

  return (
    <article
      className={`produto-card surgir ${compacta ? "produto-card--compacta" : ""} ${indisponivel ? "produto-card--esgotado" : ""}`}
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
        <button
          type="button"
          className={`produto-card__favorito ${favorito ? "produto-card__favorito--ativo" : ""}`}
          onClick={aoFavoritar}
          aria-label={favorito ? `Remover ${produto.nome} dos favoritos` : `Favoritar ${produto.nome}`}
          aria-pressed={favorito}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={favorito ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 21s-6.7-4.35-9.33-8.2C1.06 10.6 1.6 7.2 4.4 5.6c2.2-1.26 4.7-.6 6.1 1.2l1.5 1.9 1.5-1.9c1.4-1.8 3.9-2.46 6.1-1.2 2.8 1.6 3.34 5 1.73 7.2C18.7 16.65 12 21 12 21Z" />
          </svg>
        </button>
      </div>
      <div className="produto-card__corpo">
        <h3 className="produto-card__nome">{produto.nome}</h3>
        {!compacta && <p className="produto-card__desc">{produto.descricao}</p>}
        <div className="produto-card__rodape">
          <div className={`produto-card__precos ${emOferta ? "produto-card__precos--oferta" : ""}`}>
            {emOferta && (
              <span className="produto-card__preco-antigo">
                De <s>{moeda(produto.preco)}</s>
              </span>
            )}
            <span className={`produto-card__preco ${emOferta ? "produto-card__preco--oferta" : ""}`}>
              {emOferta && <span className="produto-card__por">Por </span>}
              {moeda(preco)}
            </span>
            <span className="produto-card__unidade">
              {rotuloPreco(produto.tipo_venda, produto.unidade_medida)}
            </span>
          </div>
          {quantidade > 0 ? (
            <div className="produto-card__stepper">
              <button
                type="button"
                onClick={aoDiminuir}
                aria-label={`Diminuir ${produto.nome}`}
              >
                −
              </button>
              <span>
                {compacta
                  ? formatarQuantidadeCurta(quantidade, produto.tipo_venda, produto.unidade_medida)
                  : formatarQuantidade(quantidade, produto.tipo_venda, produto.unidade_medida)}
              </span>
              <button
                type="button"
                onClick={aoAumentar}
                aria-label={`Aumentar ${produto.nome}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="produto-card__add"
              onClick={aoAdicionar}
              disabled={indisponivel}
              aria-label={`Adicionar ${produto.nome} ao carrinho`}
            >
              +
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
