// Cliente de la API de Cromoverso. Solo se usa en el servidor (páginas y route handlers),
// así el navegador no depende de CORS y la dirección queda en un solo lugar.
export const API_BASE =
  process.env.CROMOVERSO_API_URL ?? "https://yanethm-cromoverso-api.fly.dev/api/v1";

// Error con el formato de la API: { error: { codigo, mensaje, campos } }
export class ErrorApi extends Error {
  constructor(estado, cuerpo) {
    super(cuerpo?.error?.mensaje ?? `HTTP ${estado}`);
    this.name = "ErrorApi";
    this.estado = estado;
    this.codigo = cuerpo?.error?.codigo ?? "generico";
    this.campos = cuerpo?.error?.campos;
  }
}

function construirUrl(ruta, parametros = {}) {
  const url = new URL(`${API_BASE}${ruta}`);
  Object.entries(parametros).forEach(([clave, valor]) => {
    // Los filtros vacíos no se envían
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(clave, String(valor));
    }
  });
  return url;
}

export async function pedir(ruta, { parametros, revalidar = 60 } = {}) {
  const respuesta = await fetch(construirUrl(ruta, parametros), {
    headers: { Accept: "application/json" },
    next: { revalidate: revalidar },
  });
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, cuerpo);
  return cuerpo;
}

// Secciones de textos que usan el layout y las vistas 1 y 2
export const SECCIONES_TEXTOS = [
  "sitio",
  "navbar",
  "menuMovil",
  "footer",
  "paginas.inicio",
  "paginas.albumMundo",
  "componentes.cromo",
  "estados",
  "errores",
  "cookies",
  "idioma",
  "general",
].join(",");

// Endpoints del contrato. Solo /textos se traduce; el catálogo llega igual en los dos idiomas.
export const api = {
  textos: (idioma) =>
    pedir("/textos", { parametros: { idioma, seccion: SECCIONES_TEXTOS }, revalidar: 300 }),
  mundos: () => pedir("/mundos"),
  mundo: (id) => pedir(`/mundos/${encodeURIComponent(id)}`),
  rarezas: () => pedir("/rarezas", { revalidar: 3600 }),
  cromos: (filtros) => pedir("/cromos", { parametros: filtros }),
};
