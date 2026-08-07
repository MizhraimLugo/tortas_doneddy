import { cn } from "@/lib/utils";

/**
 * Botones y enlaces con apariencia de botón.
 *
 * Contraste: los fondos usan `--brand-red-dark` (#CD1C11) y `--brand-green-dark`
 * (#2F6B3D) en vez de los tonos originales. Medido contra texto blanco, el rojo
 * original (#E9241A) daba 4.44:1 y el verde (#3B874C) 4.42:1 — ambos por debajo
 * del mínimo AA de 4.5:1. Los tonos oscuros superan 5.5:1 sin alterar la
 * identidad de marca, que se conserva en acentos, bordes y textos grandes.
 */

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink " +
  "disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-red-dark text-white hover:bg-brand-green-dark active:bg-brand-green-dark",
  secondary:
    "bg-brand-green-dark text-white hover:bg-brand-red-dark active:bg-brand-red-dark",
  outline:
    "border-2 border-brand-gold bg-white text-brand-ink hover:bg-brand-gold hover:text-brand-ink",
  ghost: "text-brand-ink hover:bg-brand-gold/30",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
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
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
