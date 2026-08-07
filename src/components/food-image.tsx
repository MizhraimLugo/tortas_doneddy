"use client";

import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Foto de platillo, optimizada y con respaldo de marca.
 *
 * Usa `next/image`, que hace en automático lo que si no habría que hacer a mano
 * foto por foto:
 *
 *  - Convierte a AVIF y WebP según lo que soporte el navegador. Un JPG de
 *    fotografía de comida suele bajar entre 40 % y 60 % de peso sin diferencia
 *    visible.
 *  - Genera varios tamaños y sirve el que corresponde: un celular descarga una
 *    versión chica en vez de la original de 1500 px de ancho.
 *  - Recorta al encuadre que pide cada sección con `object-cover`, así la misma
 *    foto vertical funciona en la portada y en una miniatura cuadrada sin tener
 *    que guardar dos archivos.
 *  - Reserva el espacio antes de cargar, de modo que no hay salto de layout
 *    (CLS), que es una de las tres métricas de Core Web Vitals.
 *
 * Todo eso ocurre en el servidor la primera vez que se pide cada tamaño, y
 * después queda en caché. No hay que preparar las imágenes: basta subir el
 * archivo original en buena resolución.
 *
 * Si el archivo todavía no existe, dibuja un mosaico con la trama de medio tono
 * y un icono de marca. El respaldo NO lleva instrucciones para el desarrollador:
 * mostrarle notas técnicas al cliente fue una de las fallas de la versión
 * original. Dónde van los archivos se documenta en `public/brand/LEEME.md`.
 */

type FoodImageProps = {
  /** Ruta dentro de /public, por ejemplo "/brand/torta-ahogada.jpg". */
  src: string;
  /**
   * Texto alternativo. Es SEO real: es lo que lee Google Imágenes, y esa
   * pestaña manda tráfico de gente decidiendo qué se le antoja.
   */
  alt: string;
  className?: string;
  /** Proporción del encuadre. La foto se recorta a esta forma. */
  aspect?: string;
  /**
   * Qué parte de la foto conservar al recortar. Útil cuando el platillo no está
   * al centro del encuadre original.
   */
  focus?: string;
  /**
   * `cover` recorta al encuadre (lo normal en fotos de platillos); `contain`
   * muestra la imagen completa sin cortar, para ilustraciones y personajes,
   * donde recortar la cabeza no es una opción.
   */
  fit?: "cover" | "contain";
  /** Color de fondo del hueco. */
  tone?: "gold" | "cream";
  /** `true` en la imagen principal de la portada: es el LCP de la página. */
  priority?: boolean;
  /**
   * Anchos en los que se muestra, para que el navegador elija el archivo justo.
   * Sin esto `next/image` asume el ancho completo del viewport y descarga de
   * más en móvil.
   */
  sizes?: string;
  /** Icono del respaldo, dentro del sistema visual del sitio. */
  fallbackIcon?: React.ReactNode;
};

export function FoodImage({
  src,
  alt,
  className,
  aspect = "4 / 3",
  focus = "center",
  fit = "cover",
  tone = "gold",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px",
  fallbackIcon,
}: FoodImageProps) {
  const [failed, setFailed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fail = useCallback(() => setFailed(true), []);

  // La imagen viene en el HTML del servidor, así que puede fallar antes de que
  // React hidrate y conecte `onError`. En ese caso el evento se pierde y
  // quedaría el icono de imagen rota del navegador, por eso al montar se revisa
  // también el estado real del elemento.
  useEffect(() => {
    const img = wrapperRef.current?.querySelector("img");
    if (img && img.complete && img.naturalWidth === 0) fail();
  }, [fail]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative overflow-hidden",
        tone === "gold" ? "bg-gold" : "bg-cream",
        className
      )}
      style={{ aspectRatio: aspect }}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span aria-hidden="true" className="halftone absolute inset-0 text-chile/20" />
          <span aria-hidden="true" className="relative text-chile/45">
            {fallbackIcon}
          </span>
          {/* El texto alternativo sigue disponible para lectores de pantalla. */}
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <NextImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          // Debe ser uno de los valores declarados en `images.qualities` de
          // next.config.ts; si no, el optimizador responde 400.
          quality={85}
          className={fit === "contain" ? "object-contain" : "object-cover"}
          style={{ objectPosition: focus }}
          onError={fail}
        />
      )}
    </div>
  );
}
