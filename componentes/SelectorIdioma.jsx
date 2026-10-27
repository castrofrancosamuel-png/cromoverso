"use client";

import { IDIOMAS } from "@/lib/preferencias";
import { useTextos } from "./ProveedorTextos";
import estilos from "./SelectorIdioma.module.css";

export default function SelectorIdioma() {
  const { idioma, cambiarIdioma, cambiando, t } = useTextos();

  return (
    <div className={estilos.selector} role="group" aria-label={t("navbar.aria.idioma")} aria-busy={cambiando}>
      {IDIOMAS.map((codigo) => (
        <button
          key={codigo}
          type="button"
          lang={codigo}
          className={estilos.opcion}
          aria-pressed={idioma === codigo}
          aria-label={t(`idioma.opciones.${codigo}`)}
          onClick={() => cambiarIdioma(codigo)}
        >
          {t(`idioma.codigos.${codigo}`)}
        </button>
      ))}
    </div>
  );
}
