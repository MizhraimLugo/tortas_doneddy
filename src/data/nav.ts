/**
 * Navegación principal.
 *
 * Además de servir al usuario, el menú es la principal ruta de rastreo del
 * sitio: los enlaces que aparecen en todas las páginas reparten autoridad hacia
 * las páginas que quieres posicionar. Por eso las tres páginas con intención de
 * búsqueda propia (menú, domicilio y la guía) están aquí y no escondidas.
 */

/**
 * Dónde viven los paquetes.
 *
 * Los combos se muestran en dos páginas, pero solo una puede ser la dirección
 * canónica que se publica en los datos estructurados, en el menú de navegación
 * y en los enlaces internos. Es la del menú: ahí es donde alguien compara
 * precios, y el enlace funciona igual desde cualquier página del sitio,
 * mientras que `/#paquetes` obliga a volver a cargar la portada primero.
 */
export const PAQUETES_PATH = "/menu#paquetes";

export type NavLink = {
  label: string;
  href: string;
  /** Descripción para lectores de pantalla y para el mapa del sitio. */
  title: string;
};

export const navLinks: NavLink[] = [
  { label: "Menú", href: "/menu", title: "Menú completo con precios" },
  // Apunta a la página de menú, no a la portada: así el enlace funciona igual
  // desde cualquier página. Con `/#paquetes` había que volver a cargar la
  // portada entera para bajar a una sección que ya existe en /menu.
  { label: "Paquetes", href: PAQUETES_PATH, title: "Combos y promociones" },
  {
    label: "Domicilio",
    href: "/tortas-ahogadas-a-domicilio-zapopan",
    title: "Entrega a domicilio en Zapopan",
  },
  { label: "Ubicación", href: "/#ubicacion", title: "Cómo llegar al local" },
  { label: "Instagram", href: "/#instagram", title: "Nuestras fotos y novedades" },
  {
    label: "Guía",
    href: "/que-es-una-torta-ahogada",
    title: "Qué es una torta ahogada",
  },
  { label: "FAQ", href: "/#faq", title: "Preguntas frecuentes" },
];

/**
 * Todas las páginas del sitio.
 *
 * `index: false` marca las que no deben aparecer en el sitemap. Incluir en el
 * sitemap una página que además lleva `noindex` manda dos señales opuestas al
 * mismo tiempo ("indéxame" / "no me indexes"); Google lo reporta como conflicto
 * en Search Console y gasta presupuesto de rastreo en páginas que igual va a
 * descartar. Las legales se enlazan desde el pie, que es suficiente para que se
 * descubran.
 */
export const sitePages: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  index: boolean;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1, index: true },
  { path: "/menu", changeFrequency: "weekly", priority: 0.9, index: true },
  {
    path: "/tortas-ahogadas-a-domicilio-zapopan",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
  },
  {
    path: "/que-es-una-torta-ahogada",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
  },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.2, index: false },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.2, index: false },
];

/** Solo las páginas que sí deben indexarse. */
export const indexablePages = sitePages.filter((page) => page.index);
