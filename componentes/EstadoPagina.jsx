"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import estilos from "./EstadoPagina.module.css";

// Página completa para "no encontrado" y "no se pudo cargar"
export default function EstadoPagina({ tipo, onReintentar }) {
  const { t } = useTextos();
  const base = tipo === "error" ? "estados.error" : "estados.noEncontrado";

  return (
    <section className={`contenedor ${estilos.estado}`} role={tipo === "error" ? "alert" : undefined}>
      <h1 className="titular-h1">{t(`${base}.titulo`)}</h1>
      <p className="cuerpo-g">{t(`${base}.texto`)}</p>
      {tipo === "error" ? (
        <button type="button" className="boton boton--primario boton--grande" onClick={onReintentar}>
          {t("estados.error.botones.reintentar")}
        </button>
      ) : (
        <Link href="/" className="boton boton--primario boton--grande">
          {t("estados.noEncontrado.botones.irAlInicio")}
        </Link>
      )}
    </section>
  );
}
