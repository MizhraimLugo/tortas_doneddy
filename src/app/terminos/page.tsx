import { Breadcrumbs } from "@/components/breadcrumbs";
import { business, serviceAreasText } from "@/data/business";
import { buildMetadata } from "@/lib/seo";

/**
 * Términos y condiciones.
 *
 * AVISO: plantilla base, no asesoría legal. Completar los apartados marcados
 * como PENDIENTE y revisar con un abogado antes de publicar.
 */

export const metadata = buildMetadata({
  path: "/terminos",
  title: "Términos y Condiciones",
  description: `Términos y condiciones de ${business.name}: cómo se toman los pedidos, vigencia de precios y promociones, y cobertura de entrega a domicilio en Zapopan.`,
  noIndex: true,
});

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Breadcrumbs
        trail={[
          { name: "Inicio", path: "/" },
          { name: "Términos y condiciones", path: "/terminos" },
        ]}
      />

      <h1 className="mt-5 text-3xl md:text-4xl">
        Términos y condiciones
      </h1>

      <div className="mt-6 rounded-2xl border-2 border-brand-red-dark bg-gold-soft p-5 text-sm">
        <p className="font-bold text-brand-red-dark">Pendiente de revisión legal</p>
        <p className="mt-1 text-ink/80">
          Plantilla base. Completa los apartados marcados como{" "}
          <strong>PENDIENTE</strong> y valídala con un abogado antes de publicar.
          Elimina este recuadro cuando esté listo.
        </p>
      </div>

      <div className="mt-8 grid gap-6 text-base leading-relaxed text-ink/80">
        <section>
          <h2 className="text-xl text-ink">Pedidos</h2>
          <p className="mt-2">
            Los pedidos se toman por WhatsApp, por teléfono, en el local o a través de
            las plataformas de reparto. Un pedido se considera confirmado cuando te
            respondemos con el total y el tiempo estimado de entrega.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">Precios</h2>
          <p className="mt-2">
            Los precios publicados en este sitio están en pesos mexicanos e incluyen
            impuestos. Aplican a pedidos directos por WhatsApp, teléfono o en el local.
            En Rappi y Uber Eats los precios pueden diferir por las comisiones de cada
            plataforma.
          </p>
          <p className="mt-2">
            Procuramos mantener los precios actualizados, pero pueden cambiar sin previo
            aviso. El precio válido es el que confirmamos al momento de tomar tu pedido.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">Entregas</h2>
          <p className="mt-2">
            Entregamos a domicilio en {serviceAreasText}, dentro de nuestro horario de
            servicio de {business.hours.range}. Los tiempos de entrega son estimados y
            pueden variar según la demanda y el tráfico.
          </p>
          <p className="mt-2">
            <strong>PENDIENTE:</strong> definir si hay costo de envío, monto mínimo de
            pedido y qué sucede si nadie recibe en el domicilio indicado.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">Promociones</h2>
          <p className="mt-2">
            Los paquetes y promociones publicados aplican mientras estén vigentes en
            esta página y no son acumulables con otras promociones, salvo que se indique
            lo contrario.
          </p>
          <p className="mt-2">
            <strong>PENDIENTE:</strong> definir vigencia de las promociones y si hay
            restricciones por zona u horario.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">Venta de bebidas alcohólicas</h2>
          <p className="mt-2">
            <strong>PENDIENTE:</strong> el menú incluye cerveza. Hay que declarar aquí
            la política de venta a mayores de edad, la identificación requerida y si
            aplica alguna restricción de horario según la normativa municipal de{" "}
            {business.address.locality}. Confirmar también si la venta de alcohol está
            permitida en la modalidad a domicilio.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">Contacto</h2>
          <p className="mt-2">
            Para cualquier aclaración sobre un pedido, comunícate al{" "}
            {business.phone.displayIntl}.
          </p>
        </section>
      </div>
    </div>
  );
}
