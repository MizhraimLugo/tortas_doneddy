import { Check } from "lucide-react";

import { OrderLink } from "@/components/order-link";
import { Card, CardContent } from "@/components/ui/card";
import { business, waMessages } from "@/data/business";
import { combos } from "@/data/combos";
import { formatPrice } from "@/data/menu";

/**
 * Paquetes y promociones.
 *
 * Cada combo lleva su propio enlace de WhatsApp con el pedido ya escrito
 * ("Quiero pedir el Combo Familiar de la promoción de la página"). Un chat en
 * blanco obliga al cliente a redactar y ahí se cae una parte de los pedidos.
 *
 * El precio regular se calcula desde el menú (ver `data/combos.ts`), así que el
 * descuento anunciado siempre corresponde a precios reales.
 */
export function Combos() {
  return (
    <section id="paquetes" className="border-y border-brand-gold/40 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm font-black uppercase tracking-widest text-brand-red-dark">
          Paquetes
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
          Combos de tortas ahogadas para compartir
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink/75">
          Cuatro paquetes con tortas ahogadas y tacos dorados, desde{" "}
          {formatPrice(Math.min(...combos.map((c) => c.promo)))} para dos personas hasta{" "}
          {formatPrice(Math.max(...combos.map((c) => c.promo)))} para dieciséis. Ideales
          para la comida en familia, una reunión o un pedido de oficina.
        </p>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {combos.map((combo) => (
            <li key={combo.id}>
              <Card
                className={
                  combo.highlight
                    ? "h-full border-brand-red-dark bg-brand-gold-soft"
                    : "h-full bg-brand-gold-soft"
                }
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{combo.name}</h3>
                      <p className="mt-0.5 text-sm font-semibold text-brand-ink/60">
                        Rinde para {combo.serves}
                      </p>
                      <p className="mt-1 text-sm text-brand-ink/70">{combo.tagline}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm text-brand-ink/55">
                        <span className="line-through">{formatPrice(combo.regular)}</span>
                      </p>
                      <p className="mt-1 text-2xl font-black text-brand-red-dark">
                        {formatPrice(combo.promo)}
                      </p>
                      <p className="mt-1 inline-block rounded-lg bg-brand-green-dark px-2 py-0.5 text-xs font-black text-white">
                        {combo.discountPct}% menos
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 grid gap-2 text-sm text-brand-ink/80">
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

                  <p className="mt-3 text-sm font-semibold text-brand-green-dark">
                    Ahorras {formatPrice(combo.savings)}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 pt-1">
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
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-brand-ink/60">
          Los precios de promoción aplican en pedidos directos por WhatsApp o teléfono.
          En Rappi y Uber Eats pueden variar por las comisiones de cada plataforma.
        </p>
      </div>
    </section>
  );
}
