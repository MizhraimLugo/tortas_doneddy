import { Breadcrumbs } from "@/components/breadcrumbs";
import { PapelPicado } from "@/components/ornaments";
import { cn } from "@/lib/utils";

/**
 * Encabezado de página interior.
 *
 * Antes cada página interior abría con migas de pan, un `h1` y un párrafo sobre
 * el crema del fondo, mientras la portada abría con la banda roja, el grano de
 * cartel y el remate de papel picado. El resultado era que el menú y la guía
 * parecían de otro sitio: quien llegaba desde Google a `/menu` no veía nada de
 * la identidad que sí ve quien entra por la portada, y la mayoría del tráfico de
 * búsqueda aterriza justamente en las interiores.
 *
 * Esto unifica esa apertura en un solo lugar. Lo que cambia entre páginas son
 * los datos, no el tratamiento.
 *
 * `data-speakable` va sobre la entrada: es el fragmento que los asistentes de
 * voz leen y el que los motores generativos citan, así que tiene que ser una
 * respuesta autónoma y no un arranque de párrafo.
 */

type PageHeroProps = {
  trail: Array<{ name: string; path: string }>;
  eyebrow: string;
  title: React.ReactNode;
  /** Entrada citable. Se marca como `speakable` salvo que se desactive. */
  intro?: React.ReactNode;
  /** Botones de pedido u otras acciones. */
  actions?: React.ReactNode;
  /** Franja de datos al pie de la banda (horario, dirección…). */
  facts?: React.ReactNode;
  /** Columna derecha: una foto, una tarjeta de precio, lo que pida la página. */
  aside?: React.ReactNode;
  /**
   * `sobrio` baja el tamaño del título y omite el papel picado. Es para las
   * páginas legales, donde la fiesta visual estorba y lo que importa es que el
   * documento se lea.
   */
  variant?: "festivo" | "sobrio";
  /** Color de la sección que sigue, para que el papel picado recorte bien. */
  nextColor?: string;
  speakable?: boolean;
};

export function PageHero({
  trail,
  eyebrow,
  title,
  intro,
  actions,
  facts,
  aside,
  variant = "festivo",
  nextColor = "var(--color-cream)",
  speakable = true,
}: PageHeroProps) {
  const sobrio = variant === "sobrio";

  return (
    <section className="relative isolate bg-chile text-cream">
      <span aria-hidden="true" className="grain absolute inset-0" />

      <div
        className={cn(
          "shell relative",
          sobrio ? "pb-10 pt-8 md:pb-12 md:pt-10" : "pb-14 pt-8 md:pb-16 md:pt-12",
          Boolean(aside) && "grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]"
        )}
      >
        <div>
          <Breadcrumbs trail={trail} tone="cream" />

          <p className="mt-6 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
            {eyebrow}
          </p>

          <h1
            className={cn(
              "mt-4 text-balance",
              sobrio
                ? "text-[clamp(1.9rem,4vw,2.75rem)]"
                : "text-[clamp(2.1rem,4.6vw,3.4rem)]"
            )}
          >
            {title}
          </h1>

          {intro && (
            <p
              {...(speakable && { "data-speakable": true })}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/90"
            >
              {intro}
            </p>
          )}

          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>

        {aside}
      </div>

      {facts && (
        <div className="relative border-t border-cream/15">
          <div className="shell py-5">{facts}</div>
        </div>
      )}

      {!sobrio && <PapelPicado color={nextColor} />}
    </section>
  );
}

/** Dato suelto para la franja del pie del encabezado. */
export function PageHeroFact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-gold">{icon}</span>
      <span>
        <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-gold">
          {label}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-cream/85">{children}</span>
      </span>
    </li>
  );
}
