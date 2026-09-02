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
  /**
   * Nombre corto. Debe coincidir EXACTAMENTE con el de la ficha de Google
   * Business Profile: la consistencia entre ficha, sitio y directorios es de
   * los factores más pesados del posicionamiento local, y una variación cuenta
   * como inconsistencia.
   */
  name: "Tortas Ahogadas Don Eddy",
  shortName: "Don Eddy",

  /**
   * Nombre completo tal como aparece en el logotipo. Se usa en títulos y como
   * `alternateName` en los datos estructurados, para que "tacos dorados" —que
   * es media línea de negocio— también sea una vía de entrada.
   */
  fullName: "Tortas Ahogadas y Tacos Dorados Don Eddy",
  legalName: "Tortas Ahogadas Don Eddy",

  /** Descripción base reutilizada en metadatos y datos estructurados. */
  description:
    "Tortas ahogadas y tacos dorados en La Cima, Zapopan. El birote salado y las carnitas los hacemos en casa el mismo día, y las dos salsas son nuestras. Comes aquí o te lo llevamos a domicilio.",

  /**
   * Año de apertura. Vacío a propósito.
   *
   * El "DESDE 1995" venía del logotipo del diseño de referencia, pero el
   * logotipo real del negocio no lo incluye y el dato no está confirmado, así
   * que se retiró: publicar un año de fundación falso es una afirmación falsa
   * sobre el negocio, y va en el JSON-LD como `foundingDate`.
   *
   * TODO(negocio): si se confirma el año real, basta escribirlo aquí. Todo el
   * sitio lo recoge solo —portada, pie, imagen de vista previa y datos
   * estructurados— porque cada uso ya está condicionado a que exista.
   * "Desde 20XX" es una señal de confianza fuerte para un negocio local y vale
   * la pena recuperarla.
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
    /** Días de descanso, en español y para el texto visible. */
    closedDays: ["Lunes", "Martes"] as const,
    closedNote: "Lunes y martes cerrado",
    /** Días abiertos en formato schema.org */
    openDays: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const,
    /** Días abiertos en español, para el texto visible. */
    openDaysEs: "Miércoles, jueves, viernes, sábado y domingo",
  },

  // ── Cobertura de reparto ───────────────────────────────────────────────────
  /**
   * Las colonias listadas una por una capturan búsquedas long-tail
   * ("tortas ahogadas Valdepeñas") y le dan a los motores de IA una
   * respuesta concreta a "¿entregan en mi zona?".
   */
  serviceAreas: [
    "La Cima",
    "Valdepeñas",
    "Cañada San Lorenzo",
    "Lomas de Zapopan",
  ],
  // Sin "y" al principio: la lista de colonias ya termina con una ("…y Lomas de
  // Zapopan"), y encadenar las dos daba "…y Lomas de Zapopan y colonias
  // aledañas…". Se une con coma en `serviceAreasText`.
  serviceAreaNote: "además de colonias aledañas del norte de Zapopan",

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
    didiFood: "https://www.didi-food.com/es-MX",
  },

  priceRange: "$$",
  currency: "MXN",
  cuisine: ["Mexicana", "Tortas ahogadas", "Tacos dorados", "Comida jalisciense"],

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
  return `${areas.join(", ")} y ${last}, ${business.serviceAreaNote}`;
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
