import { http, HttpResponse } from "msw";
import { servidor } from "./setup";
import { pedirJSON, ErrorApi } from "../api/cliente";
import { consultar, leerCache, obtenerEstadisticas } from "../api/cache";
import { consultas } from "../api/libreria";
import { cambiarEscenario } from "../mocks/simulacion";

// Cuenta cuántas peticiones llegan realmente al servidor simulado
function contarPeticiones() {
  const registro = [];
  servidor.events.on("request:start", ({ request }) => registro.push(new URL(request.url).pathname));
  return registro;
}

describe("API REST simulada (handlers de MSW)", () => {
  test("GET /api/categorias entrega las categorías con su cantidad de libros", async () => {
    const categorias = await pedirJSON("/api/categorias");
    expect(categorias.map((c) => c.nombre)).toContain("Ciencia Ficción");
    expect(categorias.find((c) => c.slug === "ciencia-ficcion").totalLibros).toBe(5);
    expect(categorias.find((c) => c.slug === "poesia").totalLibros).toBe(0);
  });

  test("GET /api/categorias/:slug/libros entrega los libros sin sinopsis", async () => {
    const { categoria, libros } = await pedirJSON("/api/categorias/fantasia/libros");
    expect(categoria.nombre).toBe("Fantasía");
    expect(libros).toHaveLength(3);
    expect(libros[0]).not.toHaveProperty("sinopsis");
  });

  test("GET /api/libros/:id entrega el detalle con sinopsis", async () => {
    const libro = await pedirJSON("/api/libros/18");
    expect(libro).toMatchObject({ titulo: "El Principito", categoriaNombre: "Infantil" });
    expect(libro.sinopsis).toMatch(/aviador/);
  });
});

describe("manejo de errores del cliente", () => {
  test.each([
    ["/api/categorias/terror/libros", 'La categoría "terror" no existe'],
    ["/api/libros/999", "No existe un libro con el código 999"],
  ])("404 en %s: error 'no-encontrado' con el mensaje del servidor y sin reintentos", async (ruta, mensaje) => {
    const registro = contarPeticiones();
    const error = await pedirJSON(ruta).catch((e) => e);
    expect(error).toBeInstanceOf(ErrorApi);
    expect(error).toMatchObject({ tipo: "no-encontrado", estado: 404, message: mensaje });
    expect(registro).toHaveLength(1);
  });

  test("500: reintenta 2 veces y termina en error 'servidor'", async () => {
    cambiarEscenario("error500");
    const registro = contarPeticiones();
    const intentos = [];
    const error = await pedirJSON("/api/categorias", { alReintentar: (n) => intentos.push(n) }).catch((e) => e);
    expect(error).toMatchObject({ tipo: "servidor", estado: 500 });
    expect(registro).toHaveLength(3);
    expect(intentos).toEqual([2, 3]);
  });

  test("servidor inestable: el reintento automático recupera la respuesta", async () => {
    cambiarEscenario("inestable");
    const registro = contarPeticiones();
    const categorias = await pedirJSON("/api/categorias");
    expect(categorias.length).toBeGreaterThan(0);
    expect(registro).toHaveLength(2);
  });

  test("sin conexión: error 'red'", async () => {
    cambiarEscenario("sinConexion");
    await expect(pedirJSON("/api/categorias")).rejects.toMatchObject({ tipo: "red" });
  });

  test("respuesta que no llega a tiempo: error 'tiempo'", async () => {
    const { ajustes } = await import("../api/cliente");
    const anterior = ajustes.tiempoMaximo;
    ajustes.tiempoMaximo = 20;
    servidor.use(http.get("/api/categorias", () => new Promise(() => {})));
    await expect(pedirJSON("/api/categorias")).rejects.toMatchObject({ tipo: "tiempo" });
    ajustes.tiempoMaximo = anterior;
  });

  test("otro código de error (400): error 'desconocido' con el mensaje del servidor", async () => {
    servidor.use(http.get("/api/categorias", () => HttpResponse.json({ mensaje: "Solicitud inválida" }, { status: 400 })));
    await expect(pedirJSON("/api/categorias")).rejects.toMatchObject({ tipo: "desconocido", message: "Solicitud inválida" });
  });
});

describe("optimización de consultas (caché)", () => {
  const { clave, pedir } = consultas.categorias();

  test("una respuesta reciente se reutiliza sin volver a pedirla", async () => {
    const registro = contarPeticiones();
    await consultar(clave, pedir);
    await consultar(clave, pedir);
    await consultar(clave, pedir);
    expect(registro).toHaveLength(1);
    expect(obtenerEstadisticas()).toMatchObject({ peticiones: 1, desdeCache: 2 });
  });

  test("dos pedidos simultáneos comparten una sola petición", async () => {
    const registro = contarPeticiones();
    const [a, b] = await Promise.all([consultar(clave, pedir), consultar(clave, pedir)]);
    expect(a).toBe(b);
    expect(registro).toHaveLength(1);
    expect(obtenerEstadisticas().compartidas).toBe(1);
  });

  test("forzar vuelve a pedir aunque haya datos recientes", async () => {
    const registro = contarPeticiones();
    await consultar(clave, pedir);
    await consultar(clave, pedir, { forzar: true });
    expect(registro).toHaveLength(2);
  });

  test("los datos guardados siguen disponibles aunque una petición posterior falle", async () => {
    await consultar(clave, pedir);
    cambiarEscenario("error500");
    await expect(consultar(clave, pedir, { forzar: true })).rejects.toMatchObject({ tipo: "servidor" });
    expect(leerCache(clave).datos.length).toBeGreaterThan(0);
  });
});
