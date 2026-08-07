import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Tarjeta base: borde de tinta grueso y sombra dura, como un cartel pegado en
 * la pared del puesto. El radio es amplio para que no se lea rígido.
 */
export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("rounded-3xl border-2 border-ink bg-white shadow-stamp", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-6", className)} {...props} />;
}
