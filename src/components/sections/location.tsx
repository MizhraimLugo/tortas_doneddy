import { MapPin, Navigation } from "lucide-react";

import { OrderLink } from "@/components/order-link";
import { business, fullAddress, hoursText, serviceAreasText, waMessages } from "@/data/business";

/**
 * Ubicación.
 *
 * El mapa embebido ahora sí se renderiza. En la versión anterior estaba
 * reemplazado por un aviso que decía "En este preview, el mapa embebido está
 * desactivado para evitar solicitudes de red" — un texto de desarrollo que
 * habría llegado a producción y que el cliente habría leído sin entender nada.
 *
 * Se carga con `loading="lazy"`: al estar debajo del pliegue, el iframe no se
 * descarga hasta que el usuario se acerca, así que no afecta el LCP.
 */
export function Location() {
  return (
    <section id="ubicacion" className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand-red-dark">
              Ubicación
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              Dónde comer tortas ahogadas en {business.address.neighborhood},{" "}
              {business.address.locality}
            </h2>

            <p data-speakable className="mt-4 text-base leading-relaxed text-brand-ink/75">
              Nos encuentras en {fullAddress}. Estamos sobre Avenida Federalistas, en
              el Local 6, en la zona norte de {business.address.locality}. Abrimos{" "}
              {hoursText.toLowerCase()}.
            </p>

            <dl className="mt-6 grid gap-4 text-sm">
              <div className="rounded-2xl border-2 border-brand-gold bg-brand-gold-soft p-4">
                <dt className="flex items-center gap-2 font-black uppercase tracking-wide text-brand-red-dark">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Dirección
                </dt>
                <dd className="mt-1.5 text-brand-ink/80">{fullAddress}</dd>
              </div>

              <div className="rounded-2xl border-2 border-brand-gold bg-brand-gold-soft p-4">
                <dt className="flex items-center gap-2 font-black uppercase tracking-wide text-brand-red-dark">
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Llevamos a domicilio
                </dt>
                <dd className="mt-1.5 text-brand-ink/80">{serviceAreasText}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <OrderLink
                href={business.links.googleMaps}
                channel="maps"
                location="ubicacion"
                variant="outline"
              >
                Cómo llegar
              </OrderLink>
              <OrderLink
                href={business.whatsapp(waMessages.hours)}
                channel="whatsapp"
                location="ubicacion"
              >
                Preguntar por WhatsApp
              </OrderLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border-2 border-brand-gold bg-white">
            <iframe
              title={`Mapa con la ubicación de ${business.name} en ${business.address.locality}`}
              src={business.links.googleMapsEmbed}
              className="aspect-square w-full md:aspect-4/3"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // `allowFullScreen` deja al usuario expandir el mapa en móvil.
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
