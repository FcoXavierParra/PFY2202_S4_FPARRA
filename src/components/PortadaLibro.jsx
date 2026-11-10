import React from "react";

// Portada ilustrativa generada con el título (el mock no entrega imágenes)
const COLORES = ["bg-marca", "bg-indigo-600", "bg-amber-600", "bg-rose-600", "bg-sky-700", "bg-violet-700"];

function PortadaLibro({ libro, grande = false }) {
  const iniciales = libro.titulo
    .split(" ")
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-md font-bold text-white shadow ${
        COLORES[libro.id % COLORES.length]
      } ${grande ? "h-48 w-32 text-4xl" : "h-24 w-16 text-xl"}`}
    >
      {iniciales}
    </div>
  );
}

export default PortadaLibro;
