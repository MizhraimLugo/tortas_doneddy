import { ArrowRight, ChefHat } from "lucide-react";
import Link from "next/link";

import { FoodImage } from "@/components/food-image";
import { JsonLd } from "@/components/json-ld";
import { OrderLink } from "@/components/order-link";
import { PageHero } from "@/components/page-hero";
import { FaqSection } from "@/components/sections/faq-section";
import { business, waMessages } from "@/data/business";
import { faqByTopic } from "@/data/faq";
import { images } from "@/data/images";
import { findMenuItem, formatPrice } from "@/data/menu";
import { articleNode, breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * Guía: qué es una torta ahogada.
 *
 * Esta es la página que atrae tráfico que todavía no busca comprar, y es la
 * pieza que mejor funciona para búsqueda con IA. Razones:
 *
 *  - "Qué es una torta ahogada" es una pregunta informativa con volumen alto y
 *    competencia baja frente a "tortas ahogadas Zapopan". Trae visitas nuevas.
 *  - Los motores generativos citan fuentes cuando responden preguntas de
 *    definición. Una explicación clara, con encabezados en forma de pregunta y
 *    respuestas autónomas, es exactamente el formato que extraen.
 *  - Le da al sitio autoridad temática: un dominio que explica el birote salado
 *    y el origen del platillo se lee como especialista, no como un directorio.
 *
 * Cada H2 está redactado como la pregunta que escribe una persona, y el primer
 * párrafo bajo cada uno responde de forma completa y citable por sí solo.
 *
 * Los encabezados llevan `id` y arriba va un índice que enlaza a cada uno. Sirve
 * a quien llega buscando una sola cosa —"cómo se come"— y además le da a Google
 * los saltos de sección que a veces muestra debajo del resultado.
 */

const TRAIL = [
  { name: "Inicio", path: "/" },
  { name: "Qué es una torta ahogada", path: "/que-es-una-torta-ahogada" },
];

// TODO(negocio): actualizar `dateModified` cuando se revise el contenido. La
// frescura es señal de posicionamiento y los modelos prefieren fuentes recientes.
const PUBLICADO = "2026-01-15";
const ACTUALIZADO = "2026-01-15";

/** Índice del artículo. El `id` es el ancla y el `titulo` es el H2 literal. */
const SECCIONES = [
  { id: "origen", titulo: "¿De dónde viene la torta ahogada?", corto: "Origen" },
  { id: "ingredientes", titulo: "¿Qué lleva una torta ahogada?", corto: "Ingredientes" },
  { id: "birote", titulo: "¿Por qué el birote salado es indispensable?", corto: "El birote" },
  { id: "como-se-come", titulo: "¿Cómo se come una torta ahogada?", corto: "Cómo se come" },
  { id: "a-que-hora", titulo: "¿A qué hora se come?", corto: "A qué hora" },
  { id: "carnes", titulo: "¿Cuál es la diferencia entre pierna, buche y cuero?", corto: "Las carnes" },
] as const;

const faqGuia = faqByTopic("guia");

export const metadata = buildMetadata({
  path: "/que-es-una-torta-ahogada",
  ogType: "article",
  title: "¿Qué es una torta ahogada?",
  description:
    "Un birote salado relleno de carne de cerdo y sumergido en salsa de jitomate con chile de árbol. Su origen en Jalisco, sus ingredientes y cómo se come.",
  keywords: [
    "qué es una torta ahogada",
    "torta ahogada origen",
    "birote salado",
    "cómo se come una torta ahogada",
    "ingredientes torta ahogada",
  ],
});

export default function GuiaPage() {
  const tortaPrice = formatPrice(findMenuItem("torta-ahogada").price);

  return (
    <>
      <PageHero
        trail={TRAIL}
        eyebrow="Guía de la torta ahogada"
        title="¿Qué es una torta ahogada?"
        intro={
          <>
            La torta ahogada es un platillo tradicional de Guadalajara y Zapopan, en
            Jalisco, que consiste en un birote salado partido a la mitad, relleno de
            carne de cerdo —normalmente pierna, buche o cuero— y sumergido por completo
            en una salsa de jitomate. Encima lleva salsa de chile de árbol al gusto,
            cebolla curtida en limón y sal. Se come con las manos, sobre un plato hondo,
            y es uno de los desayunos más representativos del occidente de México.
          </>
        }
        aside={
          <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
            <div className="rotate-[1.5deg] rounded-[2rem] border-4 border-gold bg-gold p-2 shadow-[10px_10px_0_0_var(--color-chile-deep)]">
              <FoodImage
                src={images.tortaAhogada.src}
                alt={images.tortaAhogada.alt}
                aspect="4 / 3"
                priority
                className="rounded-[1.5rem]"
              />
            </div>
          </div>
        }
      />

      <article className="shell shell-narrow py-12 md:py-16">
        <p className="text-sm text-ink/55">
          Guía escrita por {business.name}, {business.address.neighborhood},{" "}
          {business.address.locality}, Jalisco ·{" "}
          <time dateTime={ACTUALIZADO}>Actualizado en enero de 2026</time>
        </p>

        {/* Índice: seis apartados largos son varias pantallas en un teléfono. */}
        <nav
          aria-label="Contenido de la guía"
          className="mt-6 rounded-2xl border-2 border-ink bg-gold-soft p-5 shadow-stamp-gold"
        >
          <h2 className="font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red-dark">
            En esta guía
          </h2>
          <ol className="mt-3 grid gap-1.5 text-base sm:grid-cols-2">
            {SECCIONES.map((seccion, index) => (
              <li key={seccion.id} className="flex gap-2">
                <span aria-hidden="true" className="font-bold text-chile">
                  {index + 1}.
                </span>
                <a href={`#${seccion.id}`} className="font-semibold hover:underline">
                  {seccion.corto}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <Seccion id="origen" titulo={SECCIONES[0].titulo}>
          <p>
            La torta ahogada nació en Guadalajara, Jalisco, durante la primera mitad
            del siglo XX, y hoy es el platillo más identificado con la ciudad y su zona
            metropolitana, que incluye Zapopan. Se vende en puestos de calle, mercados y
            locales especializados desde temprano por la mañana.
          </p>
          <p>
            La versión más contada sobre su origen dice que un vendedor dejó caer por
            accidente una torta en un recipiente con salsa y el cliente, lejos de
            rechazarla, la pidió así de nuevo. Es una anécdota popular y no hay registro
            que la confirme, pero explica bien el espíritu del platillo: algo simple que
            funcionó y se quedó.
          </p>
        </Seccion>

        <Seccion id="ingredientes" titulo={SECCIONES[1].titulo}>
          <p>
            Una torta ahogada lleva cuatro elementos, y los cuatro importan:
          </p>
          <ul>
            <li>
              <strong>Birote salado.</strong> El pan. Es lo único que aguanta la salsa
              sin deshacerse.
            </li>
            <li>
              <strong>Carne de cerdo.</strong> Lo más común es pierna, buche (estómago) o
              cuero. También hay versiones con lengua de res.
            </li>
            <li>
              <strong>Salsa de jitomate.</strong> La que "ahoga" la torta. No pica: es
              una base de jitomate con especias, ligera y aguada a propósito.
            </li>
            <li>
              <strong>Salsa de chile de árbol.</strong> La que pica. Va aparte o encima,
              según cuánto aguantes.
            </li>
          </ul>
          <p>
            Casi siempre se acompaña de cebolla curtida en jugo de limón con sal, que
            corta la grasa y refresca entre mordida y mordida.
          </p>
        </Seccion>

        <Seccion id="birote" titulo={SECCIONES[2].titulo}>
          <p>
            El birote salado es un pan de masa fermentada, propio de la región de
            Guadalajara, con corteza dura y migajón firme y compacto. Esa estructura es
            la razón de todo: al sumergirlo en salsa, absorbe el sabor pero conserva la
            forma. Un bolillo común o una telera se deshacen en cuestión de segundos y
            la torta se vuelve una sopa.
          </p>
          <p>
            Es un pan difícil de reproducir fuera de la zona; la explicación que suele
            darse combina el clima, la altitud y las levaduras locales con las que se
            fermenta la masa. Sea cual sea el motivo, quien intenta hacer tortas ahogadas
            en otra ciudad casi siempre choca con el mismo problema: sin birote salado no
            sale igual.
          </p>
          <p>
            En {business.name} lo horneamos nosotros mismos todos los días, igual que
            las carnitas, y las dos salsas también son de la casa. Por eso el birote
            llega firme a la mesa: recién hecho aguanta el caldillo sin volverse
            esponja.
          </p>
        </Seccion>

        <Seccion id="como-se-come" titulo={SECCIONES[3].titulo}>
          <p>
            Se come con las manos, encima de un plato hondo y encorvándose sobre él.
            No hay forma elegante de hacerlo y no se espera que la haya. En muchos
            puestos se sirve dentro de una bolsa de plástico que se sostiene desde
            abajo, lo cual mantiene la torta entera y las manos relativamente limpias.
          </p>
          <p>Vale la pena saber que puedes pedirla a tu medida:</p>
          <ul>
            <li>
              <strong>Media ahogada:</strong> solo bañada por encima. Es la recomendada
              si es tu primera vez.
            </li>
            <li>
              <strong>Bien ahogada:</strong> sumergida por completo en salsa de jitomate.
            </li>
            <li>
              <strong>Sin picante:</strong> solo con salsa de jitomate, sin chile de
              árbol. La salsa base no pica.
            </li>
          </ul>
        </Seccion>

        <Seccion id="a-que-hora" titulo={SECCIONES[4].titulo}>
          <p>
            En Jalisco la torta ahogada es principalmente un desayuno o un almuerzo:
            los puestos abren temprano y muchos cierran a media tarde. También tiene
            fama de remedio contra la cruda, por la combinación de salsa picante, grasa y
            acidez del limón. En {business.name} servimos de {business.hours.range},{" "}
            {business.hours.closedNote.toLowerCase()}.
          </p>
        </Seccion>

        <Seccion id="carnes" titulo={SECCIONES[5].titulo}>
          <p>
            Son tres cortes distintos del cerdo y cambian bastante la experiencia:
          </p>
          <ul>
            <li>
              <strong>Pierna:</strong> carne magra y deshebrada. La más suave y la
              entrada más segura si no conoces el platillo.
            </li>
            <li>
              <strong>Buche:</strong> estómago de cerdo. Más firme, con textura
              masticable y sabor más marcado.
            </li>
            <li>
              <strong>Cuero:</strong> piel de cerdo cocida. Suave y gelatinosa, la
              favorita de quien ya es cliente frecuente.
            </li>
            <li>
              <strong>Lengua:</strong> de res, no de cerdo. Muy suave y de sabor
              delicado; suele costar un poco más.
            </li>
          </ul>
          <p>
            Si no te decides, pide una combinación: mucha gente lleva mitad pierna y
            mitad cuero.
          </p>
        </Seccion>

        {/* Cierre con conversión: la guía trae tráfico informativo y aquí se convierte. */}
        <aside className="mt-14 grid items-center gap-6 rounded-3xl border-2 border-ink bg-gold-soft p-6 shadow-stamp sm:grid-cols-[1fr_auto] md:p-8">
          <div>
            <h2 className="text-2xl text-chile">
              Pruébala en {business.address.neighborhood}, {business.address.locality}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-ink/75">
              En {business.name} preparamos tortas ahogadas con birote salado, salsa de
              chile de árbol hecha en casa y carne de pierna, buche, cuero o lengua. La
              torta cuesta {tortaPrice} y también entregamos a domicilio en el norte de{" "}
              {business.address.locality}.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <OrderLink
                href={business.whatsapp(waMessages.general)}
                channel="whatsapp"
                location="guia_cierre"
                size="lg"
              >
                Pedir por WhatsApp
              </OrderLink>
              <Link
                href="/menu"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-7 text-sm font-extrabold uppercase tracking-wide text-ink transition-colors hover:bg-gold"
              >
                Ver el menú
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/*
            Don Eddy hace de anfitrión al cerrar la guía. Un negocio con cara
            detrás genera más confianza que uno anónimo, y para los buscadores
            cuenta como señal de experiencia real.
          */}
          <FoodImage
            src={images.personaje.src}
            alt={images.personaje.alt}
            aspect="1 / 1"
            fit="contain"
            tone="gold"
            sizes="200px"
            className="mx-auto w-36 shrink-0 sm:w-44"
            fallbackIcon={<ChefHat className="h-14 w-14" aria-hidden="true" />}
          />
        </aside>
      </article>

      <FaqSection
        items={faqGuia}
        title={
          <>
            Otras dudas sobre
            <span className="block text-chile">la torta ahogada</span>
          </>
        }
        columns={1}
      />

      <JsonLd
        data={graph(
          webPageNode({
            path: "/que-es-una-torta-ahogada",
            name: "¿Qué es una torta ahogada?",
            description:
              "Guía sobre el origen, los ingredientes y la forma de comer la torta ahogada de Jalisco.",
            dateModified: ACTUALIZADO,
          }),
          articleNode({
            path: "/que-es-una-torta-ahogada",
            headline: "¿Qué es una torta ahogada? Origen, ingredientes y cómo se come",
            description:
              "La torta ahogada es un birote salado relleno de carne de cerdo y sumergido en salsa de jitomate con chile de árbol, originario de Guadalajara, Jalisco.",
            datePublished: PUBLICADO,
            dateModified: ACTUALIZADO,
          }),
          faqNode({ path: "/que-es-una-torta-ahogada", items: faqGuia }),
          breadcrumbNode(TRAIL)
        )}
      />
    </>
  );
}

function Seccion({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-28">
      <h2 className="text-2xl md:text-3xl">{titulo}</h2>
      <div className="mt-3 grid gap-4 text-base leading-relaxed text-ink/80 [&_li]:ml-5 [&_li]:list-disc [&_ul]:grid [&_ul]:gap-2">
        {children}
      </div>
    </section>
  );
}
