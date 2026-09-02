import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Las fotos del negocio se sirven desde /public. Si más adelante mueves las
  // imágenes a un CDN, agrégalo aquí en `images.remotePatterns`.
  images: {
    formats: ["image/avif", "image/webp"],

    // Next 16 solo acepta los valores de calidad declarados aquí; cualquier
    // otro devuelve 400 y el componente cae al valor por omisión sin avisar.
    // Se agrega 85 porque en fotografía de comida la diferencia contra 75 sí se
    // nota en las salsas y los brillos, que es justo lo que da hambre.
    qualities: [75, 85],
  },

};

// Nota: /llms.txt lo sirve un route handler en `src/app/llms.txt/route.ts`, que
// fija sus propios encabezados de tipo y caché. No hay que duplicarlos aquí.

export default nextConfig;
