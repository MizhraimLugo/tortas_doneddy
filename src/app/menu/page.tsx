import { JsonLd } from "@/components/json-ld";
import { OrderLink } from "@/components/order-link";
import { MenuList } from "@/components/sections/menu-list";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { business, waMessages } from "@/data/business";
import { findMenuItem, formatPrice, maxPrice, menu, minPrice } from "@/data/menu";
import { breadcrumbNode, graph, menuNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * Página de menú.
 *
 * Existe como página propia y no solo como sección porque "menú" es una
 * consulta con intención de compra alta ("menú tortas ahogadas Zapopan",
 * "tortas ahogadas precio") y merece su propio título, su propia descripción y
 * su propia URL que se pueda compartir y posicionar.
 */

const TRAIL = [
  { name: "Inicio", path: "/" },
  { name: "Menú", path: "/menu" },
];

export const metadata = buildMetadata({
  path: "/menu",
  title: "Menú y Precios",
  description: `Menú completo de ${business.name}: torta ahogada ${formatPrice(findMenuItem("torta-ahogada").price)}, de lengua ${formatPrice(findMenuItem("torta-ahogada-lengua").price)}, tacos dorados, birote salado y bebidas en Zapopan.`,
  keywords: [
    "menú tortas ahogadas",
    "precio torta ahogada Zapopan",
    "tacos dorados precio",
    "torta ahogada de lengua",
  ],
});

export default function MenuPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <Breadcrumbs trail={TRAIL} />

        <h1 className="mt-5 text-4xl md:text-5xl">
          Menú de tortas ahogadas y precios
        </h1>

        <p data-speakable className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">
          Este es el menú completo de {business.name}, en {business.address.neighborhood},{" "}
          {business.address.locality}. Los precios van de {formatPrice(minPrice)} a{" "}
          {formatPrice(maxPrice)} e incluyen tortas ahogadas, mini tortas, tacos dorados,
          birote salado y bebidas. Abrimos de {business.hours.range},{" "}
          {business.hours.closedNote}.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <OrderLink
            href={business.whatsapp(waMessages.menu)}
            channel="whatsapp"
            location="menu_encabezado"
            size="lg"
          >
            Pedir por WhatsApp
          </OrderLink>
          <OrderLink
            href={business.phone.telHref}
            channel="telefono"
            location="menu_encabezado"
            variant="outline"
            size="lg"
          >
            Llamar al {business.phone.display}
          </OrderLink>
        </div>

        <div className="mt-10">
          <MenuList sections={menu} headingLevel="h2" />
        </div>

        <p className="mt-8 text-sm text-ink/60">
          Los precios pueden variar en Rappi y Uber Eats por las comisiones de cada
          plataforma. Para el precio de esta página, pide directo por WhatsApp o
          teléfono.
        </p>
      </div>

      <JsonLd
        data={graph(
          webPageNode({
            path: "/menu",
            name: `Menú y precios — ${business.name}`,
            description: "Menú completo con precios de tortas ahogadas, tacos dorados y bebidas.",
          }),
          menuNode(),
          breadcrumbNode(TRAIL)
        )}
      />
    </>
  );
}
