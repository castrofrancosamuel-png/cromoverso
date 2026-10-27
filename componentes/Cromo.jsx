"use client";

import { useId } from "react";
import { useTextos } from "./ProveedorTextos";
import Icono, { ICONO_DE_FIGURA } from "./Icono";
import { numeroDeCromo } from "@/lib/textos";
import estilos from "./Cromo.module.css";

const ICONO_DE_RAREZA = { comun: "circulo", rara: "rombo", epica: "estrella", legendaria: "corona" };

// Rayos del fondo de la carta, calculados una vez
const RAYOS = Array.from({ length: 12 }, (_, indice) => {
  const angulo = (indice / 12) * Math.PI * 2;
  const abertura = Math.PI / 24;
  const punto = (a) => `${50 + Math.cos(a) * 120},${48 + Math.sin(a) * 120}`;
  return `50,48 ${punto(angulo - abertura)} ${punto(angulo + abertura)}`;
}).map((puntos) => <polygon key={puntos} points={puntos} />);

// Ilustración de la carta: no hay imágenes, se dibuja con colorBase y figura (ver contrato)
function Ilustracion({ colorBase, figura, holografico }) {
  const id = useId();
  return (
    <svg className={estilos.ilustracion} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-holo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9be6" />
          <stop offset="0.35" stopColor="#b59cff" />
          <stop offset="0.65" stopColor="#8fd0ff" />
          <stop offset="1" stopColor="#7be3a8" />
        </linearGradient>
        <linearGradient id={`${id}-cuerpo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a6b6b" />
          <stop offset="1" stopColor="#4a4a7a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={colorBase} />
      {holografico && <rect width="100" height="100" fill={`url(#${id}-holo)`} opacity="0.75" />}
      <g fill="#1a1033" opacity="0.12">{RAYOS}</g>
      <circle cx="50" cy="44" r="30" fill="#ffffff" opacity="0.28" />
      <g fill={holografico ? `url(#${id}-cuerpo)` : "#1a1033"} opacity={holografico ? 0.85 : 1}>
        <circle cx="50" cy="48" r="13" />
        <path d="M20 104c0-22 13-36 30-36s30 14 30 36z" />
      </g>
      <rect x="39" y="44" width="22" height="6" rx="3" fill="#ffd23f" />
      {/* Emblema en el pecho: la figura del cromo */}
      <g transform="translate(44 78)" color="#ffd23f">
        <Icono nombre={ICONO_DE_FIGURA[figura] ?? "estrella"} tamano={12} />
      </g>
    </svg>
  );
}

export default function Cromo({ cromo, tamano = "m", className = "" }) {
  const { t } = useTextos();
  const rareza = t(`componentes.cromo.rarezas.${cromo.rareza}`);
  const tipo = t(`componentes.cromo.tipos.${cromo.tipo}`);
  const numero = numeroDeCromo(cromo.numero);

  return (
    <article
      className={`${estilos.cromo} ${estilos[tamano]} ${className}`}
      data-rareza={cromo.rareza}
      aria-label={`${numero} ${cromo.nombre}, ${rareza}`}
    >
      <div className={estilos.arte}>
        <Ilustracion {...cromo.ilustracion} holografico={cromo.holografico} />
        <span className={estilos.numero}>{numero}</span>
        {/* La rareza nunca va solo con color: icono propio y su palabra para lectores */}
        <span className={estilos.rareza} title={rareza}>
          <Icono nombre={ICONO_DE_RAREZA[cromo.rareza]} tamano={tamano === "p" ? 9 : 12} />
        </span>
      </div>
      <div className={estilos.pie}>
        <h3 className={estilos.nombre}>{cromo.nombre}</h3>
        <p className={estilos.meta}>
          {t("paginas.albumMundo.tarjeta.tipo", { mundo: cromo.mundoNombre, tipo })}
          {cromo.holografico && <span className="solo-lector">, {t("componentes.cromo.estados.holografico")}</span>}
        </p>
      </div>
    </article>
  );
}
