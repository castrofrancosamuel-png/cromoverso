"use client";

import { useEffect } from "react";
import { useTextos } from "./ProveedorTextos";

// El título de la pestaña lo pone generateMetadata; esto lo actualiza al cambiar de idioma
export default function TituloDocumento({ ruta, variables }) {
  const { t } = useTextos();
  const titulo = t(ruta, variables);

  useEffect(() => {
    document.title = titulo;
  }, [titulo]);

  return null;
}
