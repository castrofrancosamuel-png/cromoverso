import { cookies, headers } from "next/headers";
import { api } from "./api";
import { leerTexto } from "./textos";
import {
  COOKIE_CONSENTIMIENTO,
  COOKIE_IDIOMA,
  CONSENTIMIENTO,
  IDIOMA_PREDETERMINADO,
  esIdioma,
  idiomaDeCabecera,
} from "./preferencias";

// Preferencias de la persona según sus cookies. La cookie de idioma solo cuenta si aceptó.
export async function leerPreferencias() {
  const almacen = await cookies();
  const consentimiento = almacen.get(COOKIE_CONSENTIMIENTO)?.value ?? null;
  const guardado = almacen.get(COOKIE_IDIOMA)?.value;

  let idioma;
  if (consentimiento === CONSENTIMIENTO.aceptado && esIdioma(guardado)) {
    idioma = guardado;
  } else {
    idioma = idiomaDeCabecera((await headers()).get("accept-language") ?? "") ?? IDIOMA_PREDETERMINADO;
  }
  return { idioma, consentimiento };
}

// Textos del idioma actual, para metadatos y para el primer render
export async function leerTextos() {
  const { idioma } = await leerPreferencias();
  const { textos } = await api.textos(idioma);
  return { idioma, textos, t: (ruta, variables) => leerTexto(textos, ruta, variables) };
}
