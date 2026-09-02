"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { business } from "@/data/business";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * Logotipo con respaldo tipográfico.
 *
 * El logo real es un óvalo horizontal, no un cuadrado. La versión anterior lo
 * encerraba en un círculo con borde propio, lo que habría recortado el óvalo y
 * duplicado un contorno que el logotipo ya trae. Ahora se renderiza a su
 * proporción natural: se fija la altura, el ancho se acomoda y `object-contain`
 * hace el resto, así funciona igual si el archivo viene recortado o con margen.
 *
 * Dos problemas heredados que se resuelven aquí:
 *
 *  1. En la versión original la cadena de respaldos nunca llegaba a usarse: el
 *     logo del encabezado y el del pie compartían estado pero tenían
 *     manejadores distintos, y el del pie se rendía de inmediato. La lógica vive
 *     ahora en un solo componente con estado propio por instancia.
 *  2. La imagen viene en el HTML del servidor, así que el navegador intenta
 *     cargarla y falla ANTES de que React hidrate y conecte el `onError`. El
 *     evento se pierde y quedaría el icono de imagen rota, por eso al montar se
 *     comprueba también `complete` y `naturalWidth`.
 */

const CANDIDATES = [images.logo, "/brand/logo.jpg", "/brand/logo.svg"];

type BrandLogoProps = {
  /** Altura en píxeles; el ancho se calcula solo. */
  height?: number;
  className?: string;
  /**
   * `true` en el logo principal (encabezado): carga con prioridad y lleva texto
   * alternativo. El del pie es decorativo porque el nombre del negocio ya
   * aparece como texto a su lado.
   */
  priority?: boolean;
};

export function BrandLogo({ height = 52, className, priority = false }: BrandLogoProps) {
  const [index, setIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const exhausted = index >= CANDIDATES.length;

  const advance = useCallback(() => setIndex((current) => current + 1), []);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) advance();
  }, [index, advance]);

  if (exhausted) {
    // Respaldo deliberado: monograma en la tipografía de marca. Se lee como una
    // decisión de diseño y no como una imagen rota.
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full",
          "border-2 border-ink bg-gold font-display leading-none text-chile",
          className
        )}
        style={{ width: height, height, fontSize: height * 0.38 }}
      >
        DE
      </span>
    );
  }

  return (
    <img
      ref={imgRef}
      // `key` fuerza un elemento nuevo por candidato: sin esto React reutiliza
      // el mismo nodo y, con el error ya en caché, podría no volver a emitirlo.
      key={CANDIDATES[index]}
      src={CANDIDATES[index]}
      alt={priority ? `Logotipo de ${business.name}` : ""}
      // La altura fija reserva el espacio antes de que cargue y evita salto de
      // layout (CLS), una de las tres métricas de Core Web Vitals que Google usa
      // para posicionar. El ancho es tentativo; `w-auto` lo corrige al cargar.
      width={Math.round(height * 2.1)}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority && { fetchPriority: "high" as const })}
      className={cn("block w-auto shrink-0 object-contain", className)}
      style={{ height }}
      onError={advance}
    />
  );
}
