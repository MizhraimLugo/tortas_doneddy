import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/data/business";
import { indexablePages } from "@/data/nav";

/**
 * Verifica los metadatos reales exportados por cada página.
 *
 * Estos límites no son estéticos. Google corta el título alrededor de los 60
 * caracteres y la descripción alrededor de los 160; lo que se pasa se sustituye
 * por puntos suspensivos, así que un llamado a la acción que quede fuera del
 * corte simplemente no existe para quien ve el resultado.
 */

// Se cargan igual que en producción: importando el módulo de cada página.
const PAGINAS = [
  { path: "/", mod: () => import("@/app/page") },
  { path: "/menu", mod: () => import("@/app/menu/page") },
  {
    path: "/tortas-ahogadas-a-domicilio-zapopan",
    mod: () => import("@/app/tortas-ahogadas-a-domicilio-zapopan/page"),
  },
  {
    path: "/que-es-una-torta-ahogada",
    mod: () => import("@/app/que-es-una-torta-ahogada/page"),
  },
  { path: "/privacidad", mod: () => import("@/app/privacidad/page") },
  { path: "/terminos", mod: () => import("@/app/terminos/page") },
];

/** Sufijo que la plantilla del layout agrega a cada título. */
const SUFIJO = " | Don Eddy Zapopan";

async function metadataDe(entry: (typeof PAGINAS)[number]) {
  const mod = await entry.mod();
  // `Metadata` de Next es un tipo cerrado sin índice de cadena; se pasa por
  // `unknown` para poder inspeccionar sus campos de forma genérica en el test.
  return mod.metadata as unknown as Record<string, unknown>;
}

describe("metadatos de cada página", () => {
  it.each(PAGINAS)("$path tiene título dentro del límite visible", async (entry) => {
    const metadata = await metadataDe(entry);
    const raw = metadata.title;

    // El título puede ser una cadena (usa la plantilla) o {absolute} (no la usa).
    const rendered =
      typeof raw === "string"
        ? raw + SUFIJO
        : (raw as { absolute: string }).absolute;

    expect(rendered.length, `Título demasiado largo: "${rendered}"`).toBeLessThanOrEqual(
      65
    );
    expect(rendered.length).toBeGreaterThan(15);
  });

  it.each(PAGINAS)("$path tiene descripción del largo adecuado", async (entry) => {
    const metadata = await metadataDe(entry);
    const description = metadata.description as string;

    expect(description).toBeTruthy();
    // Menos de 110 desaprovecha el espacio del resultado; más de 160 se corta.
    expect(
      description.length,
      `Descripción de ${entry.path}: ${description.length} caracteres`
    ).toBeGreaterThanOrEqual(110);
    expect(
      description.length,
      `Descripción de ${entry.path}: ${description.length} caracteres`
    ).toBeLessThanOrEqual(165);
  });

  it.each(PAGINAS)("$path declara su URL canónica correcta", async (entry) => {
    const metadata = await metadataDe(entry);
    const canonical = (metadata.alternates as { canonical: string }).canonical;
    const esperado = entry.path === "/" ? SITE_URL : `${SITE_URL}${entry.path}`;

    expect(canonical).toBe(esperado);
  });

  it.each(PAGINAS)("$path declara imagen de vista previa", async (entry) => {
    const metadata = await metadataDe(entry);
    const og = metadata.openGraph as { images?: unknown[]; locale?: string };

    // Sin imagen, el enlace compartido en WhatsApp aparece sin tarjeta visual.
    expect(og.images, `${entry.path} no tiene og:image`).toBeDefined();
    expect(og.images!.length).toBeGreaterThan(0);
    expect(og.locale).toBe("es_MX");
  });

  it("todas las páginas indexables están cubiertas por estos tests", () => {
    // Evita que se agregue una página nueva sin verificar sus metadatos.
    const probadas = PAGINAS.map((p) => p.path);
    for (const page of indexablePages) {
      expect(probadas, `Falta probar ${page.path}`).toContain(page.path);
    }
  });

  it("las páginas legales no se indexan y el resto sí", async () => {
    for (const entry of PAGINAS) {
      const metadata = await metadataDe(entry);
      const robots = metadata.robots as { index: boolean } | undefined;
      const deberiaIndexarse = indexablePages.some((p) => p.path === entry.path);

      if (deberiaIndexarse) {
        expect(robots?.index, `${entry.path} no debería llevar noindex`).not.toBe(false);
      } else {
        expect(robots?.index, `${entry.path} debería llevar noindex`).toBe(false);
      }
    }
  });
});
