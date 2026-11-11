import React, { useSyncExternalStore } from "react";
import { almacenamientoDisponible, suscribirEstadisticas } from "../api/cache";

// Avisa cuando el navegador no permite guardar datos (localStorage bloqueado).
// El sitio sigue funcionando, pero las respuestas guardadas se pierden al cerrar o recargar.
function AvisoAlmacenamiento() {
  const disponible = useSyncExternalStore(suscribirEstadisticas, almacenamientoDisponible);
  if (disponible) return null;

  return (
    <p role="status" className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
      <strong>Tu navegador no permite guardar datos de este sitio.</strong> Puedes seguir navegando normalmente, pero
      la información descargada se perderá al recargar y no habrá copia disponible si se pierde la conexión.
    </p>
  );
}

export default AvisoAlmacenamiento;
