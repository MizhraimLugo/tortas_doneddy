import { cn } from "@/lib/utils";

/**
 * Ornamentos del sistema visual.
 *
 * Son los elementos que le dan carácter regional al sitio y lo separan de una
 * landing genérica: el remate de papel picado, los títulos de sección con regla
 * dorada y los separadores. Todos son SVG o CSS puro, así que no pesan nada ni
 * piden red.
 */

/**
 * Remate de papel picado.
 *
 * Corta el borde inferior de un bloque de color con la silueta del papel picado
 * de fiesta mexicana. Es el detalle que vuelve la página reconocible: nadie más
 * en el rubro lo tiene, y cuesta unos pocos bytes de SVG.
 */
export function PapelPicado({
  className,
  color = "var(--color-cream)",
  flip = false,
}: {
  className?: string;
  /** Color del papel que "queda", normalmente el de la sección siguiente. */
  color?: string;
  /** `true` para colgarlo del borde superior en vez del inferior. */
  flip?: boolean;
}) {
  return (
    <svg
      className={cn("block w-full", flip && "rotate-180", className)}
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ height: "clamp(14px, 2.2vw, 26px)" }}
    >
      {/*
        Doce festones con un semicírculo y una perforación central, que es la
        estructura real del papel picado de banderín.
      */}
      <path
        fill={color}
        d="M0 12 V6 Q5 12 10 6 Q15 0 20 6 Q25 12 30 6 Q35 0 40 6 Q45 12 50 6 Q55 0 60 6 Q65 12 70 6 Q75 0 80 6 Q85 12 90 6 Q95 0 100 6 Q105 12 110 6 Q115 0 120 6 V12 Z"
      />
    </svg>
  );
}

/**
 * Encabezado de sección con regla dorada.
 *
 * Mantiene la jerarquía semántica intacta (`h2` real, no un div con estilos)
 * porque los modelos de lenguaje usan los encabezados para decidir qué
 * fragmento responde a una consulta.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "ink",
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "cream";
  id?: string;
}) {
  const centered = align === "center";
  const onDark = tone === "cream";

  return (
    <div className={cn(centered && "text-center", centered && "mx-auto max-w-3xl")}>
      <p
        className={cn(
          "flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em]",
          centered && "justify-center",
          onDark ? "text-gold" : "text-brand-red-dark"
        )}
      >
        <span
          aria-hidden="true"
          className={cn("h-px w-8", onDark ? "bg-gold/60" : "bg-brand-red-dark/40")}
        />
        {eyebrow}
        <span
          aria-hidden="true"
          className={cn("h-px w-8", onDark ? "bg-gold/60" : "bg-brand-red-dark/40")}
        />
      </p>

      <h2
        id={id}
        className={cn(
          "mt-4 text-[clamp(2rem,5vw,3.25rem)]",
          onDark ? "text-cream" : "text-ink"
        )}
      >
        {title}
      </h2>

      {intro && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed md:text-lg",
            centered && "mx-auto",
            onDark ? "text-cream/85" : "text-ink/75"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

/** Separador con rombo central, como los remates de un menú impreso. */
export function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-3 py-2", className)}
    >
      <span className="h-px w-16 bg-ink/15" />
      <span className="h-2 w-2 rotate-45 bg-gold" />
      <span className="h-px w-16 bg-ink/15" />
    </div>
  );
}
