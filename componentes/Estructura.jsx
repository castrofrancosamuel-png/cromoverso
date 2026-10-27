"use client";

import { useState } from "react";
import { useTextos } from "./ProveedorTextos";
import Navbar from "./Navbar";
import Pie from "./Pie";
import AvisoCookies from "./AvisoCookies";

// Partes que comparten todas las vistas: saltar al contenido, navbar, pie y aviso de cookies
export default function Estructura({ children }) {
  const { t, consentimiento } = useTextos();
  const [reabierto, setReabierto] = useState(false);

  return (
    <>
      <a href="#contenido" className="saltar-al-contenido">
        {t("general.aria.saltarAlContenido")}
      </a>
      <Navbar />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Pie onPreferenciasCookies={() => setReabierto(true)} />
      <AvisoCookies visible={!consentimiento || reabierto} onResponder={() => setReabierto(false)} />
    </>
  );
}
