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
 * Nota sobre "use client": en el App Router, un componente cliente igual se
 * renderiza en el servidor en la primera carga, así que los enlaces salen en el
 * HTML y los crawlers los ven. La directiva solo habilita la interactividad.
 *
 * Se usa `next/link` en vez de `<a>` para la navegación interna: Next precarga
 * la página al pasar el cursor, lo que mejora el LCP de la segunda página.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Cerrar con Escape: comportamiento esperado de cualquier menú desplegable.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-ink/10 bg-white/95 backdrop-blur">
      <div className="h-1 w-full bg-brand-red" />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label={`${business.name} — inicio`}>
          <BrandLogo size={56} priority />
          <span className="leading-tight">
            <span className="block text-xs font-semibold text-brand-ink/70 sm:text-sm">
              Tortas Ahogadas
            </span>
            <span className="block text-lg font-black tracking-tight sm:text-xl">
              Don Eddy
            </span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.title}
              className="text-sm font-medium text-brand-ink/75 transition-colors hover:text-brand-red-dark"
            >
              {link.label}
            </Link>
          ))}
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
            Pedir por WhatsApp
          </OrderLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border-2 border-brand-ink/15 bg-white p-2.5 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          // El estado del menú debe anunciarse; la versión anterior tenía la
          // etiqueta fija en "Abrir menú" incluso estando abierto.
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        >
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div id="menu-movil" className="border-t border-brand-ink/10 bg-white lg:hidden">
          <nav aria-label="Navegación móvil" className="mx-auto max-w-6xl px-4 py-3">
            <ul className="grid gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-brand-ink/85 hover:bg-brand-gold-soft"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <span className="block text-xs font-normal text-brand-ink/55">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-3 grid grid-cols-2 gap-2">
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
