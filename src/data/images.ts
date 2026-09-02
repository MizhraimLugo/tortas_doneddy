/**
 * Imágenes del negocio.
 *
 * Fuente única de rutas y textos alternativos. Centralizarlo importa por dos
 * razones:
 *
 *  1. El `alt` es SEO real. Es lo que lee Google Imágenes, y esa pestaña manda
 *     tráfico de gente decidiendo qué se le antoja comer. Escribirlo aquí, junto
 *     a la ruta, evita que alguien agregue una foto con `alt=""`.
 *  2. El nombre del archivo también cuenta como señal. Por eso son descriptivos
 *     y con palabras clave, no "IMG_4821.jpg".
 *
 * Las fotos aún no están en el repositorio. Mientras falten, `FoodImage` dibuja
 * un mosaico de marca en su lugar; en cuanto los archivos existan en
 * `public/brand/` con estos nombres, aparecen solas sin tocar código.
 * Ver `public/brand/LEEME.md`.
 */

export type BrandImage = {
  src: string;
  alt: string;
};

export const images = {
  /** Logotipo ovalado. Formato ancho, no cuadrado. */
  logo: "/brand/logo.png",

  /** Ilustración de Don Eddy con el mandil. */
  personaje: {
    src: "/brand/don-eddy-personaje.png",
    alt: "Don Eddy, con mandil negro y el logotipo del negocio bordado",
  },

  /** La foto principal: es la que tiene que dar hambre. */
  tortaAhogada: {
    src: "/brand/torta-ahogada-don-eddy.jpg",
    alt: "Torta ahogada de Tortas Don Eddy en birote salado, con carne de cerdo, bañada con caldillo de jitomate y chile de árbol, servida en plato hondo con aguas de horchata y jamaica",
  },

  tacosDorados: {
    src: "/brand/tacos-dorados-don-eddy.jpg",
    alt: "Tres tacos dorados de Tortas Don Eddy sobre cama de repollo y rábano, con salsa de chile de árbol sirviéndose encima",
  },

  /** Pendiente: fachada del local. Aún no hay archivo. */
  local: {
    src: "/brand/local-don-eddy-la-cima-zapopan.jpg",
    alt: "Fachada de Tortas Ahogadas Don Eddy en La Cima, Zapopan",
  },
} as const;

/**
 * Fotos que se declaran en el JSON-LD del negocio.
 *
 * Google usa `image` del nodo Restaurant para los resultados enriquecidos y
 * para el panel de conocimiento. Sin fotos reales, ese espacio queda vacío y el
 * resultado pierde el clic frente a un competidor que sí las tiene.
 */
export const schemaImages: BrandImage[] = [images.tortaAhogada, images.tacosDorados];
