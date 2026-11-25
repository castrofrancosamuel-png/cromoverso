import { cookies } from "next/headers";
import { enviar } from "./api";

// Cookie httpOnly del frontend con el token de la API (contrato, «Sesión»):
// el navegador la guarda pero JavaScript no puede leerla, y nunca va a localStorage.
export const COOKIE_SESION = "sesion";
// La sesión de la API dura 12 horas
export const DURACION_SESION = 60 * 60 * 12;

export async function leerToken() {
  return (await cookies()).get(COOKIE_SESION)?.value ?? null;
}

// `mantener`: con la casilla marcada la cookie dura 12 horas; sin marcar, se borra al cerrar el navegador
export async function guardarSesion(token, mantener) {
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(mantener ? { maxAge: DURACION_SESION } : {}),
  });
}

export async function borrarSesion() {
  (await cookies()).delete(COOKIE_SESION);
}

// GET /sesion con el token: el usuario de la sesión, o null si no hay sesión o venció (401).
// Si la API no responde, se trata como "sin sesión" para que las vistas públicas sigan funcionando.
export async function leerUsuario() {
  const token = await leerToken();
  if (!token) return null;
  try {
    const { estado, datos } = await enviar("/sesion", { token });
    return estado === 200 ? datos.usuario : null;
  } catch {
    return null;
  }
}
