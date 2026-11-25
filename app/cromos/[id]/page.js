import PaginaDetalleCromo from "@/componentes/PaginaDetalleCromo";
import TituloDocumento from "@/componentes/TituloDocumento";
import { leerDetalle } from "@/lib/detalle";
import { leerTextos } from "@/lib/servidor";

// Nombre y poder del cromo para los metadatos (contrato, vista 3)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const [{ t }, { cromo }] = await Promise.all([leerTextos(), leerDetalle(id)]);
  return {
    title: t("paginas.detalleCromo.seo.titulo", { nombre: cromo.nombre }),
    description: t("paginas.detalleCromo.seo.descripcion", { poder: cromo.poder }),
  };
}

// Vista 3 · Detalle de un cromo como página completa (enlace directo o recarga)
export default async function DetalleDeCromo({ params }) {
  const { id } = await params;
  const { cromo, vecinos } = await leerDetalle(id);

  return (
    <>
      <TituloDocumento ruta="paginas.detalleCromo.seo.titulo" variables={{ nombre: cromo.nombre }} />
      <PaginaDetalleCromo cromo={cromo} vecinos={vecinos} />
    </>
  );
}
