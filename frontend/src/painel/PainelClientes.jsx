import { useEffect, useMemo, useState } from "react";
import { listarClientes, listarPedidosDoCliente } from "../lib/admin";
import { moeda, formatarQuantidade } from "../lib/formato";

const ROTULO_STATUS = {
  novo: "Recebido",
  em_separacao: "Em separação",
  a_caminho: "A caminho",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

function dataCurta(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PainelClientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(null); // cliente selecionado
  const [historico, setHistorico] = useState([]);
  const [carregandoHist, setCarregandoHist] = useState(false);

  useEffect(() => {
    let ativo = true;
    listarClientes()
      .then((c) => ativo && setClientes(c))
      .catch((e) => ativo && setErro(e.message))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter(
      (c) =>
        c.nome?.toLowerCase().includes(termo) ||
        c.telefone?.toLowerCase().includes(termo) ||
        c.endereco?.toLowerCase().includes(termo),
    );
  }, [clientes, busca]);

  async function abrir(cliente) {
    setAberto(cliente);
    setCarregandoHist(true);
    setHistorico([]);
    try {
      const pedidos = await listarPedidosDoCliente(cliente.id);
      setHistorico(pedidos);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoHist(false);
    }
  }

  return (
    <div className="painel-secao">
      <header className="painel-secao__cabeca">
        <div>
          <span className="olho">Base</span>
          <h1>Clientes</h1>
          <p className="painel-secao__sub">
            Quem já comprou com a gente, com histórico de pedidos.
          </p>
        </div>
      </header>

      {erro && <p className="painel-erro">{erro}</p>}

      <div className="form-linha">
        <input
          type="search"
          placeholder="Buscar por nome, telefone ou endereço…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando ? (
        <p className="painel-vazio">Carregando clientes…</p>
      ) : visiveis.length === 0 ? (
        <p className="painel-vazio">
          {busca ? "Nenhum cliente com esse termo." : "Ainda nenhum cliente cadastrado."}
        </p>
      ) : (
        <div className="tabela-envolve">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Pedidos</th>
                <th>Total gasto</th>
                <th>Último pedido</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome ?? "—"}</td>
                  <td>{c.telefone ?? "—"}</td>
                  <td>{c.pedidos}</td>
                  <td>{moeda(c.total)}</td>
                  <td>{dataCurta(c.ultimo)}</td>
                  <td>
                    <button className="link-btn" onClick={() => abrir(c)}>
                      Histórico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aberto && (
        <div
          className="painel-modal"
          onClick={(e) =>
            e.target === e.currentTarget && setAberto(null)
          }
        >
          <div className="painel-modal__caixa">
            <button
              className="painel-modal__fechar"
              onClick={() => setAberto(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <span className="olho">Cliente</span>
            <h2>{aberto.nome ?? "Sem nome"}</h2>
            <p className="painel-modal__meta">
              {aberto.telefone ?? "—"}
              {aberto.endereco ? ` · ${aberto.endereco}` : ""}
            </p>

            <div className="painel-modal__linha">
              <strong>Pedidos:</strong> {aberto.pedidos} ·{" "}
              <strong>Total gasto:</strong> {moeda(aberto.total)}
            </div>
            <div className="painel-modal__linha">
              <strong>Cadastrada em:</strong> {dataCurta(aberto.criado_em)}
            </div>

            {carregandoHist ? (
              <p className="painel-vazio painel-vazio--pequeno">
                Carregando histórico…
              </p>
            ) : historico.length === 0 ? (
              <p className="painel-vazio painel-vazio--pequeno">
                Sem pedidos ainda.
              </p>
            ) : (
              <div className="historico-cliente">
                {historico.map((pd) => (
                  <article key={pd.id} className="historico-cliente__pedido">
                    <div className="historico-cliente__topo">
                      <span>#{String(pd.numero).padStart(4, "0")}</span>
                      <span className={`selo-status selo-status--${pd.status}`}>
                        {ROTULO_STATUS[pd.status] ?? pd.status}
                      </span>
                      <span className="historico-cliente__data">
                        {dataCurta(pd.criado_em)}
                      </span>
                    </div>
                    <ul className="historico-cliente__itens">
                      {pd.itens_pedido?.map((i) => (
                        <li key={i.id}>
                          {formatarQuantidade(
                            i.quantidade,
                            i.tipo_venda_snapshot,
                            i.unidade_snapshot,
                          )}{" "}
                          {i.nome_snapshot}
                        </li>
                      ))}
                    </ul>
                    <div className="historico-cliente__total">
                      Total: {moeda(pd.total)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
