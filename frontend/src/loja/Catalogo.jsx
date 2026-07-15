import { useEffect, useMemo, useState } from "react";
import { carregarCatalogo } from "../lib/dados";
import { estaEmOferta } from "../lib/formato";
import ProdutoCard from "../componentes/ProdutoCard";
import Botao from "../componentes/Botao";
import "./Catalogo.css";

const TODAS = "todas";
const OFERTAS = "ofertas";

export default function Catalogo() {
  const [filtro, setFiltro] = useState(TODAS);
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    let ativo = true;
    carregarCatalogo().then((catalogo) => {
      if (!ativo) return;
      setCategorias(catalogo.categorias);
      setProdutos(catalogo.produtos);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const ofertas = useMemo(
    () => produtos.filter((p) => p.disponivel_hoje && estaEmOferta(p)),
    [produtos],
  );

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return produtos
      .filter((p) => {
        if (filtro === OFERTAS) return p.disponivel_hoje && estaEmOferta(p);
        if (filtro !== TODAS && p.categoria_id !== filtro) return false;
        return true;
      })
      .filter((p) => (termo ? p.nome.toLowerCase().includes(termo) : true))
      // Disponíveis primeiro; ofertas antes; alfabético dentro do grupo.
      .sort((a, b) => {
        if (a.disponivel_hoje !== b.disponivel_hoje) {
          return a.disponivel_hoje ? -1 : 1;
        }
        const oa = estaEmOferta(a);
        const ob = estaEmOferta(b);
        if (oa !== ob) return oa ? -1 : 1;
        return a.nome.localeCompare(b.nome, "pt-BR");
      });
  }, [produtos, filtro, busca]);

  const nomeCategoria =
    filtro === TODAS
      ? "Tudo o que tem hoje"
      : filtro === OFERTAS
        ? "Ofertas do dia"
        : categorias.find((c) => c.id === filtro)?.nome ?? "";

  return (
    <>
      <section className="hero">
        <div className="container hero__grade">
          <div className="hero__texto surgir">
            <span className="olho">Sacolão Santa Helena · direto da feira</span>
            <h1 className="hero__titulo">
              Fresco de <em>hoje</em>, no preço que cabe.
            </h1>
            <p className="hero__sub">
              Frutas, verduras, temperos, polpas e saladas prontas. A Joice
              publica o que tem no dia — você pede pelo site e paga na entrega.
            </p>
            <div className="hero__acoes">
              <Botao como="link" para="#catalogo" variante="primario">
                Ver o que tem hoje
              </Botao>
              <Botao como="link" para="/conta/meus-pedidos" variante="fantasma">
                Já sou cliente
              </Botao>
            </div>
            <p className="hero__lema">
              <strong>Qualidade · Frescor · Economia</strong>
            </p>
          </div>

          <div className="hero__cartoes" aria-hidden="true">
            <div className="hero__foto hero__foto--1">🍎</div>
            <div className="hero__foto hero__foto--2">🥬</div>
            <div className="hero__foto hero__foto--3">🍅</div>
          </div>
        </div>
      </section>

      {ofertas.length > 0 && filtro === TODAS && (
        <section className="ofertas container">
          <header className="ofertas__cabeca">
            <span className="olho olho--oferta">Ofertas do dia</span>
            <h2>Aproveite antes de acabar 🔥</h2>
          </header>
          <div className="catalogo__grade">
            {ofertas.slice(0, 4).map((p, i) => (
              <ProdutoCard key={p.id} produto={p} indice={i} />
            ))}
          </div>
          {ofertas.length > 4 && (
            <div className="ofertas__mais">
              <button
                type="button"
                className="ofertas__botao"
                onClick={() => setFiltro(OFERTAS)}
              >
                Ver todas as ofertas →
              </button>
            </div>
          )}
        </section>
      )}

      <section id="catalogo" className="catalogo container">
        <header className="catalogo__cabeca">
          <div>
            <span className="olho">Catálogo do dia</span>
            <h2 className="catalogo__titulo">{nomeCategoria}</h2>
          </div>

          <div className="catalogo__busca">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar (banana, tomate…)"
              aria-label="Buscar produto"
            />
          </div>
        </header>

        <div className="filtros" role="tablist" aria-label="Categorias">
          <button
            className={`filtro ${filtro === TODAS ? "filtro--ativo" : ""}`}
            onClick={() => setFiltro(TODAS)}
          >
            Tudo
          </button>
          {ofertas.length > 0 && (
            <button
              className={`filtro filtro--oferta ${filtro === OFERTAS ? "filtro--ativo" : ""}`}
              onClick={() => setFiltro(OFERTAS)}
            >
              🔥 Ofertas
            </button>
          )}
          {categorias.map((c) => (
            <button
              key={c.id}
              className={`filtro ${filtro === c.id ? "filtro--ativo" : ""}`}
              onClick={() => setFiltro(c.id)}
            >
              {c.icone && <span aria-hidden="true">{c.icone}</span>} {c.nome}
            </button>
          ))}
        </div>

        {carregando ? (
          <div className="catalogo__grade">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="produto-esqueleto" />
            ))}
          </div>
        ) : visiveis.length === 0 ? (
          <p className="catalogo__vazio">
            Nada por aqui ainda. Volte em breve! 🥬
          </p>
        ) : (
          <div className="catalogo__grade">
            {visiveis.map((p, i) => (
              <ProdutoCard key={p.id} produto={p} indice={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
