// Iconos de trazo de 24×24 con el estilo del kit de Cromoverso. Heredan el color del texto.
const TRAZOS = {
  inicio: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  mundo: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M20.2 7.6C21.9 5.3 22.4 3.4 21.5 2.5c-1.4-1.4-6.4 1.3-11.2 6.1S2.9 18.8 4.3 20.2c.9.9 2.8.4 5.1-1.3" />
      <path d="M17 7a7.1 7.1 0 0 1-10 10" />
    </>
  ),
  album: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 3v18" />
    </>
  ),
  regalo: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </>
  ),
  destellos: (
    <>
      <path d="M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z" />
      <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
    </>
  ),
  rayo: (
    <path d="M4 14a1 1 0 0 1-.8-1.6l9.9-10.2a.5.5 0 0 1 .9.5l-1.9 6A1 1 0 0 0 13 10h7a1 1 0 0 1 .8 1.6l-9.9 10.2a.5.5 0 0 1-.9-.5l1.9-6A1 1 0 0 0 11 14z" />
  ),
  ola: (
    <>
      <path d="M3 13c2-5 7-7 11-5 3 1.5 3 6-1 6-3 0-3-4 1-5" />
      <path d="M14 9c2.5-.5 5 .5 7 3" />
    </>
  ),
  hoja: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.4-.5 4.9-2 6.8-3.9" />
    </>
  ),
  llama: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  estrella: (
    <path d="M11.5 2.3a.5.5 0 0 1 1 0l2.3 4.7a2.1 2.1 0 0 0 1.6 1.2l5.2.7a.5.5 0 0 1 .3.9l-3.7 3.6a2.1 2.1 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6l-4.6-2.4a2.1 2.1 0 0 0-2 0L6.4 21a.5.5 0 0 1-.8-.6l.9-5.1a2.1 2.1 0 0 0-.6-1.9L2.2 9.8a.5.5 0 0 1 .3-.9l5.2-.7a2.1 2.1 0 0 0 1.6-1.2z" />
  ),
  ojo: (
    <>
      <path d="M2.1 12.3a1 1 0 0 1 0-.7 10.8 10.8 0 0 1 19.8 0 1 1 0 0 1 0 .7 10.8 10.8 0 0 1-19.8 0" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  corona: (
    <>
      <path d="M11.6 3.3a.5.5 0 0 1 .8 0l3 5.6a1 1 0 0 0 1.5.3l4.3-3.7a.5.5 0 0 1 .8.5l-2.8 10.3a1 1 0 0 1-1 .7H5.8a1 1 0 0 1-1-.7L2 6a.5.5 0 0 1 .8-.5l4.3 3.7a1 1 0 0 0 1.5-.3z" />
      <path d="M5 21h14" />
    </>
  ),
  rombo: (
    <path d="M2.7 10.3a2.4 2.4 0 0 0 0 3.4l7.6 7.6a2.4 2.4 0 0 0 3.4 0l7.6-7.6a2.4 2.4 0 0 0 0-3.4l-7.6-7.6a2.4 2.4 0 0 0-3.4 0Z" />
  ),
  circulo: <circle cx="12" cy="12" r="9" />,
  flechaDer: <path d="M5 12h14M12 5l7 7-7 7" />,
  flechaIzq: <path d="M19 12H5M12 19l-7-7 7-7" />,
  chevronDer: <path d="m9 18 6-6-6-6" />,
  chevronAbajo: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  cerrar: <path d="M18 6 6 18M6 6l12 12" />,
  galleta: (
    <>
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5h.01M16 15.5h.01M12 12h.01M11 17h.01M7 14h.01" />
    </>
  ),
};

// Iconos que van rellenos (las rarezas y la estrella del logo)
const RELLENOS = new Set(["estrella", "corona", "rombo"]);

export default function Icono({ nombre, tamano = 20, relleno, className }) {
  const lleno = relleno ?? RELLENOS.has(nombre);
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      fill={lleno ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRAZOS[nombre]}
    </svg>
  );
}

// La API describe la figura de cada mundo y cromo; aquí elegimos su icono
export const ICONO_DE_FIGURA = {
  circulo: "circulo",
  rayo: "rayo",
  estrella: "estrella",
  ola: "ola",
  hoja: "destellos",
  llama: "llama",
  orbita: "estrella",
  runa: "ojo",
};
