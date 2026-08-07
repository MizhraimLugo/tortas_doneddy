import { ChevronDown } from "lucide-react";

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
 */

type FaqSectionProps = {
  items: FaqItem[];
  title?: string;
  intro?: string;
  /** `true` en la home, donde la sección está dentro de un contenedor propio. */
  compact?: boolean;
};

export function FaqSection({
  items,
  title = "Preguntas frecuentes",
  intro,
  compact = false,
}: FaqSectionProps) {
  return (
    <section id="faq" className={compact ? "" : "py-14 md:py-20"}>
      <div className="mx-auto max-w-4xl px-4">
        <p className="text-sm font-black uppercase tracking-widest text-brand-red-dark">
          Dudas comunes
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
        {intro && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink/75">
            {intro}
          </p>
        )}

        <div className="mt-8 grid gap-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border-2 border-brand-gold bg-white px-5 py-4 open:bg-brand-gold-soft"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4">
                <h3 className="text-base font-bold text-brand-ink">{item.q}</h3>
                <ChevronDown
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-dark transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-base leading-relaxed text-brand-ink/75">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
