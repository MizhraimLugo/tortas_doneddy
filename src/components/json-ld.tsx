/**
 * Renderiza datos estructurados dentro del HTML del servidor.
 *
 * Este componente es el corazón del cambio: al ser un Server Component, el
 * `<script type="application/ld+json">` sale ya escrito en la respuesta HTML.
 * Los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, CCBot) no ejecutan
 * JavaScript, así que un JSON-LD inyectado desde el cliente, para ellos,
 * simplemente no existe.
 */

type JsonLdProps = {
  /** Objeto ya construido por los helpers de `lib/schema`. */
  data: object;
};

/**
 * Escapa los caracteres que podrían cerrar la etiqueta `<script>` de forma
 * anticipada. Si un dato del menú llegara a contener `</script>`, sin este
 * escape rompería el HTML y abriría un vector de inyección.
 */
function serialize(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Seguro: `serialize` neutraliza `<`, `>` y `&` antes de insertar.
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
