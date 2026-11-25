import { notFound } from "next/navigation";
import { api, ErrorApi } from "./api";

// Vista 3 · Detalle de un cromo: GET /cromos/:id (contrato).
// Los vecinos (cromo anterior y siguiente del mismo mundo) salen de GET /mundos/:id,
// que ya usa la vista 2 y queda en caché.
export async function leerDetalle(id) {
  let cromo;
  try {
    cromo = await api.cromo(id);
  } catch (error) {
    // 404 no_encontrado: muestra la página de no encontrado (contrato)
    if (error instanceof ErrorApi && error.codigo === "no_encontrado") notFound();
    throw error;
  }

  let vecinos = { anterior: null, siguiente: null };
  if (cromo.posicion) {
    try {
      const { cromos } = await api.mundo(cromo.mundo);
      const resumen = (otro) => (otro ? { id: otro.id, numero: otro.numero, nombre: otro.nombre } : null);
      vecinos = {
        anterior: resumen(cromos.find((otro) => otro.posicion === cromo.posicion - 1)),
        siguiente: resumen(cromos.find((otro) => otro.posicion === cromo.posicion + 1)),
      };
    } catch {
      // Los vecinos son un atajo: si fallan, el detalle se muestra sin ellos
    }
  }
  return { cromo, vecinos };
}
