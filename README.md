# Cromoverso · Sprints 1 y 2

Álbum de cromos de héroes. Este repositorio tiene los sprints 1 y 2 del proyecto de frontend:

- **Sprint 1:** las vistas públicas **Inicio** y **Catálogo de un mundo**, en español e inglés, con aviso de cookies, en web y móvil.
- **Sprint 2:** la vista **Detalle de un cromo**, los **estados de carga y de error** de todas las vistas, **Iniciar sesión** y la **sesión iniciada** en la navegación (con cerrar sesión).

- Despliegue: (https://cromoverso-chi.vercel.app)
- Diseño: archivo de Figma de Cromoverso, página «Curso — alcance de tres sprints», bloques «Sprint 1» y «Sprint 2»
- API: https://yanethm-cromoverso-api.fly.dev/api/v1 ([endpoints](https://yanethm-cromoverso-api.fly.dev/docs), [contrato por vista](https://yanethm-cromoverso-api.fly.dev/docs/contrato))

## Requisitos

- Node.js 18.18 o superior (recomendado 20 o 22)
- npm

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

Otros comandos:

| Comando | Para qué |
| --- | --- |
| `npm run build` | Compila para producción |
| `npm start` | Sirve la versión compilada |
| `npm run lint` | Revisa el código con ESLint |

La dirección de la API se puede cambiar con la variable `CROMOVERSO_API_URL` (ver `.env.example`). Si no se define, se usa la de Cromoverso.

## Qué incluye

| Vista | Ruta | Datos de la API |
| --- | --- | --- |
| 1 · Inicio público | `/` | `GET /mundos`, `GET /cromos?rareza=legendaria` (cartas del hero), `GET /textos`, `GET /sesion` y `DELETE /sesion` |
| 2 · Catálogo de un mundo | `/mundos/[id]` | `GET /mundos/:id`, `GET /mundos`, `GET /rarezas`, `GET /cromos?mundo=&rareza=&tipo=&pagina=` |
| 3 · Detalle de un cromo | `/cromos/[id]` | `GET /cromos/:id` (y `GET /mundos/:id` para el cromo anterior y el siguiente) |
| 4 · Iniciar sesión | `/ingresar` | `POST /sesion` |

### Sprint 1

- **Filtros en la URL.** Rareza, tipo y página van en la dirección (`/mundos/neon?rareza=legendaria&tipo=heroe`), así no se pierden al recargar ni al compartir el enlace. Muestra el estado vacío (200 con lista vacía), el error de filtro (422 `validacion`) y la página de no encontrado (404 `no_encontrado`).
- **Idioma.** Todos los textos de la interfaz salen de `GET /textos?idioma=es|en`; no hay textos escritos a mano. El selector ES | EN cambia los textos sin recargar y actualiza `<html lang>` y el título de la pestaña.
- **Cookies.** En la primera visita aparece el aviso. `consentimiento` guarda `aceptado` o `rechazado`. `idioma` guarda `es` o `en` y solo se escribe si la persona aceptó; si rechaza, se borra. Las dos duran un año, con `SameSite=Lax`. El aviso se vuelve a abrir desde «Preferencias de cookies» en el pie.
- **Diseño adaptable.** Desde 320 px. En móvil: menú de pantalla completa, carrusel de mundos, filtros desplegables y tres columnas de cromos.
- **Accesibilidad básica.** Enlace para saltar al contenido, foco visible, `aria-current` en la navegación y los filtros, menú móvil que se cierra con Escape y devuelve el foco, y rarezas con icono y palabra (nunca solo color).

### Sprint 2

- **Vista 3 · Detalle de un cromo.** Al pulsar una carta del catálogo, el detalle se abre en una **ventana modal** sobre el catálogo y la URL cambia a `/cromos/CV-008` (rutas paralelas e interceptadas de Next.js: `app/@modal/(.)cromos/[id]`). Si se recarga o se abre el enlace directo, se ve como **página completa** (`app/cromos/[id]`). Muestra rareza (icono y palabra), mundo, tipo, poder, descripción, las cuatro barras de atributos (escala de 10 a 99) con su total, y enlaces al cromo anterior y al siguiente del mismo mundo. Un id que no existe muestra «No encontramos este cromo» (404 `no_encontrado` → `notFound()`). Los metadatos usan el nombre y el poder (`generateMetadata`). En móvil la modal es una hoja que sube desde abajo.
- **Estados de carga.** Cada vista tiene su silueta (`loading.js`): inicio, catálogo, detalle (página y modal). Los lectores de pantalla oyen «Cargando…».
- **Estados de error.** Si la API falla, la vista muestra «No se pudo cargar» con el mensaje de `textos.errores[codigo]` (por ejemplo `falla_simulada`) y el botón **Reintentar**, que vuelve a pedir los datos. En el inicio, si fallan los mundos, el hero se sigue viendo. En el catálogo, si fallan solo los cromos, el error aparece en la grilla.
- **Probar los estados.** Agrega a cualquier URL `?simularLatencia=3000` (carga) o `?simularError=503` (error, también `500` o `504`). `middleware.js` las convierte en las cabeceras `X-Simular-Latencia` y `X-Simular-Error` del contrato.
- **Vista 4 · Iniciar sesión.** Formulario con correo, contraseña (botón para mostrarla u ocultarla), «Mantener la sesión iniciada» y los estados del diseño: campos obligatorios, «Ingresando…», correo o contraseña incorrectos (401, un solo mensaje), demasiados intentos (429, con cuenta regresiva de `Retry-After`), sin conexión (con **Reintentar** y lo escrito se conserva) y error del servidor. Tras ingresar vuelve a la página de donde vino (`/ingresar?volver=/mundos/neon`).
- **Sesión.** El ingreso se hace en una **Server Action** (`app/ingresar/acciones.js`). El token de la API se guarda en la cookie **httpOnly** `sesion` del frontend (12 horas si se marca «Mantener la sesión»; si no, hasta cerrar el navegador) y viaja a la API como `Authorization: Bearer` solo desde el servidor. Nunca va a `localStorage` ni lo ve JavaScript del navegador. El layout llama a `GET /sesion` y, si hay sesión, la navegación muestra el avatar con las iniciales y el menú de la cuenta (nombre, correo y **Cerrar sesión**, que llama a `DELETE /sesion` y borra la cookie). En móvil, el menú muestra nombre, alias y cerrar sesión.
- **Cookies.** `sesion` es una cookie necesaria: se pone aunque la persona haya rechazado las opcionales. `consentimiento` e `idioma` siguen igual que en el sprint 1.

## Estructura

```
app/
  layout.js                   Fuentes, idioma, textos, sesión (GET /sesion) y la ranura @modal
  (inicio)/page.js            Vista 1 · Inicio público (y su loading.js)
  mundos/[id]/page.js         Vista 2 · Catálogo de un mundo (y su loading.js)
  cromos/[id]/page.js         Vista 3 · Detalle como página completa (loading.js y not-found.js)
  @modal/(.)cromos/[id]/      Vista 3 · Detalle en ventana modal sobre el catálogo
  ingresar/page.js            Vista 4 · Iniciar sesión
  ingresar/acciones.js        Server Action: POST /sesion y cookie httpOnly
  acciones/sesion.js          Server Action: cerrar sesión (DELETE /sesion)
  api/textos/route.js         El navegador pide aquí los textos al cambiar de idioma
  error.js, not-found.js      Último recurso para errores y rutas que no existen
  tokens.css                  Tokens de Figma (colores, espacios, radios, sombras, tipografía)
componentes/                  Navbar, MenuCuenta, DetalleCromo, ModalCromo, FormularioIngreso,
                              EstadoPagina, Esqueleto, Cromo, Hero, CatalogoMundo...
lib/
  api.js                      Cliente de la API: pedir (GET con caché) y enviar (POST/DELETE con token)
  cargar.js                   Convierte un fallo de la API en el código del estado de error
  detalle.js                  Carga de la vista 3 (cromo y vecinos)
  sesion.js                   Cookie de sesión y GET /sesion
  textos.js                   Lee textos por ruta, marcadores {nombre} y plurales
  preferencias.js             Nombres y reglas de las cookies de idioma y consentimiento
  servidor.js                 Lee cookies e idioma en el servidor
middleware.js                 ?simularLatencia y ?simularError → cabeceras de simulación
docs/SUSTENTACION-SPRINT-2.md Guía para la demostración del sprint 2
```

## Desplegar en Vercel

1. En vercel.com elige «Add New» → «Project» e importa este repositorio.
2. Vercel detecta Next.js solo. No hace falta cambiar nada.
3. Opcional: agrega la variable `CROMOVERSO_API_URL`.
4. Copia el enlace del despliegue al inicio de este README.

## Fuera del sprint 2

Sprint 3: crear cuenta, verificación del correo y recuperación de la contraseña. «Crear cuenta» apunta a `/registro` y «¿Olvidaste tu contraseña?» a `/recuperar-clave`, que por ahora muestran la página de no encontrado.

## Cuenta de prueba

`laura@cromoverso.test`, clave `cromos2026`. Para probar el 429 usa un correo inventado (por ejemplo `tu-nombre@cromoverso.test`) y falla la clave seis veces seguidas.
