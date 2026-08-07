import { Clock, MapPin, Sandwich, Truck } from "lucide-react";
import Link from "next/link";

import { FoodImage } from "@/components/food-image";
import { OrderLink } from "@/components/order-link";
import { PapelPicado } from "@/components/ornaments";
import { business, fullAddress, serviceAreasText, waMessages } from "@/data/business";
import { findMenuItem, formatPrice } from "@/data/menu";

/**
 * Portada.
 *
 * El eslogan manda visualmente, como en el diseño de referencia, pero el `h1`
 * abre con "Tortas ahogadas en Zapopan". El `h1` es la señal on-page más fuerte
 * de una página y en la versión original estaba gastado íntegramente en una
 * frase que nadie busca; así se conservan las dos cosas: la marca para quien
 * llega, y la palabra clave para quien todavía no.
 */
export function Hero() {
  const tortaPrice = formatPrice(findMenuItem("torta-ahogada").price);

  return (
    <section className="relative isolate bg-chile text-cream">
      <span aria-hidden="true" className="grain absolute inset-0" />

      {/*
        Entrada escalonada al cargar. Es el único momento de la página con
        movimiento, y a propósito: una secuencia bien orquestada en la primera
        impresión rinde más que micro-animaciones repartidas por todos lados.
        La regla `prefers-reduced-motion` de globals.css la anula por completo
        para quien la tenga activada.
      */}
      <div className="shell relative grid items-center gap-10 pb-16 pt-12 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <h1 className="text-[clamp(2.3rem,4.6vw,3.6rem)]">
            {/*
              Orden de lectura: primero la palabra clave, luego el eslogan.
              Visualmente domina el eslogan; para un buscador, el h1 empieza
              con "Tortas ahogadas en Zapopan".
            */}
            <span className="rise mb-4 block font-sans text-[0.3em] font-extrabold uppercase leading-tight tracking-[0.2em] text-gold">
              Tortas ahogadas en Zapopan · desde {business.founded}
            </span>
            <span className="rise block text-balance [animation-delay:90ms]">
              Tú pones el hambre,
            </span>
            <span className="rise block text-balance text-gold [animation-delay:180ms]">
              nosotros ponemos las tortas
            </span>
          </h1>

          <p
            data-speakable
            className="rise mt-6 max-w-xl text-lg leading-relaxed text-cream/90 [animation-delay:280ms]"
          >
            Tortas ahogadas de pierna, buche, cuero y lengua con birote salado y
            salsa de chile de árbol, desde {tortaPrice}, en{" "}
            {business.address.neighborhood}, {business.address.locality}. Abrimos de{" "}
            {business.hours.range} y llevamos a domicilio.
          </p>

          <div className="rise mt-8 flex flex-wrap gap-3 [animation-delay:380ms]">
            <OrderLink
              href={business.whatsapp(waMessages.general)}
              channel="whatsapp"
              location="hero"
              variant="onDark"
              size="lg"
            >
              Pedir ahora
            </OrderLink>

            <Link
              href="/menu"
              className="inline-flex h-13 items-center justify-center rounded-full border-2 border-cream/70 px-7 text-sm font-extrabold uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-chile"
            >
              Ver el menú
            </Link>
          </div>

          <div className="rise mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm [animation-delay:460ms]">
            <span className="font-semibold text-cream/70">También en</span>
            <OrderLink
              href={business.links.rappi}
              channel="rappi"
              location="hero"
              variant="onDarkOutline"
              size="sm"
            >
              Rappi
            </OrderLink>
            <OrderLink
              href={business.links.uberEats}
              channel="uber_eats"
              location="hero"
              variant="onDarkOutline"
              size="sm"
            >
              Uber Eats
            </OrderLink>
            <span className="text-cream/55">Promos pueden variar por plataforma</span>
          </div>
        </div>

        {/* Foto principal, ligeramente girada como una foto clavada al muro. */}
        <div className="rise relative mx-auto w-full max-w-sm [animation-delay:220ms] lg:max-w-md">
          <div className="rotate-[1.5deg] rounded-[2rem] border-4 border-gold bg-gold p-2 shadow-[10px_10px_0_0_var(--color-chile-deep)]">
            <FoodImage
              src="/brand/torta-ahogada-don-eddy.jpg"
              alt={`Torta ahogada de ${business.name} con birote salado, bañada en salsa de jitomate y chile de árbol`}
              aspect="4 / 3"
              priority
              className="rounded-[1.5rem]"
              fallbackIcon={<Sandwich className="h-20 w-20" aria-hidden="true" />}
            />
          </div>

          <p className="mt-6 text-center font-display text-lg text-gold">
            Tradición, sabor y calidad
            {business.founded ? ` desde ${business.founded}` : ""}
          </p>
        </div>
      </div>

      {/* Franja de datos clave: texto plano, fácil de extraer por un modelo. */}
      <div className="relative border-t border-cream/15">
        <ul className="mx-auto grid max-w-6xl gap-px px-4 py-6 sm:grid-cols-3">
          <HeroFact icon={<Clock className="h-5 w-5" aria-hidden="true" />} label="Horario">
            {business.hours.range} · {business.hours.closedNote}
          </HeroFact>
          <HeroFact icon={<MapPin className="h-5 w-5" aria-hidden="true" />} label="Dónde estamos">
            {fullAddress}
          </HeroFact>
          <HeroFact icon={<Truck className="h-5 w-5" aria-hidden="true" />} label="A domicilio">
            {serviceAreasText}
          </HeroFact>
        </ul>
      </div>

      <PapelPicado />
    </section>
  );
}

function HeroFact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 px-2 py-2">
      <span className="mt-0.5 shrink-0 text-gold">{icon}</span>
      <span>
        <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-gold">
          {label}
        </span>
        <span className="mt-1 block text-sm leading-snug text-cream/85">{children}</span>
      </span>
    </li>
  );
}
