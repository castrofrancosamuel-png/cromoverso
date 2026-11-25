"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTextos } from "./ProveedorTextos";
import Navbar from "./Navbar";
import Pie from "./Pie";
import AvisoCookies from "./AvisoCookies";
import ProveedorSesion from "./ProveedorSesion";

// Vistas a pantalla completa, sin navbar ni pie (Figma: Iniciar sesión)
const SIN_NAVEGACION = ["/ingresar"];

// Partes que comparten todas las vistas: saltar al contenido, navbar, pie y aviso de cookies
export default function Estructura({ usuario = null, children }) {
  const { t, consentimiento } = useTextos();
  const [reabierto, setReabierto] = useState(false);
  const conNavegacion = !SIN_NAVEGACION.includes(usePathname());

  return (
    <ProveedorSesion usuario={usuario}>
      <a href="#contenido" className="saltar-al-contenido">
        {t("general.aria.saltarAlContenido")}
      </a>
      {conNavegacion && <Navbar />}
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      {conNavegacion && <Pie onPreferenciasCookies={() => setReabierto(true)} />}
      <AvisoCookies visible={!consentimiento || reabierto} onResponder={() => setReabierto(false)} />
    </ProveedorSesion>
  );
}
