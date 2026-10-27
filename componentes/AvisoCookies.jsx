"use client";

import { useEffect, useRef } from "react";
import { useTextos } from "./ProveedorTextos";
import estilos from "./AvisoCookies.module.css";

// Aviso de la primera visita. También se abre desde el pie de página para cambiar la respuesta.
export default function AvisoCookies({ visible, onResponder }) {
  const { t, responderCookies } = useTextos();
  const aviso = useRef(null);

  // Cuando se abre desde el pie, llevar el foco al aviso
  useEffect(() => {
    if (visible && document.activeElement !== document.body) aviso.current?.focus();
  }, [visible]);

  if (!visible) return null;

  function responder(acepta) {
    responderCookies(acepta);
    onResponder?.();
  }

  return (
    <section
      ref={aviso}
      className={estilos.aviso}
      role="region"
      aria-labelledby="aviso-cookies-titulo"
      tabIndex={-1}
    >
      <div className={estilos.texto}>
        <h2 id="aviso-cookies-titulo" className="titular-h4">
          {t("cookies.banner.titulo")}
        </h2>
        <p className="cuerpo-p">{t("cookies.banner.texto")}</p>
      </div>
      <div className={estilos.botones}>
        <button type="button" className="boton boton--claro" onClick={() => responder(false)}>
          {t("cookies.banner.botones.rechazar")}
        </button>
        <button type="button" className="boton boton--primario" onClick={() => responder(true)}>
          {t("cookies.banner.botones.aceptar")}
        </button>
      </div>
    </section>
  );
}
