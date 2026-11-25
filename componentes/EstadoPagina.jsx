"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTextos } from "./ProveedorTextos";
import Icono from "./Icono";
import estilos from "./EstadoPagina.module.css";

// Estado de "no encontrado" o de "no se pudo cargar".
// - `codigo`: el codigo de error de la API; su mensaje sale de textos.errores[codigo].
// - `onReintentar`: si no llega, «Reintentar» vuelve a pedir los datos al servidor (router.refresh).
// - `nivel` y `compacto`: para mostrarlo dentro de una sección o de la ventana modal.
export default function EstadoPagina({ tipo, codigo, onReintentar, nivel = 1, compacto = false, idTitulo }) {
  const { t, textos } = useTextos();
  const router = useRouter();
  const [reintentando, iniciar] = useTransition();
  const Titulo = `h${nivel}`;
  const esError = tipo === "error";
  const base = esError ? "estados.error" : "estados.noEncontrado";
  // Si la API mandó un código conocido usamos su mensaje; si no, el texto general del estado
  const texto = esError && codigo && textos?.errores?.[codigo] ? t(`errores.${codigo}`) : t(`${base}.texto`);

  function reintentar() {
    iniciar(() => {
      if (onReintentar) onReintentar();
      router.refresh();
    });
  }

  return (
    <section
      className={`${compacto ? "" : "contenedor"} ${estilos.estado} ${compacto ? estilos.compacto : ""}`}
      role={esError ? "alert" : undefined}
      aria-busy={reintentando || undefined}
    >
      <span className={`${estilos.icono} ${esError ? estilos.iconoError : ""}`} aria-hidden="true">
        <Icono nombre={esError ? "alerta" : "mundo"} tamano={28} />
      </span>
      <Titulo id={idTitulo} className={compacto ? "titular-h3" : "titular-h1"}>
        {t(`${base}.titulo`)}
      </Titulo>
      <p className={compacto ? "cuerpo-m" : "cuerpo-g"}>{texto}</p>
      {esError ? (
        <button
          type="button"
          className={`boton boton--primario ${compacto ? "" : "boton--grande"}`}
          onClick={reintentar}
          disabled={reintentando}
        >
          <Icono nombre="recargar" tamano={18} className={reintentando ? estilos.girando : ""} />
          {reintentando ? t("estados.cargando") : t("estados.error.botones.reintentar")}
        </button>
      ) : (
        <Link href="/" className="boton boton--primario boton--grande">
          {t("estados.noEncontrado.botones.irAlInicio")}
        </Link>
      )}
    </section>
  );
}
