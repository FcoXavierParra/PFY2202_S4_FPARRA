// Cliente HTTP de la aplicación: hace la petición REST, convierte la respuesta en JSON
// y transforma cualquier falla en un ErrorApi con un tipo concreto, para mostrar
// al usuario un mensaje específico en vez de un error genérico.

export const REINTENTOS = 2; // reintentos automáticos ante fallas temporales (500, red, tiempo)

// Tiempos en milisegundos (las pruebas automatizadas los acortan)
export const ajustes = {
  tiempoMaximo: 8000, // espera máxima por una respuesta
  pausaBase: 500, // pausa antes del primer reintento; se duplica en el siguiente
};

export class ErrorApi extends Error {
  constructor(tipo, mensaje, estado = null) {
    super(mensaje);
    this.tipo = tipo; // "no-encontrado" | "servidor" | "red" | "tiempo" | "desconocido"
    this.estado = estado; // código HTTP, si hubo respuesta
    // Un 404 no se arregla reintentando; un 500 o una falla de red pueden ser pasajeros
    this.reintentable = tipo === "servidor" || tipo === "red" || tipo === "tiempo";
  }
}

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

function conTiempoMaximo(promesa, ms) {
  let temporizador;
  const limite = new Promise((_, rechazar) => {
    temporizador = setTimeout(
      () => rechazar(new ErrorApi("tiempo", "El servidor tardó demasiado en responder.")),
      ms
    );
  });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(temporizador));
}

async function unaPeticion(ruta) {
  let respuesta;
  try {
    respuesta = await conTiempoMaximo(fetch(new URL(ruta, window.location.origin)), ajustes.tiempoMaximo);
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    // fetch rechaza con TypeError cuando no hay conexión con el servidor
    throw new ErrorApi("red", "No hay conexión con el servidor.");
  }

  if (respuesta.ok) return respuesta.json();

  // El backend informa el detalle en { mensaje }; si no viene, se usa uno genérico
  const cuerpo = await respuesta.json().catch(() => ({}));
  if (respuesta.status === 404) {
    throw new ErrorApi("no-encontrado", cuerpo.mensaje ?? "El recurso solicitado no existe.", 404);
  }
  if (respuesta.status >= 500) {
    throw new ErrorApi("servidor", "El servidor tuvo un problema al procesar la solicitud.", respuesta.status);
  }
  throw new ErrorApi("desconocido", cuerpo.mensaje ?? "La solicitud no pudo completarse.", respuesta.status);
}

// GET con reintentos automáticos y espera creciente (0,5 s y luego 1 s) ante fallas temporales.
// alReintentar(n) avisa a la interfaz qué intento va, para mostrarlo en el indicador de carga.
export async function pedirJSON(ruta, { alReintentar } = {}) {
  for (let intento = 0; ; intento += 1) {
    try {
      return await unaPeticion(ruta);
    } catch (error) {
      if (!error.reintentable || intento === REINTENTOS) throw error;
      alReintentar?.(intento + 2);
      await esperar(ajustes.pausaBase * 2 ** intento);
    }
  }
}
