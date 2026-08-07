/**
 * Menú del negocio.
 *
 * Los precios son NÚMEROS, no cadenas como "$75". Esto permite:
 *  - formatearlos de forma consistente en un solo lugar,
 *  - emitirlos en JSON-LD (schema.org exige valor numérico), y
 *  - verificar por test que los combos cuadren con el menú.
 *
 * Cada platillo lleva `description`: es el texto que los motores de IA citan
 * cuando alguien pregunta "¿qué lleva una torta ahogada?". Sin descripción, un
 * precio suelto no le dice nada ni a Google ni a un modelo.
 */

export type MenuItem = {
  id: string;
  name: string;
  /** Precio en MXN. */
  price: number;
  description?: string;
  /** Variantes sin costo extra (rellenos, sabores). */
  options?: string[];
  /** Gramaje o presentación, p. ej. "100 g". */
  serving?: string;
  /** Se destaca visualmente y se marca como recomendado en el schema. */
  popular?: boolean;
};

export type MenuSection = {
  id: string;
  title: string;
  subtitle?: string;
  /** Copy con intención SEO para la sección. */
  description?: string;
  items: MenuItem[];
};

export const CARNES = ["Pierna", "Buche", "Cuero"] as const;
export const RELLENOS_TACO = ["Frijol", "Papa", "Requesón"] as const;

export const menu: MenuSection[] = [
  {
    id: "tortas-ahogadas",
    title: "Tortas ahogadas",
    subtitle: "Birote salado · 100 g de carne",
    description:
      "La clásica de Jalisco: birote salado relleno de carne, bañado en salsa de jitomate y coronado con chile de árbol al gusto. Tú decides qué tan ahogada y qué tan picante.",
    items: [
      {
        id: "torta-ahogada",
        name: "Torta ahogada",
        price: 75,
        serving: "100 g",
        options: [...CARNES],
        description:
          "Birote salado con pierna, buche o cuero de cerdo, ahogado en salsa de jitomate con chile de árbol.",
        popular: true,
      },
      {
        id: "torta-ahogada-lengua",
        name: "Torta ahogada de lengua",
        price: 80,
        serving: "100 g",
        description:
          "Birote salado relleno de lengua de res suave, ahogado en salsa de jitomate y chile de árbol.",
      },
    ],
  },
  {
    id: "mini-tortas",
    title: "Mini tortas ahogadas",
    subtitle: "50 g de carne",
    description:
      "La versión chica, ideal para acompañar unos tacos dorados o para el antojo de media tarde.",
    items: [
      {
        id: "mini-torta",
        name: "Mini torta ahogada",
        price: 45,
        serving: "50 g",
        options: [...CARNES],
        description: "Media porción de la torta clásica, con pierna, buche o cuero.",
      },
      {
        id: "mini-torta-lengua",
        name: "Mini torta ahogada de lengua",
        price: 50,
        serving: "50 g",
        description: "Media porción con lengua de res.",
      },
    ],
  },
  {
    id: "tacos-dorados",
    title: "Tacos dorados con carne",
    subtitle: "Frijol o papa · 50 g de carne",
    description:
      "Tacos dorados crujientes rellenos de frijol o papa, más una porción de carne encima. Se sirven con salsa y repollo.",
    items: [
      {
        id: "taco-dorado-carne",
        name: "Taco dorado con carne",
        price: 40,
        serving: "50 g",
        options: [...CARNES],
        description:
          "Taco dorado de frijol o papa con pierna, buche o cuero de cerdo.",
        popular: true,
      },
      {
        id: "taco-dorado-lengua",
        name: "Taco dorado con lengua",
        price: 45,
        serving: "50 g",
        description: "Taco dorado de frijol o papa con lengua de res.",
      },
    ],
  },
  {
    id: "tacos-sencillos",
    title: "Tacos dorados sencillos",
    subtitle: "Sin carne",
    description:
      "Tacos dorados de frijol, papa o requesón. La opción más económica y la base de todos nuestros combos.",
    items: [
      {
        id: "taco-sencillo",
        name: "Taco dorado sencillo",
        price: 15,
        options: [...RELLENOS_TACO],
        description: "Taco dorado relleno de frijol, papa o requesón.",
      },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    items: [
      {
        id: "birote",
        name: "Birote salado",
        price: 12,
        description:
          "El pan que hace la torta ahogada: corteza dura, migajón firme y sabor salado. También se vende suelto.",
      },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    description:
      "Aguas frescas del día, refrescos bien fríos y cerveza para acompañar el picante.",
    items: [
      // TODO(negocio): confirmar precios de bebidas. Los tres primeros están
      // capturados al mismo precio ($35) pese a ser presentaciones distintas
      // (355 ml, 500 ml y 1 L); conviene verificar que no sea un error de captura.
      {
        id: "agua-fresca",
        name: "Agua fresca",
        price: 35,
        serving: "500 ml",
        options: ["Jamaica", "Horchata"],
        description: "Aguas frescas hechas en casa, de jamaica u horchata.",
        popular: true,
      },
      {
        id: "refresco",
        name: "Refresco",
        price: 35,
        serving: "355 ml",
        options: [
          "Coca-Cola",
          "Coca-Cola Zero",
          "Coca-Cola Light",
          "Sidral Mundet",
          "Fresca",
          "Fanta",
        ],
      },
      {
        id: "agua-natural",
        name: "Agua natural Ciel",
        price: 35,
        serving: "1 L",
      },
      {
        id: "cerveza-corona",
        name: "Cerveza Corona",
        price: 55,
        serving: "2 × 210 ml",
        description: "Promoción 2×1: dos cervezas Corona ampolleta.",
      },
      {
        id: "cerveza-modelo",
        name: "Cerveza Modelo",
        price: 55,
        serving: "355 ml",
      },
    ],
  },
];

/** Formatea un precio en pesos mexicanos de forma consistente en todo el sitio. */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Lista plana de platillos, útil para el JSON-LD y los tests. */
export const allMenuItems: MenuItem[] = menu.flatMap((section) => section.items);

/** Busca un platillo por id. Los combos lo usan para calcular su precio regular. */
export function findMenuItem(id: string): MenuItem {
  const item = allMenuItems.find((i) => i.id === id);
  if (!item) throw new Error(`Platillo desconocido en el menú: "${id}"`);
  return item;
}

/** Precio más bajo del menú — se usa en el rango de precios del JSON-LD. */
export const minPrice = Math.min(...allMenuItems.map((i) => i.price));
export const maxPrice = Math.max(...allMenuItems.map((i) => i.price));
