import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Migas de pan.
 *
 * Además de orientar al usuario, Google las muestra en el resultado de búsqueda
 * en lugar de la URL cruda cuando existe el `BreadcrumbList` correspondiente en
 * JSON-LD (ver `breadcrumbNode` en lib/schema). Un resultado que dice
 * "Inicio › Menú" se lee mejor que "tortasdoneddy.mx/menu" y suele mejorar el
 * porcentaje de clics.
 */

type BreadcrumbsProps = {
  trail: Array<{ name: string; path: string }>;
  /**
   * `cream` para las migas que van sobre la banda roja del encabezado de
   * página. El gris de `ink/60` sobre rojo queda por debajo del mínimo de
   * contraste, así que sobre fondo oscuro se cambia el juego de colores entero
   * en vez de bajarle la opacidad al mismo tono.
   */
  tone?: "ink" | "cream";
};

export function Breadcrumbs({ trail, tone = "ink" }: BreadcrumbsProps) {
  const onDark = tone === "cream";

  return (
    <nav aria-label="Ruta de navegación">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-sm",
          onDark ? "text-cream/75" : "text-ink/60"
        )}
      >
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}

              {isLast ? (
                // El elemento actual no se enlaza a sí mismo.
                <span
                  aria-current="page"
                  className={cn("font-semibold", onDark ? "text-gold" : "text-ink/80")}
                >
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:underline">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
