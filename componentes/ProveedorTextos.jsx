"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { leerTexto } from "@/lib/textos";
import {
  COOKIE_CONSENTIMIENTO,
  COOKIE_IDIOMA,
  CONSENTIMIENTO,
  borrarCookie,
  escribirCookie,
} from "@/lib/preferencias";

const ContextoTextos = createContext(null);

// Guarda el idioma, los textos de la API y el consentimiento de cookies para toda la app.
export default function ProveedorTextos({ idiomaInicial, textosIniciales, consentimientoInicial, children }) {
  const [idioma, setIdioma] = useState(idiomaInicial);
  const [textos, setTextos] = useState(textosIniciales);
  const [consentimiento, setConsentimiento] = useState(consentimientoInicial);
  const [cambiando, setCambiando] = useState(false);
  // Textos ya pedidos, para no volver a pedirlos al alternar ES y EN
  const cache = useRef({ [idiomaInicial]: textosIniciales });

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const cambiarIdioma = useCallback(
    async (nuevo) => {
      if (nuevo === idioma) return;
      // La cookie de idioma solo se guarda si la persona aceptó las cookies
      if (consentimiento === CONSENTIMIENTO.aceptado) escribirCookie(COOKIE_IDIOMA, nuevo);

      if (!cache.current[nuevo]) {
        setCambiando(true);
        try {
          const respuesta = await fetch(`/api/textos?idioma=${nuevo}`);
          if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
          cache.current[nuevo] = (await respuesta.json()).textos;
        } catch (error) {
          console.error("No se pudieron cargar los textos:", error);
          setCambiando(false);
          return;
        }
        setCambiando(false);
      }
      setTextos(cache.current[nuevo]);
      setIdioma(nuevo);
    },
    [idioma, consentimiento],
  );

  const responderCookies = useCallback(
    (acepta) => {
      const valor = acepta ? CONSENTIMIENTO.aceptado : CONSENTIMIENTO.rechazado;
      escribirCookie(COOKIE_CONSENTIMIENTO, valor);
      if (acepta) escribirCookie(COOKIE_IDIOMA, idioma);
      else borrarCookie(COOKIE_IDIOMA);
      setConsentimiento(valor);
    },
    [idioma],
  );

  const valor = useMemo(
    () => ({
      idioma,
      textos,
      cambiando,
      consentimiento,
      cambiarIdioma,
      responderCookies,
      t: (ruta, variables) => leerTexto(textos, ruta, variables),
    }),
    [idioma, textos, cambiando, consentimiento, cambiarIdioma, responderCookies],
  );

  return <ContextoTextos.Provider value={valor}>{children}</ContextoTextos.Provider>;
}

export function useTextos() {
  const contexto = useContext(ContextoTextos);
  if (!contexto) throw new Error("useTextos debe usarse dentro de ProveedorTextos");
  return contexto;
}
