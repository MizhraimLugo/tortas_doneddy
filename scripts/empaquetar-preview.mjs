/**
 * Empaqueta el sitio completo en una sola página HTML autónoma.
 *
 *   node scripts/empaquetar-preview.mjs http://localhost:3300 salida.html
 *
 * Para qué sirve: obtener una previsualización que se pueda compartir por un
 * enlace, sin desplegar el sitio. El destino bloquea cualquier petición a otro
 * host, así que todo —hoja de estilos, tipografías y fotos— tiene que viajar
 * incrustado en el propio archivo como data URI.
 *
 * Las seis páginas van en el mismo archivo y un enrutador de unas líneas cambia
 * entre ellas al hacer clic, así que el menú, las migas de pan y los enlaces
 * internos funcionan como en el sitio real. Meterlas juntas además sale barato:
 * las tipografías y las fotos son las mismas y se incrustan una sola vez.
 *
 * No es el sitio real: no hay optimización de imágenes por dispositivo, ni
 * datos estructurados, ni el mapa embebido. Es una foto fiel de las páginas.
 */

const BASE = process.argv[2] ?? "http://localhost:3300";
const OUT = process.argv[3] ?? "preview.html";

/** Las páginas que se empaquetan. La primera es la que abre. */
const RUTAS = [
  { ruta: "/", nombre: "Portada" },
  { ruta: "/menu", nombre: "Menú y paquetes" },
  { ruta: "/tortas-ahogadas-a-domicilio-zapopan", nombre: "A domicilio" },
  { ruta: "/que-es-una-torta-ahogada", nombre: "Guía" },
  { ruta: "/privacidad", nombre: "Aviso de privacidad" },
  { ruta: "/terminos", nombre: "Términos" },
];

/**
 * Ancho al que se descarga cada foto. Se pide UNO y se usa en todas las
 * páginas: el sitio real sirve un tamaño por dispositivo, pero aquí eso
 * multiplicaría el peso del archivo sin que se note la diferencia.
 */
const ANCHOS = {
  "torta-ahogada-don-eddy.jpg": 1080,
  "tacos-dorados-don-eddy.jpg": 828,
  "don-eddy-personaje.png": 828,
};

const bajar = async (ruta, accept) => {
  const res = await fetch(BASE + ruta, accept ? { headers: { Accept: accept } } : undefined);
  if (!res.ok) throw new Error(`${ruta} respondió ${res.status}`);
  return res;
};

const aDataUri = async (ruta, accept) => {
  const res = await bajar(ruta, accept);
  const tipo = res.headers.get("content-type")?.split(";")[0] ?? "application/octet-stream";
  const buf = Buffer.from(await res.arrayBuffer());
  return { uri: `data:${tipo};base64,${buf.toString("base64")}`, kb: buf.length / 1024 };
};

const escaparRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let total = 0;
const registrar = (etiqueta, kb) => {
  total += kb;
  console.log(`  ${etiqueta.padEnd(46)} ${kb.toFixed(0).padStart(5)} KB`);
};

// ── Descarga de las páginas ──────────────────────────────────────────────────
console.log(`Empaquetando ${RUTAS.length} páginas desde ${BASE}…\n`);

const paginas = [];
for (const { ruta, nombre } of RUTAS) {
  const html = await (await bajar(ruta)).text();
  paginas.push({ ruta, nombre, html });
  console.log(`  ${nombre.padEnd(24)} ${ruta.padEnd(40)} ${(html.length / 1024).toFixed(0)} KB`);
}

// ── Hoja de estilos, con las tipografías incrustadas dentro ──────────────────
// Se recogen las hojas de TODAS las páginas: Next puede partir el CSS en varios
// fragmentos y una página interior podría traer reglas que la portada no usa.
console.log("\nHoja de estilos y tipografías:");

const rutasCss = [
  ...new Set(paginas.flatMap((p) => [...p.html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]))),
];
if (rutasCss.length === 0) throw new Error("No se encontró ninguna hoja de estilos");

let css = "";
for (const rutaCss of rutasCss) {
  css += await (await bajar(rutaCss)).text();
}

// Next escribe las tipografías con ruta relativa a la hoja de estilos
// (`url(../media/…)`), no absoluta, así que hay que resolverlas contra su
// carpeta antes de poder descargarlas.
const dirCss = rutasCss[0].slice(0, rutasCss[0].lastIndexOf("/"));
const fuentes = [...new Set([...css.matchAll(/url\(([^)'"]+\.woff2)\)/g)].map((m) => m[1]))];
if (fuentes.length === 0) throw new Error("No se encontró ninguna tipografía en la hoja de estilos");

let kbFuentes = 0;
for (const referencia of fuentes) {
  const absoluta = new URL(referencia, `http://x${dirCss}/`).pathname;
  const { uri, kb } = await aDataUri(absoluta);
  css = css.replaceAll(`url(${referencia})`, `url(${uri})`);
  kbFuentes += kb;
}
registrar(`${fuentes.length} tipografías`, kbFuentes);
registrar(`hoja de estilos (${rutasCss.length} fragmentos)`, css.length / 1024 - kbFuentes);

// ── Limpieza previa ──────────────────────────────────────────────────────────
// Va ANTES de incrustar las fotos, no después. `next/image` escribe un `srcSet`
// con una decena de anchos por imagen; si se sustituyeran primero, cada foto
// quedaría repetida diez veces en base64 dentro de un atributo que enseguida se
// borra. En la práctica eran 66 copias de la misma foto para tirar 62.
for (const pagina of paginas) {
  pagina.html = pagina.html
    // Sin `srcSet` manda el `src`, que sí se sustituye por el data URI.
    // React 19 lo emite en camelCase, de ahí la bandera `i`.
    .replace(/\ssrcset="[^"]*"/gi, "")
    .replace(/\ssizes="[^"]*"/gi, "")
    // Los bundles de Next y sus precargas pedirían archivos inexistentes.
    .replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, "")
    // Los datos de hidratación. El `self.__next` no siempre abre el script:
    // Next también emite `(self.__next_f=self.__next_f||[]).push(…)`, así que
    // se busca en todo el contenido y no solo al principio.
    .replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*?self\.__next[\s\S]*?<\/script>/g, "")
    .replace(/<link[^>]*\/_next\/[^>]*>/g, "")
    // Los datos estructurados no se ven y sí pesan; el sitio real sí los lleva.
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
}

// ── Fotos ────────────────────────────────────────────────────────────────────
// Se piden en WebP: pesa mucho menos que el original y lo entiende cualquier
// navegador desde 2020. AVIF sería aún más chico pero deja fuera equipos viejos,
// y esto va a acabar abriéndose en el celular de alguien.
console.log("\nFotos (una sola copia para las seis páginas):");

/**
 * Cada foto se guarda UNA vez y en el HTML solo queda su clave.
 *
 * Incrustarla en cada `<img>` sería lo obvio, pero la misma foto aparece en
 * varias páginas y el logotipo en las doce cabeceras y pies: eran 1.8 MB de los
 * cuales más de la mitad era la misma cadena repetida. Y no se arregla solo al
 * comprimir, porque la ventana de gzip es de 32 KB y las copias quedan mucho
 * más lejos que eso, así que ni las ve. Con la tabla aparte, el archivo baja a
 * la mitad, que en el celular de alguien es la diferencia que importa.
 */
const fotos = {};

for (const [archivo, ancho] of Object.entries(ANCHOS)) {
  const clave = archivo.replace(/\.\w+$/, "");
  const enc = encodeURIComponent("/brand/" + archivo);
  const { uri, kb } = await aDataUri(`/_next/image?url=${enc}&w=${ancho}&q=85`, "image/webp");
  fotos[clave] = uri;

  // Se descarga UN ancho pero se sustituyen TODAS las variantes del archivo.
  // El atributo `src` que escribe `next/image` apunta al ancho mayor (3840),
  // no al que se eligió aquí, así que buscar la URL exacta dejaría fuera
  // justamente la que el navegador va a pedir. El `&` viaja escapado como
  // `&amp;` en el HTML, de ahí las dos formas en el patrón.
  const patron = new RegExp(
    `src="/_next/image\\?url=${escaparRegex(enc)}(?:&|&amp;)w=\\d+(?:&|&amp;)q=\\d+"`,
    "g"
  );

  let usos = 0;
  for (const pagina of paginas) {
    usos += (pagina.html.match(patron) ?? []).length;
    pagina.html = pagina.html.replace(patron, `data-foto="${clave}"`);
  }
  if (usos === 0) throw new Error(`${archivo} no se usa en ninguna página`);
  registrar(`${archivo} (${usos} usos)`, kb);
}

// El logotipo se sirve crudo en el sitio (lo usa un <img> normal, no
// `next/image`), y como PNG con transparencia pesa casi medio mega. Aquí se
// pasa por el optimizador: a la altura en que se muestra, 384 px de ancho
// sobran, y en WebP conserva el canal alfa.
const logo = await aDataUri(
  `/_next/image?url=${encodeURIComponent("/brand/logo.png")}&w=384&q=85`,
  "image/webp"
);
fotos.logo = logo.uri;

let usosLogo = 0;
for (const pagina of paginas) {
  usosLogo += (pagina.html.match(/src="\/brand\/logo\.png"/g) ?? []).length;
  pagina.html = pagina.html.replace(/src="\/brand\/logo\.png"/g, 'data-foto="logo"');
}
if (usosLogo === 0) throw new Error("el logotipo no se usa en ninguna página");
registrar(`logo.png (${usosLogo} usos)`, logo.kb);

// ── Limpieza y extracción del cuerpo ─────────────────────────────────────────
const MAPA_SUSTITUTO = `<a href="https://www.google.com/maps?cid=3392006286938494353" target="_blank" rel="noopener noreferrer"
      class="mapa-sustituto" aria-label="Abrir la ubicación en Google Maps">
     <span class="mapa-pin" aria-hidden="true">📍</span>
     <span class="mapa-titulo">Av. Federalistas 1100, Local 6</span>
     <span class="mapa-sub">La Cima, 45130 Zapopan, Jal.</span>
     <span class="mapa-cta">Abrir en Google Maps</span>
   </a>`;

/**
 * Menú móvil.
 *
 * En el sitio real se monta solo al abrirlo (`{open && <div id="menu-movil">}`),
 * así que en el HTML que llega del servidor no existe: el botón de hamburguesa
 * está, pero no hay nada que mostrar. Sin esto la previsualización se ve rota
 * justo en el celular, que es donde se va a enseñar.
 *
 * Los enlaces se sacan del propio menú de escritorio de cada página en vez de
 * escribirlos aquí: si mañana se agrega una sección al sitio, aparece sola.
 */
function menuMovil(html) {
  const nav = html.match(/<nav[^>]*aria-label="Navegación principal"[\s\S]*?<\/nav>/)?.[0];
  if (!nav) throw new Error("No se encontró el menú de escritorio para armar el móvil");

  // Los atributos se leen por separado: React no garantiza el orden en que los
  // escribe, y darlo por hecho es lo que rompió esto la primera vez.
  const enlaces = [...nav.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)]
    .map(([, attrs, etiqueta]) => ({
      href: attrs.match(/href="([^"]*)"/)?.[1],
      titulo: attrs.match(/title="([^"]*)"/)?.[1] ?? "",
      etiqueta: etiqueta.replace(/<[^>]*>/g, "").trim(),
    }))
    .filter((e) => e.href && e.etiqueta);

  if (enlaces.length === 0) throw new Error("El menú de escritorio no tiene enlaces");

  const items = enlaces
    .map(
      ({ href, titulo, etiqueta }) => `<li><a href="${href}" class="block rounded-xl px-3 py-2.5 hover:bg-gold-soft">
        <span class="block text-sm font-extrabold uppercase tracking-wide">${etiqueta}</span>
        <span class="block text-xs text-ink/55">${titulo}</span>
      </a></li>`
    )
    .join("\n");

  return `<div id="menu-movil" class="border-t-2 border-ink bg-white lg:hidden" style="display:none">
    <nav aria-label="Navegación móvil" class="shell py-4">
      <ul class="grid gap-1">
${items}
      </ul>
    </nav>
  </div>`;
}

for (const pagina of paginas) {
  // El mapa embebido es una petición a otro host y queda bloqueado.
  pagina.html = pagina.html.replace(/<iframe[^>]*maps\/embed[^>]*><\/iframe>/, MAPA_SUSTITUTO);

  // El menú va dentro del <header>, que es donde lo pondría React.
  const menu = menuMovil(pagina.html);
  const antes = pagina.html;
  pagina.html = pagina.html.replace("</header>", `${menu}</header>`);
  if (pagina.html === antes) throw new Error(`${pagina.ruta} no tiene <header> donde colgar el menú móvil`);

  pagina.cuerpo = pagina.html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? pagina.html;
  if (!pagina.cuerpo.trim()) throw new Error(`${pagina.ruta} quedó sin cuerpo`);
}

// ── Variables de tipografía ──────────────────────────────────────────────────
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
console.log(`\nTipografías reasignadas a :root → ${declaraciones.join(" | ")}`);

// ── Armado ───────────────────────────────────────────────────────────────────
const secciones = paginas
  .map(
    (p, i) =>
      `<div class="pagina-preview" data-ruta="${p.ruta}" data-nombre="${p.nombre}"${i === 0 ? "" : ' hidden'}>\n${p.cuerpo}\n</div>`
  )
  .join("\n\n");

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
:root { ${declaraciones.join("; ")}; }

.pagina-preview[hidden] { display: none; }

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

${secciones}

<p class="aviso-preview">Previsualización · Las seis páginas navegan entre sí; el mapa y los pedidos van al sitio real</p>

<script>
// Tabla de fotos: cada una aparece una sola vez en el archivo y se reparte
// entre todos los <img data-foto>. Se asigna en cuanto se parsea este bloque,
// y como son data URI la carga es inmediata: no hay petición ni parpadeo.
var FOTOS = ${JSON.stringify(fotos)};
(function () {
  var pendientes = document.querySelectorAll("img[data-foto]");
  for (var i = 0; i < pendientes.length; i++) {
    var uri = FOTOS[pendientes[i].getAttribute("data-foto")];
    if (uri) pendientes[i].src = uri;
  }
})();
</script>

<script>
(function () {
  var paginas = [].slice.call(document.querySelectorAll(".pagina-preview"));
  var porRuta = {};
  paginas.forEach(function (el) { porRuta[el.dataset.ruta] = el; });

  function activa() {
    for (var i = 0; i < paginas.length; i++) if (!paginas[i].hidden) return paginas[i];
    return paginas[0];
  }

  // El desplazamiento a un ancla se resuelve DENTRO de la página visible. Los
  // identificadores se repiten entre páginas (#paquetes está en la portada y en
  // el menú), así que getElementById devolvería el de una página oculta.
  function irAlAncla(pagina, ancla) {
    if (!ancla) { window.scrollTo(0, 0); return; }
    var destino = pagina.querySelector('[id="' + ancla + '"]');
    if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo(0, 0);
  }

  function mostrar(ruta, ancla) {
    var destino = porRuta[ruta];
    if (!destino) return false;
    paginas.forEach(function (el) { el.hidden = el !== destino; });
    document.title = destino.dataset.nombre + " — Tortas Ahogadas Don Eddy";
    // El menú móvil se cierra al cambiar de página, como en el sitio real.
    cerrarMenus();
    irAlAncla(destino, ancla);
    return true;
  }

  function cerrarMenus() {
    paginas.forEach(function (pagina) {
      var menu = pagina.querySelector("#menu-movil");
      var boton = pagina.querySelector('header button[aria-controls="menu-movil"]');
      if (menu) menu.style.display = "none";
      if (boton) boton.setAttribute("aria-expanded", "false");
    });
  }

  document.addEventListener("click", function (e) {
    // El menú de hamburguesa es lo único que necesita interacción propia; el
    // resto de la página es HTML y CSS.
    var boton = e.target.closest && e.target.closest('header button[aria-controls="menu-movil"]');
    if (boton) {
      var menu = boton.closest(".pagina-preview").querySelector("#menu-movil");
      if (!menu) return;
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", String(!abierto));
      menu.style.display = abierto ? "none" : "block";
      return;
    }

    var enlace = e.target.closest && e.target.closest("a[href]");
    if (!enlace) return;
    var href = enlace.getAttribute("href");
    // Los enlaces externos (WhatsApp, teléfono, Maps, Instagram) se dejan pasar.
    if (!href || (href.charAt(0) !== "/" && href.charAt(0) !== "#")) return;

    e.preventDefault();
    if (href.charAt(0) === "#") { irAlAncla(activa(), href.slice(1)); return; }

    var partes = href.split("#");
    if (!mostrar(partes[0], partes[1])) irAlAncla(activa(), partes[1]);
  });

  cerrarMenus();
})();
</script>
`;

const fs = await import("node:fs/promises");
await fs.writeFile(OUT, salida);
const kb = (await fs.stat(OUT)).size / 1024;
console.log(`\nRecursos incrustados: ${total.toFixed(0)} KB`);
console.log(`Archivo final: ${OUT} — ${kb.toFixed(0)} KB`);
