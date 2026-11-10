import React, { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router";
import { consultas } from "../api/libreria";
import { useConsulta } from "../hooks/useConsulta";
import EstadoCarga from "../components/EstadoCarga";
import MensajeError, { AvisoDatosGuardados, IndicadorActualizando } from "../components/MensajeError";
import TarjetaLibro from "../components/TarjetaLibro";
import Boton from "../components/ui/Boton";

const ORDENES = {
  titulo: { etiqueta: "Título (A-Z)", comparar: (a, b) => a.titulo.localeCompare(b.titulo, "es") },
  "precio-asc": { etiqueta: "Precio: menor a mayor", comparar: (a, b) => a.precio - b.precio },
  "precio-desc": { etiqueta: "Precio: mayor a menor", comparar: (a, b) => b.precio - a.precio },
  anio: { etiqueta: "Más recientes", comparar: (a, b) => b.anio - a.anio },
};

// Libros de una categoría: GET /api/categorias/:slug/libros
function Categoria() {
  const { slug } = useParams();
  const libros = useConsulta(consultas.librosDeCategoria(slug));
  // Las categorías ya se obtuvieron en el inicio: aquí salen de la caché, sin otra petición
  const { datos: categorias } = useConsulta(consultas.categorias());
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("titulo");

  // Búsqueda y orden se aplican sobre los datos ya recibidos: no generan peticiones nuevas
  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return (libros.datos?.libros ?? [])
      .filter((l) => `${l.titulo} ${l.autor}`.toLowerCase().includes(texto))
      .sort(ORDENES[orden].comparar);
  }, [libros.datos, busqueda, orden]);

  const nombre = libros.datos?.categoria.nombre ?? categorias?.find((c) => c.slug === slug)?.nombre;

  return (
    <div className={`grid gap-6 ${categorias ? "lg:grid-cols-[200px_1fr]" : ""}`}>
      {/* Menú de categorías (enlaces de React Router); si no se pudieron obtener, no ocupa espacio */}
      <nav aria-label="Categorías" className={`flex gap-2 overflow-x-auto lg:flex-col ${categorias ? "" : "hidden"}`}>
        {categorias?.map((c) => (
          <NavLink
            key={c.slug}
            to={`/categorias/${c.slug}`}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                isActive ? "bg-marca font-semibold text-white" : "bg-white text-gray-700 hover:text-marca"
              }`
            }
          >
            {c.nombre}
          </NavLink>
        ))}
      </nav>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="titulo-pagina mb-0">{nombre ?? "Categoría"}</h2>
          {libros.actualizando && <IndicadorActualizando />}
        </div>

        {libros.cargando && <EstadoCarga texto="Cargando libros..." intento={libros.intento} />}

        {!libros.cargando && !libros.datos && libros.error && (
          <MensajeError error={libros.error} onReintentar={libros.reintentar}>
            <Boton variante="secundario" to="/">
              Ver todas las categorías
            </Boton>
          </MensajeError>
        )}

        {libros.datos && (
          <>
            {libros.error && <AvisoDatosGuardados error={libros.error} onReintentar={libros.reintentar} />}
            <p className="mb-4 text-gray-600">{libros.datos.categoria.descripcion}</p>

            {libros.datos.libros.length === 0 ? (
              <div className="tarjeta py-10 text-center">
                <p className="mb-4 text-gray-600">Aún no hay libros en esta categoría.</p>
                <Boton to="/">Explorar otras categorías</Boton>
              </div>
            ) : (
              <>
                <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
                  <label className="sr-only" htmlFor="buscar-libro">
                    Buscar por título o autor
                  </label>
                  <input
                    id="buscar-libro"
                    type="search"
                    className="campo"
                    placeholder="Buscar por título o autor..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <label className="sr-only" htmlFor="orden-libros">
                    Ordenar libros
                  </label>
                  <select id="orden-libros" className="campo" value={orden} onChange={(e) => setOrden(e.target.value)}>
                    {Object.entries(ORDENES).map(([valor, { etiqueta }]) => (
                      <option key={valor} value={valor}>
                        {etiqueta}
                      </option>
                    ))}
                  </select>
                </div>

                {visibles.length === 0 ? (
                  <p className="tarjeta text-center text-gray-500">Ningún libro coincide con "{busqueda}".</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visibles.map((libro) => (
                      <TarjetaLibro key={libro.id} libro={libro} />
                    ))}
                  </div>
                )}
                <p className="mt-4 text-sm text-gray-500">
                  Mostrando {visibles.length} de {libros.datos.libros.length} libros
                </p>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Categoria;
