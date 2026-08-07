# Tortas Ahogadas Don Eddy — sitio web

Sitio del negocio construido con **Next.js (App Router) + TypeScript + Tailwind CSS**,
optimizado para búsqueda tradicional (Google) y para búsqueda con modelos de
lenguaje (ChatGPT, Perplexity, Google AI Overviews).

---

## Arranque rápido

```bash
npm install
cp .env.example .env.local     # y completa NEXT_PUBLIC_SITE_URL
npm run dev                    # http://localhost:3000
```

Otros comandos:

```bash
npm run build       # build de producción
npm run start       # sirve el build
npm test            # 52 tests de consistencia de datos y SEO
npm run typecheck   # verificación de tipos
```

---

## ⚠️ Antes de publicar

El sitio funciona, pero hay datos que solo el negocio puede confirmar. Están
marcados con `TODO(negocio)` en el código. Búscalos con:

```bash
grep -rn "TODO(negocio)" src/
```

### Bloqueantes

| Qué | Dónde | Por qué importa |
|---|---|---|
| **Dominio real** | `.env.local` → `NEXT_PUBLIC_SITE_URL` | De ahí salen las URLs canónicas, el sitemap y los `@id` del JSON-LD. Con el valor por defecto, Google indexa direcciones equivocadas. |
| **Logo** | `public/brand/logo.png` | Ahora se muestra un monograma "DE" de respaldo. Ver `public/brand/LEEME.md`. |
| **URLs reales de Rappi y Uber Eats** | `src/data/business.ts` → `links` | Hoy apuntan a la portada genérica de cada plataforma: el cliente aterriza en un buscador y tiene que encontrarte solo. Es un pedido perdido por cada clic. |
| **Revisión legal** | `/privacidad` y `/terminos` | Son plantillas. En México el aviso de privacidad es obligatorio: tomar un pedido por WhatsApp con nombre, teléfono y dirección es tratamiento de datos personales. |

### A confirmar

- **Precios de bebidas** (`src/data/menu.ts`). Refresco de 355 ml, agua fresca de
  500 ml y agua natural de 1 L están capturados los tres a $35. Puede ser
  correcto, pero conviene verificar que no sea un error de captura.
- **Año de apertura** (`founded`). Está puesto en **1995**, tomado del "DESDE
  1995" que aparece en el logo y en la portada del diseño de referencia. Se
  publica como `foundingDate` en el JSON-LD; si el año no es exacto, se corrige
  en `src/data/business.ts` y cambia en todo el sitio.
- **Formas de pago** (`src/data/business.ts` → `paymentAccepted`). Se dejó vacío a
  propósito: publicar "aceptamos tarjeta" sin terminal genera fricción en el
  mostrador y reseñas negativas.
- **Precios de los combos.** Se conservan los del código original, que cuadran
  exactamente con el menú (verificado por test). El diseño de referencia traía
  otros números —Maxi de 8 tortas + 15 tacos a $826→$645 y un "Combo Individual
  próximamente"—; ese $826 además no cuadra: 8 × $75 + 15 × $15 = **$825**. Si
  los correctos son esos, se capturan en `src/data/combos.ts` y el precio
  regular se recalcula solo.
- **Preguntas pendientes del FAQ** (`src/data/faq.ts`, al final del archivo):
  tiempo de entrega, pedido mínimo, costo de envío y estacionamiento. Tienen
  volumen de búsqueda alto y conviene publicarlas en cuanto se confirmen.
- **Venta de alcohol a domicilio** (`/terminos`). El menú incluye cerveza;
  confirmar qué permite la normativa municipal de Zapopan.

---

## Después de publicar: la parte que no es código

El sitio es la mitad del trabajo. Para un negocio local, esto es lo que
realmente mueve el tráfico, en orden de impacto:

1. **Google Business Profile.** Es la fuente #1 de clientes de un restaurante
   local, por encima del sitio web. Reclama la ficha, verifica el domicilio y
   asegúrate de que el nombre, la dirección y el teléfono estén **idénticos** a
   los de este sitio (los datos exactos están en `src/data/business.ts`). La
   inconsistencia entre ficha y sitio es de los errores que más cuestan en
   posicionamiento local.

2. **Fotos.** El sitio no tiene ni una foto de comida y es la carencia más cara
   que queda. Afecta conversión y posicionamiento a la vez. Instrucciones y
   nombres de archivo recomendados en `public/brand/LEEME.md`.

3. **Google Search Console.** Da de alta el dominio, pega el código de
   verificación en `src/app/layout.tsx` (hay un bloque comentado listo) y envía
   `sitemap.xml`. Sin esto no sabes por qué consultas te encuentran.

4. **Reseñas reales.** El JSON-LD deja fuera `aggregateRating` a propósito:
   inventar calificaciones viola las políticas de Google y puede costar una
   penalización manual sobre el dominio. Cuando tengas reseñas verdaderas en
   Google Business Profile, se conectan con sus valores reales.

5. **Analítica.** El código de medición ya está listo (`src/lib/analytics.ts`):
   cada botón de pedido dispara un evento con el canal y su posición. Solo falta
   cargar el script de GA4. Después de un mes sabrás si conviene más WhatsApp o
   las plataformas, y qué botón mover.

---

## Sistema visual

La referencia no es una landing de software, es la **rotulación pintada de las
fondas del occidente de México**. De ahí salen todas las decisiones:

- **Tipografía.** *Alfa Slab One* para títulos —una losa pesada que evoca los
  rótulos pintados a mano— y *Barlow* para el texto, una grotesca de señalética
  que aguanta bien en tamaños chicos. Se auto-hospedan con `next/font`: cero
  peticiones a Google en tiempo de ejecución y sin salto de layout.
- **Color.** Rojo chile profundo (`#9B1209`) como campo dominante, dorado como
  el acento que salta, crema como papel. Todos los pares de contraste están
  medidos y documentados en `globals.css`; el rojo vivo de marca (`#E9241A`) se
  reserva para acentos porque como fondo de botón da 4.4:1 y reprueba WCAG AA.
- **Textura.** Grano de cartel impreso y trama de medio tono, ambos en SVG
  embebido: dan sensación de tinta sobre papel sin pedir una sola imagen.
- **Papel picado.** El remate dentado entre secciones es el detalle que vuelve
  la página reconocible. Es un `<path>` de SVG, pesa unos bytes.
- **Sombras duras desplazadas** en vez de difuminado digital, como capas de
  serigrafía. Los botones se "hunden" al presionarlos.

Las secciones son Server Components: el sitio manda muy poco JavaScript al
cliente, lo que cuenta para Core Web Vitals.

## Qué se hizo para posicionar

### El cambio de fondo: renderizado en servidor

La versión anterior inyectaba el JSON-LD desde un `useEffect`, o sea desde el
navegador. **Los crawlers de IA no ejecutan JavaScript** — GPTBot, ClaudeBot,
PerplexityBot y CCBot leen el HTML tal como llega del servidor. Para ellos, ese
JSON-LD no existía.

Ahora todo el sitio se genera de forma estática en el build. Se puede comprobar:

```bash
npm run build && npm run start
curl -s http://localhost:3000/ | grep -c "application/ld+json"
```

### SEO tradicional

- **Metadatos completos** por página: título, descripción, canónica, Open Graph
  y Twitter Card, con longitudes verificadas por tests.
- **JSON-LD como grafo conectado** (`src/lib/schema.ts`): `Restaurant`,
  `WebSite`, `Menu` con los 13 platillos y sus precios, `FAQPage`,
  `BreadcrumbList` y `Article`, enlazados entre sí por `@id`.
- **Datos locales**: teléfono en E.164, coordenadas exactas, horario estructurado
  con el martes excluido, zonas de reparto como lugares tipados.
- **`sitemap.xml`** generado desde la misma lista que la navegación, excluyendo
  las páginas con `noindex`.
- **Imagen Open Graph** generada en el build (`src/app/opengraph-image.tsx`), que
  es la tarjeta que aparece al compartir el enlace en WhatsApp.
- **Arquitectura de páginas** por intención de búsqueda:

  | Página | Intención que ataca |
  |---|---|
  | `/` | Marca y navegación general |
  | `/menu` | Comercial: "menú tortas ahogadas Zapopan", "precio torta ahogada" |
  | `/tortas-ahogadas-a-domicilio-zapopan` | Transaccional: la de mayor intención de compra |
  | `/que-es-una-torta-ahogada` | Informativa: tráfico nuevo y autoridad temática |

### Búsqueda con IA

- **`robots.txt` permite explícitamente a los crawlers de modelos**
  (`src/app/robots.ts`). Es una decisión de negocio: bloquearlos por reflejo
  equivale a renunciar a que ChatGPT o Perplexity te recomienden cuando alguien
  pregunta dónde comer tortas ahogadas en Zapopan.
- **`/llms.txt`** (`src/app/llms.txt/route.ts`): resumen del negocio en Markdown
  plano, con menú completo, precios, horario, cobertura y FAQ. Se genera desde
  los mismos datos que la página, así que no se desactualiza.
- **Respuestas redactadas para ser citadas**: en `src/data/faq.ts` cada respuesta
  contiene el dato completo en la primera oración y es autónoma, porque un
  modelo puede extraer una sola pregunta sin el resto de la página.
- **`speakable`** en el JSON-LD para asistentes de voz, apuntando a los bloques
  marcados con `data-speakable`.
- **La guía de la torta ahogada** existe precisamente porque los motores
  generativos citan fuentes al responder preguntas de definición.

### Conversión

- Barra fija de pedido en móvil, siempre visible.
- Enlaces de WhatsApp con el mensaje ya escrito, distinto según el contexto
  (portada, combo específico, consulta de cobertura).
- Jerarquía invertida: el botón de pedir es el dominante, no el terciario.
- Canales sin comisión (WhatsApp, teléfono) antes que las plataformas.

---

## Estructura

```
src/
├── app/                    Páginas y rutas especiales (robots, sitemap, llms.txt, OG)
├── components/
│   ├── sections/           Bloques de página, todos Server Components
│   └── ui/                 Botón y tarjeta
├── data/                   ⭐ Fuente única de verdad — se edita aquí
│   ├── business.ts         NAP, horario, cobertura, enlaces
│   ├── menu.ts             Platillos y precios
│   ├── combos.ts           Paquetes (el precio regular se calcula solo)
│   ├── faq.ts              Preguntas y respuestas
│   └── nav.ts              Navegación y páginas del sitemap
└── lib/
    ├── schema.ts           Constructores de JSON-LD
    ├── seo.ts              Constructor de metadatos
    └── analytics.ts        Medición de conversión
```

**Para cambiar un precio, un horario o una dirección se toca únicamente
`src/data/`.** El texto visible, el JSON-LD, el `llms.txt` y los metadatos
derivan de ahí, así que no pueden quedar desincronizados. Los tests verifican
esa consistencia.

---

## Tests

```bash
npm test
```

Cubren lo que puede romperse en silencio:

- Los precios de los combos cuadran con el menú (se calculan, no se escriben).
- La escalera de combos no tiene arbitraje: el paquete grande siempre conviene.
- El JSON-LD lleva teléfono, dirección y coordenadas, y sus nodos se enlazan.
- **No hay `aggregateRating`**: ninguna calificación inventada.
- No quedan URLs de ejemplo ni anclas relativas en los datos estructurados.
- El número que se muestra y el que se marca son el mismo.
- Títulos y descripciones dentro del largo visible en el resultado de búsqueda.
- Las páginas con `noindex` no aparecen en el sitemap.
- No quedan notas de desarrollo en el texto que ve el cliente.

Estos tests sustituyen a los `console.assert` de la versión anterior, que
corrían dentro de un `useEffect`, no rompían nada al fallar y —por cómo detectaban
el entorno— podían acabar ejecutándose también en producción.
