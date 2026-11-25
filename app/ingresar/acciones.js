"use server";

import { enviar } from "@/lib/api";
import { guardarSesion } from "@/lib/sesion";

// Server Action de la vista 4 (contrato, «Sesión»: el ingreso se hace en el servidor y el token
// queda en una cookie httpOnly del frontend). Devuelve qué mostrar; la vista no ve el token.
export async function iniciarSesion({ correo, clave, mantener }) {
  const datos = { correo: String(correo ?? "").trim(), clave: String(clave ?? "") };

  // La misma validación que en el navegador, por si llega una petición sin pasar por el formulario
  const campos = {};
  if (!datos.correo) campos.correo = "correoObligatorio";
  if (!datos.clave) campos.clave = "claveObligatoria";
  if (Object.keys(campos).length) return { error: "campos", campos };

  let respuesta;
  try {
    // simulable: /ingresar?simularLatencia=3000 deja ver «Ingresando…» en la demostración
    respuesta = await enviar("/sesion", { metodo: "POST", cuerpo: datos, simulable: true });
  } catch {
    // Sin respuesta de la API: error de conexión, con botón para reintentar
    return { error: "conexion" };
  }

  const { estado, datos: cuerpo, cabeceras } = respuesta;
  if (estado === 201 && cuerpo?.token) {
    await guardarSesion(cuerpo.token, Boolean(mantener));
    return { ok: true };
  }
  // 401: un solo mensaje, sin decir cuál de los dos datos falló
  if (estado === 401) return { error: "credenciales" };
  // 422: un mensaje por campo
  if (estado === 422) {
    const porCampo = {};
    Object.keys(cuerpo?.error?.campos ?? {}).forEach((campo) => {
      if (campo === "correo") porCampo.correo = datos.correo ? "correoInvalido" : "correoObligatorio";
      if (campo === "clave") porCampo.clave = "claveObligatoria";
    });
    return { error: "campos", campos: porCampo };
  }
  // 429: esperar los segundos de Retry-After
  if (estado === 429) {
    const segundos = Number(cabeceras.get("retry-after")) || cuerpo?.error?.detalles?.reintentarEnSegundos || 60;
    return { error: "demasiadosIntentos", segundos };
  }
  // 5xx (falla_simulada, error_interno): estado de error con reintentar
  return { error: "servidor", codigo: cuerpo?.error?.codigo ?? "generico" };
}
