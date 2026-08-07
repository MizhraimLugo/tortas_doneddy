import { Check, PartyPopper } from "lucide-react";

import { OrderLink } from "@/components/order-link";
import { SectionHeading } from "@/components/ornaments";
import { business, waMessages } from "@/data/business";
import { combos } from "@/data/combos";
import { formatPrice } from "@/data/menu";

/**
 * Paquetes y promociones.
 *
 * Cada combo lleva su propio enlace de WhatsApp con el pedido ya redactado
 * ("Quiero pedir el Combo Familiar de la promoción de la página"). Un chat en
 * blanco obliga al cliente a componer el mensaje, y ahí se cae una parte de los
 * pedidos.
 *
 * El precio regular tachado se calcula desde el menú (ver `data/combos.ts`), no
 * se escribe a mano: así el descuento anunciado siempre corresponde a precios
 * que existen de verdad. Un "antes" inventado es, además de un bug, publicidad
 * engañosa.
 */
export function Combos() {
  const barato = Math.min(...combos.map((c) => c.promo));
  const caro = Math.max(...combos.map((c) => c.promo));

  return (
    <section id="paquetes" className="relative isolate bg-chile py-16 text-cream md:py-20">
      <span aria-hidden="true" className="grain absolute inset-0" />

      <div className="relative shell">
        <SectionHeading
          eyebrow="Paquetes y promociones"
          title="Combos para compartir"
          tone="cream"
          align="center"
          intro={`Cuatro paquetes con tortas ahogadas y tacos dorados, desde ${formatPrice(barato)} para dos personas hasta ${formatPrice(caro)} para dieciséis. Para la comida en familia, una reunión o un pedido de oficina.`}
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {combos.map((combo) => (
            <li key={combo.id}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-cream p-6 text-ink shadow-stamp-gold ${
                  combo.highlight ? "border-gold" : "border-ink"
                }`}
              >
                {combo.highlight && (
                  <p className="absolute right-0 top-0 flex items-center gap-1.5 rounded-bl-2xl border-b-2 border-l-2 border-ink bg-gold px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide">
                    <PartyPopper className="h-3.5 w-3.5" aria-hidden="true" />
                    El favorito
                  </p>
                )}

                <h3 className="pr-28 text-2xl text-chile">{combo.name}</h3>
                <p className="mt-1 text-sm font-bold uppercase tracking-wide text-ink/55">
                  Rinde para {combo.serves}
                </p>
                <p className="mt-2 text-sm text-ink/70">{combo.tagline}</p>

                <ul className="mt-5 grid gap-2 text-sm">
                  {combo.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark"
                        aria-hidden="true"
                      />
                      {line}
                    </li>
                  ))}
                </ul>

                {/* Precio: el tachado y el vigente, con el ahorro explícito. */}
                <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1 border-t-2 border-dashed border-ink/20 pt-5">
                  <span className="text-sm font-semibold text-ink/50">
                    De <span className="line-through">{formatPrice(combo.regular)}</span>
                  </span>
                  <span className="font-display text-4xl leading-none text-chile">
                    {formatPrice(combo.promo)}
                  </span>
                  <span className="rounded-full border-2 border-ink bg-brand-green-dark px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                    Ahorras {formatPrice(combo.savings)} · {combo.discountPct}%
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <OrderLink
                    href={business.whatsapp(waMessages.combo(combo.name))}
                    channel="whatsapp"
                    location={`combo_${combo.id}`}
                    value={combo.promo}
                  >
                    Pedir este
                  </OrderLink>
                  <OrderLink
                    href={business.phone.telHref}
                    channel="telefono"
                    location={`combo_${combo.id}`}
                    value={combo.promo}
                    variant="outline"
                  >
                    Llamar
                  </OrderLink>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-cream/70">
          Los precios de promoción aplican en pedidos directos por WhatsApp o teléfono.
          En Rappi y Uber Eats pueden variar por las comisiones de cada plataforma.
        </p>
      </div>
    </section>
  );
}
