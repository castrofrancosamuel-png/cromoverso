import { unstable_rethrow } from "next/navigation";
import { ErrorApi } from "./api";

// Código que decide qué estado de error mostrar (contrato, «Errores que debes manejar»):
// el `codigo` de la API (falla_simulada, error_interno...) o sin_conexion si la API no respondió.
export function codigoDeError(error) {
  if (error instanceof ErrorApi) return error.codigo;
  return "sin_conexion";
}

// Ejecuta una carga de datos y, si falla, devuelve el código en vez de lanzar el error.
// Así la página puede mostrar su estado de error con el mensaje correcto: en producción
// Next.js oculta el mensaje de los errores que llegan a error.js.
// notFound(), redirect() y los avisos internos de Next.js se vuelven a lanzar.
export async function cargar(promesa) {
  try {
    return { datos: await promesa, error: null };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Falló una petición a la API:", error);
    return { datos: null, error: codigoDeError(error) };
  }
}
