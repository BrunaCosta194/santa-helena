import { useEffect, useState } from "react";
import {
  listarCategoriasAdmin,
  salvarCategoria,
  excluirCategoria,
} from "../lib/admin";
import Botao from "../componentes/Botao";

const VAZIA = { nome: "", icone: "", ordem: 0, ativo: true };

export default function PainelCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function recarregar() {
    setCategorias(await listarCategoriasAdmin());
  }

  useEffect(() => {
    recarregar()
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  async function submeter(e) {
    e.preventDefault();
    if (salvando || !editando?.nome?.trim()) return;
    setSalvando(true);
    setErro("");
    try {
      await salvarCategoria(editando);
      setEditando(null);
      await recarregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarAtivo(c) {
    try {
      await salvarCategoria({ ...c, ativo: !c.ativo });
      setCategorias((l) =>
        l.map((x) => (x.id === c.id ? { ...x, ativo: !x.ativo } : x)),
      );
    } catch (e) {
      setErro(e.message);
    }
  }

  async function aoExcluir(c) {
    if (
      !confirm(
        `Excluir a categoria "${c.nome}"? Os produtos ficam sem categoria.`,
      )
    )
      return;
    try {
      await excluirCategoria(c.id);
      setCategorias((l) => l.filter((x) => x.id !== c.id));
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div className="painel-secao">
      <header className="painel-secao__cabeca">
        <div>
          <span className="olho">Catálogo</span>
          <h1>Categorias</h1>
        </div>
        <Botao variante="primario" onClick={() => setEditando({ ...VAZIA })}>
          + Nova categoria
        </Botao>
      </header>

      {erro && <p className="painel-erro">{erro}</p>}

      {editando && (
        <form className="form-admin" onSubmit={submeter}>
          <div className="form-admin__grade">
            <div className="campo">
              <label htmlFor="c-nome">Nome</label>
              <input
                id="c-nome"
                value={editando.nome}
                onChange={(e) =>
                  setEditando({ ...editando, nome: e.target.value })
                }
                placeholder="Ex.: Frutas"
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="c-icone">Ícone (emoji)</label>
              <input
                id="c-icone"
                value={editando.icone ?? ""}
                onChange={(e) =>
                  setEditando({ ...editando, icone: e.target.value })
                }
                placeholder="🍎"
                maxLength={4}
              />
            </div>
            <div className="campo">
              <label htmlFor="c-ordem">Ordem</label>
              <input
                id="c-ordem"
                type="number"
                min="0"
                value={editando.ordem ?? 0}
                onChange={(e) =>
                  setEditando({ ...editando, ordem: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-admin__toggles">
            <label className="alternador">
              <input
                type="checkbox"
                checked={editando.ativo}
                onChange={(e) =>
                  setEditando({ ...editando, ativo: e.target.checked })
                }
              />
              Ativa (aparece na loja)
            </label>
          </div>
          <div className="form-admin__acoes">
            <Botao
              variante="fantasma"
              type="button"
              onClick={() => setEditando(null)}
            >
              Cancelar
            </Botao>
            <Botao variante="primario" type="submit" disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar categoria"}
            </Botao>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="painel-vazio">Carregando…</p>
      ) : categorias.length === 0 ? (
        <p className="painel-vazio">Nenhuma categoria cadastrada.</p>
      ) : (
        <ul className="lista-zonas">
          {categorias.map((c) => (
            <li key={c.id} className={c.ativo ? "" : "inativa"}>
              <span className="lista-zonas__nome">
                <span aria-hidden="true">{c.icone || "🗂️"}</span> {c.nome}
              </span>
              <span className="lista-zonas__frete">ordem {c.ordem}</span>
              <label className="alternador alternador--compacto">
                <input
                  type="checkbox"
                  checked={c.ativo}
                  onChange={() => alternarAtivo(c)}
                />
                {c.ativo ? "Ativa" : "Inativa"}
              </label>
              <button
                className="link-btn"
                onClick={() => setEditando({ ...c })}
              >
                Editar
              </button>
              <button
                className="link-btn link-btn--perigo"
                onClick={() => aoExcluir(c)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
