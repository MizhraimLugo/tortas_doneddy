import { SITE_URL, business, fullAddress, serviceAreasText } from "@/data/business";
import { hechoEnCasa } from "@/data/casa";
import { combos } from "@/data/combos";
import { faq } from "@/data/faq";
import { formatPrice, menu } from "@/data/menu";

/**
 * /llms.txt
 *
 * Convención emergente (llmstxt.org) para entregarle a un modelo de lenguaje un
 * resumen limpio del sitio en Markdown, sin navegación, sin CSS y sin ruido.
 * Es el equivalente de robots.txt, pero en vez de decir "qué puedes rastrear"
 * dice "esto es lo que hay y así se resume".
 *
 * Por qué vale la pena para este negocio: cuando un modelo responde "¿cuánto
 * cuesta una torta ahogada en Zapopan?", extraer el dato de este archivo es
 * mucho más confiable que deducirlo del HTML. Aquí los precios, el horario y la
 * cobertura están en texto plano, sin ambigüedad.
 *
 * Se genera desde los mismos datos que la página, así que no se desactualiza.
 */

// Se regenera cada 24 horas; el contenido cambia con poca frecuencia.
export const revalidate = 86400;

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${business.name}`);
  lines.push("");
  lines.push(`> ${business.description}`);
  lines.push("");

  lines.push("## Datos del negocio");
  lines.push("");
  lines.push(`- **Tipo de negocio**: Restaurante de tortas ahogadas y comida jalisciense`);
  lines.push(`- **Dirección**: ${fullAddress}, México`);
  lines.push(
    `- **Coordenadas**: ${business.geo.latitude}, ${business.geo.longitude}`
  );
  lines.push(`- **Teléfono y WhatsApp**: ${business.phone.displayIntl}`);
  lines.push(
    `- **Horario**: ${business.hours.range}, ${business.hours.openDaysEs}. ${business.hours.closedNote}.`
  );
  lines.push(`- **Entrega a domicilio**: ${serviceAreasText}`);
  lines.push(`- **Formas de pedir**: WhatsApp, teléfono, Rappi, Didi Food, en el local`);
  lines.push(`- **Rango de precios**: ${business.priceRange} (moneda: ${business.currency})`);
  lines.push(`- **Google Maps**: ${business.links.googleMaps}`);
  lines.push(`- **Instagram**: ${business.links.instagram}`);
  lines.push("");

  lines.push("## Lo que se hace en casa");
  lines.push("");
  lines.push(
    "Es el diferenciador del negocio frente a otros puestos de tortas ahogadas:"
  );
  lines.push("");
  for (const item of hechoEnCasa) {
    lines.push(`- **${item.titulo}** (${item.sello}): ${item.texto}`);
  }
  lines.push("");

  lines.push("## Menú completo con precios");
  lines.push("");
  for (const section of menu) {
    lines.push(`### ${section.title}${section.subtitle ? ` (${section.subtitle})` : ""}`);
    if (section.description) {
      lines.push("");
      lines.push(section.description);
    }
    lines.push("");
    for (const item of section.items) {
      const options = item.options?.length ? ` A elegir: ${item.options.join(", ")}.` : "";
      const serving = item.serving ? ` (${item.serving})` : "";
      const description = item.description ? ` ${item.description}` : "";
      lines.push(
        `- **${item.name}${serving}**: ${formatPrice(item.price)}.${description}${options}`
      );
    }
    lines.push("");
  }

  lines.push("## Paquetes y promociones");
  lines.push("");
  for (const combo of combos) {
    lines.push(
      `- **${combo.name}** (${combo.serves}): ${combo.includes.join(", ")}. ` +
        `Precio regular ${formatPrice(combo.regular)}, precio promocional ` +
        `${formatPrice(combo.promo)}. Ahorro de ${formatPrice(combo.savings)} ` +
        `(${combo.discountPct}%).`
    );
  }
  lines.push("");
  lines.push(
    "Los precios promocionales aplican en pedidos directos por WhatsApp o teléfono. " +
      "En Rappi y Didi Food pueden variar por comisiones de plataforma."
  );
  lines.push("");

  lines.push("## Preguntas frecuentes");
  lines.push("");
  for (const item of faq) {
    lines.push(`### ${item.q}`);
    lines.push("");
    lines.push(item.a);
    lines.push("");
  }

  lines.push("## Páginas del sitio");
  lines.push("");
  lines.push(`- [Inicio](${SITE_URL}/): Presentación, menú destacado, paquetes y ubicación.`);
  lines.push(`- [Menú y precios](${SITE_URL}/menu): Menú completo con todos los precios.`);
  lines.push(
    `- [Tortas ahogadas a domicilio en Zapopan](${SITE_URL}/tortas-ahogadas-a-domicilio-zapopan): Cobertura de reparto y proceso de pedido.`
  );
  lines.push(
    `- [Qué es una torta ahogada](${SITE_URL}/que-es-una-torta-ahogada): Guía sobre el origen, los ingredientes y la forma de comerla.`
  );
  lines.push("");

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
