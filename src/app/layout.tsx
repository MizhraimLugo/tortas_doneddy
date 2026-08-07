import type { Metadata, Viewport } from "next";
import { Alfa_Slab_One, Barlow } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyOrderBar } from "@/components/sticky-order-bar";
import { SITE_URL, business } from "@/data/business";
import { graph, restaurantNode, websiteNode } from "@/lib/schema";

import "./globals.css";

/**
 * Tipografías.
 *
 * Alfa Slab One es una losa pesada que evoca directamente la rotulación
 * pintada de fondas y cantinas mexicanas; Barlow es una grotesca ligeramente
 * condensada con aire de señalética, que aguanta bien en tamaños chicos.
 *
 * `next/font` las descarga en el build y las auto-hospeda: no hay petición a
 * Google en tiempo de ejecución (mejor privacidad y mejor LCP) y `display:
 * swap` con métricas de respaldo evita el salto de layout que castiga CLS.
 */
const alfa = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alfa",
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  // Base para resolver todas las URLs relativas (canónicas, Open Graph, sitemap).
  metadataBase: new URL(SITE_URL),

  title: {
    // Cada página aporta su título; la marca se agrega aquí una sola vez.
    //
    // El sufijo es "Don Eddy Zapopan" y no el nombre completo del negocio para
    // no gastar caracteres: Google corta el título alrededor de los 60 y
    // "| Tortas Ahogadas Don Eddy" se llevaba 27 de ellos, dejando muy poco
    // espacio útil. El sufijo corto conserva marca y ciudad.
    template: "%s | Don Eddy Zapopan",
    default: `Tortas Ahogadas en Zapopan | ${business.name}`,
  },
  description: business.description,

  applicationName: business.name,
  authors: [{ name: business.name, url: SITE_URL }],
  creator: business.name,
  publisher: business.name,
  category: "Restaurante",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Sin esto Google limita la vista previa a una miniatura. Las imágenes
      // grandes son requisito para aparecer en Discover y mejoran el CTR.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  formatDetection: {
    // Permite que el navegador móvil convierta el teléfono en enlace de llamada.
    telephone: true,
    address: true,
  },

  // TODO(negocio): pegar los códigos de verificación al dar de alta el sitio en
  // Google Search Console y Bing Webmaster Tools. Sin Search Console no hay
  // forma de saber por qué consultas te encuentran ni de pedir indexación.
  // verification: { google: "...", other: { "msvalidate.01": "..." } },

  // El favicon lo genera `src/app/icon.tsx`; Next lo detecta y lo enlaza solo,
  // así que no hace falta declararlo aquí.
};

export const viewport: Viewport = {
  themeColor: "#9b1209",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `es-MX` y no solo `es`: le indica a buscadores y modelos que el contenido
    // es de México, lo cual importa para consultas locales y para el vocabulario
    // ("birote", "buche") que no se usa igual en otros países hispanohablantes.
    <html lang="es-MX" className={`${alfa.variable} ${barlow.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#contenido" className="skip-link rounded-lg bg-ink px-4 py-2 font-semibold text-white">
          Saltar al contenido
        </a>

        <SiteHeader />

        <main id="contenido">{children}</main>

        <SiteFooter />
        <StickyOrderBar />

        {/*
          Entidad del negocio y del sitio, presentes en TODAS las páginas.
          Cada página agrega además sus propios nodos (menú, FAQ, artículo)
          que apuntan a estos por `@id`.
        */}
        <JsonLd data={graph(restaurantNode(), websiteNode())} />
      </body>
    </html>
  );
}
