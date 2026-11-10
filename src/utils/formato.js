// Formatea un monto en pesos chilenos: 18990 -> "$18.990"
export const formatoPrecio = (monto) => `$${monto.toLocaleString("es-CL")}`;
