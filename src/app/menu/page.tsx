import { ArrowRight, Clock, Flame, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { FoodImage } from "@/components/food-image";
import { JsonLd } from "@/components/json-ld";
import { OrderLink } from "@/components/order-link";
import { PageHero, PageHeroFact } from "@/components/page-hero";
import { Combos } from "@/components/sections/combos";
import { FaqSection } from "@/components/sections/faq-section";
import { MenuList } from "@/components/sections/menu-list";
import { business, fullAddress, waMessages } from "@/data/business";
import { comboMasRendidor, combos } from "@/data/combos";
import { faqByTopic } from "@/data/faq";
import { images } from "@/data/images";
import { findMenuItem, formatPrice, maxPrice, menu, minPrice } from "@/data/menu";
import { breadcrumbNode, faqNode, graph, menuNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * Página de menú.
 *
 * Existe como página propia y no solo como sección porque "menú" es una
 * consulta con intención de compra alta ("menú tortas ahogadas Zapopan",
 * "tortas ahogadas precio") y merece su propio título, su propia descripción y
 * su propia URL que se pueda compartir y posicionar.
 *
 * Es además la página donde viven los paquetes. Los combos se muestran también
 * en la portada, pero la dirección canónica es esta (`/menu#paquetes`, ver
 * `PAQUETES_PATH` en lib/schema): quien está comparando precios ya está aquí, y
 * el paquete solo se entiende como lo que es —un descuento sobre el menú—
 * cuando tiene los precios sueltos justo arriba para comparar.
 */

const TRAIL = [
  { name: "Inicio", path: "/" },
  { name: "Menú", path: "/menu" },
];

const faqMenu = faqByTopic("menu");

export const metadata = buildMetadata({
  path: "/menu",
  title: "Menú y Precios",
  description: `Menú completo de ${business.name}: torta ahogada ${formatPrice(findMenuItem("torta-ahogada").price)}, de lengua ${formatPrice(findMenuItem("torta-ahogada-lengua").price)}, tacos dorados, birote salado y bebidas en Zapopan.`,
  keywords: [
    "menú tortas ahogadas",
    "precio torta ahogada Zapopan",
    "tacos dorados precio",
    "torta ahogada de lengua",
    "paquetes tortas ahogadas",
    "combos tortas ahogadas Zapopan",
  ],
});

export default function MenuPage() {
  const torta = findMenuItem("torta-ahogada");
  const comboBarato = combos.reduce((a, b) => (a.promo < b.promo ? a : b));

  return (
    <>
      <PageHero
        trail={TRAIL}
        eyebrow="Menú y precios"
        title="Todo lo que servimos, con su precio"
        intro={
          <>
            Este es el menú completo de {business.name}, en{" "}
            {business.address.neighborhood}, {business.address.locality}. Los precios
            van de {formatPrice(minPrice)} a {formatPrice(maxPrice)} e incluyen tortas
            ahogadas, mini tortas, tacos dorados, birote salado y bebidas. También hay
            cuatro paquetes para compartir, desde {formatPrice(comboBarato.promo)}.
          </>
        }
        actions={
          <>
            <OrderLink
              href={business.whatsapp(waMessages.menu)}
              channel="whatsapp"
              location="menu_encabezado"
              variant="onDark"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Pedir por WhatsApp
            </OrderLink>
            <OrderLink
              href={business.phone.telHref}
              channel="telefono"
              location="menu_encabezado"
              variant="onDarkOutline"
              size="lg"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {business.phone.display}
            </OrderLink>
          </>
        }
        aside={
          /*
            La foto del platillo estrella con su precio encima. En una carta,
            la decisión se toma viendo la comida, no leyendo una lista: la foto
            es la que vende y el precio colgado le quita la duda de encima.
          */
          <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
            <div className="rotate-[-1.5deg] rounded-[2rem] border-4 border-gold bg-gold p-2 shadow-[10px_10px_0_0_var(--color-chile-deep)]">
              <FoodImage
                src={images.tortaAhogada.src}
                alt={images.tortaAhogada.alt}
                aspect="4 / 3"
                priority
                className="rounded-[1.5rem]"
              />
            </div>
            <p className="price-tag absolute -bottom-4 left-4 rotate-[-2deg] border-2 border-ink bg-cream py-2 pr-5 font-display text-xl text-chile shadow-stamp">
              {torta.name} {formatPrice(torta.price)}
            </p>
          </div>
        }
        facts={
          <ul className="grid gap-4 sm:grid-cols-3">
            <PageHeroFact icon={<Clock className="h-5 w-5" aria-hidden="true" />} label="Horario">
              {business.hours.range} · {business.hours.closedNote}
            </PageHeroFact>
            <PageHeroFact icon={<MapPin className="h-5 w-5" aria-hidden="true" />} label="Dónde estamos">
              {fullAddress}
            </PageHeroFact>
            <PageHeroFact icon={<Flame className="h-5 w-5" aria-hidden="true" />} label="Tú mandas">
              La salsa picante va aparte, tú le pones
            </PageHeroFact>
          </ul>
        }
      />

      <div className="shell py-12 md:py-16">
        {/*
          Índice de secciones.

          Son seis apartados y en un teléfono eso son varias pantallas de
          desplazamiento. Quien entra buscando el precio de las bebidas no
          debería tener que recorrer las tortas para llegar. Son anclas HTML
          normales: funcionan sin JavaScript y el desplazamiento suave lo pone
          el CSS.
        */}
        <nav aria-label="Secciones del menú">
          {/*
            `font-sans` es obligatorio: es un `h2`, y los encabezados heredan
            Alfa Slab One, que a 12 px se cierra y además no tiene el peso 800
            que se le pide aquí. Los antetítulos del resto del sitio van en
            Barlow; sin esto, este sería el único distinto.
          */}
          <h2 className="font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red-dark">
            Ir directo a
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {menu.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex items-center rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-bold transition-colors hover:bg-gold"
                >
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#paquetes"
                className="inline-flex items-center rounded-full border-2 border-ink bg-gold px-4 py-2 text-sm font-bold transition-colors hover:bg-gold-deep"
              >
                Paquetes
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-10">
          <MenuList sections={menu} headingLevel="h2" />
        </div>

        <p className="mt-8 max-w-3xl text-sm text-ink/60">
          Los precios pueden variar en Rappi y Didi Food por las comisiones de cada
          plataforma. Para el precio de esta página, pide directo por WhatsApp o
          teléfono.
        </p>
      </div>

      {/*
        Los paquetes, justo debajo del menú suelto.

        El orden importa: primero ves que una torta cuesta $75 y un taco $15,
        y con esos números frescos el "de $210 a $165" del combo se lee como lo
        que es. Al revés —paquetes antes que precios— el descuento es una
        afirmación que hay que creer.
      */}
      <Combos
        intro={`Cuatro paquetes que combinan tortas ahogadas y tacos dorados a un precio menor que pedirlos por separado. El más rendidor es el ${comboMasRendidor.name}: sale en ${formatPrice(comboMasRendidor.perPerson)} por persona.`}
      />

      {/* Puente a la página de domicilio: la otra mitad de la intención de compra. */}
      <section className="shell py-14 md:py-16">
        <div className="grid items-center gap-6 rounded-3xl border-2 border-ink bg-gold-soft p-7 shadow-stamp sm:grid-cols-[1fr_auto] md:p-9">
          <div>
            <h2 className="text-[clamp(1.5rem,3.2vw,2.1rem)] text-chile">
              ¿Ya sabes qué vas a pedir?
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/80">
              Te lo llevamos a domicilio en {business.serviceAreas.join(", ")} y
              colonias cercanas. Ahí te explicamos cómo pedir paso a paso y hasta
              dónde llegamos.
            </p>
            <Link
              href="/tortas-ahogadas-a-domicilio-zapopan"
              className="mt-5 inline-flex items-center gap-2 border-b-2 border-chile pb-1 font-display text-lg text-chile transition-colors hover:border-ink hover:text-ink"
            >
              Ver entrega a domicilio
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <FoodImage
            src={images.tacosDorados.src}
            alt={images.tacosDorados.alt}
            aspect="1 / 1"
            sizes="200px"
            className="mx-auto w-40 shrink-0 rounded-2xl border-2 border-ink shadow-stamp-gold sm:w-48"
          />
        </div>
      </section>

      <FaqSection
        items={faqMenu}
        title={
          <>
            Dudas sobre el
            <span className="block text-chile">menú y los precios</span>
          </>
        }
        intro="Carnes, picante, opciones sin carne, paquetes y bebidas."
      />

      <JsonLd
        data={graph(
          webPageNode({
            path: "/menu",
            name: `Menú y precios — ${business.name}`,
            description:
              "Menú completo con precios de tortas ahogadas, tacos dorados, bebidas y los cuatro paquetes para compartir.",
          }),
          menuNode(),
          // Solo las preguntas que esta página muestra de verdad: un FAQPage que
          // declara preguntas invisibles en la URL es motivo de descarte.
          faqNode({ path: "/menu", items: faqMenu }),
          breadcrumbNode(TRAIL)
        )}
      />
    </>
  );
}
