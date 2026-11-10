import React, { useState, useSyncExternalStore } from "react";
import { ESCENARIOS, cambiarEscenario, obtenerEscenario } from "../mocks/simulacion";
import { obtenerEstadisticas, suscribirEstadisticas, vaciarCache } from "../api/cache";

// Panel para probar la integración con el backend simulado:
// elegir cómo responde el servidor y ver cuántas peticiones se hicieron realmente.
function PanelPruebas() {
  const [abierto, setAbierto] = useState(false);
  const [escenario, setEscenario] = useState(obtenerEscenario);
  const { peticiones, desdeCache, compartidas } = useSyncExternalStore(suscribirEstadisticas, obtenerEstadisticas);

  const elegir = (valor) => {
    cambiarEscenario(valor);
    setEscenario(valor);
  };

  return (
    <aside className="mx-auto mt-10 max-w-5xl px-4" aria-label="Panel de pruebas de la API">
      <div className="rounded-xl border border-dashed border-gray-300 bg-white">
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700"
        >
          <span>
            🧪 Panel de pruebas de la API
            {escenario !== "normal" && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                {ESCENARIOS[escenario].nombre}
              </span>
            )}
          </span>
          <span aria-hidden="true">{abierto ? "▲" : "▼"}</span>
        </button>

        {abierto && (
          <div className="grid gap-6 border-t border-gray-100 p-4 md:grid-cols-2">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Respuesta del servidor simulado</legend>
              <div className="space-y-2">
                {Object.entries(ESCENARIOS).map(([valor, { nombre, descripcion }]) => (
                  <label key={valor} className="flex cursor-pointer gap-2 text-sm">
                    <input
                      type="radio"
                      name="escenario"
                      value={valor}
                      checked={escenario === valor}
                      onChange={() => elegir(valor)}
                      className="mt-1 accent-marca"
                    />
                    <span>
                      <strong>{nombre}:</strong> {descripcion}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Peticiones en esta visita</h3>
              <dl className="mb-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Al servidor", peticiones],
                  ["Desde caché", desdeCache],
                  ["Compartidas", compartidas],
                ].map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="flex flex-col-reverse rounded-lg bg-gray-50 p-2">
                    <dt className="text-xs text-gray-500">{etiqueta}</dt>
                    <dd className="text-xl font-bold">{valor}</dd>
                  </div>
                ))}
              </dl>
              <p className="mb-3 text-xs text-gray-500">
                Las respuestas se reutilizan durante 5 minutos: volver a una página ya visitada no genera una petición
                nueva.
              </p>
              <button type="button" onClick={vaciarCache} className="btn-secundario text-sm">
                Vaciar caché
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default PanelPruebas;
