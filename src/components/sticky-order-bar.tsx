"use client";

import { MessageCircle, Phone } from "lucide-react";

import { OrderLink } from "@/components/order-link";
import { business, waMessages } from "@/data/business";

/**
 * Barra fija de pedido en móvil.
 *
 * La mayor parte del tráfico de un negocio local llega desde un celular, con
 * intención inmediata ("tengo hambre ahorita"). En la versión anterior la
 * sección de domicilio era la sexta de ocho, así que el usuario tenía que
 * recorrer toda la página para encontrar cómo pedir.
 *
 * Con esta barra la acción está siempre a un toque. Se oculta en escritorio,
 * donde el encabezado fijo ya cumple esa función.
 */
export function StickyOrderBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-cream/97 p-2.5 shadow-[0_-6px_24px_rgba(31,16,12,0.14)] backdrop-blur md:hidden"
      // La barra duplica acciones que ya existen en el contenido, así que se
      // oculta a los lectores de pantalla para no repetir los mismos enlaces.
      aria-hidden="true"
    >
      <div className="flex gap-2">
        <OrderLink
          href={business.whatsapp(waMessages.general)}
          channel="whatsapp"
          location="barra_movil"
          className="flex-1"
          size="lg"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Pedir ahora
        </OrderLink>

        <OrderLink
          href={business.phone.telHref}
          channel="telefono"
          location="barra_movil"
          variant="gold"
          size="lg"
          className="px-5"
          ariaLabel="Llamar por teléfono"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </OrderLink>
      </div>
    </div>
  );
}
