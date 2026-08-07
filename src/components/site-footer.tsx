import { Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { InstagramIcon } from "@/components/icons/instagram";
import { business, fullAddress, serviceAreasText } from "@/data/business";
import { navLinks } from "@/data/nav";

/**
 * Pie de página.
 *
 * Cumple dos funciones de SEO además de la obvia:
 *
 *  1. Repite el bloque NAP (nombre, dirección, teléfono) en TODAS las páginas
 *     con exactamente el mismo formato. La consistencia NAP entre tu sitio,
 *     Google Business Profile y los directorios es de los factores más pesados
 *     del posicionamiento local.
 *  2. Enlaza cada página interna desde cualquier punto del sitio, lo que
 *     garantiza que el rastreador llegue a todas en un solo salto.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    // `pb-24` en móvil deja espacio para que la barra fija de pedido no tape
    // el contenido del pie.
    <footer className="border-t-2 border-brand-gold bg-white pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Bloque NAP, marcado con microdatos coherentes con el JSON-LD. */}
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo size={48} />
              <span>
                <span className="block font-black tracking-tight">{business.name}</span>
                <span className="block text-sm text-brand-ink/60">
                  {business.founded
                    ? `Desde ${business.founded} en ${business.address.locality}`
                    : `Tortas ahogadas en ${business.address.locality}`}
                </span>
              </span>
            </div>

            <address className="mt-5 grid gap-3 text-sm not-italic text-brand-ink/75">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-dark" aria-hidden="true" />
                <a
                  href={business.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {fullAddress}
                </a>
              </span>

              <span className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-dark" aria-hidden="true" />
                <a href={business.phone.telHref} className="hover:underline">
                  {business.phone.displayIntl}
                </a>
              </span>

              <span className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-dark" aria-hidden="true" />
                <span>
                  {business.hours.range}
                  <br />
                  <span className="text-brand-ink/60">{business.hours.openDaysEs}</span>
                  <br />
                  <strong className="font-semibold text-brand-red-dark">
                    {business.hours.closedNote}
                  </strong>
                </span>
              </span>

              <span className="flex items-start gap-2.5">
                <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-dark" />
                <a
                  href={business.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {business.links.instagramHandle}
                </a>
              </span>
            </address>
          </div>

          <nav aria-label="Mapa del sitio">
            <h2 className="text-sm font-black uppercase tracking-wide text-brand-ink/50">
              Secciones
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-ink/75 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-brand-ink/50">
              Entrega a domicilio
            </h2>
            <p className="mt-4 text-sm text-brand-ink/75">{serviceAreasText}.</p>

            <h2 className="mt-8 text-sm font-black uppercase tracking-wide text-brand-ink/50">
              Legal
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              <li>
                <Link href="/privacidad" className="text-brand-ink/75 hover:underline">
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-brand-ink/75 hover:underline">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-brand-ink/10 pt-6 text-xs text-brand-ink/55">
          © {year} {business.name}. Tortas ahogadas en {business.address.neighborhood},{" "}
          {business.address.locality}, {business.address.region}.
        </p>
      </div>
    </footer>
  );
}
