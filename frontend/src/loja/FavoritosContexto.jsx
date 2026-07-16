import { createContext, useContext, useEffect, useState } from "react";

const FavoritosContexto = createContext(null);
const CHAVE = "sacolao-favoritos";

export function ProvedorFavoritos({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(favoritos));
  }, [favoritos]);

  function alternar(produtoId) {
    setFavoritos((atual) =>
      atual.includes(produtoId)
        ? atual.filter((id) => id !== produtoId)
        : [...atual, produtoId],
    );
  }

  function ehFavorito(produtoId) {
    return favoritos.includes(produtoId);
  }

  return (
    <FavoritosContexto.Provider value={{ favoritos, alternar, ehFavorito }}>
      {children}
    </FavoritosContexto.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContexto);
  if (!ctx)
    throw new Error("useFavoritos precisa estar dentro de <ProvedorFavoritos>");
  return ctx;
}
