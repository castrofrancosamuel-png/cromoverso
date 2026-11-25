"use client";

import EstadoPagina from "@/componentes/EstadoPagina";

// Último recurso para un fallo que la vista no atrapó. Las vistas muestran su propio estado
// de error con el código de la API (lib/cargar.js); aquí Next.js ya no deja ver ese código.
export default function ErrorDeVista({ reset }) {
  return <EstadoPagina tipo="error" onReintentar={reset} />;
}
