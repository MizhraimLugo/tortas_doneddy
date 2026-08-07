import { MessageCircle, Phone, ShoppingBag } from "lucide-react";

import { OrderLink } from "@/components/order-link";
import { SectionHeading } from "@/components/ornaments";
import { business, serviceAreasText, waMessages } from "@/data/business";

/**
 * Cómo pedir.
 *
 * Dos decisiones de fondo:
 *
 *  1. Jerarquía. En la versión original el botón de pedir era el terciario
 *     (estilo contorno) mientras "Ver menú" y "Ver mapa" se llevaban el color
 *     sólido. Si el objetivo de la página es que pidan, ese botón es el que
 *     debe dominar.
 *  2. Orden de canales. WhatsApp y teléfono van primero porque no pagan
 *     comisión; Rappi y Uber Eats después. Cada pedido que se mueve de una
 *     plataforma al canal directo conserva el margen completo.
 */
export function Delivery() {
  return (
    <section id="domicilio" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeading
        eyebrow="A domicilio"
        title={
          <>
            Te la llevamos
            <span className="block text-chile">calientita a tu casa</span>
          </>
        }
        align="center"
        intro={`Entregamos en ${serviceAreasText}. Servimos de ${business.hours.range}, ${business.hours.closedNote.toLowerCase()}.`}
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Channel
          icon={<MessageCircle className="h-7 w-7" aria-hidden="true" />}
          title="WhatsApp"
          detail="Lo más rápido. Al tocar aquí el mensaje ya va escrito."
          badge="Sin comisión"
          href={business.whatsapp(waMessages.delivery())}
          channel="whatsapp"
          featured
        />
        <Channel
          icon={<Phone className="h-7 w-7" aria-hidden="true" />}
          title={business.phone.display}
          detail="Si prefieres explicar tu pedido de viva voz."
          badge="Sin comisión"
          href={business.phone.telHref}
          channel="telefono"
          featured
        />
        <Channel
          icon={<ShoppingBag className="h-7 w-7" aria-hidden="true" />}
          title="Rappi"
          detail="Pago en la app y seguimiento del repartidor."
          href={business.links.rappi}
          channel="rappi"
        />
        <Channel
          icon={<ShoppingBag className="h-7 w-7" aria-hidden="true" />}
          title="Uber Eats"
          detail="Pago en la app y seguimiento del repartidor."
          href={business.links.uberEats}
          channel="uber_eats"
        />
      </ul>
    </section>
  );
}

function Channel({
  icon,
  title,
  detail,
  badge,
  href,
  channel,
  featured = false,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  badge?: string;
  href: string;
  channel: "whatsapp" | "telefono" | "rappi" | "uber_eats";
  featured?: boolean;
}) {
  return (
    <li>
      <article
        className={`flex h-full flex-col rounded-3xl border-2 border-ink p-6 shadow-stamp ${
          featured ? "bg-gold" : "bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-chile">{icon}</span>
          {badge && (
            <span className="rounded-full border-2 border-ink bg-brand-green-dark px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
              {badge}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-xl">{title}</h3>
        <p className="mt-1.5 grow text-sm leading-relaxed text-ink/70">{detail}</p>

        <OrderLink
          href={href}
          channel={channel}
          location="seccion_domicilio"
          variant={featured ? "primary" : "outline"}
          className="mt-5 w-full"
        >
          Pedir aquí
        </OrderLink>
      </article>
    </li>
  );
}
