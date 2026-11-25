# Sustentación del Sprint 2 · Cromoverso

Guía para presentar el sprint 2: qué hay de nuevo, cómo funciona cada historia, qué endpoints usa, cómo se maneja la sesión y los estados, un guion de 5 minutos y las preguntas que probablemente te hagan.

## 1. Qué entrega el sprint 2

| Historia | Rama / PR | Qué hace |
| --- | --- | --- |
| Vista 3 · Detalle de un cromo | `feat/vista-detalle-cromo` | Ficha del cromo en ventana modal sobre el catálogo y como página completa |
| Estados de carga y de error | `feat/estados-carga-error` | Siluetas mientras cargan las vistas y «No se pudo cargar» con «Reintentar» |
| Vista 4 · Iniciar sesión | `feat/iniciar-sesion` | Formulario con todos sus estados; token en cookie httpOnly |
| Sesión en la navegación | `feat/sesion-en-navegacion` | Avatar y menú de la cuenta, cerrar sesión, hero sin «Crear cuenta» |
| Documentación | `docs/sprint-2` | README, IA.md (entradas 6 a 10) y esta guía |

Fuera del sprint 2 (sprint 3): crear cuenta, verificar el correo y recuperar la contraseña. Los enlaces «Crea una cuenta» y «¿Olvidaste tu contraseña?» ya existen y por ahora llevan a la página de no encontrado.

## 2. Endpoints que se usan

| Vista | Endpoint | Para qué | ¿Pide sesión? |
| --- | --- | --- | --- |
| Todas | `GET /textos?idioma=es\|en&seccion=...` | Textos de la interfaz (nuevas secciones: `paginas.detalleCromo`, `paginas.ingresar`, `formularios.validacion`) | No |
| 1 | `GET /mundos`, `GET /cromos` | Mundos y cartas del hero | No |
| Layout | `GET /sesion` (con `Authorization: Bearer`) | Saber quién inició sesión; 401 = sin sesión | Sí |
| Navegación | `DELETE /sesion` | Cerrar sesión (204) | No |
| 2 | `GET /mundos/:id`, `GET /cromos`, `GET /rarezas` | Catálogo (sprint 1) | No |
| 3 | `GET /cromos/:id` | El cromo (acepta `cv-018` o `CV-018`) | No |
| 3 | `GET /mundos/:id` | Cromo anterior y siguiente del mismo mundo (ya estaba en caché por la vista 2) | No |
| 4 | `POST /sesion` | Ingresar con `{ correo, clave }` | No |

Todas las llamadas salen del **servidor de Next.js**, no del navegador. Así no dependemos de CORS y el token nunca llega al navegador.

## 3. Cómo funciona cada historia

### Vista 3 · Detalle de un cromo

- **Dos formas de verla.** Desde el catálogo, la carta es un enlace a `/cromos/CV-008`. Next.js **intercepta** esa ruta (`app/@modal/(.)cromos/[id]/page.js`) y la pinta en la ranura paralela `@modal` del layout: el catálogo se queda detrás y la URL cambia. Si recargas o abres el enlace directo, no hay intercepción y se ve la **página completa** (`app/cromos/[id]/page.js`) con migas de pan.
- **Ventana modal accesible.** Usa `<dialog>` con `showModal()`: el foco queda atrapado dentro, Escape cierra, el fondo oscuro también cierra y al cerrar se hace `router.back()`. El título tiene `aria-labelledby`.
- **Contenido** (`componentes/DetalleCromo.jsx`): rareza con icono y palabra (nunca solo color), mundo, tipo, holográfico, ubicación «CV-008 · Ciudad Neón, posición 8», nombre, poder, descripción, barras de atributos (ancho = valor / 99) con el número al lado como texto y el total, y enlaces al cromo anterior y siguiente.
- **No encontrado.** `GET /cromos/CV-999` responde 404 `no_encontrado` → `notFound()` → `app/cromos/[id]/not-found.js` con los textos de `paginas.detalleCromo.noEncontrado`. Dentro de la modal se muestra el mismo mensaje en la ventana.
- **Metadatos.** `generateMetadata` usa `nombre` y `poder`, como pide el contrato.
- **Móvil.** La modal es una hoja que sube desde abajo, con la carta pequeña al lado del nombre (Figma, móvil).

### Estados de carga y de error

- **Carga.** Cada ruta tiene `loading.js` con una silueta de su forma (`componentes/Esqueleto.jsx`): inicio, catálogo, detalle y detalle en modal. Next.js lo muestra mientras el servidor espera la API (Suspense). Lleva `role="status"` con «Cargando…» para lectores de pantalla y respeta «reducir movimiento».
- **Error.** `lib/cargar.js` envuelve las peticiones: si la API falla devuelve el `codigo` (`falla_simulada`, `error_interno`, o `sin_conexion` si no respondió). La vista pinta `EstadoPagina` con el título «No se pudo cargar», el texto de `textos.errores[codigo]` y el botón **Reintentar** (`router.refresh()` dentro de `useTransition`, que muestra «Cargando…» mientras tanto).
- **Errores parciales.** En el inicio, si fallan los mundos, el hero sigue visible. En el catálogo, si fallan solo los cromos, el error sale dentro de la grilla. En el detalle, el error sale en la página o dentro de la modal.
- **Por qué no basta `error.js`.** En producción Next.js oculta el mensaje de los errores que llegan a `error.js`; por eso cada vista atrapa su error y conoce el `codigo`. `error.js` queda como último recurso.
- **Cómo demostrarlo.** `?simularLatencia=3000` o `?simularError=503` en cualquier URL. `middleware.js` los convierte en las cabeceras `X-Simular-Latencia` y `X-Simular-Error` que documenta el contrato, y esas respuestas no se guardan en caché.

### Vista 4 · Iniciar sesión

- **Pantalla completa** sin navbar ni pie (como en Figma): a la izquierda la presentación con tres cartas legendarias de la API, a la derecha el formulario. En móvil la presentación va arriba. Se agregó el selector ES | EN arriba a la derecha para poder cambiar de idioma también aquí.
- **Validación en el navegador** antes de enviar: correo y contraseña obligatorios y formato de correo. Cada error va junto a su campo (`aria-invalid`, `aria-describedby`) y arriba aparece el resumen «Revisa los campos marcados», que recibe el foco.
- **Envío.** El formulario llama a la Server Action `iniciarSesion` (`app/ingresar/acciones.js`), que hace `POST /sesion` desde el servidor. El botón muestra «Ingresando…» con un icono que gira.
- **Respuestas** (contrato, vista 4):
  - 201 → guarda el token en la cookie httpOnly y vuelve a la página de origen (`?volver=`).
  - 401 `credenciales_invalidas` → un solo mensaje, «Correo o contraseña incorrectos», sin decir cuál dato falló.
  - 422 `validacion` → mensaje junto a cada campo.
  - 429 `demasiadas_peticiones` → «Espera N segundos» con cuenta regresiva desde `Retry-After`; el botón queda deshabilitado mientras tanto.
  - Sin respuesta → «No pudimos conectarnos», el botón cambia a **Reintentar** y lo escrito se conserva.
  - 5xx → «No se pudo cargar» con el texto de `errores[codigo]`.
- **Mostrar contraseña** con un botón con `aria-pressed` y etiqueta «Mostrar / Ocultar contraseña».
- **Ya con sesión**, `/ingresar` redirige al inicio (307 desde el servidor).
- `?volver=` solo acepta rutas internas (empiezan por `/` y no por `//`) para que nadie use el enlace para mandar a otro sitio.

### Sesión iniciada y cerrar sesión

- **Dónde vive el token.** En la cookie `sesion` del dominio del frontend, con `httpOnly`, `SameSite=Lax`, `Secure` en producción y `Path=/`. Con «Mantener la sesión iniciada» dura 12 horas (lo mismo que la sesión de la API); sin marcar, es de sesión del navegador. Nunca se guarda en `localStorage`.
- **Quién soy.** El layout (`app/layout.js`) llama a `GET /sesion` con `Authorization: Bearer <token>`. Si responde 200, pasa al navegador solo nombre, alias, correo y color del avatar (`ProveedorSesion`). Si responde 401 (venció) o la API no responde, la página se ve sin sesión.
- **Navegación con sesión.** En web, el avatar con las iniciales («LC») reemplaza a «Ingresar» y «Crear cuenta»; al pulsarlo se abre el menú con nombre, correo y «Cerrar sesión» (se cierra con Escape o clic afuera). En móvil, el menú de pantalla completa muestra abajo nombre, `@alias` y «Cerrar sesión». En el inicio desaparece el botón «Crear cuenta gratis».
- **Cerrar sesión.** Es un `<form action={cerrarSesion}>` (Server Action en `app/acciones/sesion.js`): llama a `DELETE /sesion`, borra la cookie y `revalidatePath("/", "layout")` vuelve a pintar la navegación.

### Idioma y cookies en lo nuevo

- Todos los textos nuevos salen de la API (`paginas.detalleCromo`, `paginas.ingresar`, `formularios.validacion`, `estados`, `errores`, `navbar.usuario`, `menuMovil.botones.cerrarSesion`). Cambiar a EN cambia también la modal, los estados y el formulario.
- `sesion` es una cookie **necesaria**: se pone aunque la persona rechace las opcionales. `idioma` sigue guardándose solo con consentimiento.

### Accesibilidad básica en lo nuevo

- Modal con `<dialog>`: foco atrapado, Escape, título con `aria-labelledby`.
- Barras de atributos decorativas (`aria-hidden`) con el número como texto en una lista `<dl>`.
- Estados de carga con `role="status"`, errores con `role="alert"`, botón Reintentar con `aria-busy`.
- Formulario con `label` en cada campo, `autocomplete="username"` y `"current-password"`, errores asociados con `aria-describedby`, foco en el resumen de errores.
- Menú de la cuenta con `aria-expanded` y `aria-controls`, Escape devuelve el foco al avatar.
- Áreas táctiles de 44 px como mínimo en los botones nuevos.

## 4. Guion de la demostración (5 minutos, sobre el despliegue de Vercel)

1. **(0:00 – 0:30) Contexto.** «En el sprint 2 agregamos la vista 3, los estados de carga y error, iniciar sesión y la sesión en la navegación. Hay un PR por historia, fusionados en `main`.» Muestra la lista de PR en GitHub.
2. **(0:30 – 1:30) Vista 3.** Entra a un mundo, pulsa una carta: se abre la modal y la URL cambia a `/cromos/CV-0xx`. Muestra atributos y total, pasa al cromo siguiente, cierra con Escape (vuelve al catálogo). Recarga estando en `/cromos/CV-008`: ahora es página completa. Abre `/cromos/CV-999`: «No encontramos este cromo».
3. **(1:30 – 2:30) Estados.** Abre `/mundos/coral?simularLatencia=3000`: se ve la silueta. Abre `/mundos/neon?simularError=503`: «No se pudo cargar» con el mensaje de `falla_simulada` y Reintentar. Abre `/?simularError=503`: el hero sigue, el error queda en la sección de mundos.
4. **(2:30 – 3:45) Iniciar sesión.** Pulsa «Ingresar» desde el catálogo. Envía vacío: errores junto a los campos y resumen. Escribe `laura@cromoverso.test` con una clave mala: «Correo o contraseña incorrectos». Muestra el ojo de la contraseña. Ingresa con `cromos2026`: «Ingresando…» y vuelves al catálogo donde estabas.
5. **(3:45 – 4:30) Sesión.** Muestra el avatar «LC» y el menú (nombre y correo). En las herramientas del navegador (Application → Cookies) muestra la cookie `sesion` con **HttpOnly** marcado y que en `localStorage` no hay nada. Cambia a EN: el menú y la modal se traducen. Cierra sesión: vuelve «Ingresar».
6. **(4:30 – 5:00) Móvil y cierre.** Con el modo responsive (390 px): modal como hoja inferior, login apilado, menú móvil con la cuenta. Cierra mostrando README e IA.md.

Consejo: abre las pestañas antes de empezar. La API se apaga por inactividad y la primera petición puede tardar unos segundos.

## 5. Preguntas probables

**¿Por qué el token no está en `localStorage`?** Porque cualquier script de la página (por ejemplo una dependencia comprometida o un XSS) podría leerlo. En una cookie httpOnly JavaScript no puede leerla; el navegador la envía sola a nuestro servidor y el servidor la manda a la API como Bearer. Es lo que recomienda el contrato.

**¿Por qué una Server Action y no `fetch` desde el navegador a la API?** Para que el token se reciba y se guarde en el servidor, sin pasar por el navegador, y para no depender de CORS ni de la cookie `sesion` del dominio de la API (es de otro dominio, no le sirve a nuestro frontend).

**¿Qué pasa cuando la sesión vence?** `GET /sesion` responde 401 `no_autenticado` y el layout trata a la persona como sin sesión: vuelve a ver «Ingresar».

**¿Qué hace «Mantener la sesión iniciada»?** Si está marcada, la cookie dura 12 horas (`maxAge`); si no, no tiene fecha y el navegador la borra al cerrarse.

**¿Cómo funciona la modal con la URL?** Con rutas paralelas (`@modal`) e interceptadas (`(.)cromos`) de Next.js. Navegando desde la app se intercepta y se pinta encima; al recargar o compartir el enlace se carga la página real. Así el enlace siempre funciona.

**¿Por qué los vecinos salen de `GET /mundos/:id`?** El contrato de la vista 3 solo da `GET /cromos/:id`, que no trae los vecinos. `GET /mundos/:id` trae los 20 cromos en orden y ya está en caché por la vista 2, así que no es una petición extra en la práctica. Si falla, el detalle se muestra sin esos enlaces.

**¿Cómo se ven los estados si la API funciona bien?** Con `?simularLatencia=` y `?simularError=`, que el middleware convierte en las cabeceras de simulación del contrato.

**¿Por qué el error no usa solo `error.js`?** Porque en producción Next.js no deja leer el mensaje del error en `error.js` (solo un `digest`), y necesitamos el `codigo` para mostrar `textos.errores[codigo]`.

**¿Qué pasa con el 429?** Después de 5 intentos fallidos con el mismo correo en 5 minutos, la API responde 429 con `Retry-After`. Mostramos «Espera N segundos» con cuenta regresiva y deshabilitamos el botón. Se prueba con un correo inventado, no con la cuenta de prueba.

**¿Por qué una página que no existe responde con estado 200?** Las rutas con `loading.js` empiezan a enviar la página antes de saber si el recurso existe (streaming). Cuando llega el 404, Next.js muestra la página de no encontrado y agrega `<meta name="robots" content="noindex">`. La persona ve lo correcto; es un comportamiento conocido de Next.js.

**¿Cómo se mantiene el idioma en lo nuevo?** Igual que en el sprint 1: ningún texto está escrito en los componentes; todos salen de `GET /textos`. Agregamos las secciones nuevas a la lista de `lib/api.js`.

**¿Qué hiciste con la IA?** Ver IA.md, entradas 6 a 10. Dos respuestas fueron equivocadas y se corrigieron: el `loading.js` en la raíz que se colaba en `/ingresar`, y el cálculo sin redondear de los rayos de la carta que causaba un error de hidratación.

## 6. Qué conviene revisar antes de presentar

- El diseño se tomó de la exportación de Figma (`Cromoverso · Álbum de héroes.png`, bloque «Sprint 2»), no del archivo de Figma en vivo. Compara medidas y colores finos con el archivo si tienes acceso.
- El código se probó contra una copia local de la API con las mismas respuestas del contrato (incluidos 401, 422, 429, 404 y 503). Antes de la demo, prueba en el despliegue de Vercel con la API real: ingresar, cerrar sesión, la modal y los dos parámetros de simulación.
