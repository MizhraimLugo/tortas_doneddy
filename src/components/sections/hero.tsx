import { Clock, MapPin, Star, Truck } from "lucide-react";
import Link from "next/link";

import { OrderLink } from "@/components/order-link";
import { business, fullAddress, serviceAreasText, waMessages } from "@/data/business";
import { findMenuItem, formatPrice } from "@/data/menu";

/**
 * Portada.
 *
 * El cambio de fondo respecto a la versión anterior es el H1. Antes decía
 * "TU PONES EL HAMBRE / NOSOTROS PONEMOS LAS TORTAS": un eslogan sin una sola
 * palabra clave. El H1 es la señal on-page más fuerte que tiene una página, y
 * estaba gastado en algo que nadie busca.
 *
 * Ahora el H1 contiene el producto ("tortas ahogadas"), la ciudad ("Zapopan") y
 * el diferenciador ("birote salado"). El eslogan se conserva como antetítulo,
 * que es donde funciona: refuerza marca sin costar posicionamiento.
 */
export function Hero() {
  const tortaPrice = formatPrice(findMenuItem("torta-ahogada").price);

  return (
    <section className="border-b border-brand-gold/40 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand-red-dark">
              {/* Acento corregido: en español la tilde se mantiene en mayúsculas. */}
              Tú pones el hambre, nosotros las tortas
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Tortas ahogadas en Zapopan,
              <span className="block text-brand-red-dark">hechas con birote salado</span>
            </h1>

            {/*
              `data-speakable` marca el párrafo que los asistentes de voz leen en
              voz alta cuando alguien pregunta por el negocio. Contiene los cinco
              datos que resuelven la consulta: qué, dónde, cuánto, cuándo y cómo.
            */}
            <p
              data-speakable
              className="mt-5 max-w-prose text-lg leading-relaxed text-brand-ink/75"
            >
              En {business.name} preparamos tortas ahogadas de pierna, buche, cuero y
              lengua desde {tortaPrice}, en {business.address.neighborhood},{" "}
              {business.address.locality}. Abrimos de {business.hours.range} y
              entregamos a domicilio en {serviceAreasText}.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <OrderLink
                href={business.whatsapp(waMessages.general)}
                channel="whatsapp"
                location="hero"
                size="lg"
              >
                Pedir por WhatsApp
              </OrderLink>

              <Link
                href="/menu"
                className="inline-flex h-13 items-center justify-center rounded-xl border-2 border-brand-gold bg-white px-6 text-base font-semibold text-brand-ink transition-colors hover:bg-brand-gold"
              >
                Ver menú y precios
              </Link>
            </div>

            <p className="mt-4 text-sm text-brand-ink/60">
              ¿Prefieres llamar?{" "}
              <a
                href={business.phone.telHref}
                className="font-semibold text-brand-red-dark underline underline-offset-2"
              >
                {business.phone.displayIntl}
              </a>
            </p>
          </div>

          {/* Datos clave: texto plano, extraíble por modelos y buscadores. */}
          <ul className="grid gap-3 sm:grid-cols-2">
            <HeroFact
              icon={<Clock className="h-5 w-5" aria-hidden="true" />}
              title="Horario"
              lines={[business.hours.range, business.hours.closedNote]}
            />
            <HeroFact
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              title="Dónde estamos"
              lines={[fullAddress]}
            />
            <HeroFact
              icon={<Truck className="h-5 w-5" aria-hidden="true" />}
              title="Entrega a domicilio"
              lines={[serviceAreasText]}
            />
            <HeroFact
              icon={<Star className="h-5 w-5" aria-hidden="true" />}
              title="Desde"
              lines={[
                `${tortaPrice} la torta ahogada`,
                `Combos desde ${formatPrice(165)} para 2 personas`,
              ]}
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function HeroFact({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <li className="rounded-2xl border-2 border-brand-gold bg-brand-gold-soft p-4">
      <span className="flex items-center gap-2 text-brand-red-dark">
        {icon}
        <span className="text-sm font-black uppercase tracking-wide">{title}</span>
      </span>
      {lines.map((line) => (
        <span key={line} className="mt-1.5 block text-sm text-brand-ink/80">
          {line}
        </span>
      ))}
    </li>
  );
}
