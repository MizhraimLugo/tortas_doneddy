/**
 * FUENTE ÚNICA DE VERDAD del negocio.
 *
 * Todo el sitio (texto visible, JSON-LD, sitemap, llms.txt, metadatos) deriva de
 * este archivo. Esto garantiza consistencia NAP (Name / Address / Phone), que es
 * el factor #1 de SEO local: Google penaliza cuando tu dirección o teléfono
 * aparecen distintos en diferentes lugares.
 *
 * Si cambia un dato del negocio, se cambia AQUÍ y en ningún otro lado.
 */

/** Dominio real del sitio. Configúralo en `.env.local` antes de publicar. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tortasdoneddy.mx"
).replace(/\/$/, "");

/**
 * Teléfono en formato E.164 — el ÚNICO lugar donde se escribe el número.
 * México: +52 seguido de 10 dígitos. El "1" extra después del 52 es un formato
 * heredado de WhatsApp anterior a 2019 y ya no se usa en enlaces `tel:`.
 */
const PHONE_E164 = "+523347543255";

/** Dígitos sin símbolos, como los pide la API de wa.me. */
const PHONE_DIGITS = PHONE_E164.replace(/\D/g, "");

export const business = {
  name: "Tortas Ahogadas Don Eddy",
  shortName: "Don Eddy",
  legalName: "Tortas Ahogadas Don Eddy",

  /** Descripción base reutilizada en metadatos y datos estructurados. */
  description:
    "Tortas ahogadas de pierna, buche, cuero y lengua con birote salado y salsa de chile de árbol, en La Cima, Zapopan. Comemos aquí o te lo llevamos a domicilio.",

  /**
   * TODO(negocio): año de apertura. Se emite como `foundingDate` en el JSON-LD y
   * es una señal de confianza (E-E-A-T) fuerte para un negocio local: "desde
   * 2015" pesa más que un sitio sin historia. Se deja vacío porque no está
   * confirmado, y un dato inventado aquí sería una afirmación falsa publicada.
   */
  founded: "" as string,

  // ── Dirección (NAP) ────────────────────────────────────────────────────────
  address: {
    street: "Av. Federalistas 1100, Local 6",
    neighborhood: "La Cima",
    postalCode: "45130",
    locality: "Zapopan",
    /** Nombre completo del estado: schema.org prefiere "Jalisco" sobre "Jal." */
    region: "Jalisco",
    regionShort: "Jal.",
    country: "MX",
    countryName: "México",
  },

  /**
   * Coordenadas exactas extraídas del embed de Google Maps del negocio.
   * `geo` en el JSON-LD es una señal fuerte para el "map pack" local.
   */
  geo: {
    latitude: 20.752959780828352,
    longitude: -103.40758442300665,
  },

  // ── Contacto ───────────────────────────────────────────────────────────────
  phone: {
    /** Para JSON-LD y enlaces `tel:` */
    e164: PHONE_E164,
    /** Para mostrar al usuario */
    display: "33 4754 3255",
    displayIntl: "+52 33 4754 3255",
    telHref: `tel:${PHONE_E164}`,
  },

  /**
   * Enlaces de WhatsApp con mensaje precargado. Un pedido que llega con el
   * contexto ya escrito convierte bastante mejor que un chat en blanco.
   *
   * Nota: si el enlace no resuelve, algunos números mexicanos dados de alta
   * antes de 2019 aún requieren el prefijo heredado "521". En ese caso cambia
   * PHONE_DIGITS por "52" + "1" + los 10 dígitos.
   */
  whatsapp: (message?: string) => {
    const base = `https://wa.me/${PHONE_DIGITS}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  },

  // ── Horario ────────────────────────────────────────────────────────────────
  hours: {
    opens: "09:00",
    closes: "16:00",
    /** Texto humano, reutilizado en toda la página. */
    range: "9:00 a 16:00 h",
    closedDay: "Martes",
    closedNote: "Martes cerrado",
    /** Días abiertos en formato schema.org */
    openDays: [
      "Monday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ] as const,
    /** Días abiertos en español, para el texto visible. */
    openDaysEs: "Lunes, miércoles, jueves, viernes, sábado y domingo",
  },

  // ── Cobertura de reparto ───────────────────────────────────────────────────
  /**
   * Las colonias listadas una por una capturan búsquedas long-tail
   * ("tortas ahogadas Real Valdepeñas") y le dan a los motores de IA una
   * respuesta concreta a "¿entregan en mi zona?".
   */
  serviceAreas: [
    "La Cima",
    "Real Valdepeñas",
    "Lomas de Zapopan",
    "Jardines de Nuevo México",
    "Villas de Guadalupe",
  ],
  serviceAreaNote: "y colonias aledañas del norte de Zapopan",

  // ── Enlaces externos ───────────────────────────────────────────────────────
  links: {
    /** URL canónica de Google Maps construida con el CID del negocio. */
    googleMaps: "https://www.google.com/maps?cid=3392006286938494353",
    googleMapsShort: "https://maps.app.goo.gl/qhGHuqPUJ43qj3xE6",
    googleMapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3730.9465652162685!2d-103.40758442300665!3d20.752959780828352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428afa6ea94f84d%3A0x2f12d3bf10dc5591!2sTortas%20Ahogadas%20Don%20Eddy!5e0!3m2!1ses!2smx!4v1768356512810!5m2!1ses!2smx",
    instagram: "https://www.instagram.com/tortas_don.eddy",
    instagramHandle: "@tortas_don.eddy",

    // TODO(negocio): sustituir por las URLs reales de la tienda en cada
    // plataforma. Apuntar a la home genérica pierde el pedido: el usuario
    // aterriza en un buscador y tiene que encontrarte por su cuenta.
    rappi: "https://www.rappi.com.mx",
    uberEats: "https://www.ubereats.com",
  },

  priceRange: "$$",
  currency: "MXN",
  cuisine: ["Mexicana", "Tortas ahogadas", "Comida jalisciense"],

  // TODO(negocio): confirmar formas de pago aceptadas (efectivo, terminal,
  // transferencia) y agregarlas aquí. Se emitirán como `paymentAccepted` en el
  // JSON-LD. Se deja vacío a propósito: publicar "aceptamos tarjeta" sin
  // terminal genera fricción en el mostrador y reseñas negativas.
  paymentAccepted: [] as string[],
} as const;

/** Dirección de una línea, para texto visible. */
export const fullAddress = `${business.address.street}, ${business.address.neighborhood}, ${business.address.postalCode} ${business.address.locality}, ${business.address.regionShort}`;

/** Zonas de reparto en prosa natural: "A, B, C y D". */
export const serviceAreasText = (() => {
  const areas = [...business.serviceAreas];
  const last = areas.pop();
  return `${areas.join(", ")} y ${last} ${business.serviceAreaNote}`;
})();

/** Horario en una línea. */
export const hoursText = `${business.hours.range} · ${business.hours.closedNote}`;

/** Mensajes precargados de WhatsApp, por contexto de la página. */
export const waMessages = {
  general: "¡Hola Don Eddy! Quiero hacer un pedido 🌮",
  menu: "¡Hola Don Eddy! Vi el menú en la página y quiero pedir:",
  combo: (comboName: string) =>
    `¡Hola Don Eddy! Quiero pedir el ${comboName} de la promoción de la página 🔥`,
  delivery: (area = "") =>
    `¡Hola Don Eddy! ¿Tienen entrega a domicilio${area ? ` en ${area}` : ""}? Quiero hacer un pedido.`,
  hours: "¡Hola Don Eddy! ¿Están abiertos ahorita?",
} as const;
