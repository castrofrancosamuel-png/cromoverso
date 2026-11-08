import { api, ErrorApi } from "@/lib/api";
import { esIdioma } from "@/lib/preferencias";

// El navegador pide aquí los textos al cambiar de idioma; el servidor los trae de la API.
export async function GET(peticion) {
  const idioma = new URL(peticion.url).searchParams.get("idioma");
  if (!esIdioma(idioma)) {
    return Response.json(
      { error: { codigo: "idioma_no_soportado", mensaje: "Usa es o en." } },
      { status: 400 },
    );
  }
  try {
    return Response.json(await api.textos(idioma));
  } catch (error) {
    const estado = error instanceof ErrorApi ? error.estado : 502;
    return Response.json({ error: { codigo: error.codigo ?? "generico", mensaje: error.message } }, { status: estado });
  }
}
