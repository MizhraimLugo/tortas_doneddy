import { ImageResponse } from "next/og";

/**
 * Favicon generado en el build.
 *
 * Se genera en código para no depender de un binario en el repositorio. Cuando
 * el negocio entregue su logo definitivo, basta con borrar este archivo y poner
 * `icon.png` en esta misma carpeta: Next lo detecta automáticamente.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#9b1209",
          color: "#ecba54",
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        DE
      </div>
    ),
    size
  );
}
