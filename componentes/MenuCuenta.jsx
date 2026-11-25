"use client";

import { useEffect, useRef, useState } from "react";
import { cerrarSesion } from "@/app/acciones/sesion";
import { useTextos } from "./ProveedorTextos";
import { iniciales, useUsuario } from "./ProveedorSesion";
import Icono from "./Icono";
import estilos from "./MenuCuenta.module.css";

// Menú de la cuenta en la navegación web (Figma: inicio con sesión iniciada):
// avatar con las iniciales; al abrirlo, nombre, correo y «Cerrar sesión».
export default function MenuCuenta() {
  const { t } = useTextos();
  const usuario = useUsuario();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);
  const boton = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    function cerrarConEscape(evento) {
      if (evento.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    }
    function cerrarAfuera(evento) {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    }
    document.addEventListener("keydown", cerrarConEscape);
    document.addEventListener("pointerdown", cerrarAfuera);
    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
      document.removeEventListener("pointerdown", cerrarAfuera);
    };
  }, [abierto]);

  if (!usuario) return null;

  return (
    <div ref={contenedor} className={estilos.menu}>
      <button
        ref={boton}
        type="button"
        className={estilos.avatar}
        aria-expanded={abierto}
        aria-controls="menu-cuenta"
        aria-label={`${t("navbar.usuario.menu")}: ${usuario.nombre}`}
        onClick={() => setAbierto((valor) => !valor)}
      >
        {iniciales(usuario.nombre)}
      </button>
      <div id="menu-cuenta" className={estilos.panel} hidden={!abierto}>
        <div className={estilos.persona}>
          <span className={estilos.avatarGrande} style={{ background: usuario.colorAvatar }} aria-hidden="true">
            {iniciales(usuario.nombre)}
          </span>
          <div className={estilos.datos}>
            <p className="cuerpo-p-fuerte">{usuario.nombre}</p>
            <p className={`detalle-nota ${estilos.correo}`}>{usuario.correo}</p>
          </div>
        </div>
        <form action={cerrarSesion}>
          <button type="submit" className={`cuerpo-p-fuerte ${estilos.salir}`}>
            <Icono nombre="salir" tamano={18} />
            {t("navbar.usuario.cerrarSesion")}
          </button>
        </form>
      </div>
    </div>
  );
}
