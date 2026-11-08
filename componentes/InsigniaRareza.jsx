"use client";

import { useTextos } from "./ProveedorTextos";
import Icono from "./Icono";
import estilos from "./InsigniaRareza.module.css";

// Rareza con su icono y su palabra: nunca solo con color (contrato, accesibilidad)
export default function InsigniaRareza({ rareza }) {
  const { t } = useTextos();
  return (
    <span className={`detalle-etiqueta ${estilos.insignia}`} data-rareza={rareza.id} style={{ "--color-rareza": rareza.color }}>
      <Icono nombre={rareza.icono} tamano={12} relleno={rareza.icono !== "circulo"} />
      {t(`componentes.cromo.rarezas.${rareza.id}`)}
    </span>
  );
}
