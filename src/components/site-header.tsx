"use client";

import { Menu as MenuIcon, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { OrderLink } from "@/components/order-link";
import { business, waMessages } from "@/data/business";
import { navLinks } from "@/data/nav";

/**
 * Encabezado del sitio.
 *
 * Sobre "use client": en el App Router un componente cliente igual se renderiza
 * en el servidor en la primera carga, así que los enlaces salen en el HTML y
 * los crawlers los ven. La directiva solo habilita la interactividad.
 *
 * Se usa `next/link` para la navegación interna: Next precarga la página al
 * pasar el cursor, lo que mejora el LCP de la segunda página que visite el
 * usuario.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Cerrar con Escape: comportamiento esperado de cualquier menú desplegable y
  // requisito de accesibilidad para contenido que se superpone.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${business.name} — inicio`}
        >
          <BrandLogo size={54} priority />
          <span className="leading-none">
            <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-brand-red-dark">
              Tortas Ahogadas
            </span>
            <span className="mt-1 block font-display text-xl tracking-tight sm:text-2xl">
              Don Eddy
            </span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={link.title}
                  className="text-xs font-extrabold uppercase tracking-wide text-ink/75 transition-colors hover:text-chile"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <OrderLink
            href={business.phone.telHref}
            channel="telefono"
            location="header"
            variant="outline"
            ariaLabel={`Llamar al ${business.phone.displayIntl}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {business.phone.display}
          </OrderLink>

          <OrderLink
            href={business.whatsapp(waMessages.general)}
            channel="whatsapp"
            location="header"
          >
            WhatsApp
          </OrderLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border-2 border-ink bg-white p-2.5 shadow-stamp active:translate-x-[3px] active:translate-y-[3px] active:shadow-none xl:hidden"
          onClick={() => setOpen((value) => !value)}
          // El estado debe anunciarse: la versión original tenía la etiqueta
          // fija en "Abrir menú" incluso estando el menú abierto.
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div id="menu-movil" className="border-t-2 border-ink bg-white xl:hidden">
          <nav aria-label="Navegación móvil" className="mx-auto max-w-6xl px-4 py-4">
            <ul className="grid gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 hover:bg-gold-soft"
                    onClick={() => setOpen(false)}
                  >
                    <span className="block text-sm font-extrabold uppercase tracking-wide">
                      {link.label}
                    </span>
                    <span className="block text-xs text-ink/55">{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <OrderLink
                href={business.phone.telHref}
                channel="telefono"
                location="menu_movil"
                variant="outline"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Llamar
              </OrderLink>
              <OrderLink
                href={business.whatsapp(waMessages.general)}
                channel="whatsapp"
                location="menu_movil"
              >
                WhatsApp
              </OrderLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
