import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Service Worker de MSW: intercepta en el navegador las peticiones a /api y responde con los handlers
export const worker = setupWorker(...handlers);
