import { EsqueletoInicio } from "@/componentes/Esqueleto";

// Estado de carga de la vista 1 mientras llegan GET /mundos y GET /cromos
export default function Cargando() {
  return <EsqueletoInicio />;
}
