import { MessageCircle, Phone, ShoppingBag } from "lucide-react";

import { OrderLink } from "@/components/order-link";
import { business, serviceAreasText, waMessages } from "@/data/business";

/**
 * Cómo pedir.
 *
 * Dos cambios de fondo respecto a la versión anterior:
 *
 *  1. Jerarquía. Antes el CTA de pedir era el terciario (estilo contorno) y los
 *     botones sólidos se los llevaban "Ver menú" y "Ver mapa". Si el objetivo
 *     de la página es que pidan, el botón de pedir es el que debe dominar.
 *  2. Orden de canales. WhatsApp y teléfono van primero porque no pagan
 *     comisión; Rappi y Uber Eats después. Cada pedido que se mueve de una
 *     plataforma al canal directo conserva el margen completo.
 */
export function Delivery() {
  return (
    <section id="domicilio" className="border-y border-brand-gold/40 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm font-black uppercase tracking-widest text-brand-red-dark">
          A domicilio
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
          Pide tortas ahogadas a domicilio en {business.address.locality}
        </h2>
        <p data-speakable className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink/75">
          Entregamos a domicilio en {serviceAreasText}. Puedes pedir por WhatsApp al{" "}
          {business.phone.displayIntl}, por teléfono al mismo número, o desde Rappi y
          Uber Eats. Servimos de {business.hours.range}, {business.hours.closedNote}.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <OrderChannel
            icon={<MessageCircle className="h-6 w-6" aria-hidden="true" />}
            title="WhatsApp"
            detail="La forma más rápida. Te contestamos con el pedido ya escrito."
            badge="Sin comisión"
            href={business.whatsapp(waMessages.delivery())}
            channel="whatsapp"
          />
          <OrderChannel
            icon={<Phone className="h-6 w-6" aria-hidden="true" />}
            title={`Llamar al ${business.phone.display}`}
            detail="Si prefieres explicar tu pedido de viva voz."
            badge="Sin comisión"
            href={business.phone.telHref}
            channel="telefono"
          />
          <OrderChannel
            icon={<ShoppingBag className="h-6 w-6" aria-hidden="true" />}
            title="Rappi"
            detail="Pago en la app y seguimiento del repartidor."
            href={business.links.rappi}
            channel="rappi"
            secondary
          />
          <OrderChannel
            icon={<ShoppingBag className="h-6 w-6" aria-hidden="true" />}
            title="Uber Eats"
            detail="Pago en la app y seguimiento del repartidor."
            href={business.links.uberEats}
            channel="uber_eats"
            secondary
          />
        </div>
      </div>
    </section>
  );
}

function OrderChannel({
  icon,
  title,
  detail,
  badge,
  href,
  channel,
  secondary = false,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  badge?: string;
  href: string;
  channel: "whatsapp" | "telefono" | "rappi" | "uber_eats";
  secondary?: boolean;
}) {
  return (
    <article
      className={`flex flex-col rounded-3xl border-2 p-6 ${
        secondary ? "border-brand-gold bg-white" : "border-brand-gold bg-brand-gold-soft"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-brand-red-dark">{icon}</span>
        {badge && (
          <span className="rounded-full bg-brand-green-dark px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-black tracking-tight">{title}</h3>
      <p className="mt-1 grow text-sm leading-relaxed text-brand-ink/70">{detail}</p>

      <OrderLink
        href={href}
        channel={channel}
        location="seccion_domicilio"
        variant={secondary ? "outline" : "primary"}
        className="mt-5 w-full"
      >
        Pedir aquí
      </OrderLink>
    </article>
  );
}
