// Datos del backend simulado. En un proyecto real vivirían en la base de datos del servidor;
// aquí solo los usa el mock (handlers.js), nunca los componentes directamente.

export const categorias = [
  { slug: "ficcion", nombre: "Ficción", descripcion: "Novelas y cuentos de autores clásicos y contemporáneos." },
  { slug: "ciencia-ficcion", nombre: "Ciencia Ficción", descripcion: "Futuros posibles, viajes espaciales y tecnología." },
  { slug: "fantasia", nombre: "Fantasía", descripcion: "Mundos imaginarios, magia y aventuras épicas." },
  { slug: "misterio", nombre: "Misterio", descripcion: "Detectives, enigmas y suspenso hasta la última página." },
  { slug: "historia", nombre: "Historia", descripcion: "Ensayos y relatos sobre el pasado de la humanidad." },
  { slug: "infantil", nombre: "Infantil", descripcion: "Lecturas para niñas, niños y toda la familia." },
  // Categoría sin libros: permite ver cómo responde la interfaz ante una lista vacía
  { slug: "poesia", nombre: "Poesía", descripcion: "Próximamente: estamos preparando esta sección." },
];

export const libros = [
  { id: 1, categoria: "ficcion", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", anio: 1967, paginas: 471, precio: 18990, sinopsis: "La historia de siete generaciones de la familia Buendía en el pueblo de Macondo." },
  { id: 2, categoria: "ficcion", titulo: "La casa de los espíritus", autor: "Isabel Allende", anio: 1982, paginas: 448, precio: 16990, sinopsis: "La saga de la familia Trueba a lo largo de cuatro generaciones en un país latinoamericano." },
  { id: 3, categoria: "ficcion", titulo: "Pedro Páramo", autor: "Juan Rulfo", anio: 1955, paginas: 128, precio: 9990, sinopsis: "Juan Preciado llega a Comala en busca de su padre y encuentra un pueblo habitado por murmullos." },
  { id: 4, categoria: "ficcion", titulo: "Rayuela", autor: "Julio Cortázar", anio: 1963, paginas: 600, precio: 19990, sinopsis: "Una novela que puede leerse en distintos órdenes, entre París y Buenos Aires." },
  { id: 5, categoria: "ciencia-ficcion", titulo: "Fahrenheit 451", autor: "Ray Bradbury", anio: 1953, paginas: 192, precio: 12990, sinopsis: "En una sociedad donde los libros están prohibidos, un bombero encargado de quemarlos empieza a dudar." },
  { id: 6, categoria: "ciencia-ficcion", titulo: "Fundación", autor: "Isaac Asimov", anio: 1951, paginas: 256, precio: 14990, sinopsis: "Un matemático prevé la caída del Imperio Galáctico y crea un plan para acortar la edad oscura." },
  { id: 7, categoria: "ciencia-ficcion", titulo: "Dune", autor: "Frank Herbert", anio: 1965, paginas: 704, precio: 22990, sinopsis: "Paul Atreides llega al desértico planeta Arrakis, fuente de la especia más valiosa del universo." },
  { id: 8, categoria: "ciencia-ficcion", titulo: "Un mundo feliz", autor: "Aldous Huxley", anio: 1932, paginas: 288, precio: 13990, sinopsis: "Una sociedad futura organizada en castas, donde la felicidad se fabrica en laboratorio." },
  { id: 9, categoria: "ciencia-ficcion", titulo: "Crónicas marcianas", autor: "Ray Bradbury", anio: 1950, paginas: 304, precio: 13490, sinopsis: "Relatos encadenados sobre la colonización humana de Marte." },
  { id: 10, categoria: "fantasia", titulo: "El Hobbit", autor: "J. R. R. Tolkien", anio: 1937, paginas: 320, precio: 15990, sinopsis: "Bilbo Bolsón deja su hogar para ayudar a un grupo de enanos a recuperar su tesoro." },
  { id: 11, categoria: "fantasia", titulo: "Un mago de Terramar", autor: "Ursula K. Le Guin", anio: 1968, paginas: 224, precio: 12490, sinopsis: "Ged, un joven con gran talento para la magia, libera una sombra que deberá enfrentar." },
  { id: 12, categoria: "fantasia", titulo: "La historia interminable", autor: "Michael Ende", anio: 1979, paginas: 496, precio: 17990, sinopsis: "Bastián lee un libro que lo transporta al reino de Fantasía, amenazado por la Nada." },
  { id: 13, categoria: "misterio", titulo: "Asesinato en el Orient Express", autor: "Agatha Christie", anio: 1934, paginas: 256, precio: 11990, sinopsis: "Hércules Poirot investiga un crimen a bordo de un tren detenido por la nieve." },
  { id: 14, categoria: "misterio", titulo: "El nombre de la rosa", autor: "Umberto Eco", anio: 1980, paginas: 672, precio: 19490, sinopsis: "Una serie de muertes en una abadía medieval pone a prueba la lógica de fray Guillermo." },
  { id: 15, categoria: "misterio", titulo: "El sabueso de los Baskerville", autor: "Arthur Conan Doyle", anio: 1902, paginas: 256, precio: 10990, sinopsis: "Sherlock Holmes investiga la leyenda de un perro sobrenatural en los páramos ingleses." },
  { id: 16, categoria: "historia", titulo: "Sapiens", autor: "Yuval Noah Harari", anio: 2011, paginas: 496, precio: 21990, sinopsis: "Una breve historia de la humanidad, desde los primeros homínidos hasta la era moderna." },
  { id: 17, categoria: "historia", titulo: "Las venas abiertas de América Latina", autor: "Eduardo Galeano", anio: 1971, paginas: 400, precio: 15490, sinopsis: "Un ensayo sobre la historia económica y social del continente." },
  { id: 18, categoria: "infantil", titulo: "El Principito", autor: "Antoine de Saint-Exupéry", anio: 1943, paginas: 96, precio: 8990, sinopsis: "Un aviador perdido en el desierto conoce a un pequeño príncipe llegado de otro planeta." },
  { id: 19, categoria: "infantil", titulo: "Papelucho", autor: "Marcela Paz", anio: 1947, paginas: 112, precio: 7990, sinopsis: "El diario de un niño chileno lleno de ocurrencias, preguntas y aventuras cotidianas." },
  { id: 20, categoria: "infantil", titulo: "Matilda", autor: "Roald Dahl", anio: 1988, paginas: 240, precio: 10490, sinopsis: "Una niña muy lectora descubre que tiene poderes y los usa contra una directora terrible." },
];
