import React, { lazy } from "react";
import { Routes, Route } from "react-router";
import Layout from "../layouts/Layout";

// Rutas del sitio. Cada página se descarga recién cuando se visita (React.lazy)
const Inicio = lazy(() => import("../pages/Inicio"));
const Categoria = lazy(() => import("../pages/Categoria"));
const DetalleLibro = lazy(() => import("../pages/DetalleLibro"));
const NoEncontrado = lazy(() => import("../pages/NoEncontrado"));

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        {/* Rutas dinámicas: el parámetro define qué se pide a la API */}
        <Route path="categorias/:slug" element={<Categoria />} />
        <Route path="libros/:id" element={<DetalleLibro />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
