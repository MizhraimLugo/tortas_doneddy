import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/business";
import { indexablePages } from "@/data/nav";

/**
 * sitemap.xml
 *
 * Se genera a partir de la misma lista que alimenta la navegación, para que no
 * pueda quedar una página publicada pero fuera del sitemap. Se excluyen las
 * páginas marcadas con `noindex`: anunciarlas aquí contradice esa directiva.
 *
 * Después de publicar, hay que enviarlo a mano una primera vez en Google Search
 * Console (Sitemaps → agregar `sitemap.xml`) y en Bing Webmaster Tools. Sin ese
 * paso, un sitio nuevo puede tardar semanas en ser descubierto.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return indexablePages.map((page) => ({
    url: page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
