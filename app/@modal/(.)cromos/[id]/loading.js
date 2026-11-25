import ModalCromo from "@/componentes/ModalCromo";
import { EsqueletoDetalle } from "@/componentes/Esqueleto";

// La ventana modal se abre enseguida y muestra la silueta mientras llega el cromo
export default function Cargando() {
  return (
    <ModalCromo idTitulo={null} conCerrar>
      <EsqueletoDetalle enModal />
    </ModalCromo>
  );
}
