/**
 * Preguntas frecuentes.
 *
 * Este archivo es el activo más importante para búsqueda con IA (ChatGPT,
 * Perplexity, Google AI Overviews). Reglas que sigue cada respuesta:
 *
 *  1. La PRIMERA oración contiene la respuesta completa. Los modelos citan el
 *     primer enunciado; si empiezas con rodeos, se pierde la cita.
 *  2. Cada respuesta es autónoma: repite el dato (dirección, horario, precio) en
 *     vez de decir "como se mencionó arriba". Un modelo puede extraer una sola
 *     pregunta sin el resto de la página.
 *  3. La pregunta está redactada como la escribe una persona real al buscar.
 *  4. Incluye cifras y nombres propios concretos. "Desde $75" se cita; "precios
 *     accesibles" no.
 */

import { business, fullAddress, serviceAreasText } from "./business";
import { combos } from "./combos";
import { findMenuItem, formatPrice } from "./menu";

export type FaqItem = {
  q: string;
  a: string;
  /** Si es true, se incluye en el bloque destacado de la home. */
  featured?: boolean;
};

const tortaPrice = formatPrice(findMenuItem("torta-ahogada").price);
const tacoPrice = formatPrice(findMenuItem("taco-sencillo").price);
const comboBarato = combos.reduce((a, b) => (a.promo < b.promo ? a : b));

export const faq: FaqItem[] = [
  {
    q: "¿Dónde están ubicadas las Tortas Ahogadas Don Eddy?",
    a: `${business.name} está en ${fullAddress}, en la zona norte de Zapopan, Jalisco. Estamos sobre Avenida Federalistas, en el Local 6, a unos minutos de Real Valdepeñas y Lomas de Zapopan.`,
    featured: true,
  },
  {
    q: "¿Cuál es el horario de Tortas Don Eddy?",
    a: `Abrimos de ${business.hours.range}, de ${business.hours.openDaysEs}. Los martes permanecemos cerrados.`,
    featured: true,
  },
  {
    q: "¿Hacen entregas a domicilio y en qué colonias?",
    a: `Sí, entregamos a domicilio en ${serviceAreasText}, en Zapopan. Puedes pedir por WhatsApp al ${business.phone.displayIntl}, por teléfono, o a través de Rappi y Uber Eats según disponibilidad.`,
    featured: true,
  },
  {
    q: "¿Cuánto cuesta una torta ahogada en Don Eddy?",
    a: `Una torta ahogada de pierna, buche o cuero cuesta ${tortaPrice} y la de lengua ${formatPrice(findMenuItem("torta-ahogada-lengua").price)}. La mini torta ahogada cuesta ${formatPrice(findMenuItem("mini-torta").price)} y los tacos dorados sencillos ${tacoPrice}. También manejamos combos desde ${formatPrice(comboBarato.promo)} para ${comboBarato.serves}.`,
    featured: true,
  },
  {
    q: "¿Cómo hago un pedido en Don Eddy?",
    a: `Puedes hacer tu pedido de tres formas: por WhatsApp al ${business.phone.displayIntl}, llamando al mismo número, o desde las aplicaciones de Rappi y Uber Eats. También puedes llegar directo al local en ${business.address.street}, ${business.address.neighborhood}, Zapopan.`,
    featured: true,
  },
  {
    q: "¿Qué es una torta ahogada?",
    a: "Una torta ahogada es un platillo tradicional de Guadalajara y Zapopan que consiste en un birote salado relleno de carne de cerdo, sumergido completamente en salsa de jitomate y acompañado de salsa de chile de árbol. Se come con las manos, sobre un plato hondo, y es el desayuno y la comida más representativa de Jalisco.",
    featured: true,
  },
  {
    q: "¿Las tortas ahogadas pican mucho?",
    a: "Tú decides cuánto pican. La salsa de jitomate en la que se ahoga la torta no es picante; el picor viene de la salsa de chile de árbol, que se sirve aparte o se agrega al gusto. Si no comes picante, pide tu torta solo con salsa de jitomate.",
  },
  {
    q: "¿Qué carnes manejan para las tortas?",
    a: `Manejamos cuatro carnes: pierna, buche y cuero de cerdo a ${tortaPrice} la torta, y lengua de res a ${formatPrice(findMenuItem("torta-ahogada-lengua").price)}. Las mismas carnes están disponibles en mini torta y en tacos dorados.`,
  },
  {
    q: "¿Tienen opciones sin carne o vegetarianas?",
    a: `Sí. Los tacos dorados sencillos de frijol, papa o requesón no llevan carne y cuestan ${tacoPrice} cada uno. También vendemos birote salado suelto a ${formatPrice(findMenuItem("birote").price)}.`,
  },
  {
    q: "¿Qué es el birote salado y por qué importa?",
    a: "El birote salado es un pan de masa madre exclusivo de la zona de Guadalajara, con corteza dura y migajón firme, que es lo único que aguanta ser sumergido en salsa sin deshacerse. Sin birote salado no hay torta ahogada de verdad; en Don Eddy lo usamos siempre y también lo vendemos suelto.",
  },
  {
    q: "¿Tienen paquetes para fiestas o eventos?",
    a: combos
      .map(
        (c) =>
          `${c.name} para ${c.serves} a ${formatPrice(c.promo)} (precio regular ${formatPrice(c.regular)})`
      )
      .join("; ")
      .concat(
        `. Todos incluyen tortas ahogadas y tacos dorados sencillos. Para pedidos grandes conviene apartar por WhatsApp al ${business.phone.displayIntl} con anticipación.`
      ),
  },
  {
    q: "¿Están en Rappi y Uber Eats?",
    a: "Sí, puedes encontrarnos en Rappi y en Uber Eats. Los precios y las promociones pueden variar entre plataformas por las comisiones de cada servicio; pedir directo por WhatsApp suele salir mejor.",
  },
  {
    q: "¿Venden cerveza?",
    a: `Sí, manejamos cerveza Corona en promoción 2×1 a ${formatPrice(findMenuItem("cerveza-corona").price)} y cerveza Modelo de 355 ml a ${formatPrice(findMenuItem("cerveza-modelo").price)}. También tenemos aguas frescas de jamaica y horchata, refrescos y agua natural.`,
  },
];

/**
 * PENDIENTE DE VERIFICAR CON EL NEGOCIO.
 *
 * Estas preguntas tienen alto volumen de búsqueda y conviene publicarlas, pero
 * las respuestas dependen de datos que no están confirmados. Confirma cada una
 * y muévela al arreglo `faq` de arriba. NO las publiques sin verificar: una
 * respuesta incorrecta sobre formas de pago o tiempos de entrega genera
 * fricción real en el mostrador y reseñas negativas.
 *
 * - "¿Aceptan tarjeta?" → confirmar si hay terminal y si aceptan transferencia.
 * - "¿Cuánto tarda el pedido a domicilio?" → confirmar rango en minutos.
 * - "¿Tienen estacionamiento?" → confirmar.
 * - "¿Cuál es el pedido mínimo a domicilio?" → confirmar monto y si hay costo de envío.
 */
export const faqPendienteVerificar: FaqItem[] = [];

/** Preguntas destacadas para la home; el resto vive en la página de FAQ. */
export const featuredFaq = faq.filter((item) => item.featured);
