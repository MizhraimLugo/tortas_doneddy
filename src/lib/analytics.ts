/**
 * Medición de conversión, agnóstica del proveedor.
 *
 * La versión anterior no medía nada: cuatro botones de Rappi, dos de Uber Eats,
 * varios de WhatsApp y de llamada, sin forma de saber cuál genera pedidos. Sin
 * este dato no se puede decidir dónde invertir ni qué CTA mover.
 *
 * Envía el evento a Google Analytics 4 (`gtag`) y a Google Tag Manager
 * (`dataLayer`) si están presentes. Si no hay ninguno, no hace nada y no falla.
 */

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Canales por los que un cliente puede pedir. */
export type OrderChannel =
  | "whatsapp"
  | "telefono"
  | "rappi"
  | "uber_eats"
  | "maps"
  | "instagram";

export type ConversionEvent = {
  channel: OrderChannel;
  /** Dónde estaba el botón: "hero", "combo_familiar", "barra_movil"... */
  location: string;
  /** Valor estimado en MXN, cuando aplica (por ejemplo el precio de un combo). */
  value?: number;
};

export function trackOrderIntent({ channel, location, value }: ConversionEvent): void {
  if (typeof window === "undefined") return;

  const payload: Record<string, unknown> = {
    event_category: "pedido",
    channel,
    location,
    ...(value !== undefined && { value, currency: "MXN" }),
  };

  // GA4 mide `generate_lead` como evento de conversión recomendado.
  window.gtag?.("event", "generate_lead", payload);

  window.dataLayer?.push({ event: "intencion_pedido", ...payload });
}
