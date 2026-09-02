import { LegalDoc, LegalSeccion } from "@/components/legal-doc";
import { business, fullAddress } from "@/data/business";
import { buildMetadata } from "@/lib/seo";

/**
 * Aviso de privacidad.
 *
 * En la versión anterior el pie enlazaba a /privacidad y /terminos sin que esas
 * rutas existieran: dos errores 404 en todas las páginas del sitio. Los enlaces
 * rotos desperdician presupuesto de rastreo y restan confianza.
 *
 * Además, en México el aviso de privacidad es obligatorio para cualquier
 * particular que trate datos personales (Ley Federal de Protección de Datos
 * Personales en Posesión de los Particulares). Tomar un pedido por WhatsApp con
 * nombre, teléfono y dirección es tratamiento de datos personales.
 *
 * AVISO: esto es una plantilla, no asesoría legal. Complétala con los datos
 * marcados como PENDIENTE y revísala con un abogado antes de publicar.
 */

export const metadata = buildMetadata({
  path: "/privacidad",
  title: "Aviso de Privacidad",
  description: `Aviso de privacidad de ${business.name}: qué datos personales recabamos al tomar tu pedido, para qué los usamos y cómo ejercer tus derechos ARCO.`,
  // No aporta al posicionamiento y consume presupuesto de rastreo, pero sí debe
  // ser accesible y enlazable, así que se permite seguir sus enlaces.
  noIndex: true,
});

export default function PrivacidadPage() {
  return (
    <LegalDoc
      path="/privacidad"
      titulo="Aviso de privacidad"
      eyebrow="Documento legal"
      intro={
        <>
          Qué datos personales recabamos cuando nos haces un pedido, para qué los
          usamos y cómo puedes pedir que los corrijamos o los borremos.
        </>
      }
      pendiente={
        <>
          Este documento es una plantilla base. Antes de publicar el sitio hay que
          completar los datos marcados como <strong>PENDIENTE</strong> y validarlo con
          un abogado. Elimina este recuadro cuando esté listo.
        </>
      }
    >
      <LegalSeccion titulo="Responsable de tus datos">
        <p>
          {business.name}, con domicilio en {fullAddress}, México, es responsable del
          uso y protección de tus datos personales, conforme a la Ley Federal de
          Protección de Datos Personales en Posesión de los Particulares.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Qué datos recabamos">
        <p>
          Cuando haces un pedido podemos recabar tu nombre, número de teléfono y
          dirección de entrega. Los recabamos únicamente cuando tú nos los
          proporcionas, por WhatsApp, por teléfono o en el local.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Para qué los usamos">
        <p>
          Usamos tus datos exclusivamente para preparar y entregar tu pedido,
          contactarte si hay alguna duda sobre él, y llevar el registro de la venta.
          No vendemos ni compartimos tus datos con terceros con fines comerciales.
        </p>
        <p>
          <strong>PENDIENTE:</strong> si planeas enviar promociones por WhatsApp o
          correo, hay que declararlo aquí como finalidad secundaria y ofrecer una
          forma de negarse.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Derechos ARCO">
        <p>
          Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de
          tus datos personales. Para ejercer cualquiera de estos derechos, escríbenos
          al {business.phone.displayIntl} o acude a nuestro domicilio.
        </p>
        <p>
          <strong>PENDIENTE:</strong> agregar un correo electrónico de contacto para
          solicitudes ARCO y el plazo de respuesta.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Datos de navegación">
        <p>
          <strong>PENDIENTE:</strong> si instalas Google Analytics o un píxel de
          publicidad, hay que declararlo aquí junto con el aviso de cookies
          correspondiente.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Cambios a este aviso">
        <p>
          Cualquier modificación a este aviso de privacidad se publicará en esta
          misma página.
        </p>
      </LegalSeccion>
    </LegalDoc>
  );
}
