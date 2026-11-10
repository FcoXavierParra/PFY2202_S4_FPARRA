import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { servidor } from "./setup";
import App from "../App";
import { cambiarEscenario } from "../mocks/simulacion";
import { obtenerEstadisticas } from "../api/cache";

const abrir = (ruta = "/") =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );

function contarPeticiones() {
  const registro = [];
  servidor.events.on("request:start", ({ request }) => registro.push(new URL(request.url).pathname));
  return registro;
}

test("inicio: muestra el indicador de carga y luego las categorías de la API", async () => {
  abrir("/");
  expect(await screen.findByText("Cargando categorías...")).toBeInTheDocument();
  expect(await screen.findByRole("link", { name: /Ciencia Ficción/ })).toBeInTheDocument();
  expect(screen.queryByText("Cargando categorías...")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Poesía.*Sin libros por ahora/ })).toBeInTheDocument();
});

test("navegación: inicio → categoría → libro, con el menú de categorías desde la caché", async () => {
  const registro = contarPeticiones();
  abrir("/");
  fireEvent.click(await screen.findByRole("link", { name: /Ciencia Ficción/ }));
  expect(await screen.findByRole("link", { name: /Dune/ })).toBeInTheDocument();
  // El menú lateral reutiliza las categorías ya obtenidas: GET /api/categorias se pidió una sola vez
  expect(within(screen.getByRole("navigation", { name: "Categorías" })).getByRole("link", { name: "Fantasía" })).toBeInTheDocument();
  expect(registro.filter((r) => r === "/api/categorias")).toHaveLength(1);

  fireEvent.click(screen.getByRole("link", { name: /Dune/ }));
  expect(await screen.findByRole("heading", { name: "Dune", level: 2 })).toBeInTheDocument();
  expect(screen.getByText(/planeta Arrakis/)).toBeInTheDocument();
});

test("categoría: búsqueda y orden no generan peticiones nuevas", async () => {
  abrir("/categorias/ciencia-ficcion");
  await screen.findByRole("link", { name: /Dune/ });
  const antes = obtenerEstadisticas().peticiones;

  fireEvent.change(screen.getByLabelText("Buscar por título o autor"), { target: { value: "bradbury" } });
  expect(screen.getByText("Mostrando 2 de 5 libros")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Ordenar libros"), { target: { value: "precio-asc" } });
  const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
  expect(titulos).toEqual(["Fahrenheit 451", "Crónicas marcianas"]);
  expect(obtenerEstadisticas().peticiones).toBe(antes);
});

test("volver a una categoría ya visitada no repite la petición", async () => {
  const registro = contarPeticiones();
  const { unmount } = abrir("/categorias/misterio");
  await screen.findByRole("link", { name: /Orient Express/ });
  unmount();
  abrir("/categorias/misterio");
  expect(screen.getByRole("link", { name: /Orient Express/ })).toBeInTheDocument(); // sin indicador de carga
  expect(registro.filter((r) => r.includes("misterio"))).toHaveLength(1);
});

test("categoría vacía: mensaje y alternativa para seguir explorando", async () => {
  abrir("/categorias/poesia");
  expect(await screen.findByText("Aún no hay libros en esta categoría.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explorar otras categorías" })).toHaveAttribute("href", "/");
});

test("categoría inexistente (404): mensaje del servidor, sin botón reintentar y con alternativa", async () => {
  abrir("/categorias/terror");
  const alerta = await screen.findByRole("alert");
  expect(alerta).toHaveTextContent('La categoría "terror" no existe');
  expect(within(alerta).queryByRole("button", { name: "Reintentar" })).not.toBeInTheDocument();
  expect(within(alerta).getByRole("link", { name: "Ver todas las categorías" })).toBeInTheDocument();
});

test("error 500 sin datos guardados: mensaje claro y reintento manual que recupera la página", async () => {
  cambiarEscenario("error500");
  abrir("/");
  expect(await screen.findByText(/Reintentando \(intento 2 de 3\)/)).toBeInTheDocument();
  const alerta = await screen.findByRole("alert");
  expect(alerta).toHaveTextContent("El servidor no está disponible");

  cambiarEscenario("normal");
  fireEvent.click(within(alerta).getByRole("button", { name: "Reintentar" }));
  expect(await screen.findByRole("link", { name: /Ciencia Ficción/ })).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("sin conexión con datos guardados vencidos: se muestran igual, con aviso y opción de reintentar", async () => {
  const { unmount } = abrir("/");
  await screen.findByRole("link", { name: /Ciencia Ficción/ });
  unmount();

  // Pasan 6 minutos (la caché vence a los 5) y se pierde la conexión
  const ahora = Date.now();
  const reloj = vi.spyOn(Date, "now").mockReturnValue(ahora + 6 * 60 * 1000);
  cambiarEscenario("sinConexion");
  abrir("/");

  // Las categorías aparecen de inmediato desde la caché, mientras se intenta actualizar
  expect(screen.getByRole("link", { name: /Ciencia Ficción/ })).toBeInTheDocument();
  expect(screen.getByText("Actualizando...")).toBeInTheDocument();
  const aviso = await screen.findByRole("alert");
  expect(aviso).toHaveTextContent("Sin conexión con el servidor");
  expect(aviso).toHaveTextContent("última información guardada");
  expect(screen.getByRole("link", { name: /Ciencia Ficción/ })).toBeInTheDocument();

  // Al volver la conexión, "Reintentar" actualiza y el aviso desaparece
  cambiarEscenario("normal");
  fireEvent.click(within(aviso).getByRole("button", { name: "Reintentar" }));
  await vi.waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  reloj.mockRestore();
});

test("libro inexistente (404) y ruta desconocida", async () => {
  const { unmount } = abrir("/libros/999");
  expect(await screen.findByRole("alert")).toHaveTextContent("No existe un libro con el código 999");
  unmount();
  abrir("/xyz");
  expect(await screen.findByRole("heading", { name: /404/ })).toBeInTheDocument();
});
