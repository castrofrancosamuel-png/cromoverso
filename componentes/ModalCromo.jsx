"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTextos } from "./ProveedorTextos";
import Icono from "./Icono";
import estilos from "./ModalCromo.module.css";
import estilosDetalle from "./DetalleCromo.module.css";

// Ventana modal de la vista 3 sobre el catálogo. Usa <dialog> nativo: atrapa el foco,
// cierra con Escape y devuelve el foco al cerrar. Cerrar vuelve a la página anterior.
export default function ModalCromo({ idTitulo = "modal-cromo-titulo", children }) {
  const dialogo = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const elemento = dialogo.current;
    if (elemento && !elemento.open) elemento.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={dialogo}
      className={estilos.modal}
      aria-labelledby={idTitulo}
      onClose={() => router.back()}
      // Un clic en el fondo oscuro (fuera de la tarjeta) también cierra
      onClick={(evento) => {
        if (evento.target === dialogo.current) dialogo.current.close();
      }}
    >
      <div className={estilos.tarjeta}>{children}</div>
    </dialog>
  );
}

// Botón redondo de la esquina. Cierra el <dialog> que lo contiene.
export function BotonCerrarModal() {
  const { t } = useTextos();
  return (
    <button
      type="button"
      className={estilosDetalle.cerrar}
      aria-label={t("paginas.detalleCromo.botones.cerrar")}
      onClick={(evento) => evento.currentTarget.closest("dialog")?.close()}
    >
      <Icono nombre="cerrar" />
    </button>
  );
}
