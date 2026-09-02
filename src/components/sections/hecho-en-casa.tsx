import { Croissant, Beef, Soup, Flame } from "lucide-react";

import { SectionHeading } from "@/components/ornaments";
import { hechoEnCasa } from "@/data/casa";

/**
 * Lo que se hace en casa.
 *
 * Sección de diferenciación y confianza. Va sobre el campo rojo, entre el menú
 * y los paquetes, porque es el argumento que convierte a quien ya vio los
 * precios y está decidiendo.
 *
 * El texto está marcado con `data-speakable`: son los datos que un asistente de
 * voz debería leer si alguien pregunta qué tiene de especial este lugar.
 */

const ICONOS: Record<string, React.ReactNode> = {
  birote: <Croissant className="h-7 w-7" aria-hidden="true" />,
  carnitas: <Beef className="h-7 w-7" aria-hidden="true" />,
  "salsa-dulce": <Soup className="h-7 w-7" aria-hidden="true" />,
  "salsa-picante": <Flame className="h-7 w-7" aria-hidden="true" />,
};

export function HechoEnCasa() {
  return (
    <section id="hecho-en-casa" className="shell py-16 md:py-20">
      <SectionHeading
        eyebrow="Hecho en casa"
        title={
          <>
            Aquí no compramos nada
            <span className="block text-chile">hecho de fuera</span>
          </>
        }
        align="center"
        intro="El pan, la carne y las dos salsas salen de nuestra cocina, el mismo día que te las servimos."
      />

      <ul data-speakable className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {hechoEnCasa.map((item) => (
          <li key={item.id}>
            <article className="flex h-full flex-col rounded-3xl border-2 border-ink bg-white p-6 shadow-stamp">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-gold text-chile">
                {ICONOS[item.id]}
              </span>

              <h3 className="mt-5 text-xl">{item.titulo}</h3>

              <p className="mt-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-brand-green-dark">
                {item.sello}
              </p>

              <p className="mt-3 grow text-sm leading-relaxed text-ink/75">
                {item.texto}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
