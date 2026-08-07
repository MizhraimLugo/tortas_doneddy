import { ChevronRight } from "lucide-react";
import Link from "next/link";

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
};

export function Breadcrumbs({ trail }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-brand-ink/60">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}

              {isLast ? (
                // El elemento actual no se enlaza a sí mismo.
                <span aria-current="page" className="font-semibold text-brand-ink/80">
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
