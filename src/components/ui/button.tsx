import { cn } from "@/lib/utils";

/**
 * Botones y enlaces con apariencia de botón.
 *
 * La sombra dura desplazada (`shadow-stamp`) imita capas de serigrafía y se
 * "hunde" al presionar. Es un detalle táctil que hace que el sitio se sienta
 * hecho a mano y no salido de una plantilla.
 *
 * Contraste medido de cada variante:
 *   primary (chile #9B1209 + crema)     → 7.9:1  ✓ AA y AAA
 *   gold    (#ECBA54 + tinta #1F100C)   → 9.5:1  ✓ AA y AAA
 *   green   (#2F6B3D + blanco)          → 6.4:1  ✓ AA
 * El rojo vivo de marca (#E9241A) queda en 4.4:1, por debajo del mínimo, así
 * que se reserva para acentos y texto grande, nunca como fondo de botón.
 */

export type ButtonVariant =
  | "primary"
  | "gold"
  | "green"
  | "outline"
  | "onDark"
  | "onDarkOutline"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const BASE = [
  "group/btn inline-flex items-center justify-center gap-2",
  "rounded-full border-2 font-extrabold uppercase tracking-wide",
  "transition-[transform,box-shadow,background-color,color] duration-150",
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border-ink bg-chile text-cream shadow-stamp hover:bg-chile-deep hover:-translate-y-0.5",
  gold: "border-ink bg-gold text-ink shadow-stamp hover:bg-gold-deep hover:-translate-y-0.5",
  green:
    "border-ink bg-brand-green-dark text-white shadow-stamp hover:bg-brand-green hover:-translate-y-0.5",
  outline:
    "border-ink bg-transparent text-ink hover:bg-ink hover:text-cream",
  // Para usar encima del campo rojo: se invierte el contraste.
  onDark:
    "border-cream bg-cream text-chile shadow-stamp-gold hover:bg-gold hover:text-ink hover:-translate-y-0.5",
  // Variante secundaria sobre rojo, sin sombra: para acciones de apoyo que no
  // deben competir con el llamado principal.
  onDarkOutline:
    "border-cream/45 bg-transparent text-cream hover:border-gold hover:bg-gold hover:text-ink",
  ghost: "border-transparent bg-transparent text-ink hover:bg-gold/40",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.7rem]",
  md: "h-11 px-5 text-xs",
  lg: "h-13 px-7 text-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], extra);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props} />
  );
}
