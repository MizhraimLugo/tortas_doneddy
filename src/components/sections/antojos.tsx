import { Bike, CupSoda, Sandwich, Soup } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/ornaments";
import { business } from "@/data/business";
import { findMenuItem, formatPrice } from "@/data/menu";

/**
 * Antojos principales.
 *
 * Es la primera parada después de la portada y funciona como índice visual del
 * negocio. Cada tarjeta lleva su precio de arranque en texto plano: "desde $75"
 * se cita en un resultado de IA, "precios accesibles" no.
 *
 * Las tarjetas son enlaces reales (`next/link`), así que además reparten
 * rastreo hacia las páginas internas.
 */
export function Antojos() {
  const antojos = [
    {
      icon: <Sandwich className="h-8 w-8" aria-hidden="true" />,
      title: "Tortas ahogadas",
      desc: "Pierna, buche, cuero o lengua en birote salado, bañadas en salsa de jitomate.",
      price: findMenuItem("torta-ahogada").price,
      href: "/menu#tortas-ahogadas",
    },
    {
      icon: <Soup className="h-8 w-8" aria-hidden="true" />,
      title: "Tacos dorados",
      desc: "De frijol, papa o requesón, solos o con carne encima. Crujientes y con salsa.",
      price: findMenuItem("taco-sencillo").price,
      href: "/menu#tacos-dorados",
    },
    {
      icon: <CupSoda className="h-8 w-8" aria-hidden="true" />,
      title: "Aguas frescas",
      desc: "Jamaica y horchata hechas en casa, bien frías. También refrescos y cerveza.",
      price: findMenuItem("agua-fresca").price,
      href: "/menu#bebidas",
    },
    {
      icon: <Bike className="h-8 w-8" aria-hidden="true" />,
      title: "A domicilio",
      desc: `Entregamos en ${business.serviceAreas.slice(0, 3).join(", ")} y alrededores.`,
      href: "/tortas-ahogadas-a-domicilio-zapopan",
    },
  ];

  return (
    <section className="shell py-16 md:py-20">
      <SectionHeading
        eyebrow="Antojos principales"
        title="Lo que sale de la plancha"
        align="center"
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {antojos.map((antojo, index) => (
          <li key={antojo.title}>
            <Link
              href={antojo.href}
              className="group flex h-full flex-col rounded-3xl border-2 border-ink bg-white p-6 shadow-stamp transition-transform duration-150 hover:-translate-y-1 focus-visible:-translate-y-1"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-gold text-chile transition-colors group-hover:bg-chile group-hover:text-gold">
                {antojo.icon}
              </span>

              <h3 className="mt-5 text-xl">{antojo.title}</h3>
              <p className="mt-2 grow text-sm leading-relaxed text-ink/70">
                {antojo.desc}
              </p>

              <span className="mt-4 text-sm font-extrabold uppercase tracking-wide text-brand-red-dark">
                {antojo.price ? `Desde ${formatPrice(antojo.price)}` : "Ver cobertura"}
                <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
