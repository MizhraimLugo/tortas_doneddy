import { Plus } from "lucide-react";

import { SectionHeading } from "@/components/ornaments";
import type { FaqItem } from "@/data/faq";

/**
 * Preguntas frecuentes.
 *
 * Se usa `<details>`/`<summary>` nativo en vez de un acordeón con JavaScript.
 * Ventajas concretas para lo que buscamos:
 *
 *  - El contenido está en el HTML aunque el acordeón esté cerrado, así que los
 *    crawlers de IA lo leen completo sin ejecutar nada.
 *  - Funciona con teclado y con lectores de pantalla sin código extra.
 *  - No manda ni un byte de JavaScript al cliente.
 *
 * Cada pregunta es un `<h3>` real: los modelos usan la jerarquía de encabezados
 * para decidir qué fragmento responde a una consulta.
 *
 * A dos columnas se reparte por orden alterno (pares a la izquierda, impares a
 * la derecha) para que el orden de lectura visual coincida con el del DOM.
 */

type FaqSectionProps = {
  items: FaqItem[];
  title?: React.ReactNode;
  intro?: string;
  /** Dos columnas en escritorio, como en un menú impreso. */
  columns?: 1 | 2;
};

export function FaqSection({
  items,
  title = "Preguntas frecuentes",
  intro,
  columns = 2,
}: FaqSectionProps) {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeading eyebrow="Dudas comunes" title={title} intro={intro} align="center" />

      <div
        className={`mt-12 grid gap-4 ${columns === 2 ? "md:grid-cols-2 md:items-start" : "mx-auto max-w-3xl"}`}
      >
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border-2 border-ink bg-white px-5 py-4 shadow-stamp-gold open:bg-gold-soft"
          >
            <summary className="flex cursor-pointer items-start justify-between gap-4">
              <h3 className="font-sans text-base font-extrabold leading-snug">{item.q}</h3>
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-gold text-ink transition-transform duration-200 group-open:rotate-45"
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </summary>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
