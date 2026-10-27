import { notFound } from "next/navigation";
import CatalogoMundo from "@/componentes/CatalogoMundo";
import TituloDocumento from "@/componentes/TituloDocumento";
import { api, ErrorApi } from "@/lib/api";
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
  const [{ t }, mundo] = await Promise.all([leerTextos(), leerMundo(id)]);
  return {
    title: t("paginas.albumMundo.seo.titulo", { mundo: mundo.nombre }),
    description: t("paginas.albumMundo.seo.descripcion", { mundo: mundo.nombre }),
  };
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

  const [mundo, { datos: mundos }, { datos: rarezas }] = await Promise.all([
    leerMundo(id),
    api.mundos(),
    api.rarezas(),
  ]);

  let cromos = [];
  let paginacion = null;
  let errorFiltro = null;
  try {
    const respuesta = await api.cromos({ mundo: id, edicion: "album", ...filtros, porPagina: POR_PAGINA });
    cromos = respuesta.datos;
    paginacion = respuesta.paginacion;
  } catch (error) {
    // 422 validacion: un filtro de la URL no es válido
    if (error instanceof ErrorApi && error.codigo === "validacion") errorFiltro = "validacion";
    else throw error;
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
      />
    </>
  );
}
