/**
 * Empaqueta la portada renderizada en una sola página HTML autónoma.
 *
 *   node scripts/empaquetar-preview.mjs http://localhost:3300 salida.html
 *
 * Para qué sirve: obtener una previsualización que se pueda compartir por un
 * enlace, sin desplegar el sitio. El destino bloquea cualquier petición a otro
 * host, así que todo —hoja de estilos, tipografías y fotos— tiene que viajar
 * incrustado en el propio archivo como data URI.
 *
 * No es el sitio real: no hay enrutamiento, ni optimización de imágenes por
 * dispositivo, ni datos estructurados. Es una foto fiel de la portada.
 */

const BASE = process.argv[2] ?? "http://localhost:3300";
const OUT = process.argv[3] ?? "preview.html";

const bajar = async (ruta, accept) => {
  const res = await fetch(BASE + ruta, accept ? { headers: { Accept: accept } } : undefined);
  if (!res.ok) throw new Error(`${ruta} respondió ${res.status}`);
  return res;
};

const aDataUri = async (ruta, accept) => {
  const res = await bajar(ruta, accept);
  const tipo = res.headers.get("content-type")?.split(";")[0] ?? "application/octet-stream";
  const buf = Buffer.from(await res.arrayBuffer());
  return { uri: `data:${tipo};base64,${buf.toString("base64")}`, kb: buf.length / 1024, tipo };
};

let total = 0;
const registrar = (etiqueta, kb) => {
  total += kb;
  console.log(`  ${etiqueta.padEnd(42)} ${kb.toFixed(0).padStart(5)} KB`);
};

console.log("Empaquetando la portada…\n");

let html = await (await bajar("/")).text();

// ── Hoja de estilos, con las tipografías incrustadas dentro ──────────────────
console.log("Hoja de estilos y tipografías:");
const rutaCss = html.match(/href="(\/_next\/static\/chunks\/[^"]+\.css)"/)?.[1];
if (!rutaCss) throw new Error("No se encontró la hoja de estilos");
let css = await (await bajar(rutaCss)).text();

// Next escribe las tipografías con ruta relativa a la hoja de estilos
// (`url(../media/…)`), no absoluta, así que hay que resolverlas contra su
// carpeta antes de poder descargarlas.
const dirCss = rutaCss.slice(0, rutaCss.lastIndexOf("/"));
const fuentes = [...new Set([...css.matchAll(/url\(([^)'"]+\.woff2)\)/g)].map((m) => m[1]))];
if (fuentes.length === 0) throw new Error("No se encontró ninguna tipografía en la hoja de estilos");

for (const referencia of fuentes) {
  const absoluta = new URL(referencia, `http://x${dirCss}/`).pathname;
  const { uri, kb } = await aDataUri(absoluta);
  css = css.replaceAll(`url(${referencia})`, `url(${uri})`);
  registrar(referencia.split("/").pop(), kb);
}
registrar(`(hoja de estilos, ${fuentes.length} tipografías)`, css.length / 1024);

// ── Fotos ────────────────────────────────────────────────────────────────────
// Se piden en WebP: pesa mucho menos que el original y lo entiende cualquier
// navegador desde 2020. AVIF sería aún más chico pero deja fuera equipos viejos,
// y esto va a acabar abriéndose en el celular de alguien.
console.log("\nFotos:");
const ANCHOS = { "torta-ahogada-don-eddy.jpg": 1080, "tacos-dorados-don-eddy.jpg": 828, "don-eddy-personaje.png": 828 };

for (const [archivo, ancho] of Object.entries(ANCHOS)) {
  const { uri, kb } = await aDataUri(
    `/_next/image?url=${encodeURIComponent("/brand/" + archivo)}&w=${ancho}&q=85`,
    "image/webp"
  );

  // Se descarga UN ancho pero se sustituyen TODAS las variantes del archivo.
  // El atributo `src` que escribe `next/image` apunta al ancho mayor (3840),
  // no al que se eligió aquí, así que buscar la URL exacta dejaría fuera
  // justamente la que el navegador va a pedir. El `&` viaja escapado como
  // `&amp;` en el HTML, de ahí las dos formas en el patrón.
  const patron = new RegExp(
    `/_next/image\\?url=${encodeURIComponent("/brand/" + archivo).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:&|&amp;)w=\\d+(?:&|&amp;)q=\\d+`,
    "g"
  );
  const antes = (html.match(patron) ?? []).length;
  html = html.replace(patron, uri);
  registrar(`${archivo} (${antes} referencias)`, kb);
}

// El logotipo se sirve crudo en el sitio (lo usa un <img> normal, no
// `next/image`), y como PNG con transparencia pesa casi medio mega. Aquí se
// pasa por el optimizador: a la altura en que se muestra, 384 px de ancho
// sobran, y en WebP conserva el canal alfa.
const logo = await aDataUri(`/_next/image?url=${encodeURIComponent("/brand/logo.png")}&w=384&q=85`, "image/webp");
html = html.replaceAll("/brand/logo.png", logo.uri);
registrar("logo.png", logo.kb);

// ── Limpieza ─────────────────────────────────────────────────────────────────
html = html
  // `srcSet` apunta a rutas que aquí no existen; sin él manda el `src`
  // incrustado. React 19 lo emite en camelCase, de ahí la bandera `i`.
  .replace(/\ssrcset="[^"]*"/gi, "")
  .replace(/\ssizes="[^"]*"/gi, "")
  // Los bundles de Next y sus precargas pedirían archivos inexistentes.
  .replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, "")
  .replace(/<script[^>]*>self\.__next[\s\S]*?<\/script>/g, "")
  .replace(/<link[^>]*\/_next\/[^>]*>/g, "")
  // Los datos estructurados no se ven y sí pesan; el sitio real sí los lleva.
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");

// El mapa embebido es una petición a otro host y queda bloqueado: se sustituye
// por un panel del mismo estilo que lleva a Google Maps.
html = html.replace(
  /<iframe[^>]*maps\/embed[^>]*><\/iframe>/,
  `<a href="https://www.google.com/maps?cid=3392006286938494353" target="_blank" rel="noopener noreferrer"
      class="mapa-sustituto" aria-label="Abrir la ubicación en Google Maps">
     <span class="mapa-pin" aria-hidden="true">📍</span>
     <span class="mapa-titulo">Av. Federalistas 1100, Local 6</span>
     <span class="mapa-sub">La Cima, 45130 Zapopan, Jal.</span>
     <span class="mapa-cta">Abrir en Google Maps</span>
   </a>`
);

// ── Contenido del cuerpo ─────────────────────────────────────────────────────
const cuerpo = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? html;

// `next/font` no declara las tipografías en :root, sino en clases que pone
// sobre <html> (`.alfa_slab_one_…__variable{--font-alfa:"Alfa Slab One"}`).
// Aquí el <html> lo escribe el contenedor y no lleva esas clases, así que sin
// esto `--font-alfa` queda sin definir y los títulos caen a la fuente del
// sistema. Se leen esas reglas del propio CSS y se reemiten sobre :root.
const declaraciones = [...css.matchAll(/\.[A-Za-z0-9_-]*__variable\s*\{([^}]*)\}/g)]
  .map((m) => m[1].trim().replace(/;$/, ""))
  .filter(Boolean);

if (declaraciones.length === 0) {
  throw new Error("No se hallaron las variables de tipografía; los títulos saldrían con la fuente del sistema");
}
const raizFuentes = `:root { ${declaraciones.join("; ")}; }`;
console.log(`\nTipografías reasignadas a :root → ${declaraciones.join(" | ")}`);

const salida = `<title>Tortas Ahogadas Don Eddy — Previsualización</title>

<style>
${css}

/* ── Ajustes propios de la previsualización ─────────────────────────────── */

/* El contenedor pinta su propio fondo: si lo dejara transparente, tomaría el
   del sitio anfitrión y en modo oscuro el texto quedaría ilegible. */
html, body {
  background: var(--color-cream, #fff6e8) !important;
  margin: 0;
}
${raizFuentes}

/* Sustituto del mapa, con el mismo lenguaje visual que el resto. */
.mapa-sustituto {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: .4rem; aspect-ratio: 4/3; width: 100%; padding: 1.5rem;
  border-radius: 1.3rem; background: var(--color-gold-soft, #fdf0d3);
  color: var(--color-ink, #1f100c); text-align: center; text-decoration: none;
  transition: background-color .15s;
}
.mapa-sustituto:hover { background: var(--color-gold, #ecba54); }
.mapa-pin { font-size: 2.5rem; }
.mapa-titulo { font-family: var(--font-display, Georgia, serif); font-size: 1.15rem; }
.mapa-sub { font-size: .9rem; opacity: .75; }
.mapa-cta {
  margin-top: .5rem; padding: .5rem 1.25rem; border: 2px solid var(--color-ink, #1f100c);
  border-radius: 999px; background: var(--color-chile, #9b1209); color: var(--color-cream, #fff6e8);
  font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em;
}

/* Aviso de que esto es una muestra y no el sitio publicado. */
.aviso-preview {
  position: sticky; bottom: 0; z-index: 60;
  padding: .55rem 1rem; text-align: center;
  background: var(--color-ink, #1f100c); color: var(--color-cream, #fff6e8);
  font-family: var(--font-sans, system-ui, sans-serif); font-size: .72rem; letter-spacing: .04em;
}
@media (max-width: 767px) { .aviso-preview { bottom: 4.5rem; } }
</style>

${cuerpo}

<p class="aviso-preview">Previsualización de la portada · El sitio publicado incluye el menú completo, la guía y el mapa interactivo</p>

<script>
  // El menú de hamburguesa es lo único que necesita interacción; el resto de la
  // página es HTML y CSS. Se reimplementa en unas líneas para que la muestra se
  // sienta como el sitio real.
  document.addEventListener("click", (e) => {
    const boton = e.target.closest('header button[aria-controls="menu-movil"]');
    if (!boton) return;
    const menu = document.getElementById("menu-movil");
    if (!menu) return;
    const abierto = boton.getAttribute("aria-expanded") === "true";
    boton.setAttribute("aria-expanded", String(!abierto));
    menu.style.display = abierto ? "none" : "block";
  });
  const menu = document.getElementById("menu-movil");
  if (menu) menu.style.display = "none";
</script>
`;

const fs = await import("node:fs/promises");
await fs.writeFile(OUT, salida);
const kb = (await fs.stat(OUT)).size / 1024;
console.log(`\nRecursos incrustados: ${total.toFixed(0)} KB`);
console.log(`Archivo final: ${OUT} — ${kb.toFixed(0)} KB`);
