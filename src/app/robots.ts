import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/business";

/**
 * robots.txt
 *
 * Decisión de negocio explícita: SÍ queremos que los modelos de lenguaje lean
 * este sitio.
 *
 * Mucha gente bloquea GPTBot y compañía por reflejo, pensando en proteger
 * contenido. Para un restaurante local eso es un error: cuando alguien le
 * pregunta a ChatGPT o a Perplexity "¿dónde como tortas ahogadas en Zapopan?",
 * el modelo solo puede recomendarte si pudo leerte. Bloquear a estos rastreadores
 * es renunciar a un canal completo de descubrimiento.
 *
 * Aquí se listan uno por uno en vez de confiar en el "todo permitido" por
 * omisión: así queda documentada la intención y nadie lo revierte por accidente
 * al agregar una regla general más adelante.
 */

/** Rastreadores de motores generativos y de entrenamiento de modelos. */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot", //          entrenamiento
  "OAI-SearchBot", //   índice de búsqueda de ChatGPT
  "ChatGPT-User", //    navegación iniciada por el usuario

  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",

  // Perplexity
  "PerplexityBot",
  "Perplexity-User",

  // Google (Gemini y AI Overviews; distinto de Googlebot)
  "Google-Extended",

  // Apple Intelligence / Siri
  "Applebot",
  "Applebot-Extended",

  // Common Crawl: alimenta a numerosos modelos de terceros
  "CCBot",

  // Microsoft Copilot
  "bingbot",

  // Meta AI
  "meta-externalagent",

  // Amazon
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Las rutas internas de Next no aportan nada al índice y solo gastan
        // presupuesto de rastreo.
        disallow: ["/api/", "/_next/static/chunks/"],
      },

      // Permiso explícito para cada motor de IA.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
