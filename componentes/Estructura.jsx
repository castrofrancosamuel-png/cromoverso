"use client";

import { useTextos } from "./ProveedorTextos";
import Navbar from "./Navbar";
import Pie from "./Pie";

// Partes que comparten todas las vistas: saltar al contenido, navbar y pie
export default function Estructura({ children }) {
  const { t } = useTextos();

  return (
    <>
      <a href="#contenido" className="saltar-al-contenido">
        {t("general.aria.saltarAlContenido")}
      </a>
      <Navbar />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Pie />
    </>
  );
}
