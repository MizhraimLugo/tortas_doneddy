/**
 * Busca texto puesto en la tipografía de titulares por debajo del tamaño en que
 * se lee, y negritas que el navegador esté falsificando.
 *
 *   node scripts/auditar-tipografia.mjs http://localhost:3000
 *
 * Por qué hace falta: Alfa Slab One solo tiene el peso 400. Al pedirle una
 * negrita, el navegador no encuentra la variante y la INVENTA engrosando los
 * trazos; sobre una losa que ya es pesadísima el texto deja de leerse, y en el
 * código no se ve nada raro —`font-bold` en un `h3` parece de lo más normal—.
 * Como los encabezados heredan esa tipografía por CSS, basta escribir un `h2`
 * chico para caer en la trampa sin darse cuenta.
 *
 * Esto solo se puede comprobar en el navegador: hay que saber qué tipografía y
 * qué tamaño resolvieron de verdad, y eso no se ve leyendo las clases.
 */

import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";

const RUTAS = [
  "/",
  "/menu",
  "/tortas-ahogadas-a-domicilio-zapopan",
  "/que-es-una-torta-ahogada",
  "/privacidad",
  "/terminos",
];

/**
 * Los dos umbrales salen de mirar la página, no de una regla general.
 *
 * Debajo de 16 px la tipografía de titulares no se lee en ningún caso.
 *
 * Entre 16 y 17 px depende de QUÉ diga: los precios ("$75") se leen perfecto
 * —dos o tres dígitos, formas simples, mucho contraste— y son parte de la
 * identidad de la carta, así que ahí es decisión de diseño y no descuido. Las
 * palabras a ese tamaño sí se cierran.
 *
 * A 18 px las palabras vuelven a leerse bien: los enlaces de "Ver el menú
 * completo" o "Ver los cuatro paquetes" están a ese tamaño, subrayados, y
 * funcionan. Por eso el corte va en 18 y no en 20: marcar como problema algo
 * que se ve bien enseña a ignorar la auditoría, que es peor que no tenerla.
 */
const NUNCA = 16;
const DUDOSO = 18;

const navegador = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});

let problemas = 0;

for (const ruta of RUTAS) {
  const page = await navegador.newPage({ viewport: { width: 1280, height: 900 } });
  const res = await page.goto(BASE + ruta, { waitUntil: "networkidle" });
  if (!res?.ok()) throw new Error(`${ruta} respondió ${res?.status()}`);

  const hallazgos = await page.evaluate(
    ({ nunca, dudoso }) => {
      const salida = [];

      for (const el of document.querySelectorAll("body *")) {
        // Solo elementos con texto propio; si no, se contaría el mismo texto
        // una vez por cada contenedor que lo envuelve.
        const propio = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join(" ")
          .trim();
        if (!propio) continue;

        const cs = getComputedStyle(el);
        if (!cs.fontFamily.split(",")[0].includes("Alfa")) continue;

        const px = parseFloat(cs.fontSize);
        const peso = parseInt(cs.fontWeight, 10);
        const texto = propio.replace(/\s+/g, " ").slice(0, 42);
        // Solo dígitos, moneda y signos: los precios y cifras se salvan.
        const soloCifras = !/\p{L}/u.test(propio);

        if (peso > 400 && cs.fontSynthesisWeight !== "none") {
          salida.push({ mal: "negrita falsificada", texto, px: Math.round(px), peso });
        }
        if (px < nunca || (px < dudoso && !soloCifras)) {
          salida.push({ mal: "titular demasiado chico", texto, px: Math.round(px), peso });
        }
      }

      return salida;
    },
    { nunca: NUNCA, dudoso: DUDOSO }
  );

  problemas += hallazgos.length;
  console.log(`${ruta.padEnd(38)} ${hallazgos.length === 0 ? "limpio" : `${hallazgos.length} problema(s)`}`);
  for (const h of hallazgos) {
    console.log(`   ✗ ${h.mal} · ${h.px}px peso ${h.peso} · "${h.texto}"`);
  }

  await page.close();
}

await navegador.close();

console.log(
  problemas === 0
    ? "\nSin problemas de legibilidad."
    : `\n${problemas} problema(s). Los subtítulos chicos van en Barlow: font-sans text-base font-extrabold`
);

process.exit(problemas === 0 ? 0 : 1);
