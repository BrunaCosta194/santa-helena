// Camada de acesso a dados. Usa o Supabase quando configurado; caso
// contrário, cai nos dados de exemplo — assim o app roda em qualquer estado.
import { supabase, supabaseConfigurado } from "./supabase";
import * as mock from "./dados-exemplo";

export async function carregarCatalogo() {
  if (!supabaseConfigurado) {
    return { categorias: mock.categorias, produtos: mock.produtos };
  }
  const [{ data: categorias }, { data: produtos }] = await Promise.all([
    supabase.from("categorias").select("*").eq("ativo", true).order("ordem"),
    supabase.from("produtos").select("*").eq("ativo", true).order("nome"),
  ]);
  return {
    categorias: categorias ?? [],
    produtos: produtos ?? [],
  };
}

export async function carregarProduto(id) {
  if (!supabaseConfigurado) return mock.produtoPorId(id) ?? null;
  const { data } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function carregarZonas() {
  if (!supabaseConfigurado) return mock.zonasEntrega;
  const { data } = await supabase
    .from("zonas_entrega")
    .select("*")
    .eq("ativo", true)
    .order("valor_frete");
  return data ?? [];
}

export async function carregarConfiguracoes() {
  if (!supabaseConfigurado) return mock.configuracoes;
  const { data } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("id", 1)
    .single();
  return data ?? mock.configuracoes;
}

export async function carregarCategoria(id) {
  if (!supabaseConfigurado) return mock.categoriaPorId(id) ?? null;
  const { data } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}
