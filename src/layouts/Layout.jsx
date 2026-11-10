import React, { Suspense } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import PanelPruebas from "../components/PanelPruebas";

// Estructura común: cabecera con menú, contenido de la ruta actual (<Outlet />) y panel de pruebas
function Layout() {
  const { pathname } = useLocation();
  const estiloEnlace = (activo) =>
    `rounded-lg px-3 py-2 text-sm ${activo ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`;
  const claseEnlace = ({ isActive }) => estiloEnlace(isActive);
  // "Catálogo" queda marcado en cualquier categoría o libro, no solo en la primera categoría
  const enCatalogo = pathname.startsWith("/categorias") || pathname.startsWith("/libros");

  return (
    <div className="min-h-screen bg-gray-100 pb-10 text-gray-800">
      <header className="bg-marca text-white shadow">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="leading-tight">
            <h1 className="text-xl font-bold sm:text-2xl">📚 Librería Hoja Nueva</h1>
            <p className="text-sm opacity-90">Tu próxima lectura, por categoría</p>
          </Link>
          <nav aria-label="Navegación principal" className="flex gap-1">
            <NavLink to="/" end className={claseEnlace}>
              Inicio
            </NavLink>
            <Link to="/categorias/ficcion" className={estiloEnlace(enCatalogo)} aria-current={enCatalogo ? "page" : undefined}>
              Catálogo
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Las páginas se cargan bajo demanda (React.lazy): mientras llegan se muestra este aviso */}
        <Suspense fallback={<p className="py-10 text-center text-gray-500">Cargando...</p>}>
          <Outlet />
        </Suspense>
      </main>

      <PanelPruebas />
    </div>
  );
}

export default Layout;
