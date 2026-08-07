import type { Metadata } from "next";

import { SITE_URL, business } from "@/data/business";

/**
 * Constructor de metadatos por página.
 *
 * Centralizarlo evita el error más común de SEO técnico: que la URL canónica,
 * la de Open Graph y la del sitemap apunten a sitios distintos. Aquí las tres
 * derivan del mismo `path`.
 */

type PageSeoInput = {
  /** Ruta relativa, empezando con "/". */
  path: string;
  /** Título sin el nombre de la marca; la plantilla del layout lo agrega. */
  title: string;
  /**
   * Meta description. Objetivo 140–160 caracteres: más corto desaprovecha el
   * espacio del resultado, más largo se trunca con "…".
   */
  description: string;
  /** Palabras clave objetivo — se usan para revisión editorial, no para rankear. */
  keywords?: string[];
  /** `true` en páginas que no deben indexarse (gracias, 404 personalizadas...). */
  noIndex?: boolean;
  /** Tipo Open Graph; "article" para la guía. */
  ogType?: "website" | "article";
  /**
   * `true` para usar el título tal cual, sin agregarle " | Don Eddy". Se usa en
   * la portada, donde el nombre de la marca ya va incluido en el título y
   * repetirlo desperdicia caracteres visibles en el resultado de búsqueda.
   */
  absoluteTitle?: boolean;
};

export function buildMetadata({
  path,
  title,
  description,
  keywords,
  noIndex,
  ogType = "website",
  absoluteTitle = false,
}: PageSeoInput): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length && { keywords }),

    alternates: {
      canonical,
    },

    openGraph: {
      type: ogType,
      title: `${title} | ${business.name}`,
      description,
      url: canonical,
      siteName: business.name,
      locale: "es_MX",
      // La imagen se declara explícitamente en cada página. Al definir un objeto
      // `openGraph` propio, la imagen generada por `opengraph-image.tsx` deja de
      // heredarse a las rutas hijas: solo la portada la traía y el resto de las
      // páginas se compartían sin tarjeta visual.
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${business.name} — Tortas ahogadas en ${business.address.locality}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | ${business.name}`,
      description,
      images: ["/opengraph-image"],
    },

    ...(noIndex && {
      robots: { index: false, follow: true },
    }),
  };
}
