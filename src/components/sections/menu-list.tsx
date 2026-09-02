import { formatPrice, menu, type MenuSection } from "@/data/menu";

/**
 * Lista del menú.
 *
 * Cada platillo es un `<article>` con su encabezado y su precio en texto plano.
 * Eso importa más de lo que parece: un precio dentro de una imagen es invisible
 * para buscadores y para modelos. Aquí "Torta ahogada — $75" es texto
 * rastreable, y el mismo dato sale además en JSON-LD como `MenuItem` con su
 * `Offer`.
 *
 * El precio usa la forma de etiqueta colgante (`.price-tag`), que es el
 * lenguaje visual de un puesto de comida, no de una tabla de datos.
 */

type MenuListProps = {
  sections?: MenuSection[];
  /** Nivel del título de sección, para respetar la jerarquía de la página. */
  headingLevel?: "h2" | "h3";
};

export function MenuList({ sections = menu, headingLevel = "h3" }: MenuListProps) {
  const SectionHeading = headingLevel;
  const ItemHeading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-28 rounded-3xl border-2 border-ink bg-white shadow-stamp"
        >
          {/* Cabecera de la sección, en banda dorada como un rótulo de menú. */}
          <div className="rounded-t-[1.4rem] border-b-2 border-ink bg-gold px-6 py-4">
            <SectionHeading className="text-2xl text-ink">{section.title}</SectionHeading>
            {section.subtitle && (
              <p className="mt-0.5 text-sm font-bold uppercase tracking-wide text-chile">
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="p-6">
            {section.description && (
              <p className="mb-5 text-sm leading-relaxed text-ink/70">
                {section.description}
              </p>
            )}

            <ul className="grid gap-4">
              {section.items.map((item) => (
                <li key={item.id}>
                  <article className="flex items-start justify-between gap-4 border-b border-dashed border-ink/20 pb-4 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <ItemHeading className="font-sans text-base font-extrabold leading-snug">
                        {item.name}
                        {item.serving && (
                          <span className="ml-2 text-sm font-semibold text-ink/50">
                            {item.serving}
                          </span>
                        )}
                        {item.popular && (
                          <span className="ml-2 inline-block rounded-full border border-ink bg-chile px-2 py-0.5 align-middle text-[10px] font-extrabold uppercase tracking-wide text-cream">
                            El más pedido
                          </span>
                        )}
                      </ItemHeading>

                      {item.description && (
                        <p className="mt-1 text-sm leading-snug text-ink/70">
                          {item.description}
                        </p>
                      )}

                      {item.options && (
                        <p className="mt-1.5 text-sm text-ink/60">
                          <span className="font-bold">A elegir:</span>{" "}
                          {item.options.join(" · ")}
                        </p>
                      )}
                    </div>

                    <p className="price-tag shrink-0 bg-brand-green-dark py-1.5 pr-3.5 font-display text-base text-white">
                      {formatPrice(item.price)}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
