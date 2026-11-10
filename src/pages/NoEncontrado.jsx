import React from "react";
import Boton from "../components/ui/Boton";

function NoEncontrado() {
  return (
    <section className="py-10 text-center">
      <h2 className="titulo-pagina">404 · Página no encontrada</h2>
      <p className="mb-6 text-gray-600">La ruta que intentaste abrir no existe.</p>
      <Boton to="/">Volver al inicio</Boton>
    </section>
  );
}

export default NoEncontrado;
