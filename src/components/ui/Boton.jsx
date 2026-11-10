import React from "react";
import { Link } from "react-router";

// Botón con variantes de estilo. Con la prop "to" se comporta como enlace de React Router,
// así botones y enlaces con aspecto de botón comparten las mismas clases.
const VARIANTES = {
  primario: "btn-primario",
  secundario: "btn-secundario",
  peligro: "btn-peligro",
};

function Boton({ variante = "primario", to, className = "", ...props }) {
  const clases = `${VARIANTES[variante]} ${className}`.trim();
  if (to) return <Link to={to} className={clases} {...props} />;
  return <button type="button" className={clases} {...props} />;
}

export default Boton;
