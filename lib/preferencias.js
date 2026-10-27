// Nombres y reglas de las cookies que pone el frontend (ver contrato).
export const COOKIE_CONSENTIMIENTO = "consentimiento";
export const COOKIE_IDIOMA = "idioma";
export const IDIOMAS = ["es", "en"];
export const IDIOMA_PREDETERMINADO = "es";

export const CONSENTIMIENTO = { aceptado: "aceptado", rechazado: "rechazado" };

// Un año
const DURACION = 60 * 60 * 24 * 365;

export function esIdioma(valor) {
  return IDIOMAS.includes(valor);
}

// Primer idioma soportado de Accept-Language, por ejemplo "en-US,en;q=0.9"
export function idiomaDeCabecera(cabecera = "") {
  const preferidos = cabecera
    .split(",")
    .map((parte) => {
      const [codigo, calidad] = parte.trim().split(";q=");
      return { codigo: codigo.slice(0, 2).toLowerCase(), q: calidad ? Number(calidad) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return preferidos.find(({ codigo }) => esIdioma(codigo))?.codigo;
}

// Solo en el navegador
export function escribirCookie(nombre, valor) {
  const segura = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; Max-Age=${DURACION}; Path=/; SameSite=Lax${segura}`;
}

export function borrarCookie(nombre) {
  document.cookie = `${nombre}=; Max-Age=0; Path=/; SameSite=Lax`;
}
