# Cromoverso · Sprint 1

Álbum de cromos de héroes. Este repositorio tiene el sprint 1 del proyecto de frontend: las vistas públicas **Inicio** y **Catálogo de un mundo**, en español e inglés, con aviso de cookies, en web y móvil.

- Despliegue: (https://cromoverso-chi.vercel.app)
- Diseño: archivo de Figma de Cromoverso, página «Curso — alcance de tres sprints», bloque «Sprint 1»
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
| 1 · Inicio público | `/` | `GET /mundos`, `GET /cromos?rareza=legendaria` (cartas del hero), `GET /textos` |
| 2 · Catálogo de un mundo | `/mundos/[id]` | `GET /mundos/:id`, `GET /mundos`, `GET /rarezas`, `GET /cromos?mundo=&rareza=&tipo=&pagina=` |

- **Filtros en la URL.** Rareza, tipo y página van en la dirección (`/mundos/neon?rareza=legendaria&tipo=heroe`), así no se pierden al recargar ni al compartir el enlace. Muestra el estado vacío (200 con lista vacía), el error de filtro (422 `validacion`) y la página de no encontrado (404 `no_encontrado`).
- **Idioma.** Todos los textos de la interfaz salen de `GET /textos?idioma=es|en`; no hay textos escritos a mano. El selector ES | EN cambia los textos sin recargar y actualiza `<html lang>` y el título de la pestaña.
- **Cookies.** En la primera visita aparece el aviso. `consentimiento` guarda `aceptado` o `rechazado`. `idioma` guarda `es` o `en` y solo se escribe si la persona aceptó; si rechaza, se borra. Las dos duran un año, con `SameSite=Lax`. El aviso se vuelve a abrir desde «Preferencias de cookies» en el pie.
- **Diseño adaptable.** Desde 320 px. En móvil: menú de pantalla completa, carrusel de mundos, filtros desplegables y tres columnas de cromos.
- **Accesibilidad básica.** Enlace para saltar al contenido, foco visible, `aria-current` en la navegación y los filtros, menú móvil que se cierra con Escape y devuelve el foco, y rarezas con icono y palabra (nunca solo color).

## Estructura

```
app/
  layout.js            Fuentes, idioma inicial (cookie o navegador) y textos de la API
  page.js              Vista 1 · Inicio público
  mundos/[id]/page.js  Vista 2 · Catálogo de un mundo
  api/textos/route.js  El navegador pide aquí los textos al cambiar de idioma
  tokens.css           Tokens de Figma (colores, espacios, radios, sombras, tipografía)
componentes/           Navbar, Pie, AvisoCookies, Cromo, Hero, CatalogoMundo...
lib/
  api.js               Cliente de la API (un solo lugar con la dirección)
  textos.js            Lee textos por ruta, marcadores {nombre} y plurales
  preferencias.js      Nombres y reglas de las cookies
  servidor.js          Lee cookies e idioma en el servidor
```

## Desplegar en Vercel

1. En vercel.com elige «Add New» → «Project» e importa este repositorio.
2. Vercel detecta Next.js solo. No hace falta cambiar nada.
3. Opcional: agrega la variable `CROMOVERSO_API_URL`.
4. Copia el enlace del despliegue al inicio de este README.

## Fuera del sprint 1

Sprint 2: vista 3 (detalle de un cromo), estados de carga y error completos, iniciar sesión y sesión. Sprint 3: crear cuenta, verificación del correo y recuperación de la contraseña. Los botones «Ingresar» y «Crear cuenta» ya apuntan a `/ingresar` y `/registro`, que por ahora muestran la página de no encontrado.

## Cuenta de prueba

`laura@cromoverso.test`, clave `cromos2026` (se usa desde el sprint 2).
