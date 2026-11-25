"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import DetalleCromo from "./DetalleCromo";
import Icono from "./Icono";
import estilos from "./PaginaDetalleCromo.module.css";
import estilosDetalle from "./DetalleCromo.module.css";

// Vista 3 como página completa: al abrir el enlace directo o al recargar
export default function PaginaDetalleCromo({ cromo, vecinos }) {
  const { t } = useTextos();
  const catalogo = `/mundos/${cromo.mundo}`;

  return (
    <div className={`contenedor ${estilos.pagina}`}>
      <nav aria-label={t("paginas.albumMundo.migas.inicio")} className={estilos.migas}>
        <ol>
          <li>
            <Link href="/">{t("paginas.albumMundo.migas.inicio")}</Link>
          </li>
          <li aria-hidden="true">
            <Icono nombre="chevronDer" tamano={14} />
          </li>
          <li>
            <Link href={catalogo}>{cromo.mundoNombre}</Link>
          </li>
          <li aria-hidden="true">
            <Icono nombre="chevronDer" tamano={14} />
          </li>
          <li aria-current="page">{cromo.nombre}</li>
        </ol>
      </nav>
      <div className={estilos.tarjeta}>
        <DetalleCromo
          cromo={cromo}
          vecinos={vecinos}
          cerrar={
            <Link href={catalogo} className={estilosDetalle.cerrar} aria-label={t("paginas.detalleCromo.botones.cerrar")}>
              <Icono nombre="cerrar" />
            </Link>
          }
        />
      </div>
    </div>
  );
}
