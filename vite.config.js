import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Ruta base del sitio: "/" en local; el workflow de GitHub Pages define BASE_PATH="/PFY2202_S4_FPARRA/"
  base: process.env.BASE_PATH || "/",
  // Pruebas con Vitest en un DOM simulado (jsdom)
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
