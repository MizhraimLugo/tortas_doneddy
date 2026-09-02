# Imágenes de marca

**Deja los archivos en esta carpeta (`public/brand/`) con estos nombres exactos.**
El código ya los busca ahí. No hay que tocar nada más: en cuanto existan, aparecen
en la página.

| Nombre del archivo | Qué es | Dónde se usa |
|---|---|---|
| `logo.png` | Logotipo ovalado | Encabezado, pie, JSON-LD, favicon opcional |
| `torta-ahogada-don-eddy.jpg` | La torta con el caldillo sirviéndose | **Portada** (la imagen principal), Instagram, JSON-LD |
| `tacos-dorados-don-eddy.jpg` | Los tres tacos dorados con salsa | Instagram, JSON-LD |
| `don-eddy-personaje.png` | La ilustración de Don Eddy con mandil | Bloque de la guía, Instagram |
| `local-don-eddy-la-cima-zapopan.jpg` | Fachada del local *(pendiente)* | Instagram, cuando exista |

Si el nombre no coincide, la página muestra el mosaico dorado de respaldo en vez
de la foto. No se rompe nada, simplemente no aparece.

## No hace falta preparar las imágenes

Sube el archivo **original, en la mejor resolución que tengas**. El sitio usa
`next/image`, que se encarga solo de:

- Convertirlas a AVIF y WebP según el navegador. Una foto de comida suele bajar
  entre 40 % y 60 % de peso sin diferencia visible.
- Generar varios tamaños y servir el que toca: un celular descarga una versión
  chica, no la original completa.
- Recortarlas al encuadre de cada sección. La misma foto vertical sirve para la
  portada y para una miniatura cuadrada; no hay que guardar dos versiones.
- Reservar el espacio antes de cargar, para que no salte el layout.

Así que **no las recortes ni las comprimas antes de subirlas**. Entre más grande
el original, mejor trabaja el optimizador.

Una sola excepción, el logo: conviene subirlo **en PNG con fondo transparente y
sin margen blanco alrededor**. Si trae fondo blanco, se va a ver un rectángulo
blanco sobre el crema del encabezado.

## Cómo subirlas desde GitHub

Sin instalar nada:

1. Entra a la rama del proyecto:
   https://github.com/MizhraimLugo/tortas_doneddy/tree/claude/don-eddy-landing-analysis-co2lby
2. Navega a la carpeta `public` → `brand`
3. Botón **Add file** → **Upload files**
4. Arrastra los archivos **ya renombrados** como en la tabla de arriba
5. Abajo, en *Commit changes*, escribe algo como `Agrega fotos del negocio`
6. Asegúrate de que diga **Commit directly to the `claude/don-eddy-landing-analysis-co2lby` branch**
7. **Commit changes**

Si prefieres desde tu computadora:

```bash
git checkout claude/don-eddy-landing-analysis-co2lby
git pull
cp /ruta/de/tus/fotos/*.jpg public/brand/
git add public/brand && git commit -m "Agrega fotos del negocio" && git push
```

## Qué falta fotografiar

- **La fachada del local.** Ayuda a que la gente reconozca el lugar al llegar y
  es de las fotos que más se ven en una ficha de Google.
- **Un plato de mini tortas** y **las aguas frescas por separado**, para la
  página de menú.
- Consejos: luz de día, sin flash, la salsa brillante y el birote visible.
  Formato horizontal para lo que vaya en portada, vertical para el menú.
