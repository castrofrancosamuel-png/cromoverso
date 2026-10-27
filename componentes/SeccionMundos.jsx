"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import Icono, { ICONO_DE_FIGURA } from "./Icono";
import estilos from "./SeccionMundos.module.css";

export default function SeccionMundos({ mundos }) {
  const { t } = useTextos();
  const primero = mundos[0];

  return (
    <section id="mundos" className={estilos.seccion} aria-labelledby="mundos-titulo" tabIndex={-1}>
      <div className="contenedor">
        <div className={estilos.encabezado}>
          <div>
            <h2 id="mundos-titulo" className={estilos.titulo}>
              {t("paginas.inicio.mundos.titulo")}
            </h2>
            <p className={`cuerpo-m ${estilos.subtitulo}`}>{t("paginas.inicio.mundos.subtitulo")}</p>
          </div>
          {primero && (
            <Link href={`/mundos/${primero.id}`} className={estilos.verMundo}>
              <Icono nombre="flechaDer" tamano={16} />
              {t("paginas.inicio.mundos.enlaces.ver", { mundo: primero.nombre })}
            </Link>
          )}
        </div>

        <ul className={estilos.lista}>
          {mundos.map((mundo, indice) => (
            <li key={mundo.id}>
              <Link
                href={`/mundos/${mundo.id}`}
                className={estilos.tarjeta}
                style={{ "--color-mundo": `var(--mundo-${mundo.id}, ${mundo.color})`, "--color-mundo-suave": `var(--mundo-${mundo.id}-suave)` }}
              >
                <span className={estilos.cabecera}>
                  <span className={estilos.icono} aria-hidden="true">
                    <Icono nombre={ICONO_DE_FIGURA[mundo.figura]} tamano={18} relleno={false} />
                  </span>
                  {indice === 0 && (
                    <span className={`detalle-nota-fuerte ${estilos.etiqueta}`}>
                      {t("paginas.inicio.mundos.etiquetas.mundo", { numero: indice + 1 })}
                    </span>
                  )}
                </span>
                <span className={`cuerpo-m-fuerte ${estilos.nombre}`}>{mundo.nombre}</span>
                <span className={`cuerpo-p ${estilos.total}`}>
                  {t("paginas.inicio.mundos.etiquetas.cromos", { cantidad: mundo.totalCromos })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
