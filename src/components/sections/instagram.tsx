import { FoodImage } from "@/components/food-image";
import { InstagramIcon } from "@/components/icons/instagram";
import { OrderLink } from "@/components/order-link";
import { business } from "@/data/business";
import { images } from "@/data/images";

/**
 * Instagram.
 *
 * En la versión original esta sección eran cuatro divs vacíos con un atributo
 * `title` que le hablaba al desarrollador ("Aquí puedes integrar un feed de
 * Instagram") y que los lectores de pantalla anunciaban al usuario.
 *
 * Son tres huecos y no cuatro a propósito: hay tres piezas reales. Rellenar un
 * cuarto con un marcador dejaría un hoyo visible al lado de fotos de verdad,
 * que se ve peor que una retícula de tres completa. Cuando haya una foto del
 * local, se agrega aquí y la retícula pasa a cuatro.
 */

const POSTS = [
  { ...images.tortaAhogada, focus: "center" },
  { ...images.tacosDorados, focus: "center" },
  // El personaje es vertical: en el recorte cuadrado hay que anclar arriba para
  // no cortarle la cabeza.
  { ...images.personaje, focus: "center top" },
];

export function Instagram() {
  return (
    <section id="instagram" className="shell pb-16 md:pb-20">
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

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {POSTS.map((post) => (
            <li key={post.src}>
              <div className="overflow-hidden rounded-2xl border-2 border-ink shadow-stamp-gold">
                <FoodImage
                  src={post.src}
                  alt={post.alt}
                  aspect="1 / 1"
                  focus={post.focus}
                  sizes="(max-width: 640px) 100vw, 360px"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
