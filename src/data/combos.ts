/**
 * Paquetes y promociones.
 *
 * El precio regular NO se escribe a mano: se calcula a partir del menú. Si mañana
 * sube la torta a $80, los cuatro combos se recalculan solos y el descuento
 * anunciado sigue siendo cierto. Anunciar un "precio regular" que ya no existe
 * es, además de un bug, un problema legal de publicidad engañosa.
 *
 * Lo único que se captura a mano es `promo`, que es una decisión comercial.
 */

import { findMenuItem, formatPrice } from "./menu";

type ComboLine = {
  /** id de un platillo existente en menu.ts */
  itemId: string;
  qty: number;
  /** Texto que se muestra al usuario para esta línea. */
  label: string;
};

type ComboInput = {
  id: string;
  name: string;
  /**
   * Para cuántas personas alcanza. Se captura como NÚMERO, no como "2
   * personas": el texto se deriva de aquí y además permite calcular el precio
   * por persona, que es el argumento real para comprar un paquete en vez de
   * platillos sueltos.
   */
  servesCount: number;
  tagline: string;
  lines: ComboLine[];
  /** Precio promocional en MXN (decisión comercial). */
  promo: number;
  /** Se resalta visualmente como la mejor opción. */
  highlight?: boolean;
};

const COMBOS_INPUT: ComboInput[] = [
  {
    id: "pareja",
    name: "Combo Pareja",
    servesCount: 2,
    tagline: "Para compartir sin pelearse la última.",
    lines: [
      { itemId: "torta-ahogada", qty: 2, label: "2 tortas ahogadas (pierna, buche o cuero)" },
      { itemId: "taco-sencillo", qty: 4, label: "4 tacos dorados sencillos (frijol, papa o requesón)" },
    ],
    promo: 165,
  },
  {
    id: "familiar",
    name: "Combo Familiar",
    servesCount: 4,
    tagline: "El de siempre para la comida del domingo.",
    lines: [
      { itemId: "torta-ahogada", qty: 4, label: "4 tortas ahogadas (pierna, buche o cuero)" },
      { itemId: "taco-sencillo", qty: 8, label: "8 tacos dorados sencillos (frijol, papa o requesón)" },
    ],
    promo: 320,
    highlight: true,
  },
  {
    id: "super",
    name: "Super Combo",
    servesCount: 8,
    tagline: "Para reunión chica o antojo grande.",
    lines: [
      { itemId: "torta-ahogada", qty: 8, label: "8 tortas ahogadas (pierna, buche o cuero)" },
      { itemId: "taco-sencillo", qty: 16, label: "16 tacos dorados sencillos (frijol, papa o requesón)" },
    ],
    promo: 600,
  },
  {
    id: "maxi",
    name: "Maxi Combo",
    servesCount: 16,
    tagline: "Fiestas, oficinas y bautizos. El mejor precio por torta.",
    lines: [
      { itemId: "torta-ahogada", qty: 16, label: "16 tortas ahogadas (pierna, buche o cuero)" },
      { itemId: "taco-sencillo", qty: 32, label: "32 tacos dorados sencillos (frijol, papa o requesón)" },
    ],
    promo: 1150,
  },
];

export type Combo = ComboInput & {
  /** "4 personas", derivado de `servesCount`. */
  serves: string;
  /** Suma de los platillos a precio de menú. */
  regular: number;
  /** Ahorro en pesos. */
  savings: number;
  /** Porcentaje de descuento, redondeado. */
  discountPct: number;
  /** Precio por persona, redondeado al peso. */
  perPerson: number;
  /** Total de piezas que trae el paquete. */
  pieces: number;
  /** Lista de textos para mostrar en la tarjeta. */
  includes: string[];
};

export const combos: Combo[] = COMBOS_INPUT.map((combo) => {
  const regular = combo.lines.reduce(
    (total, line) => total + findMenuItem(line.itemId).price * line.qty,
    0
  );

  return {
    ...combo,
    serves: `${combo.servesCount} personas`,
    regular,
    savings: regular - combo.promo,
    discountPct: Math.round(((regular - combo.promo) / regular) * 100),
    perPerson: Math.round(combo.promo / combo.servesCount),
    pieces: combo.lines.reduce((total, line) => total + line.qty, 0),
    includes: combo.lines.map((line) => line.label),
  };
});

/** Descripción en prosa de un combo — se reutiliza en JSON-LD y en llms.txt. */
export function comboSummary(combo: Combo): string {
  return `${combo.name}: ${combo.includes.join(" y ")}. Rinde para ${combo.serves}, unos ${formatPrice(combo.perPerson)} por persona. Precio regular ${formatPrice(combo.regular)}, precio de promoción ${formatPrice(combo.promo)} (ahorras ${formatPrice(combo.savings)}, ${combo.discountPct}% de descuento).`;
}

/** El paquete con el precio por persona más bajo. Se destaca en la página. */
export const comboMasRendidor = combos.reduce((a, b) =>
  a.perPerson <= b.perPerson ? a : b
);
