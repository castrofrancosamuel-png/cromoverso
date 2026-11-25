import { redirect } from "next/navigation";
import PaginaIngreso from "@/componentes/PaginaIngreso";
import TituloDocumento from "@/componentes/TituloDocumento";
import { api } from "@/lib/api";
import { leerTextos } from "@/lib/servidor";
import { leerUsuario } from "@/lib/sesion";

export async function generateMetadata() {
  const { t } = await leerTextos();
  return {
    title: t("paginas.ingresar.seo.titulo"),
    description: t("paginas.ingresar.seo.descripcion"),
  };
}

// Solo rutas internas: evita que ?volver= lleve a otro sitio
function destinoSeguro(volver) {
  return typeof volver === "string" && volver.startsWith("/") && !volver.startsWith("//") ? volver : "/";
}

// Cartas decorativas del panel: Bosque Eterno, Ciudad Neón (al centro) y Reino de Niebla
const MUNDOS_DEL_PANEL = ["bosque", "neon", "niebla"];

async function cartasDelPanel() {
  try {
    const { datos } = await api.cromos({ rareza: "legendaria", edicion: "album", porPagina: 100 });
    return MUNDOS_DEL_PANEL.map((mundo) => datos.find((cromo) => cromo.mundo === mundo) ?? null);
  } catch {
    return [];
  }
}

// Vista 4 · Iniciar sesión: POST /sesion desde una Server Action (app/ingresar/acciones.js)
export default async function Ingresar({ searchParams }) {
  const destino = destinoSeguro((await searchParams).volver);
  // Con la sesión ya iniciada no tiene sentido volver a ingresar
  if (await leerUsuario()) redirect(destino);

  return (
    <>
      <TituloDocumento ruta="paginas.ingresar.seo.titulo" />
      <PaginaIngreso cartas={await cartasDelPanel()} destino={destino} />
    </>
  );
}
