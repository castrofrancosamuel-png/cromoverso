"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import Cromo, { ICONO_DE_RAREZA } from "./Cromo";
import Icono from "./Icono";
import InsigniaRareza from "./InsigniaRareza";
import { numeroDeCromo } from "@/lib/textos";
import estilos from "./DetalleCromo.module.css";

const ATRIBUTOS = ["fuerza", "velocidad", "mente", "energia"];
const MAXIMO = 99;

// Contenido de la vista 3. Se usa en la página completa y dentro de la ventana modal.
// `cerrar` es el botón de la esquina: un enlace en la página o un botón en la modal.
export default function DetalleCromo({ cromo, vecinos, idTitulo = "detalle-titulo", nivel = 1, cerrar, enModal = false }) {
  const { t } = useTextos();
  const Titulo = `h${nivel}`;
  const total = ATRIBUTOS.reduce((suma, clave) => suma + cromo.atributos[clave], 0);
  const rareza = { id: cromo.rareza, icono: ICONO_DE_RAREZA[cromo.rareza], color: `var(--rareza-${cromo.rareza})` };
  const ubicacion = cromo.posicion
    ? t("paginas.detalleCromo.encabezado.ubicacion", { id: cromo.id, mundo: cromo.mundoNombre, posicion: cromo.posicion })
    : `${cromo.id} · ${cromo.mundoNombre}`;

  return (
    <div
      className={`${estilos.detalle} ${enModal ? estilos.enModal : ""}`}
      style={{ "--color-mundo": `var(--mundo-${cromo.mundo}, ${cromo.ilustracion.colorBase})`, "--color-mundo-suave": `var(--mundo-${cromo.mundo}-suave)` }}
    >
      <div className={estilos.escenario}>
        <Cromo cromo={cromo} tamano="g" className={estilos.carta} />
      </div>

      <div className={estilos.info}>
        <div className={estilos.cabecera}>
          <ul className={estilos.chips}>
            <li>
              <InsigniaRareza rareza={rareza} />
            </li>
            <li className={`detalle-nota-fuerte ${estilos.chip} ${estilos.chipMundo}`}>{cromo.mundoNombre}</li>
            <li className={`detalle-nota-fuerte ${estilos.chip}`}>
              {t(`paginas.detalleCromo.encabezado.tipos.${cromo.tipo}`)}
            </li>
            {cromo.holografico && (
              <li className={`detalle-nota-fuerte ${estilos.chip}`}>{t("componentes.cromo.estados.holografico")}</li>
            )}
          </ul>
          {cerrar}
        </div>

        <p className={`detalle-nota-fuerte ${estilos.ubicacion}`}>{ubicacion}</p>
        <Titulo id={idTitulo} className={estilos.nombre}>
          {cromo.nombre}
        </Titulo>

        <section className={estilos.poder} aria-labelledby={`${idTitulo}-poder`}>
          <span className={estilos.iconoPoder} aria-hidden="true">
            <Icono nombre="rayo" tamano={18} />
          </span>
          <div>
            <h3 id={`${idTitulo}-poder`} className={`detalle-etiqueta ${estilos.etiquetaPoder}`}>
              {t("paginas.detalleCromo.poder.titulo")}
            </h3>
            <p className="cuerpo-m-fuerte">{cromo.poder}</p>
          </div>
        </section>

        <p className={`cuerpo-m ${estilos.descripcion}`}>{cromo.descripcion}</p>

        <section className={estilos.atributos} aria-labelledby={`${idTitulo}-atributos`}>
          <div className={estilos.atributosCabecera}>
            <h3 id={`${idTitulo}-atributos`} className="titular-h4">
              {t("paginas.detalleCromo.atributos.titulo")}
            </h3>
            <span className="cuerpo-p-fuerte">{t("paginas.detalleCromo.atributos.total", { total })}</span>
          </div>
          <dl className={estilos.barras}>
            {ATRIBUTOS.map((clave) => (
              <div key={clave} className={estilos.fila}>
                <dt className="cuerpo-p-fuerte">{t(`paginas.detalleCromo.atributos.nombres.${clave}`)}</dt>
                {/* La barra es decorativa: el número va al lado como texto */}
                <span className={estilos.barra} aria-hidden="true">
                  <span style={{ width: `${(cromo.atributos[clave] / MAXIMO) * 100}%` }} />
                </span>
                <dd className={estilos.valor}>{cromo.atributos[clave]}</dd>
              </div>
            ))}
          </dl>
          <p className={`detalle-nota ${estilos.escala}`}>{t("paginas.detalleCromo.atributos.escala")}</p>
        </section>

        {(vecinos.anterior || vecinos.siguiente) && (
          <nav className={estilos.vecinos} aria-label={t("paginas.detalleCromo.navegacion.anterior") + " / " + t("paginas.detalleCromo.navegacion.siguiente")}>
            {vecinos.anterior ? (
              <EnlaceVecino cromo={vecinos.anterior} direccion="anterior" reemplazar={enModal} />
            ) : (
              <span />
            )}
            {vecinos.siguiente && <EnlaceVecino cromo={vecinos.siguiente} direccion="siguiente" reemplazar={enModal} />}
          </nav>
        )}
      </div>
    </div>
  );
}

function EnlaceVecino({ cromo, direccion, reemplazar }) {
  const { t } = useTextos();
  const texto = `${numeroDeCromo(cromo.numero)} ${cromo.nombre}`;
  return (
    // En la modal se reemplaza la entrada del historial: así «Cerrar» vuelve directo al catálogo
    <Link
      href={`/cromos/${cromo.id}`}
      replace={reemplazar}
      scroll={false}
      className={`cuerpo-p-fuerte ${estilos.vecino} ${direccion === "siguiente" ? estilos.siguiente : ""}`}
      aria-label={`${t(`paginas.detalleCromo.navegacion.${direccion}`)}: ${texto}`}
    >
      <Icono nombre={direccion === "anterior" ? "chevronIzq" : "chevronDer"} tamano={16} />
      {texto}
    </Link>
  );
}
