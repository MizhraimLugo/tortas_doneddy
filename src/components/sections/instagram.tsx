import { CupSoda, Sandwich, Soup, Store } from "lucide-react";

import { FoodImage } from "@/components/food-image";
import { InstagramIcon } from "@/components/icons/instagram";
import { OrderLink } from "@/components/order-link";
import { business } from "@/data/business";

/**
 * Instagram.
 *
 * En la versión original esta sección eran cuatro cuadros vacíos con un
 * atributo `title` que le hablaba al desarrollador ("Aquí puedes integrar un
 * feed de Instagram") y que los lectores de pantalla anunciaban al usuario.
 *
 * Ahora son huecos de foto reales con respaldo de marca: en cuanto se dejen los
 * archivos en `public/brand/` la sección se llena sola, y mientras tanto se ve
 * como una decisión de diseño y no como algo roto.
 *
 * El enlace al perfil es un `<a>` de verdad, lo que además refuerza la señal de
 * entidad: `sameAs` en el JSON-LD y un enlace rastreable dicen lo mismo.
 */

const ICON = "h-12 w-12";

const POSTS = [
  {
    src: "/brand/instagram-1.jpg",
    alt: "Torta ahogada recién preparada en Tortas Don Eddy",
    icon: <Sandwich className={ICON} aria-hidden="true" />,
  },
  {
    src: "/brand/instagram-2.jpg",
    alt: "Tacos dorados con salsa y repollo",
    icon: <Soup className={ICON} aria-hidden="true" />,
  },
  {
    src: "/brand/instagram-3.jpg",
    alt: "Aguas frescas de jamaica y horchata",
    icon: <CupSoda className={ICON} aria-hidden="true" />,
  },
  {
    src: "/brand/instagram-4.jpg",
    alt: "El local de Tortas Don Eddy en La Cima, Zapopan",
    icon: <Store className={ICON} aria-hidden="true" />,
  },
];

export function Instagram() {
  return (
    <section id="instagram" className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
      <div className="rounded-3xl border-2 border-ink bg-gold-soft p-6 shadow-stamp md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red-dark">
              <InstagramIcon className="h-4 w-4" />
              Síguenos
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)]">
              {business.links.instagramHandle}
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-ink/75">
              Publicamos el antojo del día, las promociones de la semana y cuando hay
              algo nuevo en el menú.
            </p>
          </div>

          <OrderLink
            href={business.links.instagram}
            channel="instagram"
            location="seccion_instagram"
            variant="primary"
            size="lg"
          >
            <InstagramIcon className="h-4 w-4" />
            Seguir en Instagram
          </OrderLink>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {POSTS.map((post) => (
            <li key={post.src}>
              <div className="overflow-hidden rounded-2xl border-2 border-ink shadow-stamp-gold">
                <FoodImage
                  src={post.src}
                  alt={post.alt}
                  aspect="1 / 1"
                  fallbackIcon={post.icon}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
