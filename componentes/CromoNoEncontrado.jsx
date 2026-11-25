"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import estilos from "./EstadoPagina.module.css";

// Textos propios de la vista 3 para un cromo que no existe
export default function CromoNoEncontrado({ nivel = 1, idTitulo }) {
  const { t } = useTextos();
  const Titulo = `h${nivel}`;
  return (
    <section className={`contenedor ${estilos.estado}`}>
      <Titulo id={idTitulo} className="titular-h1">
        {t("paginas.detalleCromo.noEncontrado.titulo")}
      </Titulo>
      <p className="cuerpo-g">{t("paginas.detalleCromo.noEncontrado.texto")}</p>
      <Link href="/#mundos" className="boton boton--primario boton--grande">
        {t("paginas.detalleCromo.noEncontrado.botones.volver")}
      </Link>
    </section>
  );
}
