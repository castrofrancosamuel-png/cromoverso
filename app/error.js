"use client";

import EstadoPagina from "@/componentes/EstadoPagina";

// Si la API falla al cargar una vista (los estados completos llegan en el sprint 2)
export default function ErrorDeVista({ reset }) {
  return <EstadoPagina tipo="error" onReintentar={reset} />;
}
