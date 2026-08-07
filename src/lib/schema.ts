/**
 * Constructores de JSON-LD (schema.org).
 *
 * Diferencia clave con la versión anterior: este JSON-LD se renderiza EN EL
 * SERVIDOR, dentro del HTML. Antes se inyectaba desde un `useEffect`, lo que lo
 * volvía invisible para los crawlers que no ejecutan JavaScript — que son
 * justamente GPTBot, ClaudeBot, PerplexityBot y CCBot, el público al que apunta
 * este trabajo.
 *
 * Todos los nodos usan `@id` y se referencian entre sí. Un grafo conectado le
 * dice a Google "esta página, este menú y estas preguntas pertenecen a ESTE
 * negocio"; nodos sueltos se interpretan como entidades independientes y
 * diluyen la señal.
 */

import { business, fullAddress, serviceAreasText } from "@/data/business";
import { SITE_URL } from "@/data/business";
import { combos, comboSummary } from "@/data/combos";
import { faq } from "@/data/faq";
import { images, schemaImages } from "@/data/images";
import { menu, maxPrice, minPrice } from "@/data/menu";

// ── Identificadores estables del grafo ───────────────────────────────────────
export const ID = {
  restaurant: `${SITE_URL}/#restaurant`,
  website: `${SITE_URL}/#website`,
  menu: `${SITE_URL}/menu#menu`,
  organization: `${SITE_URL}/#organization`,
} as const;

const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Imagen por defecto: la portada Open Graph generada dinámicamente. */
const defaultImage = absolute("/opengraph-image");

/**
 * Fotos reales del negocio para el nodo Restaurant.
 *
 * Google usa `image` para los resultados enriquecidos y el panel de
 * conocimiento local. Una ficha con foto de la comida se lleva el clic frente a
 * una sin ella, así que estas van antes que la portada generada.
 */
const businessPhotos = [...schemaImages.map((img) => absolute(img.src)), defaultImage];

// ── Nodo principal: el negocio ───────────────────────────────────────────────
export function restaurantNode() {
  return {
    "@type": "Restaurant",
    "@id": ID.restaurant,
    name: business.name,
    alternateName: ["Tortas Don Eddy", "Don Eddy Zapopan"],
    description: business.description,
    url: SITE_URL,

    // El teléfono faltaba por completo en la versión anterior. En un negocio
    // local es el dato de mayor conversión y Google lo usa en el map pack.
    telephone: business.phone.e164,

    image: businessPhotos,
    logo: absolute(images.logo),
    priceRange: business.priceRange,
    currenciesAccepted: business.currency,
    ...(business.paymentAccepted.length > 0 && {
      paymentAccepted: business.paymentAccepted.join(", "),
    }),
    servesCuisine: business.cuisine,
    ...(business.founded && { foundingDate: business.founded }),

    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },

    // Coordenadas exactas: señal directa para el paquete local de Google Maps.
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },

    hasMap: business.links.googleMaps,

    // Zonas de reparto como lugares tipados, no como una cadena suelta.
    areaServed: [
      {
        "@type": "City",
        name: business.address.locality,
        containedInPlace: { "@type": "State", name: business.address.region },
      },
      ...business.serviceAreas.map((area) => ({
        "@type": "Place",
        name: area,
        containedInPlace: { "@type": "City", name: business.address.locality },
      })),
    ],

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: business.hours.openDays.map(
          (d) => `https://schema.org/${d}`
        ),
        opens: business.hours.opens,
        closes: business.hours.closes,
      },
    ],

    hasMenu: { "@id": ID.menu },

    sameAs: [business.links.instagram, business.links.googleMaps],

    // Acciones que un asistente o buscador puede ofrecer directamente.
    potentialAction: [
      {
        "@type": "OrderAction",
        name: "Pedir por WhatsApp",
        target: {
          "@type": "EntryPoint",
          urlTemplate: business.whatsapp(),
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
        deliveryMethod: [
          "https://schema.org/OnSitePickup",
          "https://schema.org/ParcelService",
        ],
      },
      {
        "@type": "ViewAction",
        name: "Ver el menú",
        target: absolute("/menu"),
      },
    ],

    makesOffer: combos.map((combo) => ({
      "@type": "Offer",
      name: combo.name,
      description: comboSummary(combo),
      price: combo.promo,
      priceCurrency: business.currency,
      availability: "https://schema.org/InStock",
      url: absolute("/#paquetes"),
      eligibleQuantity: { "@type": "QuantitativeValue", value: 1 },
    })),

    // NOTA: no se incluye `aggregateRating` a propósito. Publicar calificaciones
    // inventadas viola las políticas de Google (penalización manual) y la ley de
    // publicidad. Cuando acumules reseñas reales en Google Business Profile,
    // conéctalas aquí con sus valores verdaderos.
  };
}

// ── Sitio web (habilita el sitelinks searchbox y la marca en resultados) ─────
export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: business.name,
    description: business.description,
    inLanguage: "es-MX",
    publisher: { "@id": ID.restaurant },
  };
}

// ── Menú completo, plato por plato ───────────────────────────────────────────
/**
 * Los 12 platillos con precio estaban sin estructurar en la versión anterior.
 * Marcados así, Google puede mostrarlos como datos de menú y un modelo puede
 * responder "¿cuánto cuesta la torta de lengua?" citando la fuente.
 */
export function menuNode() {
  return {
    "@type": "Menu",
    "@id": ID.menu,
    name: `Menú de ${business.name}`,
    description: `Menú completo de tortas ahogadas, tacos dorados y bebidas. Precios de ${minPrice} a ${maxPrice} pesos mexicanos.`,
    inLanguage: "es-MX",
    url: absolute("/menu"),
    hasMenuSection: menu.map((section) => ({
      "@type": "MenuSection",
      name: section.title,
      ...(section.description && { description: section.description }),
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.description && { description: item.description }),
        ...(item.options?.length && {
          menuAddOn: item.options.map((opt) => ({
            "@type": "MenuItem",
            name: opt,
          })),
        }),
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: business.currency,
          availability: "https://schema.org/InStock",
        },
      })),
    })),
  };
}

// ── Preguntas frecuentes ─────────────────────────────────────────────────────
export function faqNode() {
  return {
    "@type": "FAQPage",
    "@id": absolute("/preguntas-frecuentes#faq"),
    inLanguage: "es-MX",
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.restaurant },
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// ── Migas de pan ─────────────────────────────────────────────────────────────
export function breadcrumbNode(trail: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

// ── Página genérica, con soporte para asistentes de voz ──────────────────────
export function webPageNode(opts: {
  path: string;
  name: string;
  description: string;
  /** Fecha ISO de última revisión del contenido. */
  dateModified?: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${absolute(opts.path)}#webpage`,
    url: absolute(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: "es-MX",
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.restaurant },
    primaryImageOfPage: defaultImage,
    ...(opts.dateModified && { dateModified: opts.dateModified }),

    // Le indica a Google Assistant y Alexa qué leer en voz alta. Los selectores
    // apuntan a los bloques marcados con `data-speakable` en el markup.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable]"],
    },
  };
}

// ── Artículo informativo (para la guía "qué es una torta ahogada") ───────────
export function articleNode(opts: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@type": "Article",
    "@id": `${absolute(opts.path)}#article`,
    headline: opts.headline,
    description: opts.description,
    inLanguage: "es-MX",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: { "@id": ID.restaurant },
    publisher: { "@id": ID.restaurant },
    image: defaultImage,
    mainEntityOfPage: { "@id": `${absolute(opts.path)}#webpage` },
  };
}

/** Envuelve nodos sueltos en un grafo con contexto. */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/** Resumen en texto plano del negocio, reutilizado por llms.txt. */
export function plainTextSummary(): string {
  return [
    `${business.name} — ${business.description}`,
    `Dirección: ${fullAddress}.`,
    `Teléfono y WhatsApp: ${business.phone.displayIntl}.`,
    `Horario: ${business.hours.range}, ${business.hours.openDaysEs}. ${business.hours.closedNote}.`,
    `Reparto a domicilio: ${serviceAreasText}.`,
  ].join(" ");
}
