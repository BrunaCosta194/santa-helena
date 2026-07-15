import { useEffect, useMemo, useState } from "react";
import {
  listarProdutosAdmin,
  listarCategoriasAdmin,
  salvarProduto,
  atualizarProdutoRapido,
  excluirProduto,
  enviarFotoProduto,
} from "../lib/admin";
import { moeda, estaEmOferta } from "../lib/formato";
import Botao from "../componentes/Botao";

const UNIDADES = ["kg", "maço", "pote", "pacote", "bandeja", "unidade"];

const VAZIO = {
  nome: "",
  descricao: "",
  categoria_id: "",
  tipo_venda: "unidade",
  unidade_medida: "unidade",
  preco: "",
  preco_promocional: "",
  disponivel_hoje: true,
  ativo: true,
  foto_url: "",
};

export default function PainelProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  async function recarregar() {
    const [prods, cats] = await Promise.all([
      listarProdutosAdmin(),
      listarCategoriasAdmin(),
    ]);
    setProdutos(prods);
    setCategorias(cats);
  }

  useEffect(() => {
    recarregar()
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  const visiveis = useMemo(() => {
    if (filtroCategoria === "todas") return produtos;
    return produtos.filter((p) => p.categoria_id === filtroCategoria);
  }, [produtos, filtroCategoria]);

  function novo() {
    setEditando({ ...VAZIO });
  }

  async function aoExcluir(p) {
    if (!confirm(`Excluir "${p.nome}"? Isso não pode ser desfeito.`)) return;
    try {
      await excluirProduto(p.id);
      setProdutos((l) => l.filter((x) => x.id !== p.id));
    } catch (e) {
      setErro(e.message);
    }
  }

  // Atualização otimista: bate no banco em segundo plano; se falhar, reverte.
  async function alterarRapido(id, campos) {
    const antes = produtos.find((p) => p.id === id);
    setProdutos((l) => l.map((p) => (p.id === id ? { ...p, ...campos } : p)));
    try {
      await atualizarProdutoRapido(id, campos);
    } catch (e) {
      setErro(e.message);
      setProdutos((l) => l.map((p) => (p.id === id ? antes : p)));
    }
  }

  function nomeCategoria(id) {
    return categorias.find((c) => c.id === id)?.nome ?? "—";
  }

  if (editando) {
    return (
      <EditorProduto
        produto={editando}
        categorias={categorias}
        aoCancelar={() => setEditando(null)}
        aoSalvar={async () => {
          await recarregar();
          setEditando(null);
        }}
      />
    );
  }

  return (
    <div className="painel-secao">
      <header className="painel-secao__cabeca">
        <div>
          <span className="olho">Rotina do dia</span>
          <h1>Produtos do dia</h1>
          <p className="painel-secao__sub">
            Liga/desliga o que tem hoje, ajusta preço e promoção direto na lista.
          </p>
        </div>
        <Botao variante="primario" onClick={novo}>
          + Novo produto
        </Botao>
      </header>

      {erro && <p className="painel-erro">{erro}</p>}

      <div className="painel-filtros">
        <button
          className={`chip ${filtroCategoria === "todas" ? "ativo" : ""}`}
          onClick={() => setFiltroCategoria("todas")}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            className={`chip ${filtroCategoria === c.id ? "ativo" : ""}`}
            onClick={() => setFiltroCategoria(c.id)}
          >
            {c.icone} {c.nome}
          </button>
        ))}
      </div>

      {carregando ? (
        <p className="painel-vazio">Carregando produtos…</p>
      ) : visiveis.length === 0 ? (
        <p className="painel-vazio">Nenhum produto nesta categoria ainda.</p>
      ) : (
        <div className="lista-produtos-rapida">
          {visiveis.map((p) => (
            <LinhaRapida
              key={p.id}
              produto={p}
              nomeCategoria={nomeCategoria(p.categoria_id)}
              onAlterar={(campos) => alterarRapido(p.id, campos)}
              onEditar={() => setEditando({ ...p })}
              onExcluir={() => aoExcluir(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Linha de edição rápida: liga/desliga do dia + preço + promoção.
function LinhaRapida({ produto, nomeCategoria, onAlterar, onEditar, onExcluir }) {
  const [preco, setPreco] = useState(produto.preco);
  const [promo, setPromo] = useState(produto.preco_promocional ?? "");
  const emOferta = estaEmOferta(produto);

  function commitPreco() {
    const n = Number(preco);
    if (Number.isFinite(n) && n !== Number(produto.preco)) {
      onAlterar({ preco: n });
    }
  }
  function commitPromo() {
    const atual = produto.preco_promocional == null ? "" : String(produto.preco_promocional);
    if (String(promo) === atual) return;
    onAlterar({
      preco_promocional: promo === "" || promo == null ? null : Number(promo),
    });
  }

  return (
    <article
      className={`linha-rapida ${!produto.ativo ? "linha-rapida--inativo" : ""} ${
        !produto.disponivel_hoje ? "linha-rapida--esgotado" : ""
      }`}
    >
      <div className="linha-rapida__foto">
        {produto.foto_url ? (
          <img src={produto.foto_url} alt="" />
        ) : (
          <span aria-hidden="true">🥬</span>
        )}
        {emOferta && <span className="tag-oferta">Oferta</span>}
      </div>

      <div className="linha-rapida__info">
        <h3>{produto.nome}</h3>
        <p className="linha-rapida__meta">
          {nomeCategoria} · vendido por {produto.tipo_venda === "kg" ? "kg" : produto.unidade_medida}
        </p>
      </div>

      <label className="linha-rapida__campo" title="Preço normal">
        <span>Preço</span>
        <div className="linha-rapida__moeda">
          <span>R$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            onBlur={commitPreco}
          />
        </div>
      </label>

      <label className="linha-rapida__campo" title="Preço promocional (deixe vazio para tirar)">
        <span>Promoção</span>
        <div className="linha-rapida__moeda">
          <span>R$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="—"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            onBlur={commitPromo}
          />
        </div>
      </label>

      <label className="linha-rapida__toggle" title="Disponível hoje">
        <input
          type="checkbox"
          checked={produto.disponivel_hoje}
          onChange={(e) => onAlterar({ disponivel_hoje: e.target.checked })}
        />
        <span>{produto.disponivel_hoje ? "Tem hoje" : "Sem hoje"}</span>
      </label>

      <div className="linha-rapida__acoes">
        <button className="link-btn" onClick={onEditar}>Editar</button>
        <button className="link-btn link-btn--perigo" onClick={onExcluir}>
          Excluir
        </button>
      </div>
    </article>
  );
}

function EditorProduto({ produto, categorias, aoCancelar, aoSalvar }) {
  const [form, setForm] = useState({
    ...VAZIO,
    ...produto,
    preco: produto.preco ?? "",
    preco_promocional:
      produto.preco_promocional == null ? "" : produto.preco_promocional,
  });
  const [enviando, setEnviando] = useState(false);
  const [subindoFoto, setSubindoFoto] = useState(false);
  const [erro, setErro] = useState("");

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Quando muda pra kg, unidade_medida vira "kg" automaticamente pra não
  // confundir. Quando volta pra "unidade", sugere "unidade".
  function setTipoVenda(tipo) {
    setForm((f) => ({
      ...f,
      tipo_venda: tipo,
      unidade_medida:
        tipo === "kg"
          ? "kg"
          : f.unidade_medida === "kg"
            ? "unidade"
            : f.unidade_medida,
    }));
  }

  async function aoEscolherFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubindoFoto(true);
    setErro("");
    try {
      const url = await enviarFotoProduto(file);
      set("foto_url", url);
    } catch (err) {
      setErro("Não consegui enviar a foto: " + err.message);
    } finally {
      setSubindoFoto(false);
    }
  }

  async function submeter(e) {
    e.preventDefault();
    if (enviando) return;
    setErro("");
    if (!form.nome.trim()) {
      setErro("O produto precisa de um nome.");
      return;
    }
    setEnviando(true);
    try {
      await salvarProduto(form);
      await aoSalvar();
    } catch (err) {
      setErro(err.message);
      setEnviando(false);
    }
  }

  return (
    <div className="painel-secao">
      <header className="painel-secao__cabeca">
        <div>
          <span className="olho">Catálogo</span>
          <h1>{produto.id ? "Editar produto" : "Novo produto"}</h1>
        </div>
      </header>

      {erro && <p className="painel-erro">{erro}</p>}

      <form className="form-admin" onSubmit={submeter}>
        <div className="form-admin__grade">
          <div className="campo">
            <label htmlFor="p-nome">Nome</label>
            <input
              id="p-nome"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Ex.: Banana prata"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="p-cat">Categoria</label>
            <select
              id="p-cat"
              value={form.categoria_id ?? ""}
              onChange={(e) => set("categoria_id", e.target.value)}
            >
              <option value="">Sem categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="p-tipo">Tipo de venda</label>
            <select
              id="p-tipo"
              value={form.tipo_venda}
              onChange={(e) => setTipoVenda(e.target.value)}
            >
              <option value="unidade">Por unidade</option>
              <option value="kg">Por kg</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="p-uni">Unidade</label>
            <select
              id="p-uni"
              value={form.unidade_medida}
              onChange={(e) => set("unidade_medida", e.target.value)}
              disabled={form.tipo_venda === "kg"}
            >
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="p-preco">
              Preço (R$) {form.tipo_venda === "kg" ? "por kg" : `por ${form.unidade_medida}`}
            </label>
            <input
              id="p-preco"
              type="number"
              step="0.01"
              min="0"
              value={form.preco}
              onChange={(e) => set("preco", e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="p-promo">Preço promocional (R$)</label>
            <input
              id="p-promo"
              type="number"
              step="0.01"
              min="0"
              placeholder="Deixe vazio para tirar a oferta"
              value={form.preco_promocional}
              onChange={(e) => set("preco_promocional", e.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="p-desc">Descrição</label>
          <textarea
            id="p-desc"
            rows={3}
            value={form.descricao ?? ""}
            onChange={(e) => set("descricao", e.target.value)}
            placeholder="Ex.: Bem maduro, ótimo para o café da manhã."
          />
        </div>

        <div className="form-admin__toggles">
          <label className="alternador">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => set("ativo", e.target.checked)}
            />
            Ativo (aparece na loja)
          </label>
          <label className="alternador">
            <input
              type="checkbox"
              checked={form.disponivel_hoje}
              onChange={(e) => set("disponivel_hoje", e.target.checked)}
            />
            Tem hoje (disponível para pedido)
          </label>
        </div>

        <div className="campo">
          <label>Foto</label>
          <div className="form-admin__foto">
            <div className="form-admin__foto-previa">
              {form.foto_url ? (
                <img src={form.foto_url} alt="Prévia" />
              ) : (
                <span aria-hidden="true">🥬</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={aoEscolherFoto}
                disabled={subindoFoto}
              />
              {subindoFoto && <small>Enviando…</small>}
              {form.foto_url && (
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => set("foto_url", "")}
                >
                  Remover foto
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-admin__acoes">
          <Botao variante="fantasma" type="button" onClick={aoCancelar}>
            Cancelar
          </Botao>
          <Botao variante="primario" type="submit" disabled={enviando}>
            {enviando ? "Salvando…" : "Salvar produto"}
          </Botao>
        </div>
      </form>
    </div>
  );
}
