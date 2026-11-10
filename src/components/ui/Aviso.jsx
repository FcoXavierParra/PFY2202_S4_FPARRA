import React from "react";

// Mensaje de confirmación con botón opcional para cerrarlo
function Aviso({ children, onCerrar }) {
  return (
    <div
      role="status"
      className="mb-4 flex items-start justify-between gap-3 rounded-lg border-l-4 border-marca bg-marca-claro p-3"
    >
      <div>{children}</div>
      {onCerrar && (
        <button type="button" onClick={onCerrar} className="text-sm text-marca underline">
          Cerrar
        </button>
      )}
    </div>
  );
}

export default Aviso;
