"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { iniciarSesion } from "@/app/ingresar/acciones";
import { useTextos } from "./ProveedorTextos";
import Icono from "./Icono";
import estilos from "./FormularioIngreso.module.css";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formulario de la vista 4 con sus estados (Figma): campos obligatorios, cargando,
// credenciales incorrectas, demasiados intentos y sin conexión. Lo escrito se conserva siempre.
export default function FormularioIngreso({ destino }) {
  const { t, textos } = useTextos();
  const router = useRouter();
  const [enviando, iniciar] = useTransition();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantener, setMantener] = useState(true);
  const [verClave, setVerClave] = useState(false);
  const [campos, setCampos] = useState({});
  // { tipo: "campos" | "credenciales" | "demasiadosIntentos" | "conexion" | "servidor", segundos, codigo }
  const [alerta, setAlerta] = useState(null);
  const [espera, setEspera] = useState(0);
  const resumen = useRef(null);

  // Cuenta regresiva del 429: el botón vuelve a funcionar cuando termina
  useEffect(() => {
    if (espera <= 0) return undefined;
    const reloj = setTimeout(() => setEspera((valor) => valor - 1), 1000);
    return () => clearTimeout(reloj);
  }, [espera]);

  // Llevar el foco al mensaje para que el lector de pantalla lo anuncie
  useEffect(() => {
    if (alerta) resumen.current?.focus();
  }, [alerta]);

  function validar() {
    const errores = {};
    if (!correo.trim()) errores.correo = "correoObligatorio";
    else if (!CORREO_VALIDO.test(correo.trim())) errores.correo = "correoInvalido";
    if (!clave) errores.clave = "claveObligatoria";
    return errores;
  }

  function enviar(evento) {
    evento.preventDefault();
    if (enviando || espera > 0) return;
    const errores = validar();
    setCampos(errores);
    if (Object.keys(errores).length) {
      setAlerta({ tipo: "campos" });
      return;
    }
    setAlerta(null);

    iniciar(async () => {
      let resultado;
      try {
        resultado = await iniciarSesion({ correo, clave, mantener });
      } catch {
        // La petición ni siquiera llegó al servidor (sin red)
        resultado = { error: "conexion" };
      }
      if (resultado.ok) {
        router.replace(destino);
        router.refresh();
        return;
      }
      if (resultado.error === "campos") setCampos(resultado.campos ?? {});
      if (resultado.error === "demasiadosIntentos") setEspera(resultado.segundos);
      setAlerta({ tipo: resultado.error, segundos: resultado.segundos, codigo: resultado.codigo });
    });
  }

  function mensajeDeCampo(campo) {
    if (!campos[campo]) return null;
    return campos[campo] === "correoInvalido"
      ? t("formularios.validacion.correoInvalido")
      : t(`paginas.ingresar.errores.${campos[campo]}`);
  }

  const textoAlerta = (() => {
    if (!alerta) return null;
    const base = "paginas.ingresar.errores";
    switch (alerta.tipo) {
      case "campos":
        return { titulo: t(`${base}.camposObligatorios.titulo`), texto: t(`${base}.camposObligatorios.texto`) };
      case "credenciales":
        return { titulo: t(`${base}.credenciales.titulo`), texto: t(`${base}.credenciales.texto`) };
      case "demasiadosIntentos":
        return {
          titulo: t(`${base}.demasiadosIntentos.titulo`),
          texto: t(`${base}.demasiadosIntentos.texto`, { segundos: Math.max(espera, 0) }),
        };
      case "conexion":
        return { titulo: t(`${base}.conexion.titulo`), texto: t(`${base}.conexion.texto`) };
      default:
        return {
          titulo: t("estados.error.titulo"),
          texto: textos?.errores?.[alerta.codigo] ? t(`errores.${alerta.codigo}`) : t("errores.generico"),
        };
    }
  })();

  const errorCorreo = mensajeDeCampo("correo");
  const errorClave = mensajeDeCampo("clave");
  const reintentar = alerta?.tipo === "conexion" || alerta?.tipo === "servidor";

  return (
    <form className={estilos.formulario} onSubmit={enviar} noValidate aria-busy={enviando}>
      {textoAlerta && (
        <div ref={resumen} className={estilos.alerta} role="alert" tabIndex={-1}>
          <Icono nombre="alerta" tamano={18} className={estilos.iconoAlerta} />
          <div>
            <p className="cuerpo-p-fuerte">{textoAlerta.titulo}</p>
            <p className="detalle-nota">{textoAlerta.texto}</p>
          </div>
        </div>
      )}

      <div className={estilos.campo}>
        <label htmlFor="ingreso-correo" className="cuerpo-p-fuerte">
          {t("paginas.ingresar.formulario.etiquetas.correo")}
        </label>
        <input
          id="ingreso-correo"
          name="correo"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder={t("paginas.ingresar.formulario.placeholders.correo")}
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          aria-invalid={Boolean(errorCorreo)}
          aria-describedby={errorCorreo ? "ingreso-correo-error" : undefined}
          className={estilos.entrada}
        />
        {errorCorreo && (
          <p id="ingreso-correo-error" className={`detalle-nota ${estilos.errorCampo}`}>
            <Icono nombre="alerta" tamano={14} />
            {errorCorreo}
          </p>
        )}
      </div>

      <div className={estilos.campo}>
        <label htmlFor="ingreso-clave" className="cuerpo-p-fuerte">
          {t("paginas.ingresar.formulario.etiquetas.clave")}
        </label>
        <div className={estilos.conBoton}>
          <input
            id="ingreso-clave"
            name="clave"
            type={verClave ? "text" : "password"}
            autoComplete="current-password"
            value={clave}
            onChange={(evento) => setClave(evento.target.value)}
            aria-invalid={Boolean(errorClave)}
            aria-describedby={errorClave ? "ingreso-clave-error" : undefined}
            className={estilos.entrada}
          />
          <button
            type="button"
            className={estilos.verClave}
            aria-pressed={verClave}
            aria-label={t(`paginas.ingresar.formulario.botones.${verClave ? "ocultarClave" : "mostrarClave"}`)}
            onClick={() => setVerClave((valor) => !valor)}
          >
            <Icono nombre={verClave ? "ojoTachado" : "ojo"} tamano={18} />
          </button>
        </div>
        {errorClave && (
          <p id="ingreso-clave-error" className={`detalle-nota ${estilos.errorCampo}`}>
            <Icono nombre="alerta" tamano={14} />
            {errorClave}
          </p>
        )}
      </div>

      <div className={estilos.fila}>
        <label className={`cuerpo-p ${estilos.casilla}`}>
          <input type="checkbox" checked={mantener} onChange={(evento) => setMantener(evento.target.checked)} />
          {t("paginas.ingresar.formulario.etiquetas.mantenerSesion")}
        </label>
        {/* Recuperar la contraseña llega en el sprint 3 */}
        <Link href="/recuperar-clave" prefetch={false} className={`cuerpo-p-fuerte ${estilos.enlace}`}>
          {t("paginas.ingresar.formulario.enlaces.olvidasteClave")}
        </Link>
      </div>

      <button
        type="submit"
        className={`boton boton--primario boton--grande ${estilos.enviar}`}
        disabled={enviando || espera > 0}
      >
        {enviando ? (
          <>
            <Icono nombre="recargar" tamano={18} className={estilos.girando} />
            {t("paginas.ingresar.formulario.mensajes.ingresando")}
          </>
        ) : reintentar ? (
          t("paginas.ingresar.errores.conexion.botones.reintentar")
        ) : (
          t("paginas.ingresar.formulario.botones.ingresar")
        )}
      </button>
      {/* Para lectores de pantalla: anuncia que el ingreso está en curso */}
      <p role="status" className="solo-lector">
        {enviando ? t("paginas.ingresar.formulario.mensajes.ingresando") : ""}
      </p>

      <p className={`cuerpo-p ${estilos.registro}`}>
        {t("paginas.ingresar.formulario.mensajes.sinCuenta")}{" "}
        <Link href="/registro" prefetch={false} className={`cuerpo-p-fuerte ${estilos.enlace}`}>
          {t("paginas.ingresar.formulario.enlaces.crearCuenta")}
        </Link>
      </p>
    </form>
  );
}
