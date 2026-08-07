import { Clock, MapPin, Navigation } from "lucide-react";

import { OrderLink } from "@/components/order-link";
import { SectionHeading } from "@/components/ornaments";
import { business, fullAddress, serviceAreasText, waMessages } from "@/data/business";

/**
 * Ubicación.
 *
 * El mapa embebido se renderiza de verdad. En la versión original estaba
 * sustituido por un aviso que decía "En este preview, el mapa embebido está
 * desactivado para evitar solicitudes de red": un texto de desarrollo que
 * habría llegado a producción y que el cliente habría leído sin entender nada.
 *
 * Va con `loading="lazy"`: al estar debajo del pliegue, el iframe no se
 * descarga hasta que el usuario se acerca, así que no castiga el LCP.
 */
export function Location() {
  return (
    <section id="ubicacion" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Dónde estamos"
            title={
              <>
                {business.address.neighborhood},
                <span className="block text-chile">{business.address.locality}</span>
              </>
            }
          />

          <p data-speakable className="mt-5 text-base leading-relaxed text-ink/75">
            Nos encuentras en {fullAddress}, sobre Avenida Federalistas, en el Local 6,
            en la zona norte de {business.address.locality}. Abrimos de{" "}
            {business.hours.range}, {business.hours.closedNote.toLowerCase()}.
          </p>

          <dl className="mt-7 grid gap-3">
            <InfoRow icon={<MapPin className="h-4 w-4" aria-hidden="true" />} term="Dirección">
              {fullAddress}
            </InfoRow>
            <InfoRow icon={<Clock className="h-4 w-4" aria-hidden="true" />} term="Horario">
              {business.hours.range} · {business.hours.openDaysEs}.{" "}
              <strong className="font-bold text-chile">{business.hours.closedNote}.</strong>
            </InfoRow>
            <InfoRow
              icon={<Navigation className="h-4 w-4" aria-hidden="true" />}
              term="Cobertura a domicilio"
            >
              {serviceAreasText}
            </InfoRow>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <OrderLink
              href={business.links.googleMaps}
              channel="maps"
              location="ubicacion"
              variant="gold"
            >
              Cómo llegar
            </OrderLink>
            <OrderLink
              href={business.whatsapp(waMessages.hours)}
              channel="whatsapp"
              location="ubicacion"
              variant="outline"
            >
              ¿Están abiertos?
            </OrderLink>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-ink bg-white p-2 shadow-stamp">
          <iframe
            title={`Mapa con la ubicación de ${business.name} en ${business.address.locality}`}
            src={business.links.googleMapsEmbed}
            className="aspect-4/3 w-full rounded-[1.3rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  term,
  children,
}: {
  icon: React.ReactNode;
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-ink/12 bg-white px-4 py-3">
      <span className="mt-0.5 shrink-0 text-chile">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/50">
          {term}
        </dt>
        <dd className="mt-1 text-sm leading-snug text-ink/80">{children}</dd>
      </div>
    </div>
  );
}
