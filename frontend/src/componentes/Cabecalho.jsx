import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCarrinho } from "../loja/CarrinhoContexto";
import { useAuth } from "../conta/AuthContexto";
import logo from "../assets/logo.png";
import "./Cabecalho.css";

export default function Cabecalho() {
  const { quantidadeTotal } = useCarrinho();
  const { usuario, ehAdmin, configurado, sair } = useAuth();
  const navegar = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  async function aoSair() {
    setMenuAberto(false);
    await sair();
    navegar("/", { replace: true });
  }

  return (
    <header className="cabecalho">
      <div className="container cabecalho__linha">
        <Link to="/" className="marca" aria-label="Sacolão Santa Helena — início">
          <span className="marca__selo">
            <img src={logo} alt="" />
          </span>
          <span className="marca__nome">
            Sacolão <em>Santa Helena</em>
          </span>
        </Link>

        <nav
          className={`cabecalho__nav ${menuAberto ? "aberto" : ""}`}
          aria-label="Principal"
          onClick={() => setMenuAberto(false)}
        >
          <NavLink to="/" end className="cabecalho__link">
            Hoje
          </NavLink>
          <NavLink to="/conta/meus-pedidos" className="cabecalho__link">
            Meus pedidos
          </NavLink>
          {ehAdmin && (
            <NavLink to="/painel" className="cabecalho__link">
              Painel
            </NavLink>
          )}
          {configurado &&
            (usuario ? (
              <button
                type="button"
                className="cabecalho__link cabecalho__sair"
                onClick={aoSair}
              >
                Sair
              </button>
            ) : (
              <NavLink to="/entrar" className="cabecalho__link">
                Já sou cliente
              </NavLink>
            ))}
        </nav>

        <div className="cabecalho__acoes">
          <Link to="/carrinho" className="carrinho-botao" aria-label="Ver carrinho">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {quantidadeTotal > 0 && (
              <span className="carrinho-botao__badge">{quantidadeTotal}</span>
            )}
          </Link>

          <button
            type="button"
            className="cabecalho__menu-btn"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((a) => !a)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {menuAberto ? (
                <path d="M6 6 18 18M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
