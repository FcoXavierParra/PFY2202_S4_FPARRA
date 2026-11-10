// Caché de respuestas de la API.
// - Una respuesta reciente (menos de 5 minutos) se reutiliza sin volver a pedirla.
// - Si dos pantallas piden lo mismo a la vez, comparten una sola petición.
// - Las respuestas se guardan en el navegador: si el servidor falla, se puede mostrar
//   la última versión obtenida en vez de una pantalla vacía.
// Además lleva un registro de peticiones que el panel de pruebas muestra en pantalla.

export const VIGENCIA = 5 * 60 * 1000;
const CLAVE_STORAGE = "libreria-cache-api";

let entradas = cargarGuardadas(); // clave -> { datos, guardadoEn }
const enCurso = new Map(); // clave -> promesa de la petición en curso
let estadisticas = { peticiones: 0, desdeCache: 0, compartidas: 0 };
const suscriptores = new Set();

// Lo guardado en una visita anterior se muestra al instante, pero se marca como vencido
// para pedir una versión actualizada en segundo plano
function cargarGuardadas() {
  try {
    const guardadas = Object.entries(JSON.parse(localStorage.getItem(CLAVE_STORAGE)) ?? {});
    return new Map(guardadas.map(([clave, { datos }]) => [clave, { datos, guardadoEn: 0 }]));
  } catch {
    return new Map();
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(Object.fromEntries(entradas)));
  } catch {
    // Sin almacenamiento la caché funciona solo en memoria
  }
}

function contar(campo) {
  estadisticas = { ...estadisticas, [campo]: estadisticas[campo] + 1 };
  suscriptores.forEach((avisar) => avisar());
}

// Devuelve { datos, fresco } o null. Una entrada vencida igual se devuelve (fresco: false)
export function leerCache(clave) {
  const entrada = entradas.get(clave);
  if (!entrada) return null;
  return { datos: entrada.datos, fresco: Date.now() - entrada.guardadoEn < VIGENCIA };
}

// Obtiene los datos de la caché si están frescos; si no, hace la petición (o se suma a la que ya está en curso)
export function consultar(clave, pedir, { forzar = false, alReintentar } = {}) {
  const enCache = leerCache(clave);
  if (enCache?.fresco && !forzar) {
    contar("desdeCache");
    return Promise.resolve(enCache.datos);
  }
  if (enCurso.has(clave)) {
    contar("compartidas");
    return enCurso.get(clave);
  }

  contar("peticiones");
  const promesa = pedir({ alReintentar })
    .then((datos) => {
      entradas.set(clave, { datos, guardadoEn: Date.now() });
      guardar();
      return datos;
    })
    .finally(() => enCurso.delete(clave));
  enCurso.set(clave, promesa);
  return promesa;
}

export function vaciarCache() {
  entradas = new Map();
  guardar();
  suscriptores.forEach((avisar) => avisar());
}

export const obtenerEstadisticas = () => estadisticas;

export function suscribirEstadisticas(avisar) {
  suscriptores.add(avisar);
  return () => suscriptores.delete(avisar);
}

// Solo para pruebas automatizadas: deja la caché como recién cargada
export function reiniciarCache() {
  entradas = new Map();
  enCurso.clear();
  estadisticas = { peticiones: 0, desdeCache: 0, compartidas: 0 };
  guardar();
}
