"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import Logo from "./Logo";
import estilos from "./Pie.module.css";

const COLUMNAS = [
  { clave: "explora", enlaces: { inicio: "/", mundos: "/mundos/neon" } },
  { clave: "cuenta", enlaces: { ingresar: "/ingresar", crearCuenta: "/registro" } },
  { clave: "legal", enlaces: { terminos: "/terminos" } },
];

export default function Pie({ onPreferenciasCookies }) {
  const { t } = useTextos();

  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.superior}`}>
        <div className={estilos.marca}>
          <Logo texto={t("navbar.logo.texto")} aria={t("navbar.logo.aria")} inverso />
          <p className="cuerpo-p">{t("footer.lema")}</p>
        </div>
        <div className={estilos.columnas}>
          {COLUMNAS.map(({ clave, enlaces }) => (
            <nav key={clave} aria-labelledby={`pie-${clave}`}>
              <h2 id={`pie-${clave}`} className={`detalle-etiqueta ${estilos.titulo}`}>
                {t(`footer.columnas.${clave}.titulo`)}
              </h2>
              <ul>
                {Object.entries(enlaces).map(([enlace, href]) => (
                  <li key={enlace}>
                    <Link href={href} prefetch={false}>{t(`footer.columnas.${clave}.enlaces.${enlace}`)}</Link>
                  </li>
                ))}
                {clave === "legal" && (
                  <li>
                    <button type="button" className={estilos.botonEnlace} onClick={onPreferenciasCookies}>
                      {t("cookies.preferencias.titulo")}
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className={`contenedor ${estilos.legal}`}>
        <p className="detalle-nota">{t("footer.legal.derechos", { anio: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
