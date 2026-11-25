import DetalleCromo from "@/componentes/DetalleCromo";
import ModalCromo, { BotonCerrarModal } from "@/componentes/ModalCromo";
import CromoNoEncontrado from "@/componentes/CromoNoEncontrado";
import TituloDocumento from "@/componentes/TituloDocumento";
import { leerDetalle } from "@/lib/detalle";

const ID_TITULO = "modal-cromo-titulo";

// Vista 3 como ventana modal sobre el catálogo (ruta interceptada de Next.js).
// La URL cambia a /cromos/:id: al recargar se abre la página completa.
export default async function ModalDeCromo({ params }) {
  const { id } = await params;
  let detalle;
  try {
    detalle = await leerDetalle(id);
  } catch (error) {
    // notFound() dentro de la modal: se muestra el mensaje en la misma ventana
    if (error?.digest?.startsWith("NEXT_HTTP_ERROR_FALLBACK;404")) {
      return (
        <ModalCromo idTitulo={ID_TITULO}>
          <CromoNoEncontrado nivel={2} idTitulo={ID_TITULO} />
        </ModalCromo>
      );
    }
    throw error;
  }

  return (
    <ModalCromo idTitulo={ID_TITULO}>
      <TituloDocumento ruta="paginas.detalleCromo.seo.titulo" variables={{ nombre: detalle.cromo.nombre }} />
      <DetalleCromo {...detalle} nivel={2} idTitulo={ID_TITULO} enModal cerrar={<BotonCerrarModal />} />
    </ModalCromo>
  );
}
