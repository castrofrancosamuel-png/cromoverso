import { Rubik, Unbounded } from "next/font/google";
import ProveedorTextos from "@/componentes/ProveedorTextos";
import Estructura from "@/componentes/Estructura";
import { api } from "@/lib/api";
import { leerPreferencias } from "@/lib/servidor";
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

export const viewport = {
  themeColor: "#1a1033",
};

export default async function RootLayout({ children }) {
  const { idioma, consentimiento } = await leerPreferencias();
  const { textos } = await api.textos(idioma);

  return (
    <html lang={idioma} className={`${unbounded.variable} ${rubik.variable}`}>
      <body>
        <ProveedorTextos
          idiomaInicial={idioma}
          textosIniciales={textos}
          consentimientoInicial={consentimiento}
        >
          <Estructura>{children}</Estructura>
        </ProveedorTextos>
      </body>
    </html>
  );
}
