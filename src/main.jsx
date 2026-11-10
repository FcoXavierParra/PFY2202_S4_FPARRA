import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";

// Activa el backend simulado (MSW) antes de mostrar la aplicación, para que ninguna
// petición a /api salga antes de que el Service Worker esté listo para responderla.
// A diferencia del ejemplo de la guía, se activa también en producción: el sitio publicado
// en GitHub Pages no tiene un backend real y depende del mock para funcionar.
async function activarMock() {
  const { worker } = await import("./mocks/browser");
  const base = import.meta.env.BASE_URL; // "/" en local, "/PFY2202_S4_FPARRA/" en GitHub Pages
  return worker.start({
    serviceWorker: { url: `${base}mockServiceWorker.js`, options: { scope: base } },
    onUnhandledRequest: "bypass", // archivos del sitio (JS, CSS) pasan sin interceptar
    quiet: import.meta.env.PROD,
  });
}

activarMock().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
