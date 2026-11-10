import React from "react";
import Boton from "./ui/Boton";
import { REINTENTOS } from "../api/cliente";

// Textos según el tipo de falla: el usuario sabe qué pasó y qué puede hacer
const TEXTOS = {
  red: {
    titulo: "Sin conexión con el servidor",
    detalle: "No pudimos comunicarnos con la librería. Revisa tu conexión a internet e inténtalo de nuevo.",
  },
  servidor: {
    titulo: "El servidor no está disponible",
    detalle: `El servidor respondió con un error (500). Lo intentamos ${REINTENTOS + 1} veces sin éxito; vuelve a intentarlo en unos segundos.`,
  },
  tiempo: {
    titulo: "El servidor está tardando demasiado",
    detalle: "La respuesta no llegó a tiempo. Puede ser una conexión lenta; inténtalo de nuevo.",
  },
  "no-encontrado": { titulo: "No encontramos lo que buscas", detalle: null },
  desconocido: { titulo: "No pudimos completar la solicitud", detalle: null },
};

export const resumenError = (error) => TEXTOS[error.tipo]?.titulo ?? TEXTOS.desconocido.titulo;

// Falla sin datos que mostrar: explica el problema y ofrece reintentar y otras salidas (children)
function MensajeError({ error, onReintentar, children }) {
  const { titulo, detalle } = TEXTOS[error.tipo] ?? TEXTOS.desconocido;
  return (
    <div role="alert" className="tarjeta border-l-4 border-red-500">
      <h3 className="mb-1 text-lg font-semibold text-red-700">{titulo}</h3>
      <p className="mb-4 text-gray-700">{detalle ?? error.message}</p>
      <div className="flex flex-wrap gap-3">
        {error.tipo !== "no-encontrado" && <Boton onClick={onReintentar}>Reintentar</Boton>}
        {children}
      </div>
    </div>
  );
}

// Falla con datos guardados: se siguen mostrando y se avisa que podrían no estar al día
export function AvisoDatosGuardados({ error, onReintentar }) {
  return (
    <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
      <span>
        <strong>{resumenError(error)}.</strong> Te mostramos la última información guardada, que podría no estar
        actualizada.
      </span>
      <button type="button" onClick={onReintentar} className="font-medium underline">
        Reintentar
      </button>
    </div>
  );
}

// Aviso discreto mientras se piden datos nuevos sobre datos ya visibles
export function IndicadorActualizando() {
  return (
    <span role="status" className="inline-flex items-center gap-1.5 text-xs text-gray-500">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-marca border-t-transparent" aria-hidden="true" />
      Actualizando...
    </span>
  );
}

export default MensajeError;
