# Uso de IA

Usamos Claude (Anthropic) como asistente durante el sprint 1. Cada entrada dice qué le pedimos, qué respondió y qué hicimos con la respuesta. Revisamos y probamos todo el código antes de subirlo.

## Entrada 1 · Elegir el framework (respuesta equivocada y corregida)

- **Pedido:** revisar el repositorio anterior y decir qué faltaba para el sprint 1.
- **Respuesta de la IA:** dijo que el proyecto podía seguir en Vite con React porque «también sirve para Vercel», y que solo había que confirmar con la docente.
- **Por qué estaba mal:** el contrato de la API y la página de recursos de diseño asumen Next.js: hablan de rutas de Next.js en `/textos` (`paginas.inicio`, `paginas.albumMundo`), de `generateMetadata`, `notFound()` y de cargar las fuentes con `next/font/google`.
- **Cómo se corrigió:** al leer el contrato completo y la página de diseño, rehicimos el proyecto en Next.js (App Router). Los metadatos usan `generateMetadata`, el mundo inexistente usa `notFound()` y las fuentes Unbounded y Rubik se cargan con `next/font/google`.

## Entrada 2 · Parámetro de idioma en todos los endpoints (respuesta equivocada y corregida)

- **Pedido:** crear un cliente único para la API.
- **Respuesta de la IA:** la primera versión mandaba `?idioma=` a `/mundos`, `/rarezas` y `/cromos`.
- **Por qué estaba mal:** según `openapi.yaml`, solo `/textos` se traduce; los datos del catálogo llegan igual en los dos idiomas y esos endpoints no documentan ese parámetro.
- **Cómo se corrigió:** `lib/api.js` envía `idioma` solo a `/textos`. Los nombres de rarezas y tipos se traducen con `componentes.cromo.*` de los textos.

## Entrada 3 · Cookies de idioma y consentimiento

- **Pedido:** cómo guardar el idioma respetando el aviso de cookies.
- **Respuesta de la IA:** propuso leer las cookies en el servidor (`cookies()` de `next/headers`) para que la primera pintura ya salga en el idioma correcto, escribir `idioma` solo si `consentimiento=aceptado`, y si la persona rechaza, cambiar el idioma solo en memoria.
- **Qué hicimos:** lo aplicamos en `lib/servidor.js` y `componentes/ProveedorTextos.jsx`. Lo probamos aceptando, cambiando a EN y recargando (sigue en EN), y rechazando (la cookie `idioma` se borra y al recargar vuelve el idioma del navegador).

## Entrada 4 · Pedir los textos sin depender de CORS

- **Pedido:** cómo traer los textos del otro idioma al pulsar ES | EN.
- **Respuesta de la IA:** en vez de llamar a la API desde el navegador, crear la ruta `app/api/textos/route.js`, que pide los textos desde el servidor de Next.js. Así no dependemos de que la API permita el dominio de Vercel.
- **Qué hicimos:** la usamos tal cual y guardamos en memoria los textos ya pedidos para que alternar idiomas no repita la petición.

## Entrada 5 · Ilustración de las cartas

- **Pedido:** dibujar el cromo sin imágenes, como pide el contrato.
- **Respuesta de la IA:** un SVG con fondo `colorBase`, rayos, halo, silueta con visor amarillo y el emblema de la `figura` en el pecho; degradado para los holográficos.
- **Error que encontramos al probar:** el emblema no se veía en las cartas no holográficas porque el icono heredaba el color oscuro del texto. Se corrigió poniendo `color="#ffd23f"` en el grupo del emblema.
