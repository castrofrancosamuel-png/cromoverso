// La silueta del inicio va en su propio grupo: en app/loading.js también envolvería las demás rutas,
// como /ingresar, y mostraría el inicio vacío mientras cargan.
import { EsqueletoInicio } from "@/componentes/Esqueleto";

// Estado de carga de la vista 1 mientras llegan GET /mundos y GET /cromos
export default function Cargando() {
  return <EsqueletoInicio />;
}
