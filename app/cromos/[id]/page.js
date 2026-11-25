import { unstable_rethrow } from "next/navigation";
import EstadoPagina from "@/componentes/EstadoPagina";
import PaginaDetalleCromo from "@/componentes/PaginaDetalleCromo";
import TituloDocumento from "@/componentes/TituloDocumento";
import { cargar } from "@/lib/cargar";
import { leerDetalle } from "@/lib/detalle";
import { leerTextos } from "@/lib/servidor";

// Nombre y poder del cromo para los metadatos (contrato, vista 3)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const { t } = await leerTextos();
  try {
    const { cromo } = await leerDetalle(id);
    return {
      title: t("paginas.detalleCromo.seo.titulo", { nombre: cromo.nombre }),
      description: t("paginas.detalleCromo.seo.descripcion", { poder: cromo.poder }),
    };
  } catch (error) {
    unstable_rethrow(error);
    return { title: t("estados.error.titulo") };
  }
}

// Vista 3 · Detalle de un cromo como página completa (enlace directo o recarga)
export default async function DetalleDeCromo({ params }) {
  const { id } = await params;
  const { datos, error } = await cargar(leerDetalle(id));
  if (error) return <EstadoPagina tipo="error" codigo={error} />;
  const { cromo, vecinos } = datos;

  return (
    <>
      <TituloDocumento ruta="paginas.detalleCromo.seo.titulo" variables={{ nombre: cromo.nombre }} />
      <PaginaDetalleCromo cromo={cromo} vecinos={vecinos} />
    </>
  );
}
