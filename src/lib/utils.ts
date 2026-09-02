/**
 * Une clases condicionalmente.
 *
 * Se resuelve sin `clsx` ni `tailwind-merge` a propósito: los componentes de
 * este proyecto exponen variantes explícitas en vez de permitir que quien los
 * usa sobreescriba clases base. Así no hay conflictos que resolver en tiempo de
 * ejecución y el bundle del cliente queda más chico, lo cual cuenta para Core
 * Web Vitals (que sí es factor de posicionamiento).
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
