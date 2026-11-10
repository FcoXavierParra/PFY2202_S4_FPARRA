/** @type {import('tailwindcss').Config} */
export default {
  // Archivos donde Tailwind busca clases para generar solo el CSS que se usa
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Colores propios de la librería, disponibles como bg-marca, text-marca-oscuro, etc.
      colors: {
        marca: {
          DEFAULT: "#1b7f3b",
          oscuro: "#155f2c",
          claro: "#e3f1e8",
        },
      },
    },
  },
  plugins: [],
};
