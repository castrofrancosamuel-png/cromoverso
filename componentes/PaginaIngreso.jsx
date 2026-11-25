"use client";

import { useTextos } from "./ProveedorTextos";
import Cromo from "./Cromo";
import Explosion from "./Explosion";
import Logo from "./Logo";
import SelectorIdioma from "./SelectorIdioma";
import FormularioIngreso from "./FormularioIngreso";
import estilos from "./PaginaIngreso.module.css";

// Vista 4 a pantalla completa (Figma, Sprint 2): presentación con cartas a la izquierda
// y el formulario a la derecha. En móvil la presentación va arriba.
export default function PaginaIngreso({ cartas, destino }) {
  const { t } = useTextos();
  const [izquierda, centro, derecha] = cartas;

  return (
    <div className={estilos.pagina}>
      <section className={estilos.presentacion} aria-labelledby="presentacion-titulo">
        <Explosion className={estilos.fondo} />
        <div className={estilos.logoPresentacion}>
          <Logo texto={t("navbar.logo.texto")} aria={t("navbar.logo.aria")} inverso />
        </div>
        {centro && (
          <div className={estilos.cartas} aria-hidden="true">
            {izquierda && <Cromo cromo={izquierda} tamano="g" className={estilos.cartaIzquierda} />}
            {derecha && <Cromo cromo={derecha} tamano="g" className={estilos.cartaDerecha} />}
            <Cromo cromo={centro} tamano="g" className={estilos.cartaCentro} />
          </div>
        )}
        <div className={estilos.textos}>
          <span className={`detalle-nota-fuerte ${estilos.temporada}`}>
            {t("paginas.ingresar.presentacion.etiquetas.temporada")}
          </span>
          <h2 id="presentacion-titulo" className={estilos.titulo}>
            {t("paginas.ingresar.presentacion.titulo")}
          </h2>
          <p className={`cuerpo-p ${estilos.texto}`}>{t("paginas.ingresar.presentacion.texto")}</p>
        </div>
      </section>

      <div className={estilos.lado}>
        <div className={estilos.idioma}>
          <SelectorIdioma />
        </div>
        <div className={estilos.formulario}>
          <div className={estilos.logoFormulario}>
            <Logo texto={t("navbar.logo.texto")} aria={t("navbar.logo.aria")} />
          </div>
          <h1 className={estilos.encabezado}>{t("paginas.ingresar.formulario.titulo")}</h1>
          <p className={`cuerpo-p ${estilos.subtitulo}`}>{t("paginas.ingresar.formulario.subtitulo")}</p>
          <FormularioIngreso destino={destino} />
        </div>
      </div>
    </div>
  );
}
