"use client";

import { createContext, useContext } from "react";

const ContextoSesion = createContext(null);

// El usuario de la sesión (GET /sesion en el layout) o null. Solo datos para mostrar: nunca el token.
export default function ProveedorSesion({ usuario, children }) {
  return <ContextoSesion.Provider value={usuario}>{children}</ContextoSesion.Provider>;
}

export function useUsuario() {
  return useContext(ContextoSesion);
}

// "Laura Cardona" → "LC"
export function iniciales(nombre = "") {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}
