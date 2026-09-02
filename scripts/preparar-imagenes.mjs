/**
 * Prepara las imágenes de marca para el sitio.
 *
 *   node scripts/preparar-imagenes.mjs
 *
 * Qué hace y por qué:
 *
 * 1. Normaliza los nombres. Al subir archivos por la web de GitHub es común que
 *    queden con la extensión duplicada ("logo.png.jpg"), porque uno escribe el
 *    nombre completo y el navegador vuelve a añadir la del archivo original.
 *
 * 2. Quita el fondo blanco del logotipo y del personaje. Ambos llegaron como
 *    JPEG, formato que no admite transparencia, así que sobre el color crema del
 *    sitio se verían dentro de una caja blanca.
 *
 *    El recorte NO es "todo lo blanco se borra": eso se comería el texto blanco
 *    de adentro del óvalo. Se hace un relleno por inundación desde los bordes,
 *    que solo alcanza el blanco conectado al exterior. El contorno negro del
 *    logotipo actúa de muro y protege lo de adentro.
 *
 * 3. Recorta el margen sobrante y exporta PNG con transparencia.
 *
 * Las fotos de platillos NO se tocan: `next/image` ya las convierte a AVIF y
 * WebP y genera los tamaños necesarios en tiempo de ejecución. Procesarlas aquí
 * solo destruiría calidad del original.
 */

import { existsSync } from "node:fs";
import { readdir, rename, unlink } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const BRAND_DIR = "public/brand";

/** Archivos que solo hay que renombrar. */
const RENOMBRAR = [
  ["torta-ahogada-don-eddy.jpg.jpeg", "torta-ahogada-don-eddy.jpg"],
  ["tacos-dorados-don-eddy.jpg.jpeg", "tacos-dorados-don-eddy.jpg"],
];

/** Archivos a los que hay que quitarles el fondo blanco. */
const RECORTAR = [
  { origen: "logo.png.jpg", destino: "logo.png" },
  { origen: "don-eddy-personaje.png.jpeg", destino: "don-eddy-personaje.png" },
];

/**
 * Convierte en transparente el fondo blanco conectado a los bordes.
 *
 * @param umbral   Brillo mínimo (0-255) para considerar un píxel "fondo".
 * @param suavizar Rango de brillo en el que la transparencia es parcial, para
 *                 que el borde no quede dentado ni con halo gris del JPEG.
 */
async function quitarFondo(entrada, salida, { umbral = 232, suavizar = 26 } = {}) {
  const img = sharp(entrada).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const esClaro = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Además de brillante, tiene que ser poco saturado: así el rojo del óvalo
    // nunca se confunde con fondo aunque sea luminoso.
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return min >= umbral - suavizar && max - min <= 24;
  };

  // Relleno por inundación desde el marco. Solo el blanco que se comunica con
  // el exterior se vuelve transparente; el de adentro del óvalo queda intacto.
  const fondo = new Uint8Array(width * height);
  const pila = [];

  for (let x = 0; x < width; x++) {
    pila.push(x, x + (height - 1) * width);
  }
  for (let y = 0; y < height; y++) {
    pila.push(y * width, width - 1 + y * width);
  }

  while (pila.length) {
    const p = pila.pop();
    if (fondo[p]) continue;
    if (!esClaro(p * channels)) continue;

    fondo[p] = 1;
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) pila.push(p - 1);
    if (x < width - 1) pila.push(p + 1);
    if (y > 0) pila.push(p - width);
    if (y < height - 1) pila.push(p + width);
  }

  // Aplica la transparencia con degradado en el borde para evitar el dentado.
  let recortados = 0;
  for (let p = 0; p < width * height; p++) {
    if (!fondo[p]) continue;
    const i = p * channels;
    const brillo = Math.min(data[i], data[i + 1], data[i + 2]);
    // Cuanto más blanco, más transparente; el rango intermedio se desvanece.
    const alfa = brillo >= umbral ? 0 : Math.round(((umbral - brillo) / suavizar) * 255);
    data[i + 3] = Math.max(0, Math.min(255, alfa));
    recortados++;
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .trim() // elimina el margen transparente que quedó alrededor
    .toFile(salida);

  const meta = await sharp(salida).metadata();
  const pct = ((recortados / (width * height)) * 100).toFixed(0);
  console.log(
    `  ✓ ${path.basename(salida)} — ${meta.width}×${meta.height} px, ${pct} % del área era fondo`
  );
}

async function main() {
  console.log("Preparando imágenes de marca…\n");

  console.log("Renombrando fotos (sin tocar el contenido):");
  for (const [origen, destino] of RENOMBRAR) {
    const desde = path.join(BRAND_DIR, origen);
    const hacia = path.join(BRAND_DIR, destino);
    if (!existsSync(desde)) {
      console.log(`  · ${origen} no está, se omite`);
      continue;
    }
    await rename(desde, hacia);
    const meta = await sharp(hacia).metadata();
    console.log(`  ✓ ${destino} — ${meta.width}×${meta.height} px`);
  }

  console.log("\nQuitando el fondo blanco:");
  for (const { origen, destino } of RECORTAR) {
    const desde = path.join(BRAND_DIR, origen);
    if (!existsSync(desde)) {
      console.log(`  · ${origen} no está, se omite`);
      continue;
    }
    await quitarFondo(desde, path.join(BRAND_DIR, destino));
    await unlink(desde);
  }

  console.log("\nContenido final de public/brand:");
  for (const f of (await readdir(BRAND_DIR)).sort()) {
    console.log(`  ${f}`);
  }
}

main().catch((error) => {
  console.error("Falló la preparación:", error.message);
  process.exit(1);
});
