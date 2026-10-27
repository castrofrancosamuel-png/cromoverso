import Link from "next/link";
import Icono from "./Icono";
import estilos from "./Logo.module.css";

export default function Logo({ texto, aria, inverso = false }) {
  return (
    <Link href="/" className={`${estilos.logo} ${inverso ? estilos.inverso : ""}`} aria-label={aria}>
      <span className={estilos.simbolo} aria-hidden="true">
        <Icono nombre="estrella" tamano={18} />
      </span>
      <span className={estilos.texto}>{texto}</span>
    </Link>
  );
}
