"use client";

import Link from "next/link";
import { useTextos } from "./ProveedorTextos";
import Cromo from "./Cromo";
import Icono from "./Icono";
import Explosion from "./Explosion";
import estilos from "./Hero.module.css";

// Portada del inicio. `cartas` son tres cromos legendarios: izquierda, centro y derecha.
export default function Hero({ cartas }) {
  const { t } = useTextos();
  const [izquierda, centro, derecha] = cartas;

  return (
    <section className={estilos.hero} aria-labelledby="hero-titulo">
      <Explosion className={estilos.fondo} />
      <div className={`contenedor ${estilos.interior}`}>
        <div className={estilos.texto}>
          <h1 id="hero-titulo" className={estilos.titulo}>
            {t("paginas.inicio.hero.titulo")}
          </h1>
          <p className={`cuerpo-g ${estilos.subtituloMovil}`}>{t("paginas.inicio.hero.subtituloMovil")}</p>
          <div className={estilos.botones}>
            <Link href="/registro" prefetch={false} className="boton boton--acento boton--grande">
              <Icono nombre="regalo" />
              {t("paginas.inicio.hero.botones.crearCuentaGratis")}
            </Link>
            <Link href="#mundos" className="boton boton--claro boton--grande">
              <Icono nombre="album" />
              {t("paginas.inicio.hero.botones.explorarMundos")}
            </Link>
          </div>
          <p className={`cuerpo-p ${estilos.subtitulo}`}>
            <Icono nombre="destellos" tamano={18} className={estilos.destellos} />
            {t("paginas.inicio.hero.subtitulo")}
          </p>
        </div>

        {centro && (
          <div className={estilos.cartas}>
            {izquierda && <Cromo cromo={izquierda} tamano="g" className={estilos.cartaIzquierda} />}
            {derecha && <Cromo cromo={derecha} tamano="g" className={estilos.cartaDerecha} />}
            <div className={estilos.cartaCentro}>
              <span className={`detalle-etiqueta ${estilos.guardiana}`}>
                <Icono nombre="destellos" tamano={14} />
                {t("paginas.inicio.hero.etiquetas.guardiana")}
              </span>
              <Cromo cromo={centro} tamano="g" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
