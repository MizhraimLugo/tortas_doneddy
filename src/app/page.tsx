import { ArrowRight, ChefHat } from "lucide-react";
import Link from "next/link";

import { FoodImage } from "@/components/food-image";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/ornaments";
import { Antojos } from "@/components/sections/antojos";
import { Combos } from "@/components/sections/combos";
import { Delivery } from "@/components/sections/delivery";
import { FaqSection } from "@/components/sections/faq-section";
import { HechoEnCasa } from "@/components/sections/hecho-en-casa";
import { Hero } from "@/components/sections/hero";
import { Instagram } from "@/components/sections/instagram";
import { Location } from "@/components/sections/location";
import { MenuList } from "@/components/sections/menu-list";
import { business } from "@/data/business";
import { featuredFaq } from "@/data/faq";
import { images } from "@/data/images";
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
  title: "Tortas Ahogadas y Tacos Dorados en Zapopan | Don Eddy",
  description:
    "Tortas ahogadas con birote salado y tacos dorados de frijol, papa o requesón en La Cima, Zapopan. Desde $75. Pide por WhatsApp o a domicilio, de 9:00 a 16:00 h.",
  keywords: [
    "tortas ahogadas Zapopan",
    "tacos dorados Zapopan",
    "tortas ahogadas a domicilio",
    "tacos dorados a domicilio Zapopan",
    "tortas ahogadas La Cima",
    "birote salado Zapopan",
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
        <div className="shell">
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

      <HechoEnCasa />
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

      {/*
        Puente hacia la guía: convierte tráfico informativo en clientes.
        Don Eddy en persona hace de anfitrión; un negocio con cara detrás
        genera más confianza que uno anónimo, y eso también cuenta como señal
        de experiencia real para los buscadores.
      */}
      <section className="shell shell-mid pb-20">
        <div className="grid items-center gap-6 rounded-3xl border-2 border-ink bg-gold p-7 shadow-stamp sm:grid-cols-[1fr_auto] md:p-10">
          <div>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.25rem)] text-chile">
              ¿Nunca has comido una torta ahogada?
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/80">
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

          <FoodImage
            src={images.personaje.src}
            alt={images.personaje.alt}
            aspect="1 / 1"
            fit="contain"
            tone="gold"
            sizes="200px"
            className="mx-auto w-40 shrink-0 sm:w-48"
            fallbackIcon={<ChefHat className="h-14 w-14" aria-hidden="true" />}
          />
        </div>
      </section>

      {/*
        El menú completo sí se emite entero aunque la portada muestre solo tres
        secciones: `Menu` no exige correspondencia con lo visible y así un
        modelo que rastree únicamente la portada obtiene todos los precios.

        Las preguntas frecuentes NO siguen esa regla. Google valida que un
        `FAQPage` corresponda a preguntas visibles en esa misma URL y descarta
        el bloque cuando declara de más, así que aquí van solo las destacadas.
        El resto está publicado en las páginas de su tema —menú, domicilio y la
        guía— y las quince completas viajan en /llms.txt, que es el canal
        pensado para los modelos.
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
          faqNode({ path: "/", items: featuredFaq })
        )}
      />
    </>
  );
}
