import { Rubik, Unbounded } from "next/font/google";
import ProveedorTextos from "@/componentes/ProveedorTextos";
import Estructura from "@/componentes/Estructura";
import { api } from "@/lib/api";
import { leerPreferencias } from "@/lib/servidor";
import { leerUsuario } from "@/lib/sesion";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--fuente-titulos",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--fuente-texto",
  display: "swap",
});

// Al navegador solo pasa lo que se muestra en la navegación
function datosVisibles({ nombre, alias, correo, colorAvatar }) {
  return { nombre, alias, correo, colorAvatar };
}

export const viewport = {
  themeColor: "#1a1033",
};

// `modal` es la ranura paralela @modal: ahí se abre el detalle de un cromo sobre el catálogo
export default async function RootLayout({ children, modal }) {
  const { idioma, consentimiento } = await leerPreferencias();
  // GET /sesion con el token de la cookie httpOnly: null si no hay sesión o venció
  const [{ textos }, usuario] = await Promise.all([api.textos(idioma), leerUsuario()]);

  return (
    <html lang={idioma} className={`${unbounded.variable} ${rubik.variable}`}>
      <body>
        <ProveedorTextos
          idiomaInicial={idioma}
          textosIniciales={textos}
          consentimientoInicial={consentimiento}
        >
          <Estructura usuario={usuario && datosVisibles(usuario)}>{children}</Estructura>
          {modal}
        </ProveedorTextos>
      </body>
    </html>
  );
}
