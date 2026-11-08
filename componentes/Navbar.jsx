"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTextos } from "./ProveedorTextos";
import Logo from "./Logo";
import Icono from "./Icono";
import SelectorIdioma from "./SelectorIdioma";
import estilos from "./Navbar.module.css";

// Rutas del sprint 1. "Mundos" abre el catálogo del primer mundo.
export const ENLACES = [
  { clave: "inicio", href: "/", icono: "inicio", activo: (ruta) => ruta === "/" },
  { clave: "mundos", href: "/mundos/neon", icono: "mundo", activo: (ruta) => ruta.startsWith("/mundos") },
];

export default function Navbar() {
  const { t } = useTextos();
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef(null);
  const panel = useRef(null);
  const enInicio = ruta === "/";

  // Cerrar el menú al navegar
  useEffect(() => setAbierto(false), [ruta]);

  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("a")?.focus();

    function cerrarConEscape(evento) {
      if (evento.key === "Escape") {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  return (
    <header className={`${estilos.navbar} ${enInicio && !abierto ? estilos.sobreHero : ""}`}>
      <div className={`contenedor ${estilos.interior}`}>
        <Logo texto={t("navbar.logo.texto")} aria={t("navbar.logo.aria")} />

        <nav className={estilos.enlaces} aria-label={t("sitio.nombre")}>
          <ul>
            {ENLACES.map(({ clave, href, activo }) => (
              <li key={clave}>
                <Link href={href} aria-current={activo(ruta) ? "page" : undefined}>
                  {t(`navbar.enlaces.${clave}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acciones}>
          <div className={estilos.soloWeb}>
            <SelectorIdioma />
          </div>
          {!abierto && (
            <Link href="/ingresar" prefetch={false} className={`boton boton--claro ${estilos.ingresar}`}>
              {t("navbar.botones.ingresar")}
            </Link>
          )}
          <Link href="/registro" prefetch={false} className={`boton boton--primario ${estilos.soloWeb}`}>
            {t("navbar.botones.crearCuenta")}
          </Link>
          <button
            ref={botonMenu}
            type="button"
            className={estilos.botonMenu}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? t("menuMovil.cerrar") : t("menuMovil.abrir")}
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>
      </div>

      <div id="menu-movil" ref={panel} className={estilos.menuMovil} hidden={!abierto}>
        <nav aria-label={t("sitio.nombre")}>
          <ul className={estilos.listaMovil}>
            {ENLACES.map(({ clave, href, icono, activo }) => {
              const actual = activo(ruta);
              return (
                <li key={clave}>
                  <Link href={href} className={estilos.enlaceMovil} aria-current={actual ? "page" : undefined}>
                    <Icono nombre={icono} />
                    <span>{t(`menuMovil.enlaces.${clave}`)}</span>
                    {actual ? (
                      <span className={`detalle-etiqueta ${estilos.estasAqui}`}>{t("menuMovil.aria.estasAqui")}</span>
                    ) : (
                      <Icono nombre="chevronDer" tamano={16} className={estilos.chevron} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={estilos.pieMovil}>
          <div className={estilos.filaIdioma}>
            <span className="cuerpo-p-fuerte">{t("menuMovil.secciones.idioma")}</span>
            <SelectorIdioma />
          </div>
          <div className={estilos.botonesMovil}>
            <Link href="/ingresar" prefetch={false} className="boton boton--claro boton--grande">
              {t("menuMovil.botones.ingresar")}
            </Link>
            <Link href="/registro" prefetch={false} className="boton boton--primario boton--grande">
              {t("menuMovil.botones.crearCuenta")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
