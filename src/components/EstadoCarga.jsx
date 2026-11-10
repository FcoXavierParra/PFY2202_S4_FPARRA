import React from "react";
import { REINTENTOS } from "../api/cliente";

// Indicador de carga de una petición: texto, aviso de reintento y bloques de relleno
// con la forma del contenido que viene (así la página no "salta" al llegar los datos)
function EstadoCarga({ texto, intento = 1, bloques = 6, forma = "tarjeta" }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <p className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-marca border-t-transparent" aria-hidden="true" />
        {intento > 1 ? `El servidor no respondió bien. Reintentando (intento ${intento} de ${REINTENTOS + 1})...` : texto}
      </p>
      <div className={forma === "tarjeta" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"} aria-hidden="true">
        {Array.from({ length: bloques }, (_, i) => (
          <div key={i} className={`animate-pulse rounded-xl bg-gray-200 ${forma === "tarjeta" ? "h-32" : "h-6"}`} />
        ))}
      </div>
    </div>
  );
}

export default EstadoCarga;
