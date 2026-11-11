import React from "react";
import { Link, useLocation, useParams } from "react-router";
import { consultas } from "../api/libreria";
import { useConsulta } from "../hooks/useConsulta";
import { formatoPrecio } from "../utils/formato";
import EstadoCarga from "../components/EstadoCarga";
import MensajeError, { AvisoDatosGuardados, IndicadorActualizando } from "../components/MensajeError";
import PortadaLibro from "../components/PortadaLibro";
import Boton from "../components/ui/Boton";

// Detalle de un libro: GET /api/libros/:id (incluye la sinopsis, que el listado no trae)
function DetalleLibro() {
  const { id } = useParams();
  // Búsqueda y orden que tenía la categoría al abrir este libro: "volver" los restaura
  const desde = useLocation().state?.desde ?? "";
  const { datos: libro, cargando, actualizando, intento, error, reintentar } = useConsulta(consultas.libro(id));

  if (cargando) return <EstadoCarga texto="Cargando libro..." intento={intento} bloques={4} forma="lineas" />;

  if (!libro) {
    return (
      <MensajeError error={error} onReintentar={reintentar}>
        <Boton variante="secundario" to="/">
          Volver al inicio
        </Boton>
      </MensajeError>
    );
  }

  const datos = [
    ["Autor", libro.autor],
    ["Año de publicación", libro.anio],
    ["Páginas", libro.paginas],
    ["Categoría", libro.categoriaNombre],
  ];

  return (
    <section className="mx-auto max-w-3xl">
      <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-marca hover:underline">
          Inicio
        </Link>{" "}
        ›{" "}
        <Link to={`/categorias/${libro.categoria}${desde}`} className="hover:text-marca hover:underline">
          {libro.categoriaNombre}
        </Link>{" "}
        › <span className="text-gray-700">{libro.titulo}</span>
      </nav>

      {error && <AvisoDatosGuardados error={error} onReintentar={reintentar} />}

      <div className="tarjeta flex flex-col gap-6 sm:flex-row">
        <PortadaLibro libro={libro} grande />
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="titulo-pagina mb-1">{libro.titulo}</h2>
            {actualizando && <IndicadorActualizando />}
          </div>
          <p className="mb-4 text-2xl font-bold">{formatoPrecio(libro.precio)}</p>
          <p className="mb-4 leading-relaxed text-gray-700">{libro.sinopsis}</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {datos.map(([etiqueta, valor]) => (
              <div key={etiqueta}>
                <dt className="text-gray-500">{etiqueta}</dt>
                <dd className="font-medium">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default DetalleLibro;
