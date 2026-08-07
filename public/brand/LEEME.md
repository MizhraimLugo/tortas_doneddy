# Imágenes de marca

Coloca aquí los archivos del negocio. El código ya los busca en estas rutas.

## Logo

Guarda el logo como **`logo.png`** en esta carpeta (`public/brand/logo.png`).

- Formato: PNG con fondo transparente, o JPG si tiene fondo.
- Tamaño mínimo recomendado: 512 × 512 px, cuadrado.
- El componente `BrandLogo` prueba en orden `logo.png`, `logo.jpg` y `logo.svg`.
  Si no encuentra ninguno, muestra un monograma "DE" con los colores de la marca,
  para que nunca se vea una imagen rota.

Verifica que abra en `http://localhost:3000/brand/logo.png` después de copiarlo.

## Fotos de los platillos — lo más importante que falta

El sitio no tiene ni una sola foto de comida, y para un negocio de antojo esa es
la carencia más costosa que queda. Afecta dos cosas a la vez:

1. **Conversión.** Nadie decide pedir tortas ahogadas leyendo una descripción.
2. **Posicionamiento.** Sin imágenes no puedes aparecer en Google Imágenes ni en
   los resultados enriquecidos con foto, que son los que se llevan el clic.

Cuando tengas las fotos, guárdalas aquí con nombres descriptivos —el nombre del
archivo es una señal de SEO para Google Imágenes:

```
torta-ahogada-pierna-don-eddy-zapopan.jpg
tacos-dorados-frijol-don-eddy.jpg
combo-familiar-tortas-ahogadas.jpg
local-don-eddy-la-cima-zapopan.jpg
```

Recomendaciones de captura:

- Luz natural, de día, sin flash.
- La salsa brillante y el birote visible: es el diferenciador del platillo.
- Una foto del local por fuera ayuda a que la gente lo reconozca al llegar.
- Formato horizontal (16:9) para las que vayan en portada.

Después de agregarlas, súmalas al arreglo `image` del nodo Restaurant en
`src/lib/schema.ts` y colócalas en las secciones con el componente
`next/image`, que las convierte a WebP y AVIF automáticamente.

## Icono para pestaña y celular

El favicon se genera por código en `src/app/icon.tsx`. Si prefieres usar el logo
real, borra ese archivo y coloca `icon.png` (512 × 512 px) en `src/app/`.
