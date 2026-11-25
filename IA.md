# Uso de IA

Usamos Claude (Anthropic) como asistente durante los sprints 1 y 2. Cada entrada dice qué le pedimos, qué respondió y qué hicimos con la respuesta. Revisamos y probamos todo el código antes de subirlo.

## Sprint 1

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

## Sprint 2

## Entrada 6 · La silueta del inicio aparecía en «Iniciar sesión» (respuesta equivocada y corregida)

- **Pedido:** agregar los estados de carga de las vistas.
- **Respuesta de la IA:** puso la silueta del inicio en `app/loading.js`, en la raíz de `app/`.
- **Por qué estaba mal:** un `loading.js` envuelve también todas las rutas que están debajo de su carpeta. Al abrir `/ingresar` se veía un momento la silueta del inicio, y como la página empezaba a enviarse antes de tiempo, la redirección de «ya tienes sesión» dejaba de ser una redirección 307 del servidor.
- **Cómo se corrigió:** movimos el inicio a un grupo de rutas, `app/(inicio)/page.js` con su `app/(inicio)/loading.js`. Lo comprobamos con `curl`: `/ingresar` con sesión vuelve a responder 307 hacia `/`.

## Entrada 7 · Error de hidratación en las cartas (respuesta equivocada y corregida)

- **Pedido:** revisar los errores de la consola al abrir el catálogo para la vista 3.
- **Respuesta de la IA:** la carta del sprint 1, escrita con ayuda de la IA, calculaba los rayos del fondo con `Math.cos` y `Math.sin` sin redondear.
- **Por qué estaba mal:** el servidor y el navegador dan decimales distintos en la última cifra (`145.20240083494824` contra `145.2024008349482`), y React avisaba «A tree hydrated but some attributes didn't match».
- **Cómo se corrigió:** redondeamos los puntos con `toFixed(2)` en `componentes/Cromo.jsx`. La consola quedó limpia en las cuatro vistas.

## Entrada 8 · Dónde guardar el token de la sesión

- **Pedido:** cómo guardar la sesión después de `POST /sesion`.
- **Respuesta de la IA:** siguiendo el contrato, hacer el ingreso en una Server Action, guardar el token en una cookie **httpOnly** del propio frontend y mandarlo a la API como `Authorization: Bearer` solo desde el servidor. Descartó `localStorage` porque cualquier script de la página podría leerlo.
- **Qué hicimos:** lo aplicamos en `app/ingresar/acciones.js` y `lib/sesion.js`. La casilla «Mantener la sesión iniciada» decide si la cookie dura 12 horas (como la sesión de la API) o se borra al cerrar el navegador. Al navegador solo llegan nombre, alias, correo y color del avatar.

## Entrada 9 · La ventana modal no se cerraba al navegar

- **Pedido:** abrir el detalle del cromo como ventana modal sobre el catálogo, como en el diseño.
- **Respuesta de la IA:** usar rutas paralelas (`app/@modal`) con una ruta interceptada (`(.)cromos/[id]`), cerrar con `router.back()` y usar `<dialog>` para que el foco quede dentro y Escape funcione.
- **Error que encontramos al probar:** con la modal abierta, al ir a otra página con un enlace la modal seguía abierta, porque en la navegación del lado del cliente la ranura `@modal` conserva lo último que mostró.
- **Cómo se corrigió:** agregamos `app/@modal/page.js` y `app/@modal/[...resto]/page.js`, que devuelven `null` para cualquier otra ruta. Además, los enlaces «cromo anterior / siguiente» reemplazan la entrada del historial, así «Cerrar» vuelve directo al catálogo.

## Entrada 10 · Mostrar el código del error de la API

- **Pedido:** que el estado de error diga el mensaje de `textos.errores[codigo]`.
- **Respuesta de la IA:** explicó que en producción Next.js oculta el mensaje de los errores que llegan a `error.js`, así que ahí no se puede leer el `codigo`. Propuso atrapar el error en cada vista con una función (`lib/cargar.js`) que devuelve el código y vuelve a lanzar `notFound()` y `redirect()` con `unstable_rethrow`.
- **Qué hicimos:** lo usamos en las vistas 1, 2 y 3. `error.js` queda como último recurso con el mensaje general. Lo probamos con `?simularError=503`.
