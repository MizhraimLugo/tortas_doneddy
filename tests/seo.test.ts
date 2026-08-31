import { describe, expect, it } from "vitest";

import { SITE_URL, business, fullAddress, serviceAreasText } from "@/data/business";
import { comboMasRendidor, combos } from "@/data/combos";
import { faq } from "@/data/faq";
import { allMenuItems, findMenuItem } from "@/data/menu";
import { PAQUETES_PATH, indexablePages, navLinks, sitePages } from "@/data/nav";
import { faqNode, graph, menuNode, restaurantNode, websiteNode } from "@/lib/schema";

/**
 * Estos tests sustituyen a los `console.assert` que la versión anterior corría
 * dentro de un `useEffect`.
 *
 * El problema de aquel enfoque no era solo el lugar. `console.assert` no rompe
 * nada: imprime en la consola y sigue. Un JSON-LD malformado se publicaba en
 * silencio y nadie se enteraba. Además, la detección de entorno usaba
 * `process.env.NODE_ENV`, que en un bundle de Vite no existe en el navegador,
 * así que las comprobaciones acababan ejecutándose también en producción.
 *
 * Aquí sí fallan y detienen el pipeline.
 */

describe("consistencia de precios", () => {
  it("el precio regular de cada combo es la suma real de sus platillos", () => {
    for (const combo of combos) {
      const expected = combo.lines.reduce(
        (total, line) => total + findMenuItem(line.itemId).price * line.qty,
        0
      );
      expect(combo.regular, `${combo.name} no cuadra con el menú`).toBe(expected);
    }
  });

  it("ningún combo tiene precio promocional mayor o igual al regular", () => {
    for (const combo of combos) {
      expect(combo.promo, `${combo.name} no representa un ahorro`).toBeLessThan(
        combo.regular
      );
    }
  });

  it("conviene siempre el combo más grande (sin arbitraje entre paquetes)", () => {
    // Si dos Combo Pareja salieran más baratos que un Familiar, la escalera de
    // precios estaría rota y el cliente aprendería a no comprar el paquete
    // grande. Se compara el precio por torta de cada escalón.
    const porTorta = combos
      .map((combo) => {
        const tortas = combo.lines.find((l) => l.itemId === "torta-ahogada")?.qty ?? 0;
        return { name: combo.name, tortas, unit: combo.promo / tortas };
      })
      .sort((a, b) => a.tortas - b.tortas);

    for (let i = 1; i < porTorta.length; i++) {
      expect(
        porTorta[i].unit,
        `${porTorta[i].name} cuesta más por torta que ${porTorta[i - 1].name}`
      ).toBeLessThanOrEqual(porTorta[i - 1].unit);
    }
  });

  it("el precio por persona baja conforme crece el paquete", () => {
    // La página anuncia cuál es "el más rendidor" y muestra el precio por
    // persona en cada tarjeta. Si un paquete grande saliera más caro por cabeza
    // que uno chico, esa promesa sería falsa y estaría a la vista, comparable de
    // un vistazo entre las cuatro tarjetas.
    const escalera = [...combos].sort((a, b) => a.servesCount - b.servesCount);

    for (let i = 1; i < escalera.length; i++) {
      expect(
        escalera[i].perPerson,
        `${escalera[i].name} sale más caro por persona que ${escalera[i - 1].name}`
      ).toBeLessThanOrEqual(escalera[i - 1].perPerson);
    }
  });

  it("el paquete anunciado como más rendidor lo es de verdad", () => {
    const minimo = Math.min(...combos.map((c) => c.perPerson));
    expect(comboMasRendidor.perPerson).toBe(minimo);
  });

  it("el precio por persona y las piezas se derivan del paquete", () => {
    for (const combo of combos) {
      expect(combo.perPerson).toBe(Math.round(combo.promo / combo.servesCount));
      expect(combo.pieces).toBe(combo.lines.reduce((t, l) => t + l.qty, 0));
      expect(combo.serves).toBe(`${combo.servesCount} personas`);
    }
  });

  it("todos los precios del menú son enteros positivos", () => {
    for (const item of allMenuItems) {
      expect(item.price, `${item.name} tiene un precio inválido`).toBeGreaterThan(0);
      expect(Number.isInteger(item.price), `${item.name} tiene decimales`).toBe(true);
    }
  });

  it("no hay identificadores de platillo duplicados", () => {
    const ids = allMenuItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("datos estructurados", () => {
  const data = graph(restaurantNode(), websiteNode(), menuNode(), faqNode()) as {
    "@context": string;
    "@graph": Array<Record<string, unknown>>;
  };

  it("declara el contexto de schema.org", () => {
    expect(data["@context"]).toBe("https://schema.org");
  });

  it("el restaurante incluye teléfono, dirección y coordenadas", () => {
    const restaurant = data["@graph"].find((n) => n["@type"] === "Restaurant");
    expect(restaurant).toBeDefined();

    // El teléfono faltaba por completo en la versión anterior.
    expect(restaurant!.telephone).toBe(business.phone.e164);
    expect(restaurant!.address).toMatchObject({
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    });
    expect(restaurant!.geo).toMatchObject({
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    });
  });

  it("no publica calificaciones inventadas", () => {
    const restaurant = data["@graph"].find((n) => n["@type"] === "Restaurant");
    // Publicar `aggregateRating` sin reseñas reales viola las políticas de
    // Google y puede derivar en una acción manual sobre el dominio.
    expect(restaurant!.aggregateRating).toBeUndefined();
    expect(restaurant!.review).toBeUndefined();
  });

  it("no quedan URLs de ejemplo ni anclas relativas", () => {
    const serialized = JSON.stringify(data);

    // La versión anterior publicaba `url: "https://example.com"` y enlaces como
    // `"#paquetes"`, que schema.org exige absolutos.
    expect(serialized).not.toContain("example.com");
    expect(serialized).not.toMatch(/"(url|item|hasMap|menu)":\s*"#/);
  });

  it("el horario excluye los días de descanso", () => {
    // Se deriva del horario en vez de fijar el número de días a mano: publicar
    // como abierto un día en que se descansa manda gente al local para nada, y
    // Google lo muestra en la ficha del negocio.
    const EN_INGLES: Record<string, string> = {
      Lunes: "Monday",
      Martes: "Tuesday",
      Miércoles: "Wednesday",
      Jueves: "Thursday",
      Viernes: "Friday",
      Sábado: "Saturday",
      Domingo: "Sunday",
    };

    const restaurant = data["@graph"].find((n) => n["@type"] === "Restaurant");
    const spec = (restaurant!.openingHoursSpecification as Array<Record<string, unknown>>)[0];
    const days = spec.dayOfWeek as string[];

    expect(days).toHaveLength(7 - business.hours.closedDays.length);

    for (const cerrado of business.hours.closedDays) {
      const ingles = EN_INGLES[cerrado];
      expect(ingles, `"${cerrado}" no está en la tabla de días`).toBeDefined();
      expect(
        days.some((d) => d.endsWith(`/${ingles}`)),
        `el horario publica ${cerrado} como día abierto`
      ).toBe(false);
    }

    // Y al revés: el texto visible tampoco debe anunciar un día de descanso.
    for (const cerrado of business.hours.closedDays) {
      expect(business.hours.openDaysEs.toLowerCase()).not.toContain(cerrado.toLowerCase());
      expect(business.hours.closedNote.toLowerCase()).toContain(cerrado.toLowerCase());
    }
  });

  it("el menú estructurado incluye todos los platillos con su precio", () => {
    const menuGraph = data["@graph"].find((n) => n["@type"] === "Menu");
    const sections = menuGraph!.hasMenuSection as Array<Record<string, unknown>>;
    const items = sections.flatMap(
      (s) => s.hasMenuItem as Array<Record<string, unknown>>
    );

    expect(items).toHaveLength(allMenuItems.length);

    for (const item of items) {
      const offer = item.offers as Record<string, unknown>;
      expect(offer.priceCurrency).toBe("MXN");
      expect(typeof offer.price).toBe("number");
    }
  });

  it("el FAQ estructurado coincide con el visible", () => {
    const faqGraph = data["@graph"].find((n) => n["@type"] === "FAQPage");
    const questions = faqGraph!.mainEntity as Array<Record<string, unknown>>;

    // Si el texto del JSON-LD no coincide con el de la página, Google lo trata
    // como contenido oculto y puede ignorar o penalizar el marcado.
    expect(questions).toHaveLength(faq.length);
    questions.forEach((question, index) => {
      expect(question.name).toBe(faq[index].q);
      expect((question.acceptedAnswer as Record<string, unknown>).text).toBe(
        faq[index].a
      );
    });
  });

  it("el @id del FAQ apunta a la página donde las preguntas se ven", () => {
    // Estuvo fijo en /preguntas-frecuentes#faq, una ruta que no existe en el
    // sitio. Google comprueba que el FAQPage corresponda a contenido visible en
    // esa URL y, al no encontrarla, descarta el bloque completo.
    for (const page of indexablePages) {
      const node = faqNode({ path: page.path, items: faq.slice(0, 2) });
      // La portada queda como ".mx/#faq": misma forma que los demás @id del
      // grafo (ver `ID.restaurant`), y para una URL la barra final es
      // equivalente a omitirla.
      expect(node["@id"]).toBe(`${SITE_URL}${page.path}#faq`);
      expect(node.mainEntity).toHaveLength(2);
    }
  });

  it("cada pregunta se muestra en alguna página del sitio", () => {
    // Una pregunta sin `featured` ni `topics` solo existiría en llms.txt: se
    // habría escrito para nada y ninguna página la respondería.
    const huerfanas = faq.filter((item) => !item.featured && !item.topics?.length);
    expect(huerfanas.map((i) => i.q)).toEqual([]);
  });

  it("los nodos del grafo se referencian entre sí por @id", () => {
    const restaurant = data["@graph"].find((n) => n["@type"] === "Restaurant");
    const menuGraph = data["@graph"].find((n) => n["@type"] === "Menu");

    expect(restaurant!.hasMenu).toEqual({ "@id": menuGraph!["@id"] });
  });
});

describe("consistencia NAP", () => {
  it("el teléfono está en formato E.164", () => {
    expect(business.phone.e164).toMatch(/^\+52\d{10}$/);
    expect(business.phone.telHref).toBe(`tel:${business.phone.e164}`);
  });

  it("el número mostrado y el marcable son el mismo", () => {
    // La versión anterior mostraba "+52 1 33 4754 3255" pero marcaba
    // "tel:+523347543255": el cliente que copiaba el número visible marcaba mal.
    const shown = business.phone.displayIntl.replace(/\D/g, "");
    const dialed = business.phone.e164.replace(/\D/g, "");
    expect(shown).toBe(dialed);
  });

  it("el enlace de WhatsApp usa los mismos dígitos que el teléfono", () => {
    const url = new URL(business.whatsapp());
    expect(url.pathname.replace(/\D/g, "")).toBe(business.phone.e164.replace(/\D/g, ""));
  });

  it("los enlaces de WhatsApp llevan mensaje precargado", () => {
    const url = new URL(business.whatsapp("Hola"));
    expect(url.searchParams.get("text")).toBe("Hola");
  });

  it("la dirección se arma con todos sus componentes", () => {
    expect(fullAddress).toContain(business.address.street);
    expect(fullAddress).toContain(business.address.neighborhood);
    expect(fullAddress).toContain(business.address.postalCode);
    expect(fullAddress).toContain(business.address.locality);
  });

  it("la cobertura de reparto menciona todas las colonias", () => {
    for (const area of business.serviceAreas) {
      expect(serviceAreasText).toContain(area);
    }
  });

  it("el sitio no quedó con el dominio de ejemplo en producción", () => {
    // Falla a propósito si alguien despliega sin configurar NEXT_PUBLIC_SITE_URL.
    expect(SITE_URL).toMatch(/^https:\/\//);
    expect(SITE_URL).not.toContain("example.com");
    expect(SITE_URL.endsWith("/")).toBe(false);
  });
});

describe("contenido para buscadores y modelos", () => {
  it("cada respuesta del FAQ es autónoma y sustancial", () => {
    for (const item of faq) {
      // Una respuesta muy corta no da contexto suficiente para ser citada.
      expect(item.a.length, `Respuesta demasiado corta: "${item.q}"`).toBeGreaterThan(60);
      expect(item.q.endsWith("?"), `La pregunta no es interrogativa: "${item.q}"`).toBe(
        true
      );
    }
  });

  it("no hay preguntas duplicadas en el FAQ", () => {
    const questions = faq.map((item) => item.q.toLowerCase());
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("cada enlace del menú apunta a una página que existe", () => {
    // El enlace de "Paquetes" apuntaba a /#paquetes, un ancla de la portada.
    // Funcionaba, pero obligaba a recargar la portada entera desde cualquier
    // página interior para bajar a una sección que también vive en /menu. Este
    // test cubre además el caso peor: un enlace del menú a una ruta borrada,
    // que sería un 404 repetido en todas las páginas del sitio.
    const rutas = new Set(sitePages.map((p) => p.path));

    for (const link of navLinks) {
      const [ruta] = link.href.split("#");
      // Un href que es solo ancla ("#faq") apunta a la página actual.
      if (ruta === "") continue;
      expect(rutas.has(ruta), `"${link.label}" apunta a ${link.href}, que no existe`).toBe(
        true
      );
    }
  });

  it("los paquetes viven en una página real del sitio", () => {
    const [ruta, ancla] = PAQUETES_PATH.split("#");
    expect(sitePages.some((p) => p.path === ruta)).toBe(true);
    expect(ancla).toBe("paquetes");
  });

  it("el sitemap no tiene rutas repetidas y todas empiezan con /", () => {
    const paths = sitePages.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) {
      expect(path.startsWith("/")).toBe(true);
    }
  });

  it("el sitemap excluye las páginas marcadas como no indexables", () => {
    // Anunciar en el sitemap una página que además lleva `noindex` son dos
    // señales contradictorias, y Search Console lo reporta como error.
    const noIndex = sitePages.filter((page) => !page.index).map((p) => p.path);
    const enSitemap = indexablePages.map((page) => page.path);

    expect(noIndex.length).toBeGreaterThan(0);
    for (const path of noIndex) {
      expect(enSitemap, `${path} no debería estar en el sitemap`).not.toContain(path);
    }
  });

  it("la portada tiene la prioridad más alta del sitemap", () => {
    const home = indexablePages.find((page) => page.path === "/");
    expect(home).toBeDefined();
    for (const page of indexablePages) {
      expect(page.priority).toBeLessThanOrEqual(home!.priority);
    }
  });

  it("no quedan notas de desarrollo en el texto visible del negocio", () => {
    // La versión anterior mostraba al cliente cosas como "solo actualiza el
    // arreglo menuSections" y "en este preview el mapa está desactivado".
    const visible = [
      business.description,
      serviceAreasText,
      ...faq.flatMap((item) => [item.q, item.a]),
    ].join(" ");

    // Cada marcador se busca como palabra completa. "TODO" va sensible a
    // mayúsculas: en minúsculas es una palabra ordinaria del español y en un
    // texto en este idioma daría falsos positivos constantes.
    const leaks: Array<{ pattern: RegExp; label: string }> = [
      { pattern: /\bpreview\b/i, label: "preview" },
      { pattern: /\barreglo\b/i, label: "arreglo (referencia a código)" },
      { pattern: /\bTODO\b/, label: "TODO" },
      { pattern: /\bFIXME\b/, label: "FIXME" },
      { pattern: /\blocalhost\b/i, label: "localhost" },
      { pattern: /\bplaceholder\b/i, label: "placeholder" },
      { pattern: /\bmenuSections\b/, label: "menuSections" },
      { pattern: /\blorem ipsum\b/i, label: "lorem ipsum" },
    ];

    for (const leak of leaks) {
      expect(
        leak.pattern.test(visible),
        `El texto visible contiene una nota de desarrollo: ${leak.label}`
      ).toBe(false);
    }
  });
});
