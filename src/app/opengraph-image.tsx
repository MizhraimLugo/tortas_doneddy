import { ImageResponse } from "next/og";

import { business } from "@/data/business";

/**
 * Imagen de vista previa para redes sociales y WhatsApp.
 *
 * Se genera en el build, sin diseñador y sin archivo que mantener. Importa más
 * de lo que parece para este negocio: cuando alguien comparte el enlace en un
 * grupo de WhatsApp —que es como se recomienda una taquería en México— esta es
 * la imagen que aparece. Un enlace con tarjeta visual se abre mucho más que uno
 * pelón.
 *
 * No se usan tipografías externas a propósito: descargarlas en tiempo de build
 * agrega un punto de falla y aquí no aporta nada.
 */

export const alt = `${business.name} — Tortas ahogadas en ${business.address.locality}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#9b1209",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 999,
              backgroundColor: "#ecba54",
              color: "#9b1209",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            DE
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 22,
                color: "#ecba54",
                letterSpacing: 4,
                fontWeight: 700,
              }}
            >
              TORTAS AHOGADAS
            </span>
            <span style={{ fontSize: 44, fontWeight: 700, color: "#fff6e8" }}>
              Don Eddy
              {business.founded ? ` · desde ${business.founded}` : ""}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#fff6e8", lineHeight: 1.05 }}>
            Tortas ahogadas en
          </span>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#ecba54", lineHeight: 1.05 }}>
            {business.address.locality}, {business.address.regionShort}
          </span>
          <span style={{ fontSize: 29, color: "#fff6e8", opacity: 0.85, marginTop: 22 }}>
            Birote salado · Pierna, buche, cuero y lengua · A domicilio
          </span>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {[
            business.hours.range,
            business.address.neighborhood,
            business.phone.displayIntl,
          ].map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: 25,
                fontWeight: 700,
                color: "#1f100c",
                backgroundColor: "#ecba54",
                borderRadius: 999,
                padding: "10px 26px",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  );
}
