import { pedirJSON } from "./cliente";
import { consultar } from "./cache";

// Consultas disponibles de la API de la librería. Cada una tiene una clave de caché
// y la función que hace la petición REST; useConsulta y precargar las reciben así.

export const consultas = {
  categorias: () => ({
    clave: "categorias",
    pedir: (opciones) => pedirJSON("/api/categorias", opciones),
  }),
  librosDeCategoria: (slug) => ({
    clave: `categoria:${slug}`,
    pedir: (opciones) => pedirJSON(`/api/categorias/${encodeURIComponent(slug)}/libros`, opciones),
  }),
  libro: (id) => ({
    clave: `libro:${id}`,
    pedir: (opciones) => pedirJSON(`/api/libros/${encodeURIComponent(id)}`, opciones),
  }),
};

// Pide los datos por adelantado (al pasar el mouse o enfocar un enlace), para que la página
// siguiente abra al instante. Si ya están en caché no hace nada; los errores se ignoran.
export function precargar({ clave, pedir }) {
  consultar(clave, pedir).catch(() => {});
}
