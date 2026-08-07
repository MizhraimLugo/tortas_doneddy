import { LegalDoc, LegalSeccion } from "@/components/legal-doc";
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
    <LegalDoc
      path="/terminos"
      titulo="Términos y condiciones"
      eyebrow="Documento legal"
      intro={
        <>
          Cómo se toman los pedidos, hasta cuándo valen los precios y las promociones,
          y qué cubre la entrega a domicilio.
        </>
      }
      pendiente={
        <>
          Plantilla base. Completa los apartados marcados como{" "}
          <strong>PENDIENTE</strong> y valídala con un abogado antes de publicar.
          Elimina este recuadro cuando esté listo.
        </>
      }
    >
      <LegalSeccion titulo="Pedidos">
        <p>
          Los pedidos se toman por WhatsApp, por teléfono, en el local o a través de
          las plataformas de reparto. Un pedido se considera confirmado cuando te
          respondemos con el total y el tiempo estimado de entrega.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Precios">
        <p>
          Los precios publicados en este sitio están en pesos mexicanos e incluyen
          impuestos. Aplican a pedidos directos por WhatsApp, teléfono o en el local.
          En Rappi y Uber Eats los precios pueden diferir por las comisiones de cada
          plataforma.
        </p>
        <p>
          Procuramos mantener los precios actualizados, pero pueden cambiar sin previo
          aviso. El precio válido es el que confirmamos al momento de tomar tu pedido.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Entregas">
        <p>
          Entregamos a domicilio en {serviceAreasText}, dentro de nuestro horario de
          servicio de {business.hours.range}. Los tiempos de entrega son estimados y
          pueden variar según la demanda y el tráfico.
        </p>
        <p>
          <strong>PENDIENTE:</strong> definir si hay costo de envío, monto mínimo de
          pedido y qué sucede si nadie recibe en el domicilio indicado.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Promociones">
        <p>
          Los paquetes y promociones publicados aplican mientras estén vigentes en
          esta página y no son acumulables con otras promociones, salvo que se indique
          lo contrario.
        </p>
        <p>
          <strong>PENDIENTE:</strong> definir vigencia de las promociones y si hay
          restricciones por zona u horario.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Venta de bebidas alcohólicas">
        <p>
          <strong>PENDIENTE:</strong> el menú incluye cerveza. Hay que declarar aquí
          la política de venta a mayores de edad, la identificación requerida y si
          aplica alguna restricción de horario según la normativa municipal de{" "}
          {business.address.locality}. Confirmar también si la venta de alcohol está
          permitida en la modalidad a domicilio.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Contacto">
        <p>
          Para cualquier aclaración sobre un pedido, comunícate al{" "}
          {business.phone.displayIntl}.
        </p>
      </LegalSeccion>
    </LegalDoc>
  );
}
