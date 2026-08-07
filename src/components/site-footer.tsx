import { Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { InstagramIcon } from "@/components/icons/instagram";
import { PapelPicado } from "@/components/ornaments";
import { business, fullAddress, serviceAreasText } from "@/data/business";
import { navLinks } from "@/data/nav";

/**
 * Pie de página.
 *
 * Cumple dos funciones de SEO además de la evidente:
 *
 *  1. Repite el bloque NAP (nombre, dirección, teléfono) en TODAS las páginas
 *     con exactamente el mismo formato. La consistencia NAP entre el sitio, la
 *     ficha de Google Business Profile y los directorios es de los factores más
 *     pesados del posicionamiento local.
 *  2. Enlaza cada página interna desde cualquier punto del sitio, así el
 *     rastreador llega a todas en un solo salto.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-auto bg-chile text-cream">
      <PapelPicado flip color="var(--color-cream)" className="-mt-px" />
      <span aria-hidden="true" className="grain absolute inset-0" />

      {/* pb extra en móvil para que la barra fija de pedido no tape el contenido */}
      <div className="relative shell pb-28 pt-10 md:pb-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo size={56} />
              <span>
                <span className="block font-display text-xl leading-tight">
                  {business.name}
                </span>
                <span className="block text-sm text-gold">
                  Tradición, sabor y calidad
                  {business.founded ? ` desde ${business.founded}` : ""}
                </span>
              </span>
            </div>

            <address className="mt-6 grid gap-3 text-sm not-italic text-cream/85">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href={business.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold hover:underline"
                >
                  {fullAddress}
                </a>
              </span>

              <span className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href={business.phone.telHref}
                  className="hover:text-gold hover:underline"
                >
                  {business.phone.displayIntl}
                </a>
              </span>

              <span className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  {business.hours.range}
                  <br />
                  <span className="text-cream/65">{business.hours.openDaysEs}</span>
                  <br />
                  <strong className="font-bold text-gold">
                    {business.hours.closedNote}
                  </strong>
                </span>
              </span>

              <span className="flex items-start gap-2.5">
                <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={business.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold hover:underline"
                >
                  {business.links.instagramHandle}
                </a>
              </span>
            </address>
          </div>

          <nav aria-label="Mapa del sitio">
            <h2 className="font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-gold">
              Secciones
            </h2>
            <ul className="mt-5 grid gap-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/85 hover:text-gold hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-gold">
              Encuéntranos en
            </h2>
            {/*
              Marcas denominativas en texto, no los logotipos oficiales: evita
              usar material con marca registrada y además es texto rastreable,
              que aporta más que una imagen para "tortas ahogadas en Rappi".
            */}
            <ul className="mt-5 flex flex-wrap gap-3">
              <li>
                <a
                  href={business.links.rappi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border-2 border-cream/45 px-5 py-2 font-display text-base transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  Rappi
                </a>
              </li>
              <li>
                <a
                  href={business.links.uberEats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border-2 border-cream/45 px-5 py-2 font-display text-base transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  Uber Eats
                </a>
              </li>
            </ul>

            <h2 className="mt-8 font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-gold">
              Llevamos a domicilio
            </h2>
            <p className="mt-4 text-sm text-cream/85">{serviceAreasText}.</p>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <li>
                <Link href="/privacidad" className="text-cream/65 hover:text-gold hover:underline">
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-cream/65 hover:text-gold hover:underline">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-cream/20 pt-6 text-xs text-cream/60">
          © {year} {business.name}. Tortas ahogadas en {business.address.neighborhood},{" "}
          {business.address.locality}, {business.address.region}.
        </p>
      </div>
    </footer>
  );
}
