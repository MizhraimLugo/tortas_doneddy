/**
 * Lo que se hace en casa.
 *
 * Son los diferenciadores reales del negocio, y valen doble:
 *
 *  - Para el cliente, es la razón para elegir aquí y no el puesto de enfrente.
 *  - Para los motores de IA, es contenido específico y citable. Cuando alguien
 *    pregunta "¿dónde hacen su propio birote en Zapopan?", un modelo solo puede
 *    responder si el dato está escrito en texto plano en algún lado.
 *
 * Cada punto está redactado con el hecho concreto primero y la explicación
 * después, que es el orden que conviene para ser extraído.
 */

export type CasaItem = {
  id: string;
  /** Nombre corto del elemento. */
  titulo: string;
  /** Sello: "hecho en casa", "recién hecho", "receta de la casa". */
  sello: string;
  /** Explicación breve; la primera oración debe bastar por sí sola. */
  texto: string;
};

export const hechoEnCasa: CasaItem[] = [
  {
    id: "birote",
    titulo: "El birote salado",
    sello: "Hecho en casa · Recién hecho",
    texto:
      "Horneamos nuestro propio birote salado todos los días. Por eso llega firme a la mesa y aguanta el caldillo sin deshacerse, que es exactamente lo que un pan comprado no hace.",
  },
  {
    id: "carnitas",
    titulo: "Las carnitas",
    sello: "Hechas en casa · Recién hechas",
    texto:
      "La carne la preparamos aquí mismo cada día: pierna, buche y cuero. Nada se recalienta de un día para otro.",
  },
  {
    id: "salsa-dulce",
    titulo: "La salsa dulce",
    sello: "Hecha en casa",
    texto:
      "La salsa dulce de jitomate, la que ahoga la torta, también es nuestra. No pica: es la base del platillo y le da todo el sabor.",
  },
  {
    id: "salsa-picante",
    titulo: "La salsa picante",
    sello: "Receta de la casa",
    texto:
      "Nuestra salsa de chile de árbol es receta de la casa y va aparte, así que tú mandas. Si es tu primera vez, pídela poquita y ve subiéndole: la idea es que la disfrutes, no que te enchiles.",
  },
];

/** Resumen en una línea, para metadatos y para el resumen de llms.txt. */
export const hechoEnCasaResumen =
  "En Tortas Ahogadas Don Eddy el birote salado y las carnitas se hacen en casa y se preparan el mismo día, la salsa dulce de jitomate es propia y la salsa picante de chile de árbol es receta de la casa.";
