"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Foto de platillo con respaldo de marca.
 *
 * El negocio todavía no entrega fotos, así que este componente resuelve el
 * hueco sin que se vea inacabado: si el archivo existe lo muestra, y si no,
 * dibuja un mosaico con la trama de medio tono y un icono en color de marca.
 * Se lee como una decisión de diseño, no como una imagen rota.
 *
 * El respaldo NO lleva instrucciones para el desarrollador. Esa fue una de las
 * fallas de la versión original —mostraba al cliente cosas como "en este
 * preview el mapa está desactivado"—; dónde colocar los archivos se documenta
 * en `public/brand/LEEME.md`, que es donde le sirve a quien mantiene el sitio.
 *
 * Igual que en `BrandLogo`, se comprueba `complete`/`naturalWidth` al montar:
 * la imagen viene en el HTML del servidor y puede fallar antes de que React
 * hidrate, en cuyo caso el evento `onError` se pierde y quedaría el icono de
 * imagen rota del navegador.
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
  /** Proporción del hueco; reservarla evita salto de layout (CLS). */
  aspect?: string;
  /** `true` para la imagen principal de la portada (carga prioritaria). */
  priority?: boolean;
  /** Icono del respaldo, en el sistema visual del sitio. */
  fallbackIcon?: React.ReactNode;
};

export function FoodImage({
  src,
  alt,
  className,
  aspect = "4 / 3",
  priority = false,
  fallbackIcon,
}: FoodImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) fail();
  }, [fail]);

  return (
    <div
      className={cn("relative overflow-hidden bg-gold", className)}
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
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority && { fetchPriority: "high" as const })}
          className="absolute inset-0 h-full w-full object-cover"
          onError={fail}
        />
      )}
    </div>
  );
}
