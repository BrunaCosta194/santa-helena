import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../conta/AuthContexto";
import logo from "../assets/logo.png";
import "./painel.css";

const ITENS = [
  { para: "/painel",            fim: true, rotulo: "Pedidos",           icone: "🧾" },
  { para: "/painel/produtos",              rotulo: "Produtos do dia",   icone: "🥬" },
  { para: "/painel/categorias",            rotulo: "Categorias",        icone: "🗂️" },
  { para: "/painel/clientes",              rotulo: "Clientes",          icone: "👥" },
  { para: "/painel/zonas",                 rotulo: "Zonas de entrega",  icone: "🛵" },
  { para: "/painel/config",                rotulo: "Configurações",     icone: "⚙️" },
];

export default function PainelLayout() {
  const { perfil, sair } = useAuth();
  const navegar = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  async function aoSair() {
    await sair();
    navegar("/", { replace: true });
  }

  return (
    <div className="painel">
      <aside className={`painel__lateral ${menuAberto ? "aberto" : ""}`}>
        <div className="painel__marca">
          <span className="marca__selo">
            <img src={logo} alt="" />
          </span>
          <div>
            <strong>Painel</strong>
            <small>Sacolão Santa Helena</small>
          </div>
        </div>

        <nav className="painel__nav" onClick={() => setMenuAberto(false)}>
          {ITENS.map((it) => (
            <NavLink
              key={it.para}
              to={it.para}
              end={it.fim}
              className="painel__link"
            >
              <span aria-hidden="true">{it.icone}</span>
              {it.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="painel__rodape">
          <Link to="/" className="painel__ver-site">
            ← Ver a loja
          </Link>
          <button type="button" className="painel__sair" onClick={aoSair}>
            Sair da conta
          </button>
          {perfil?.nome && (
            <p className="painel__quem">Conectada como {perfil.nome}</p>
          )}
        </div>
      </aside>

      <div className="painel__conteudo">
        <button
          type="button"
          className="painel__menu-btn"
          onClick={() => setMenuAberto((a) => !a)}
          aria-label="Abrir menu"
        >
          ☰ Menu
        </button>
        <main className="painel__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
