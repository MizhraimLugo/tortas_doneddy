import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, menu, type MenuSection } from "@/data/menu";

/**
 * Lista del menú.
 *
 * Cada platillo se marca como `<article>` con su `<h3>` y su precio en texto
 * plano. Esto importa: un precio dentro de una imagen es invisible para
 * buscadores y modelos. Aquí "Torta ahogada — $75" es texto rastreable, y el
 * mismo dato sale además en JSON-LD como `MenuItem` con su `Offer`.
 */

type MenuListProps = {
  /** Secciones a mostrar; por defecto, el menú completo. */
  sections?: MenuSection[];
  /** Nivel de encabezado del título de sección, para respetar la jerarquía. */
  headingLevel?: "h2" | "h3";
};

export function MenuList({ sections = menu, headingLevel = "h3" }: MenuListProps) {
  const SectionHeading = headingLevel;
  const ItemHeading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {sections.map((section) => (
        <Card key={section.id} id={section.id} className="scroll-mt-28">
          <CardContent className="p-6">
            <SectionHeading className="text-xl font-black tracking-tight">
              {section.title}
            </SectionHeading>

            {section.subtitle && (
              <p className="mt-0.5 text-sm font-semibold text-brand-ink/55">
                {section.subtitle}
              </p>
            )}

            {section.description && (
              <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">
                {section.description}
              </p>
            )}

            <ul className="mt-5 grid gap-3">
              {section.items.map((item) => (
                <li key={item.id}>
                  <article className="flex items-start justify-between gap-4 rounded-2xl border-2 border-brand-gold bg-brand-gold-soft px-4 py-3">
                    <div>
                      <ItemHeading className="font-bold">
                        {item.name}
                        {item.serving && (
                          <span className="ml-2 text-sm font-medium text-brand-ink/55">
                            {item.serving}
                          </span>
                        )}
                        {item.popular && (
                          <span className="ml-2 rounded-full bg-brand-red-dark px-2 py-0.5 align-middle text-[10px] font-black uppercase tracking-wide text-white">
                            El más pedido
                          </span>
                        )}
                      </ItemHeading>

                      {item.description && (
                        <p className="mt-1 text-sm leading-snug text-brand-ink/70">
                          {item.description}
                        </p>
                      )}

                      {item.options && (
                        <p className="mt-1.5 text-sm text-brand-ink/60">
                          <span className="font-semibold">A elegir:</span>{" "}
                          {item.options.join(" · ")}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 rounded-xl bg-brand-green-dark px-3 py-1.5 text-sm font-black text-white">
                      {formatPrice(item.price)}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
