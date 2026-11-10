import React from "react";
import { Link } from "react-router";
import { consultas, precargar } from "../api/libreria";

// Tarjeta de una categoría. Al pasar el mouse o enfocarla se precargan sus libros
function TarjetaCategoria({ categoria }) {
  const alAnticipar = () => precargar(consultas.librosDeCategoria(categoria.slug));
  const { totalLibros } = categoria;

  return (
    <Link
      to={`/categorias/${categoria.slug}`}
      onMouseEnter={alAnticipar}
      onFocus={alAnticipar}
      className="tarjeta block transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-marca"
    >
      <h3 className="text-lg font-semibold text-marca">{categoria.nombre}</h3>
      <p className="mt-1 text-sm text-gray-600">{categoria.descripcion}</p>
      <p className="mt-3 text-sm font-medium text-gray-500">
        {totalLibros === 0 ? "Sin libros por ahora" : `${totalLibros} ${totalLibros === 1 ? "libro" : "libros"}`}
      </p>
    </Link>
  );
}

export default TarjetaCategoria;
