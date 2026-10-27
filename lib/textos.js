// Lee un texto por su ruta con puntos y reemplaza los marcadores {nombre}.
// Si el valor es un plural { uno, otro }, elige según `cantidad`.
export function leerTexto(textos, ruta, variables = {}) {
  let valor = ruta.split(".").reduce((nodo, clave) => nodo?.[clave], textos);

  if (valor && typeof valor === "object" && "otro" in valor) {
    valor = variables.cantidad === 1 ? valor.uno : valor.otro;
  }
  if (typeof valor !== "string") {
    // Así una clave que falta se ve en pantalla y no rompe la página
    if (process.env.NODE_ENV !== "production") console.warn(`Falta el texto «${ruta}»`);
    return ruta;
  }
  return valor.replace(/\{(\w+)\}/g, (marca, nombre) =>
    nombre in variables ? String(variables[nombre]) : marca,
  );
}

// 1 → "001", como en el diseño
export function numeroDeCromo(numero) {
  return String(numero).padStart(3, "0");
}
