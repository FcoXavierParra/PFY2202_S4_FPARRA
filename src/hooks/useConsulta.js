import { useCallback, useEffect, useState } from "react";
import { consultar, leerCache } from "../api/cache";

// Hook para consumir la API desde un componente. Devuelve:
//   datos         la respuesta (o la última guardada, si la nueva falló)
//   cargando      true mientras no hay nada que mostrar
//   actualizando  true cuando se muestran datos guardados y se pide una versión nueva
//   intento       número de intento cuando hay reintentos automáticos (2 o 3)
//   error         ErrorApi si la petición falló
//   reintentar()  vuelve a pedir los datos al servidor
export function useConsulta({ clave, pedir }) {
  const [estado, setEstado] = useState(() => estadoInicial(clave));
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const enCache = leerCache(clave);
    const forzar = version > 0;
    setEstado({
      ...estadoInicial(clave),
      cargando: !enCache,
      actualizando: Boolean(enCache) && (!enCache.fresco || forzar),
    });

    // "vigente" evita aplicar una respuesta que llegó tarde: si el usuario ya cambió de
    // categoría o salió de la página, ese resultado se descarta
    let vigente = true;
    const alReintentar = (intento) => vigente && setEstado((e) => ({ ...e, intento }));

    consultar(clave, pedir, { forzar, alReintentar })
      .then((datos) => vigente && setEstado({ datos, cargando: false, actualizando: false, intento: 1, error: null }))
      .catch((error) => vigente && setEstado((e) => ({ ...e, cargando: false, actualizando: false, error })));

    return () => {
      vigente = false;
    };
    // pedir cambia de identidad en cada render; la clave ya identifica la consulta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, version]);

  const reintentar = useCallback(() => setVersion((v) => v + 1), []);
  return { ...estado, reintentar };
}

function estadoInicial(clave) {
  const enCache = leerCache(clave);
  return { datos: enCache?.datos ?? null, cargando: !enCache, actualizando: false, intento: 1, error: null };
}
