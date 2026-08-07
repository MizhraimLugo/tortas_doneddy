import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Las fotos del negocio se sirven desde /public. Si más adelante mueves las
  // imágenes a un CDN, agrégalo aquí en `images.remotePatterns`.
  images: {
    formats: ["image/avif", "image/webp"],
  },

};

// Nota: /llms.txt lo sirve un route handler en `src/app/llms.txt/route.ts`, que
// fija sus propios encabezados de tipo y caché. No hay que duplicarlos aquí.

export default nextConfig;
