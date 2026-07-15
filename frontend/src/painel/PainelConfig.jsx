import { useEffect, useState } from "react";
import { carregarConfiguracoes } from "../lib/dados";
import { salvarConfiguracoes } from "../lib/admin";
import Botao from "../componentes/Botao";

export default function PainelConfig() {
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    carregarConfiguracoes()
      .then((c) => ativo && setForm(c))
      .catch((e) => ativo && setErro(e.message));
    return () => {
      ativo = false;
    };
  }, []);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setOk(false);
  }

  async function submeter(e) {
    e.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro("");
    setOk(false);
    try {
      await salvarConfiguracoes(form);
      setOk(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (!form) {
    return (
      <div className="painel-secao">
        <p className="painel-vazio">Carregando configurações…</p>
      </div>
    );
  }

  return (
    <div className="painel-secao">
      <header className="painel-secao__cabeca">
        <div>
          <span className="olho">Ajustes</span>
          <h1>Configurações</h1>
        </div>
      </header>

      {erro && <p className="painel-erro">{erro}</p>}
      {ok && <p className="painel-ok">Configurações salvas. 🥬</p>}

      <form className="form-admin" onSubmit={submeter}>
        <div className="form-admin__grade">
          <div className="campo">
            <label htmlFor="c-wpp">WhatsApp da Joice</label>
            <input
              id="c-wpp"
              value={form.whatsapp_joice ?? ""}
              onChange={(e) => set("whatsapp_joice", e.target.value)}
              placeholder="55DDDNÚMERO (só dígitos)"
            />
            <small className="dica">
              Usado pelo n8n para avisar cada pedido novo. Só dígitos, com DDI
              (55).
            </small>
          </div>

          <div className="campo">
            <label htmlFor="c-desc">Desconto 1ª compra (%)</label>
            <input
              id="c-desc"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={form.desconto_1a_compra_pct ?? 0}
              onChange={(e) => set("desconto_1a_compra_pct", e.target.value)}
            />
            <small className="dica">
              Deixe em 0 para desligar o convite de cadastro no checkout.
            </small>
          </div>
        </div>

        <div className="form-admin__acoes">
          <Botao variante="primario" type="submit" disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar configurações"}
          </Botao>
        </div>
      </form>
    </div>
  );
}
