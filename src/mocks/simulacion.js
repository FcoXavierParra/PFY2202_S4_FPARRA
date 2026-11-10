// Escenarios del backend simulado, elegidos desde el panel de pruebas de la API.
// Permiten ver en el sitio publicado cómo responde la interfaz ante respuestas lentas y fallas.

export const ESCENARIOS = {
  normal: { nombre: "Normal", descripcion: "Respuestas correctas en menos de 1 segundo." },
  lento: { nombre: "Red lenta", descripcion: "Cada respuesta tarda 3 segundos." },
  inestable: { nombre: "Servidor inestable", descripcion: "Una de cada dos peticiones responde 500; el reintento automático la recupera." },
  error500: { nombre: "Error del servidor", descripcion: "Todas las peticiones responden 500." },
  sinConexion: { nombre: "Sin conexión", descripcion: "Las peticiones fallan como si no hubiera red." },
};

const CLAVE = "libreria-escenario";

// Demora de cada respuesta en milisegundos (las pruebas automatizadas la acortan)
export const demoras = { normal: 600, lento: 3000 };

function leerGuardado() {
  try {
    const guardado = sessionStorage.getItem(CLAVE);
    return guardado in ESCENARIOS ? guardado : "normal";
  } catch {
    return "normal";
  }
}

let escenario = leerGuardado();
let contadorInestable = 0;

export const obtenerEscenario = () => escenario;

export function cambiarEscenario(nuevo) {
  if (!(nuevo in ESCENARIOS)) return;
  escenario = nuevo;
  contadorInestable = 0;
  try {
    sessionStorage.setItem(CLAVE, nuevo);
  } catch {
    // Sin sessionStorage el escenario dura solo hasta recargar
  }
}

// En modo inestable falla la primera petición, acierta la segunda, y así sucesivamente
export function fallaInestable() {
  contadorInestable += 1;
  return contadorInestable % 2 === 1;
}
