"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import Cromo from "./Cromo";
import Icono from "./Icono";
import Explosion from "./Explosion";
import InsigniaRareza from "./InsigniaRareza";
import { numeroDeCromo } from "@/lib/textos";
import estilos from "./CatalogoMundo.module.css";

const TIPOS = ["heroe", "aliado", "villano"];
// Orden de la leyenda en el diseño: de la más escasa a la más común
const ORDEN_RAREZAS = ["legendaria", "epica", "rara", "comun"];

// Arma la URL del catálogo con los filtros. Cambiar un filtro vuelve a la página 1.
function urlConFiltros(mundoId, filtros, cambios = {}) {
  const parametros = new URLSearchParams();
  const siguientes = { ...filtros, pagina: undefined, ...cambios };
  ["rareza", "tipo", "pagina"].forEach((clave) => {
    if (siguientes[clave] && !(clave === "pagina" && Number(siguientes[clave]) === 1)) {
      parametros.set(clave, siguientes[clave]);
    }
  });
  const consulta = parametros.toString();
  return `/mundos/${mundoId}${consulta ? `?${consulta}` : ""}`;
}

export default function CatalogoMundo({ mundo, mundos, rarezas, cromos, paginacion, filtros, errorFiltro }) {
  const { t } = useTextos();
  const posicion = mundos.findIndex(({ id }) => id === mundo.id) + 1;
  const hayFiltros = Boolean(filtros.rareza || filtros.tipo);
  const rarezasOrdenadas = ORDEN_RAREZAS.map((id) => rarezas.find((rareza) => rareza.id === id)).filter(Boolean);
  const porTipo = Object.fromEntries(
    TIPOS.map((tipo) => [tipo, mundo.cromos.filter((cromo) => cromo.tipo === tipo).length]),
  );
  const rarezaActiva = rarezas.find(({ id }) => id === filtros.rareza);
  const limpiar = urlConFiltros(mundo.id, {});

  const filtroRareza = rarezasOrdenadas.map((rareza) => ({
    clave: rareza.id,
    href: urlConFiltros(mundo.id, filtros, { rareza: filtros.rareza === rareza.id ? undefined : rareza.id }),
    activo: filtros.rareza === rareza.id,
    etiqueta: <InsigniaRareza rareza={rareza} />,
    cantidad: mundo.porRareza?.[rareza.id] ?? 0,
  }));

  const filtroTipo = TIPOS.map((tipo) => ({
    clave: tipo,
    href: urlConFiltros(mundo.id, filtros, { tipo: filtros.tipo === tipo ? undefined : tipo }),
    activo: filtros.tipo === tipo,
    etiqueta: <span className="cuerpo-p-fuerte">{t(`paginas.albumMundo.filtros.tipo.opciones.${tipo}`)}</span>,
    cantidad: porTipo[tipo],
  }));

  return (
    <div style={{ "--color-mundo": `var(--mundo-${mundo.id}, ${mundo.color})`, "--color-mundo-suave": `var(--mundo-${mundo.id}-suave)` }}>
      <header className={estilos.encabezado}>
        <Explosion className={estilos.fondo} />
        <div className={`contenedor ${estilos.encabezadoInterior}`}>
          <nav aria-label={t("paginas.albumMundo.migas.inicio")} className={estilos.migas}>
            <ol>
              <li>
                <Link href="/">{t("paginas.albumMundo.migas.inicio")}</Link>
              </li>
              <li aria-hidden="true">
                <Icono nombre="chevronDer" tamano={14} />
              </li>
              <li aria-current="page">{mundo.nombre}</li>
            </ol>
          </nav>
          <Link href="/" className={estilos.volver} aria-label={t("general.acciones.volver")}>
            <Icono nombre="flechaIzq" />
          </Link>
          <div className={estilos.titulos}>
            <h1 className={estilos.titulo}>{mundo.nombre}</h1>
            <p className={`cuerpo-g ${estilos.rango}`}>
              {t("paginas.albumMundo.encabezado.rango", {
                numero: posicion,
                desde: numeroDeCromo(mundo.numeros.desde),
                hasta: numeroDeCromo(mundo.numeros.hasta),
              })}
            </p>
            <p className={`detalle-nota ${estilos.tema}`}>{mundo.tema}</p>
          </div>
        </div>
      </header>

      <div className={`contenedor ${estilos.cuerpo}`}>
        <aside className={estilos.lateral}>
          <section className={estilos.panel} aria-labelledby="panel-mundos">
            <h2 id="panel-mundos" className="titular-h4">
              {t("paginas.albumMundo.mundos.titulo")}
            </h2>
            <ul className={estilos.listaMundos}>
              {mundos.map((otro) => {
                const actual = otro.id === mundo.id;
                return (
                  <li key={otro.id}>
                    <Link
                      href={`/mundos/${otro.id}`}
                      className={estilos.filaMundo}
                      aria-current={actual ? "page" : undefined}
                      style={{ "--color-punto": `var(--mundo-${otro.id}, ${otro.color})` }}
                    >
                      <span className={estilos.punto} aria-hidden="true" />
                      <span className={estilos.nombreMundo}>{otro.nombre}</span>
                      <span className={`cuerpo-p-fuerte ${estilos.cantidad}`}>
                        {t("paginas.albumMundo.mundos.cromos", { cantidad: otro.totalCromos })}
                      </span>
                      {actual && (
                        <span className={`detalle-nota-fuerte ${estilos.paginaActual}`}>
                          {t("paginas.albumMundo.mundos.aria.paginaActual")}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <PanelFiltro id="panel-rareza" titulo={t("paginas.albumMundo.filtros.rareza.titulo")} opciones={filtroRareza} />
          <PanelFiltro id="panel-tipo" titulo={t("paginas.albumMundo.filtros.tipo.titulo")} opciones={filtroTipo} />
        </aside>

        <section className={estilos.resultados} aria-labelledby="resultados-titulo">
          <h2 id="resultados-titulo" className="solo-lector">
            {t("paginas.albumMundo.filtros.cantidad", { cantidad: paginacion?.total ?? 0 })}
          </h2>

          <div className={estilos.barra}>
            {/* En móvil los filtros se abren como menús desplegables */}
            <div className={estilos.filtrosMovil}>
              <Desplegable
                resumen={
                  rarezaActiva
                    ? t("paginas.albumMundo.filtros.rareza.valor", { rareza: t(`componentes.cromo.rarezas.${rarezaActiva.id}`) })
                    : t("paginas.albumMundo.filtros.rareza.todas")
                }
                opciones={[
                  { clave: "todas", href: urlConFiltros(mundo.id, filtros, { rareza: undefined }), activo: !filtros.rareza, etiqueta: t("paginas.albumMundo.filtros.rareza.todas") },
                  ...filtroRareza,
                ]}
              />
              <Desplegable
                resumen={
                  filtros.tipo && TIPOS.includes(filtros.tipo)
                    ? t("paginas.albumMundo.filtros.tipo.valor", { tipo: t(`paginas.albumMundo.filtros.tipo.opciones.${filtros.tipo}`) })
                    : t("paginas.albumMundo.filtros.tipo.todos")
                }
                opciones={[
                  { clave: "todos", href: urlConFiltros(mundo.id, filtros, { tipo: undefined }), activo: !filtros.tipo, etiqueta: t("paginas.albumMundo.filtros.tipo.todos") },
                  ...filtroTipo,
                ]}
              />
            </div>
            {hayFiltros && (
              <Link href={limpiar} className={`cuerpo-p-fuerte ${estilos.quitarFiltros}`}>
                <Icono nombre="cerrar" tamano={16} />
                {t("general.acciones.quitarFiltros")}
              </Link>
            )}
            <span className={`cuerpo-p-fuerte ${estilos.orden}`}>
              {t("paginas.albumMundo.orden.etiqueta", { orden: t("paginas.albumMundo.orden.opciones.numero") })}
            </span>
          </div>

          <p className="solo-lector" role="status">
            {!errorFiltro && t("paginas.albumMundo.filtros.cantidad", { cantidad: paginacion?.total ?? 0 })}
          </p>

          {errorFiltro ? (
            <Estado titulo={t(`errores.${errorFiltro}`)} accion={t("paginas.albumMundo.vacio.botones.limpiar")} href={limpiar} error />
          ) : cromos.length === 0 ? (
            <Estado
              titulo={t("paginas.albumMundo.vacio.titulo")}
              texto={t("paginas.albumMundo.vacio.texto")}
              accion={t("paginas.albumMundo.vacio.botones.limpiar")}
              href={limpiar}
            />
          ) : (
            <ul className={estilos.grilla}>
              {cromos.map((cromo) => (
                <li key={cromo.id}>
                  <Cromo cromo={cromo} className={estilos.carta} />
                </li>
              ))}
            </ul>
          )}

          {paginacion?.paginas > 1 && (
            <nav className={estilos.paginacion}>
              {paginacion.pagina > 1 && (
                <Link href={urlConFiltros(mundo.id, filtros, { ...filtros, pagina: paginacion.pagina - 1 })} className="boton boton--claro">
                  <Icono nombre="flechaIzq" tamano={16} />
                  {t("general.acciones.anterior")}
                </Link>
              )}
              <span className="cuerpo-p-fuerte">
                {t("general.formatos.deTotal", { cantidad: paginacion.pagina, total: paginacion.paginas })}
              </span>
              {paginacion.pagina < paginacion.paginas && (
                <Link href={urlConFiltros(mundo.id, filtros, { ...filtros, pagina: paginacion.pagina + 1 })} className="boton boton--claro">
                  {t("general.acciones.siguiente")}
                  <Icono nombre="flechaDer" tamano={16} />
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

function PanelFiltro({ id, titulo, opciones }) {
  return (
    <section className={estilos.panel} aria-labelledby={id}>
      <h2 id={id} className="titular-h4">
        {titulo}
      </h2>
      <ul className={estilos.listaFiltro}>
        {opciones.map(({ clave, href, activo, etiqueta, cantidad }) => (
          <OpcionFiltro key={clave} href={href} activo={activo} etiqueta={etiqueta} cantidad={cantidad} />
        ))}
      </ul>
    </section>
  );
}

function OpcionFiltro({ href, activo, etiqueta, cantidad }) {
  const { t } = useTextos();
  return (
    <li>
      <Link href={href} scroll={false} className={estilos.opcion} aria-current={activo ? "true" : undefined}>
        {etiqueta}
        {cantidad !== undefined && (
          <span className={`cuerpo-p ${estilos.cantidad}`}>{t("paginas.albumMundo.filtros.cantidad", { cantidad })}</span>
        )}
      </Link>
    </li>
  );
}

function Desplegable({ resumen, opciones }) {
  return (
    // La clave cambia con el filtro, así el menú se cierra después de elegir
    <details key={resumen} className={estilos.desplegable}>
      <summary className="cuerpo-p-fuerte">
        {resumen}
        <Icono nombre="chevronAbajo" tamano={16} />
      </summary>
      <ul className={estilos.menuDesplegable}>
        {opciones.map(({ clave, href, activo, etiqueta, cantidad }) => (
          <OpcionFiltro key={clave} href={href} activo={activo} etiqueta={etiqueta} cantidad={cantidad} />
        ))}
      </ul>
    </details>
  );
}

function Estado({ titulo, texto, accion, href, error = false }) {
  return (
    <div className={`${estilos.estado} ${error ? estilos.estadoError : ""}`} role={error ? "alert" : undefined}>
      <h3 className="titular-h3">{titulo}</h3>
      {texto && <p className="cuerpo-m">{texto}</p>}
      <Link href={href} className="boton boton--primario">
        {accion}
      </Link>
    </div>
  );
}
