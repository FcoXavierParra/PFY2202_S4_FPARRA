import React from "react";
import { consultas } from "../api/libreria";
import { useConsulta } from "../hooks/useConsulta";
import EstadoCarga from "../components/EstadoCarga";
import MensajeError, { AvisoDatosGuardados, IndicadorActualizando } from "../components/MensajeError";
import TarjetaCategoria from "../components/TarjetaCategoria";

// Página de inicio: categorías de libros obtenidas desde GET /api/categorias
function Inicio() {
  const { datos: categorias, cargando, actualizando, intento, error, reintentar } = useConsulta(consultas.categorias());

  return (
    <section>
      <div className="mb-6">
        <h2 className="titulo-pagina mb-1">Explora por categoría</h2>
        <p className="text-gray-600">Elige una categoría para ver sus libros.</p>
      </div>

      {cargando && <EstadoCarga texto="Cargando categorías..." intento={intento} />}

      {!cargando && !categorias && error && <MensajeError error={error} onReintentar={reintentar} />}

      {categorias && (
        <>
          {error && <AvisoDatosGuardados error={error} onReintentar={reintentar} />}
          <div className="mb-3 flex h-5 justify-end">{actualizando && <IndicadorActualizando />}</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((c) => (
              <TarjetaCategoria key={c.slug} categoria={c} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Inicio;
