"use server";

import { revalidatePath } from "next/cache";
import { enviar } from "@/lib/api";
import { borrarSesion, leerToken } from "@/lib/sesion";

// Cerrar sesión: DELETE /sesion con el token (contrato, vista 1) y borrar la cookie del frontend.
// Aunque la API no responda, la cookie se borra: la persona queda fuera en este navegador.
export async function cerrarSesion() {
  const token = await leerToken();
  if (token) {
    try {
      await enviar("/sesion", { metodo: "DELETE", token });
    } catch {
      // Sin conexión con la API: el token vence solo a las 12 horas
    }
  }
  await borrarSesion();
  // Vuelve a pintar el layout para que la navegación muestre «Ingresar»
  revalidatePath("/", "layout");
}
