"use client";

// Último recurso: si no llegan ni los textos de la API no hay de dónde leer la interfaz,
// así que este mensaje va escrito en los dos idiomas.
export default function ErrorGlobal({ reset }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "48px 16px", textAlign: "center" }}>
        <h1>No se pudo cargar · Could not load</h1>
        <p>Vuelve a intentarlo en unos segundos. · Please try again in a few seconds.</p>
        <button type="button" onClick={reset}>
          Reintentar · Try again
        </button>
      </body>
    </html>
  );
}
