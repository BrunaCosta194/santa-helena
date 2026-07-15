import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Rodape.css";

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="container rodape__grade">
        <div className="rodape__marca">
          <div className="rodape__marca-linha">
            <span className="marca__selo">
              <img src={logo} alt="" />
            </span>
            <span className="marca__nome">
              Sacolão <em>Santa Helena</em>
            </span>
          </div>
          <p className="rodape__lema">
            Qualidade · Frescor · Economia — direto do sacolão para sua casa.
          </p>
        </div>

        <nav className="rodape__col" aria-label="Loja">
          <h4>Loja</h4>
          <Link to="/">Catálogo do dia</Link>
          <Link to="/carrinho">Carrinho</Link>
          <Link to="/conta/meus-pedidos">Meus pedidos</Link>
        </nav>

        <div className="rodape__col">
          <h4>Contato</h4>
          <a href="https://wa.me/5599999999999">WhatsApp</a>
          <span className="rodape__tenue">Entregas na região · pague na entrega</span>
        </div>
      </div>

      <div className="container rodape__base">
        <span>© {new Date().getFullYear()} Sacolão Santa Helena</span>
        <span className="rodape__tenue">Feito no capricho 🥬</span>
      </div>
    </footer>
  );
}
