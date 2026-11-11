import React from "react";
import { Link } from "react-router";
import { consultas, precargar } from "../api/libreria";
import { formatoPrecio } from "../utils/formato";
import PortadaLibro from "./PortadaLibro";

// Libro dentro del listado de una categoría. Al pasar el mouse se precarga su detalle.
// "desde" lleva al detalle la búsqueda y el orden activos, para restaurarlos al volver.
function TarjetaLibro({ libro, desde = "" }) {
  const alAnticipar = () => precargar(consultas.libro(libro.id));

  return (
    <Link
      to={`/libros/${libro.id}`}
      state={{ desde }}
      onMouseEnter={alAnticipar}
      onFocus={alAnticipar}
      className="tarjeta flex gap-4 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-marca"
    >
      <PortadaLibro libro={libro} />
      <div className="min-w-0">
        <h3 className="font-semibold text-marca">{libro.titulo}</h3>
        <p className="text-sm text-gray-600">{libro.autor}</p>
        <p className="text-xs text-gray-400">{libro.anio}</p>
        <p className="mt-2 font-semibold">{formatoPrecio(libro.precio)}</p>
      </div>
    </Link>
  );
}

export default TarjetaLibro;
