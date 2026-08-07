import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/ornaments";
import { Antojos } from "@/components/sections/antojos";
import { Combos } from "@/components/sections/combos";
import { Delivery } from "@/components/sections/delivery";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { Instagram } from "@/components/sections/instagram";
import { Location } from "@/components/sections/location";
import { MenuList } from "@/components/sections/menu-list";
import { business } from "@/data/business";
import { featuredFaq } from "@/data/faq";
import { menu } from "@/data/menu";
import { faqNode, graph, menuNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * Portada.
 *
 * Se genera de forma estática (SSG): Next produce el HTML en el build y lo
 * sirve como archivo. Es la configuración más rápida posible y garantiza que
 * cualquier crawler —ejecute JavaScript o no— reciba la página completa.
 */

export const metadata = buildMetadata({
  path: "/",
  absoluteTitle: true,
  title: "Tortas Ahogadas en Zapopan a Domicilio | Don Eddy",
  description:
    "Tortas ahogadas de pierna, buche, cuero y lengua con birote salado en La Cima, Zapopan. Desde $75. Pide por WhatsApp o a domicilio. Abrimos de 9:00 a 16:00 h.",
  keywords: [
    "tortas ahogadas Zapopan",
    "tortas ahogadas a domicilio",
    "tortas ahogadas La Cima",
    "birote salado Zapopan",
    "tacos dorados Zapopan",
    "comida jalisciense Zapopan",
  ],
});

// Las tres primeras secciones del menú son las de mayor intención de compra.
const previewSections = menu.slice(0, 3);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Antojos />

      <section id="menu" className="bg-cream-deep/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Menú"
            title="Todo se hace al momento"
            align="center"
            intro="Birote salado, salsa de chile de árbol hecha en casa y carne recién preparada. Estos son los platillos más pedidos; el menú completo, con bebidas y extras, está en su propia página."
          />

          <div className="mt-12">
            <MenuList sections={previewSections} />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 border-b-2 border-chile pb-1 font-display text-lg text-chile transition-colors hover:border-gold hover:text-brand-red-dark"
            >
              Ver el menú completo con precios
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Combos />
      <Delivery />
      <Location />
      <Instagram />

      <FaqSection
        items={featuredFaq}
        title={
          <>
            Lo que más nos
            <span className="block text-chile">preguntan</span>
          </>
        }
        intro="Horarios, ubicación, precios y entregas, resueltos de una vez."
      />

      {/* Puente hacia la guía: convierte tráfico informativo en clientes. */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="rounded-3xl border-2 border-ink bg-gold p-7 shadow-stamp md:p-10">
          <h2 className="text-[clamp(1.6rem,3.5vw,2.25rem)] text-chile">
            ¿Nunca has comido una torta ahogada?
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80">
            Te explicamos qué lleva, de dónde viene, por qué el birote salado es
            indispensable y cómo se come sin terminar bañado en salsa.
          </p>
          <Link
            href="/que-es-una-torta-ahogada"
            className="mt-5 inline-flex items-center gap-2 border-b-2 border-chile pb-1 font-display text-lg text-chile hover:border-ink hover:text-ink"
          >
            Leer la guía de la torta ahogada
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/*
        El menú completo y las preguntas frecuentes se emiten como datos
        estructurados aunque la página solo muestre una parte: un modelo que
        rastree únicamente la portada obtiene igual todos los precios.
      */}
      <JsonLd
        data={graph(
          webPageNode({
            path: "/",
            name: `${business.name} — Zapopan`,
            description:
              "Tortas ahogadas, tacos dorados y bebidas en La Cima, Zapopan. Menú, precios, paquetes y entrega a domicilio.",
          }),
          menuNode(),
          faqNode()
        )}
      />
    </>
  );
}
