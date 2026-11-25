import Hero from "@/componentes/Hero";
import SeccionMundos from "@/componentes/SeccionMundos";
import TituloDocumento from "@/componentes/TituloDocumento";
import EstadoPagina from "@/componentes/EstadoPagina";
import { api } from "@/lib/api";
import { cargar } from "@/lib/cargar";
import { leerTextos } from "@/lib/servidor";

export async function generateMetadata() {
  const { t } = await leerTextos();
  return {
    title: t("paginas.inicio.seo.titulo"),
    description: t("paginas.inicio.seo.descripcion"),
  };
}

// Mundos de las tres cartas del hero, en el orden izquierda, centro y derecha
const MUNDOS_DEL_HERO = ["bosque", "neon", "orbita"];

async function cartasDelHero() {
  try {
    const { datos } = await api.cromos({ rareza: "legendaria", edicion: "album", porPagina: 100 });
    return MUNDOS_DEL_HERO.map((mundo) => datos.find((cromo) => cromo.mundo === mundo) ?? null);
  } catch {
    // Las cartas son decorativas: si fallan, el inicio se muestra sin ellas
    return [];
  }
}

// Vista 1 · Inicio público: GET /mundos y GET /cromos (contrato)
export default async function Inicio() {
  const [mundos, cartas] = await Promise.all([cargar(api.mundos()), cartasDelHero()]);

  return (
    <>
      <TituloDocumento ruta="paginas.inicio.seo.titulo" />
      <Hero cartas={cartas} />
      {mundos.error ? (
        // Si los mundos no llegan, el hero sigue visible y la sección muestra el estado de error
        <div id="mundos" className="contenedor" style={{ paddingBlock: "var(--espacio-7)" }}>
          <EstadoPagina tipo="error" codigo={mundos.error} nivel={2} compacto />
        </div>
      ) : (
        <SeccionMundos mundos={mundos.datos.datos} />
      )}
    </>
  );
}
