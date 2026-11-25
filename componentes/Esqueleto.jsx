"use client";

import { useTextos } from "./ProveedorTextos";
import estilos from "./Esqueleto.module.css";

// Estados de carga: siluetas con la forma de cada vista mientras llegan los datos de la API.
// Los lectores de pantalla oyen «Cargando…» (role="status"); las siluetas son decorativas.
function Aviso({ texto }) {
  const { t } = useTextos();
  return (
    <p role="status" className="solo-lector">
      {texto ?? t("estados.cargando")}
    </p>
  );
}

function Bloque({ className = "", style }) {
  return <span className={`${estilos.bloque} ${className}`} style={style} aria-hidden="true" />;
}

function Cartas({ cantidad, className }) {
  return (
    <ul className={className} aria-hidden="true">
      {Array.from({ length: cantidad }, (_, indice) => (
        <li key={indice} className={estilos.carta}>
          <Bloque className={estilos.arte} />
          <Bloque className={estilos.linea} style={{ width: "70%" }} />
          <Bloque className={estilos.lineaFina} style={{ width: "50%" }} />
        </li>
      ))}
    </ul>
  );
}

// Vista 1 · Inicio
export function EsqueletoInicio() {
  return (
    <div aria-busy="true">
      <Aviso />
      <div className={estilos.hero}>
        <div className={`contenedor ${estilos.heroInterior}`}>
          <Bloque className={`${estilos.oscuro} ${estilos.titulo}`} />
          <Bloque className={`${estilos.oscuro} ${estilos.titulo}`} style={{ width: "60%" }} />
          <Bloque className={`${estilos.oscuro} ${estilos.boton}`} />
        </div>
      </div>
      <div className={`contenedor ${estilos.seccion}`}>
        <Bloque className={estilos.subtitulo} />
        <ul className={estilos.mundos} aria-hidden="true">
          {Array.from({ length: 6 }, (_, indice) => (
            <li key={indice}>
              <Bloque className={estilos.tarjetaMundo} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Vista 2 · Catálogo de un mundo
export function EsqueletoCatalogo() {
  return (
    <div aria-busy="true">
      <Aviso />
      <div className={estilos.encabezado}>
        <div className="contenedor">
          <Bloque className={`${estilos.claro} ${estilos.titulo}`} style={{ width: "40%" }} />
          <Bloque className={`${estilos.claro} ${estilos.lineaFina}`} style={{ width: "30%" }} />
        </div>
      </div>
      <div className={`contenedor ${estilos.catalogo}`}>
        <div className={estilos.lateral}>
          <Bloque className={estilos.panel} />
          <Bloque className={estilos.panel} />
        </div>
        <Cartas cantidad={10} className={estilos.grilla} />
      </div>
    </div>
  );
}

// Vista 3 · Detalle de un cromo (página completa y ventana modal)
export function EsqueletoDetalle({ enModal = false }) {
  return (
    <div aria-busy="true" className={enModal ? "" : `contenedor ${estilos.pagina}`}>
      <Aviso />
      <div className={`${estilos.detalle} ${enModal ? "" : estilos.tarjeta}`}>
        <Bloque className={estilos.escenario} />
        <div className={estilos.info}>
          <Bloque className={estilos.lineaFina} style={{ width: "40%" }} />
          <Bloque className={estilos.titulo} style={{ width: "60%" }} />
          <Bloque className={estilos.poder} />
          <Bloque className={estilos.linea} />
          <Bloque className={estilos.linea} style={{ width: "80%" }} />
          <Bloque className={estilos.atributos} />
        </div>
      </div>
    </div>
  );
}
