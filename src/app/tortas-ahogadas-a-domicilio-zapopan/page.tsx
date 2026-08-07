import { MessageCircle, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { OrderLink } from "@/components/order-link";
import { business, fullAddress, serviceAreasText, waMessages } from "@/data/business";
import { combos } from "@/data/combos";
import { findMenuItem, formatPrice } from "@/data/menu";
import { breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * Página de entrega a domicilio.
 *
 * Ataca la consulta con mayor intención comercial del negocio: alguien que
 * escribe "tortas ahogadas a domicilio Zapopan" ya decidió que quiere comprar,
 * solo falta a quién. Es una consulta más específica y con menos competencia
 * que "tortas ahogadas", así que es más fácil de ganar.
 *
 * Cuidado importante: esto NO es una página puente ("doorway page"). Google
 * penaliza páginas casi idénticas creadas solo para capturar variantes de una
 * palabra clave. Esta aporta información que no está en la portada: el proceso
 * de pedido paso a paso, la cobertura colonia por colonia y la comparación
 * entre canales. Si más adelante duplicas esta página cambiando solo el nombre
 * de la colonia, sí caerías en esa penalización.
 */

const TRAIL = [
  { name: "Inicio", path: "/" },
  { name: "A domicilio en Zapopan", path: "/tortas-ahogadas-a-domicilio-zapopan" },
];

export const metadata = buildMetadata({
  path: "/tortas-ahogadas-a-domicilio-zapopan",
  title: "Tortas Ahogadas a Domicilio en Zapopan",
  description: `Entrega de tortas ahogadas a domicilio en La Cima, Real Valdepeñas y Lomas de Zapopan. Pide por WhatsApp al ${business.phone.display}. Abrimos de ${business.hours.range}.`,
  keywords: [
    "tortas ahogadas a domicilio Zapopan",
    "tortas ahogadas domicilio La Cima",
    "tortas ahogadas Real Valdepeñas",
    "comida a domicilio Lomas de Zapopan",
  ],
});

const PASOS = [
  {
    titulo: "Elige lo que quieres",
    detalle: `Revisa el menú y decide entre torta ahogada (${formatPrice(findMenuItem("torta-ahogada").price)}), de lengua (${formatPrice(findMenuItem("torta-ahogada-lengua").price)}), tacos dorados o un combo completo.`,
  },
  {
    titulo: "Mándanos el pedido",
    detalle: `Escríbenos por WhatsApp al ${business.phone.displayIntl} o llámanos al mismo número. Si abres el chat desde esta página, el mensaje ya va escrito.`,
  },
  {
    titulo: "Dinos tu dirección y qué tan picante",
    detalle:
      "Necesitamos tu calle, número y referencias. Aprovecha para decirnos qué tan ahogada y qué tan picante la quieres: la salsa de chile de árbol va aparte o encima, como prefieras.",
  },
  {
    titulo: "Te confirmamos y sale el pedido",
    detalle:
      "Te confirmamos el total y el tiempo aproximado por el mismo chat, y lo mandamos a tu domicilio.",
  },
];

export default function DomicilioPage() {
  const comboFamiliar = combos.find((c) => c.id === "familiar");

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <Breadcrumbs trail={TRAIL} />

        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
          Tortas ahogadas a domicilio en Zapopan
        </h1>

        <p data-speakable className="mt-4 text-lg leading-relaxed text-brand-ink/75">
          {business.name} entrega tortas ahogadas a domicilio en {serviceAreasText}.
          Pides por WhatsApp al {business.phone.displayIntl}, por teléfono al mismo
          número, o desde Rappi y Uber Eats. Servimos de {business.hours.range},{" "}
          {business.hours.openDaysEs.toLowerCase()}; {business.hours.closedNote.toLowerCase()}.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <OrderLink
            href={business.whatsapp(waMessages.delivery())}
            channel="whatsapp"
            location="domicilio_encabezado"
            size="lg"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Pedir por WhatsApp
          </OrderLink>
          <OrderLink
            href={business.phone.telHref}
            channel="telefono"
            location="domicilio_encabezado"
            variant="outline"
            size="lg"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {business.phone.display}
          </OrderLink>
        </div>

        {/* Cobertura: cada colonia como texto plano captura su búsqueda propia. */}
        <section className="mt-12">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">
            Colonias donde entregamos
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-ink/75">
            Salimos desde nuestro local en {fullAddress}, así que la entrega es más
            rápida en las colonias cercanas del norte de {business.address.locality}:
          </p>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {business.serviceAreas.map((area) => (
              <li
                key={area}
                className="rounded-2xl border-2 border-brand-gold bg-brand-gold-soft px-4 py-3"
              >
                <h3 className="font-bold">Tortas ahogadas en {area}</h3>
                <p className="mt-0.5 text-sm text-brand-ink/70">
                  Entrega a domicilio disponible en horario de servicio.
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-base text-brand-ink/75">
            ¿Tu colonia no aparece? Escríbenos por WhatsApp y te confirmamos si
            llegamos hasta allá.{" "}
            <OrderLink
              href={business.whatsapp(waMessages.delivery())}
              channel="whatsapp"
              location="domicilio_cobertura"
              variant="ghost"
              size="sm"
              className="px-1 underline"
            >
              Preguntar cobertura
            </OrderLink>
          </p>
        </section>

        {/* Proceso: contenido único que justifica esta página frente a la portada. */}
        <section className="mt-12">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">
            Cómo pedir, paso a paso
          </h2>

          <ol className="mt-5 grid gap-4">
            {PASOS.map((paso, index) => (
              <li key={paso.titulo} className="flex gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red-dark text-sm font-black text-white"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold">{paso.titulo}</h3>
                  <p className="mt-1 text-base leading-relaxed text-brand-ink/75">
                    {paso.detalle}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">
            Pedir directo o por aplicación
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-ink/75">
            Puedes pedirnos por los dos caminos, pero no cuestan lo mismo. Las
            aplicaciones cobran una comisión que se refleja en el precio final, así
            que los precios y las promociones de esta página aplican en pedidos
            directos.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-brand-green-dark bg-brand-gold-soft p-5">
              <h3 className="flex items-center gap-2 font-black">
                <MessageCircle className="h-5 w-5 text-brand-green-dark" aria-hidden="true" />
                Directo por WhatsApp o teléfono
              </h3>
              <ul className="mt-3 grid gap-1.5 text-sm text-brand-ink/75">
                <li>Precios y promociones de esta página</li>
                <li>Puedes pedir ajustes: menos salsa, sin picante, más carne</li>
                <li>Nos hablas directo, sin intermediario</li>
              </ul>
              <OrderLink
                href={business.whatsapp(waMessages.delivery())}
                channel="whatsapp"
                location="domicilio_comparativa"
                className="mt-4 w-full"
              >
                Pedir directo
              </OrderLink>
            </div>

            <div className="rounded-2xl border-2 border-brand-gold bg-white p-5">
              <h3 className="flex items-center gap-2 font-black">
                <ShoppingBag className="h-5 w-5 text-brand-red-dark" aria-hidden="true" />
                Rappi y Uber Eats
              </h3>
              <ul className="mt-3 grid gap-1.5 text-sm text-brand-ink/75">
                <li>Pagas con tarjeta dentro de la app</li>
                <li>Puedes seguir al repartidor en el mapa</li>
                <li>Los precios pueden ser más altos por la comisión</li>
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <OrderLink
                  href={business.links.rappi}
                  channel="rappi"
                  location="domicilio_comparativa"
                  variant="outline"
                >
                  Rappi
                </OrderLink>
                <OrderLink
                  href={business.links.uberEats}
                  channel="uber_eats"
                  location="domicilio_comparativa"
                  variant="outline"
                >
                  Uber Eats
                </OrderLink>
              </div>
            </div>
          </div>
        </section>

        {comboFamiliar && (
          <section className="mt-12 rounded-3xl border-2 border-brand-gold bg-brand-gold-soft p-6 md:p-8">
            <h2 className="text-2xl font-black tracking-tight">
              ¿Piden varios? Sale más barato en combo
            </h2>
            <p className="mt-2 text-base leading-relaxed text-brand-ink/75">
              El {comboFamiliar.name} trae {comboFamiliar.includes.join(" y ")} por{" "}
              {formatPrice(comboFamiliar.promo)} en vez de{" "}
              {formatPrice(comboFamiliar.regular)}: te ahorras{" "}
              {formatPrice(comboFamiliar.savings)}. Hay cuatro paquetes, desde dos hasta
              dieciséis personas.
            </p>
            <Link
              href="/#paquetes"
              className="mt-4 inline-block font-bold text-brand-red-dark hover:underline"
            >
              Ver los cuatro paquetes
            </Link>
          </section>
        )}
      </div>

      <JsonLd
        data={graph(
          webPageNode({
            path: "/tortas-ahogadas-a-domicilio-zapopan",
            name: "Tortas ahogadas a domicilio en Zapopan",
            description: `Entrega a domicilio de tortas ahogadas en ${serviceAreasText}.`,
          }),
          breadcrumbNode(TRAIL)
        )}
      />
    </>
  );
}
