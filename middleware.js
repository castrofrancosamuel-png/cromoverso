import { NextResponse } from "next/server";

// Para la demostración de los estados de carga y de error (contrato, «Cómo ver los estados»):
// ?simularLatencia=2000 o ?simularError=503 en cualquier vista se envían a la API como las
// cabeceras X-Simular-Latencia y X-Simular-Error. Sin esos parámetros no cambia nada.
export function middleware(peticion) {
  const { searchParams } = peticion.nextUrl;
  const latencia = searchParams.get("simularLatencia");
  const error = searchParams.get("simularError");
  if (!latencia && !error) return NextResponse.next();

  const cabeceras = new Headers(peticion.headers);
  if (latencia && /^\d{1,5}$/.test(latencia)) cabeceras.set("x-simular-latencia", latencia);
  if (error && ["500", "503", "504"].includes(error)) cabeceras.set("x-simular-error", error);
  return NextResponse.next({ request: { headers: cabeceras } });
}

export const config = {
  // Solo las páginas: ni archivos estáticos ni la ruta de textos
  matcher: ["/((?!_next/|api/|favicon.ico).*)"],
};
