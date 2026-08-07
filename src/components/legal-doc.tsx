import { AlertTriangle } from "lucide-react";

import { PageHero } from "@/components/page-hero";

/**
 * Envoltorio de las páginas legales.
 *
 * Comparten estructura: encabezado sobrio, aviso de revisión pendiente y un
 * cuerpo de secciones a una columna. Tenerlo en un solo sitio evita que el
 * aviso se quede en una página y desaparezca de la otra al editarlas por
 * separado, que es justo el error que convierte una plantilla en un documento
 * publicado por accidente.
 *
 * El tratamiento es deliberadamente más callado que el del resto del sitio: en
 * un documento legal lo que importa es que se lea, no que llame la atención. Por
 * eso `variant="sobrio"` —sin papel picado y con el título más chico— y una
 * medida de línea corta.
 */

type LegalDocProps = {
  path: string;
  /** Nombre del documento, tal cual va en las migas y en el título. */
  titulo: string;
  eyebrow: string;
  intro: React.ReactNode;
  /** Texto del recuadro de revisión pendiente. `null` cuando ya se revisó. */
  pendiente?: React.ReactNode;
  children: React.ReactNode;
};

export function LegalDoc({
  path,
  titulo,
  eyebrow,
  intro,
  pendiente,
  children,
}: LegalDocProps) {
  return (
    <>
      <PageHero
        trail={[
          { name: "Inicio", path: "/" },
          { name: titulo, path },
        ]}
        eyebrow={eyebrow}
        title={titulo}
        intro={intro}
        variant="sobrio"
        // Un aviso legal no es una respuesta que un asistente de voz deba leer
        // ni un fragmento que convenga que se cite suelto.
        speakable={false}
      />

      <div className="shell shell-narrow py-10 md:py-14">
        {pendiente && (
          <div className="flex gap-3 rounded-2xl border-2 border-brand-red-dark bg-gold-soft p-5 text-sm">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-dark"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold text-brand-red-dark">Pendiente de revisión legal</p>
              <p className="mt-1 text-ink/80">{pendiente}</p>
            </div>
          </div>
        )}

        <div
          className={`grid gap-7 text-base leading-relaxed text-ink/80 ${pendiente ? "mt-9" : ""}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

/** Apartado del documento. */
export function LegalSeccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl text-ink">{titulo}</h2>
      <div className="mt-2 grid gap-2">{children}</div>
    </section>
  );
}
