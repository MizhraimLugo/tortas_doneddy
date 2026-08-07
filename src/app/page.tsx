import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Combos } from "@/components/sections/combos";
import { Delivery } from "@/components/sections/delivery";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
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
 * cualquier crawler — ejecute JavaScript o no — reciba la página completa.
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

      <section id="menu" className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-black uppercase tracking-widest text-brand-red-dark">
            Menú
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Nuestras tortas ahogadas y tacos dorados
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink/75">
            Todo se prepara al momento con birote salado y salsa de chile de árbol.
            Estos son los platillos más pedidos; el menú completo, con bebidas y
            extras, está en la página de menú.
          </p>

          <div className="mt-8">
            <MenuList sections={previewSections} />
          </div>

          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 text-base font-bold text-brand-red-dark hover:underline"
          >
            Ver el menú completo con precios
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Combos />
      <Delivery />
      <Location />

      <div className="py-14 md:py-20">
        <FaqSection
          items={featuredFaq}
          title={`Preguntas frecuentes sobre ${business.name}`}
          intro="Lo que más nos preguntan sobre horarios, ubicación, precios y entregas."
          compact
        />

        <div className="mx-auto mt-10 max-w-4xl px-4">
          <div className="rounded-3xl border-2 border-brand-gold bg-brand-gold-soft p-6 md:p-8">
            <h2 className="text-xl font-black tracking-tight md:text-2xl">
              ¿Nunca has comido una torta ahogada?
            </h2>
            <p className="mt-2 text-base leading-relaxed text-brand-ink/75">
              Te explicamos qué lleva, de dónde viene, por qué el birote salado es
              indispensable y cómo se come sin terminar bañado en salsa.
            </p>
            <Link
              href="/que-es-una-torta-ahogada"
              className="mt-4 inline-flex items-center gap-2 font-bold text-brand-red-dark hover:underline"
            >
              Leer la guía de la torta ahogada
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/*
        El menú completo y las preguntas frecuentes se emiten como datos
        estructurados aunque la página solo muestre una parte: un modelo que
        rastree únicamente la portada obtiene igual todos los precios.
      */}
      <JsonLd
        data={graph(
          webPageNode({
            path: "/",
            name: "Tortas Ahogadas Don Eddy — Zapopan",
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
