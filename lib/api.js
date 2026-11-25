import { headers } from "next/headers";

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

// Cabeceras de simulación que puso middleware.js (solo cuando la URL trae ?simularLatencia o ?simularError)
async function cabecerasDeSimulacion() {
  try {
    const entrantes = await headers();
    const cabeceras = {};
    const latencia = entrantes.get("x-simular-latencia");
    const error = entrantes.get("x-simular-error");
    if (latencia) cabeceras["X-Simular-Latencia"] = latencia;
    if (error) cabeceras["X-Simular-Error"] = error;
    return cabeceras;
  } catch {
    // Fuera de una petición (por ejemplo al compilar) no hay cabeceras
    return {};
  }
}

export async function pedir(ruta, { parametros, revalidar = 60, simulable = true } = {}) {
  const simulacion = simulable ? await cabecerasDeSimulacion() : {};
  const simulando = Object.keys(simulacion).length > 0;
  const respuesta = await fetch(construirUrl(ruta, parametros), {
    headers: { Accept: "application/json", ...simulacion },
    // Una respuesta simulada nunca se guarda en caché
    ...(simulando ? { cache: "no-store" } : { next: { revalidate: revalidar } }),
  });
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, cuerpo);
  return cuerpo;
}

// Petición con cuerpo o con sesión (POST, DELETE, GET /sesion). Nunca se guarda en caché.
// Devuelve la respuesta tal cual: quien llama decide según el estado y el codigo.
// Si la API no responde, fetch lanza un error (sin conexión) y quien llama lo atrapa.
export async function enviar(ruta, { metodo = "GET", cuerpo, token, simulable = false } = {}) {
  const simulacion = simulable ? await cabecerasDeSimulacion() : {};
  const respuesta = await fetch(construirUrl(ruta), {
    method: metodo,
    headers: {
      Accept: "application/json",
      ...simulacion,
      ...(cuerpo ? { "Content-Type": "application/json" } : {}),
      // El token viaja del servidor de Next.js a la API; el navegador nunca lo ve (contrato, «Sesión»)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);
  return { estado: respuesta.status, datos, cabeceras: respuesta.headers };
}

// Secciones de textos que usan el layout y las vistas
export const SECCIONES_TEXTOS = [
  "sitio",
  "navbar",
  "menuMovil",
  "footer",
  "paginas.inicio",
  "paginas.albumMundo",
  "paginas.detalleCromo",
  "paginas.ingresar",
  "formularios.validacion",
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
    // Los textos no se simulan: sin ellos no hay de dónde leer la interfaz
    pedir("/textos", { parametros: { idioma, seccion: SECCIONES_TEXTOS }, revalidar: 300, simulable: false }),
  mundos: () => pedir("/mundos"),
  mundo: (id) => pedir(`/mundos/${encodeURIComponent(id)}`),
  rarezas: () => pedir("/rarezas", { revalidar: 3600 }),
  cromos: (filtros) => pedir("/cromos", { parametros: filtros }),
  // Vista 3: acepta el id en mayúsculas o minúsculas (CV-018 o cv-018)
  cromo: (id) => pedir(`/cromos/${encodeURIComponent(id)}`),
};
