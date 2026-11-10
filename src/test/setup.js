// Agrega a Vitest los comparadores de Testing Library (toBeInTheDocument, toBeDisabled, etc.)
import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";
import { cambiarEscenario, demoras } from "../mocks/simulacion";
import { ajustes } from "../api/cliente";
import { reiniciarCache } from "../api/cache";

// Las pruebas usan los mismos handlers que el sitio, ejecutados en Node en vez del Service Worker
export const servidor = setupServer(...handlers);

// Tiempos cortos para que las pruebas no esperen segundos reales
demoras.normal = 5;
demoras.lento = 50;
ajustes.pausaBase = 5;

beforeAll(() => servidor.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  cambiarEscenario("normal");
  reiniciarCache();
  localStorage.clear();
});
afterEach(() => servidor.resetHandlers());
afterAll(() => servidor.close());
