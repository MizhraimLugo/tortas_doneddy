"use client";

import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { trackOrderIntent, type OrderChannel } from "@/lib/analytics";

/**
 * Enlace de pedido: un `<a>` real, no un `window.open`.
 *
 * La versión anterior abría cada destino con `window.open` dentro de un
 * `try/catch`. Eso tenía cuatro problemas:
 *
 *  1. Cuando un bloqueador de ventanas emergentes lo detiene, `window.open`
 *     devuelve `null` — no lanza excepción — así que el `catch` nunca corría y
 *     el usuario se quedaba sin nada al tocar "Pedir por WhatsApp".
 *  2. Los buscadores no ven un enlace: no hay `href` que rastrear, y los
 *     perfiles externos (Instagram, Google Maps) no cuentan como señal de
 *     entidad porque no existen como enlaces en el HTML.
 *  3. El usuario pierde clic derecho, clic central y "abrir en pestaña nueva".
 *  4. Un lector de pantalla anuncia "botón" en vez de "enlace".
 *
 * Con un `<a href>` normal desaparecen los cuatro, y el `onClick` solo agrega la
 * medición: si el script de analítica falla, el enlace sigue funcionando.
 */

type OrderLinkProps = {
  href: string;
  channel: OrderChannel;
  /** Dónde vive este botón, para segmentar en analítica. */
  location: string;
  /** Valor estimado del pedido en MXN, si aplica. */
  value?: number;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Texto accesible cuando el contenido visible no basta. */
  ariaLabel?: string;
};

export function OrderLink({
  href,
  channel,
  location,
  value,
  children,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
}: OrderLinkProps) {
  // Los esquemas `tel:` y `mailto:` deben abrirse en la misma pestaña: en móvil
  // abren la app del sistema, y forzar `_blank` deja una pestaña en blanco.
  const isSameTab = href.startsWith("tel:") || href.startsWith("mailto:");

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={buttonClasses(variant, size, className)}
      onClick={() => trackOrderIntent({ channel, location, value })}
      {...(!isSameTab && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
