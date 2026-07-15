import { Link } from "react-router-dom";
import { useCarrinho } from "./CarrinhoContexto";
import {
  moeda,
  passoQuantidade,
  formatarQuantidade,
} from "../lib/formato";
import Botao from "../componentes/Botao";
import "./Carrinho.css";

export default function Carrinho() {
  const { itens, subtotal, mudarQuantidade, remover } = useCarrinho();

  if (itens.length === 0) {
    return (
      <div className="container carrinho-vazio">
        <div className="carrinho-vazio__emoji" aria-hidden="true">🧺</div>
        <h1>Seu carrinho está vazio</h1>
        <p>Escolha o que tem hoje no sacolão.</p>
        <Botao como="link" para="/" variante="primario">
          Ver o catálogo
        </Botao>
      </div>
    );
  }

  return (
    <div className="carrinho container">
      <header className="carrinho__cabeca">
        <span className="olho">Seu pedido</span>
        <h1>Carrinho</h1>
      </header>

      <div className="carrinho__grade">
        <ul className="carrinho__lista">
          {itens.map((item) => {
            const passo = passoQuantidade(item.tipo_venda);
            return (
              <li key={item.produto_id} className="item">
                <img className="item__foto" src={item.foto_url} alt="" />
                <div className="item__info">
                  <h3>{item.nome}</h3>
                  <p className="item__unidade">
                    {moeda(item.preco_unit)}{" "}
                    {item.tipo_venda === "kg" ? "por kg" : `por ${item.unidade_medida}`}
                  </p>
                  <button
                    className="item__remover"
                    onClick={() => remover(item.produto_id)}
                  >
                    Remover
                  </button>
                </div>

                <div className="item__lado">
                  <div className="stepper stepper--sm">
                    <button
                      onClick={() => mudarQuantidade(item.produto_id, -passo)}
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <span>
                      {formatarQuantidade(
                        item.quantidade,
                        item.tipo_venda,
                        item.unidade_medida,
                      )}
                    </span>
                    <button
                      onClick={() => mudarQuantidade(item.produto_id, passo)}
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                  <span className="item__preco">
                    {moeda(item.preco_unit * item.quantidade)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="resumo">
          <h2 className="resumo__titulo">Resumo</h2>
          <div className="resumo__linha">
            <span>Subtotal</span>
            <span>{moeda(subtotal)}</span>
          </div>
          <div className="resumo__linha resumo__linha--tenue">
            <span>Frete</span>
            <span>calculado no checkout</span>
          </div>
          <div className="resumo__total">
            <span>Total parcial</span>
            <strong>{moeda(subtotal)}</strong>
          </div>
          <Botao
            como="link"
            para="/checkout"
            variante="primario"
            className="botao--bloco"
          >
            Finalizar pedido
          </Botao>
          <Link to="/" className="resumo__continuar">
            ← Continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
