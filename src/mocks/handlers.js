import { http, HttpResponse, delay } from "msw";
import { categorias, libros } from "./datos";
import { demoras, fallaInestable, obtenerEscenario } from "./simulacion";

// API REST simulada con MSW. Cada handler intercepta una ruta GET y responde JSON,
// igual que lo haría un backend real.
//
//   GET /api/categorias                     Lista de categorías con su cantidad de libros
//   GET /api/categorias/:slug/libros        Libros de una categoría (404 si la categoría no existe)
//   GET /api/libros/:id                     Detalle de un libro (404 si no existe)

// Aplica el escenario elegido en el panel de pruebas. Devuelve una respuesta de error o null.
async function simularEscenario() {
  const escenario = obtenerEscenario();
  await delay(escenario === "lento" ? demoras.lento : demoras.normal);

  if (escenario === "sinConexion") return HttpResponse.error();
  if (escenario === "error500" || (escenario === "inestable" && fallaInestable())) {
    return HttpResponse.json({ mensaje: "Error interno del servidor" }, { status: 500 });
  }
  return null;
}

// El listado no incluye la sinopsis: se pide en el detalle, solo cuando se necesita
const resumen = ({ sinopsis, ...libro }) => libro;

export const handlers = [
  http.get("/api/categorias", async () => {
    const falla = await simularEscenario();
    if (falla) return falla;

    return HttpResponse.json(
      categorias.map((c) => ({ ...c, totalLibros: libros.filter((l) => l.categoria === c.slug).length }))
    );
  }),

  http.get("/api/categorias/:slug/libros", async ({ params }) => {
    const falla = await simularEscenario();
    if (falla) return falla;

    const categoria = categorias.find((c) => c.slug === params.slug);
    if (!categoria) {
      return HttpResponse.json({ mensaje: `La categoría "${params.slug}" no existe` }, { status: 404 });
    }
    return HttpResponse.json({
      categoria,
      libros: libros.filter((l) => l.categoria === categoria.slug).map(resumen),
    });
  }),

  http.get("/api/libros/:id", async ({ params }) => {
    const falla = await simularEscenario();
    if (falla) return falla;

    const libro = libros.find((l) => l.id === Number(params.id));
    if (!libro) {
      return HttpResponse.json({ mensaje: `No existe un libro con el código ${params.id}` }, { status: 404 });
    }
    const categoria = categorias.find((c) => c.slug === libro.categoria);
    return HttpResponse.json({ ...libro, categoriaNombre: categoria.nombre });
  }),
];
