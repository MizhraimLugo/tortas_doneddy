import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { OrderLink } from "@/components/order-link";
import { business, waMessages } from "@/data/business";
import { findMenuItem, formatPrice } from "@/data/menu";
import { articleNode, breadcrumbNode, graph, webPageNode } from "@/lib/schema";
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
 */

const TRAIL = [
  { name: "Inicio", path: "/" },
  { name: "Qué es una torta ahogada", path: "/que-es-una-torta-ahogada" },
];

// TODO(negocio): actualizar `dateModified` cuando se revise el contenido. La
// frescura es señal de posicionamiento y los modelos prefieren fuentes recientes.
const PUBLICADO = "2026-01-15";
const ACTUALIZADO = "2026-01-15";

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
      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <Breadcrumbs trail={TRAIL} />

        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-5xl">
          ¿Qué es una torta ahogada?
        </h1>

        <p className="mt-3 text-sm text-brand-ink/55">
          Guía escrita por {business.name}, {business.address.neighborhood},{" "}
          {business.address.locality}, Jalisco ·{" "}
          <time dateTime={ACTUALIZADO}>Actualizado en enero de 2026</time>
        </p>

        {/* Respuesta directa arriba de todo: es el fragmento que se cita. */}
        <p
          data-speakable
          className="mt-6 rounded-2xl border-2 border-brand-gold bg-brand-gold-soft p-5 text-lg font-medium leading-relaxed"
        >
          La torta ahogada es un platillo tradicional de Guadalajara y Zapopan, en
          Jalisco, que consiste en un birote salado partido a la mitad, relleno de
          carne de cerdo —normalmente pierna, buche o cuero— y sumergido por completo
          en una salsa de jitomate. Encima lleva salsa de chile de árbol al gusto,
          cebolla curtida en limón y sal. Se come con las manos, sobre un plato hondo,
          y es uno de los desayunos más representativos del occidente de México.
        </p>

        <Seccion titulo="¿De dónde viene la torta ahogada?">
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

        <Seccion titulo="¿Qué lleva una torta ahogada?">
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

        <Seccion titulo="¿Por qué el birote salado es indispensable?">
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
        </Seccion>

        <Seccion titulo="¿Cómo se come una torta ahogada?">
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

        <Seccion titulo="¿A qué hora se come?">
          <p>
            En Jalisco la torta ahogada es principalmente un desayuno o un almuerzo:
            los puestos abren temprano y muchos cierran a media tarde. También tiene
            fama de remedio contra la cruda, por la combinación de salsa picante, grasa y
            acidez del limón. En {business.name} servimos de {business.hours.range},{" "}
            {business.hours.closedNote.toLowerCase()}.
          </p>
        </Seccion>

        <Seccion titulo="¿Cuál es la diferencia entre pierna, buche y cuero?">
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
        <aside className="mt-12 rounded-3xl border-2 border-brand-red-dark bg-brand-gold-soft p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">
            Pruébala en {business.address.neighborhood}, {business.address.locality}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-brand-ink/75">
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
              className="inline-flex h-13 items-center justify-center rounded-xl border-2 border-brand-gold bg-white px-6 font-semibold text-brand-ink transition-colors hover:bg-brand-gold"
            >
              Ver el menú
            </Link>
          </div>
        </aside>
      </article>

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
          breadcrumbNode(TRAIL)
        )}
      />
    </>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black tracking-tight md:text-3xl">{titulo}</h2>
      <div className="mt-3 grid gap-4 text-base leading-relaxed text-brand-ink/80 [&_li]:ml-5 [&_li]:list-disc [&_ul]:grid [&_ul]:gap-2">
        {children}
      </div>
    </section>
  );
}
