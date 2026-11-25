import { notFound, unstable_rethrow } from "next/navigation";
import CatalogoMundo from "@/componentes/CatalogoMundo";
import EstadoPagina from "@/componentes/EstadoPagina";
import TituloDocumento from "@/componentes/TituloDocumento";
import { api, ErrorApi } from "@/lib/api";
import { cargar, codigoDeError } from "@/lib/cargar";
import { leerTextos } from "@/lib/servidor";

const POR_PAGINA = 20;

async function leerMundo(id) {
  try {
    return await api.mundo(id);
  } catch (error) {
    // 404 no_encontrado: el mundo no existe
    if (error instanceof ErrorApi && error.codigo === "no_encontrado") notFound();
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { t } = await leerTextos();
  try {
    const mundo = await leerMundo(id);
    return {
      title: t("paginas.albumMundo.seo.titulo", { mundo: mundo.nombre }),
      description: t("paginas.albumMundo.seo.descripcion", { mundo: mundo.nombre }),
    };
  } catch (error) {
    // Si la API falla, la página muestra su estado de error; el título lo dice
    unstable_rethrow(error);
    return { title: t("estados.error.titulo") };
  }
}

// Vista 2 · Catálogo de un mundo: GET /mundos/:id, GET /cromos y GET /rarezas (contrato).
// Los filtros viven en la URL (?rareza=&tipo=&pagina=) para que no se pierdan al recargar.
export default async function CatalogoDeUnMundo({ params, searchParams }) {
  const { id } = await params;
  const consulta = await searchParams;
  const filtros = {
    rareza: typeof consulta.rareza === "string" ? consulta.rareza : undefined,
    tipo: typeof consulta.tipo === "string" ? consulta.tipo : undefined,
    pagina: typeof consulta.pagina === "string" ? consulta.pagina : undefined,
  };

  const base = await cargar(Promise.all([leerMundo(id), api.mundos(), api.rarezas()]));
  // Sin el mundo no hay catálogo: estado de error de página completa con «Reintentar»
  if (base.error) return <EstadoPagina tipo="error" codigo={base.error} />;
  const [mundo, { datos: mundos }, { datos: rarezas }] = base.datos;

  let cromos = [];
  let paginacion = null;
  let errorFiltro = null;
  let errorCarga = null;
  try {
    const respuesta = await api.cromos({ mundo: id, edicion: "album", ...filtros, porPagina: POR_PAGINA });
    cromos = respuesta.datos;
    paginacion = respuesta.paginacion;
  } catch (error) {
    unstable_rethrow(error);
    // 422 validacion: un filtro de la URL no es válido. Otro fallo: estado de error en la grilla
    if (error instanceof ErrorApi && error.codigo === "validacion") errorFiltro = "validacion";
    else errorCarga = codigoDeError(error);
  }

  return (
    <>
      <TituloDocumento ruta="paginas.albumMundo.seo.titulo" variables={{ mundo: mundo.nombre }} />
      <CatalogoMundo
        mundo={mundo}
        mundos={mundos}
        rarezas={rarezas}
        cromos={cromos}
        paginacion={paginacion}
        filtros={filtros}
        errorFiltro={errorFiltro}
        errorCarga={errorCarga}
      />
    </>
  );
}
