"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { business } from "@/data/business";
import { cn } from "@/lib/utils";

/**
 * Logo con respaldo tipográfico.
 *
 * Dos problemas resueltos aquí, ambos detectados ejecutando la página:
 *
 * 1. En la versión anterior la cadena de respaldos nunca llegaba a usarse. El
 *    logo del encabezado y el del pie compartían estado pero tenían manejadores
 *    distintos, y el del pie llamaba `setLogoFailed(true)` de inmediato. Como el
 *    respaldo ganaba el render, los candidatos 2 y 3 quedaban muertos. Ahora la
 *    lógica vive en un solo componente con estado propio por instancia.
 *
 * 2. La imagen viene en el HTML del servidor, así que el navegador intenta
 *    cargarla y falla ANTES de que React hidrate y conecte el `onError`. El
 *    evento se pierde y el usuario se queda viendo el icono de imagen rota.
 *    Por eso, al montar, se comprueba también el estado real del elemento
 *    (`complete` y `naturalWidth`) en vez de confiar solo en el evento.
 */

const CANDIDATES = ["/brand/logo.png", "/brand/logo.jpg", "/brand/logo.svg"];

type BrandLogoProps = {
  /** Lado del logo en píxeles. */
  size?: number;
  className?: string;
  /**
   * `true` cuando es el logo principal (encabezado). El del pie es decorativo
   * porque el nombre del negocio ya aparece como texto a su lado.
   */
  priority?: boolean;
};

export function BrandLogo({ size = 64, className, priority = false }: BrandLogoProps) {
  const [index, setIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const exhausted = index >= CANDIDATES.length;

  const advance = useCallback(() => setIndex((current) => current + 1), []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // `complete` con `naturalWidth` en cero significa que la carga ya terminó y
    // falló. Es la única forma de detectar un error ocurrido antes de hidratar.
    if (img.complete && img.naturalWidth === 0) advance();
  }, [index, advance]);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "border-2 border-ink bg-gold",
        className
      )}
      style={{ width: size, height: size }}
    >
      {exhausted ? (
        // Respaldo deliberado: monograma en la tipografía de marca. Se lee como
        // una decisión de diseño, no como una imagen rota.
        <span
          aria-hidden="true"
          className="font-display leading-none text-chile"
          style={{ fontSize: size * 0.38 }}
        >
          DE
        </span>
      ) : (
        <img
          ref={imgRef}
          // `key` fuerza a React a crear un elemento nuevo por cada candidato.
          // Sin esto reutilizaría el mismo nodo y, si el navegador ya tiene el
          // error en caché, podría no volver a emitirlo.
          key={CANDIDATES[index]}
          src={CANDIDATES[index]}
          alt={priority ? `Logo de ${business.name}` : ""}
          // `width`/`height` explícitos reservan el espacio antes de que cargue
          // la imagen y evitan salto de layout (CLS), una de las tres métricas
          // de Core Web Vitals que Google usa para posicionar.
          width={size}
          height={size}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority && { fetchPriority: "high" as const })}
          className="h-full w-full object-contain"
          onError={advance}
        />
      )}
    </span>
  );
}
