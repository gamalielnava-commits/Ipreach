// Static sample data for the ipreach redesign screens.

export const SUGGESTIONS = [
  { title: "Un sermón sobre la fe que vence el temor", sub: "Expositivo · 25 min · Hebreos 11", icon: "IcSpark" },
  { title: "Reflexión devocional sobre el Salmo 23", sub: "Devocional · 10 min · breve y pastoral", icon: "IcBook" },
  { title: "Clase de discipulado sobre la oración", sub: "Clase · 45 min · con dinámica", icon: "IcCross" },
  { title: "Mensaje para el Día de la Madre", sub: "Tópico · 20 min · ocasión especial", icon: "IcStar" },
];

export const CONVERSATIONS = [
  { id: "c1", title: "La fe que vence el temor", date: "Hoy", active: true },
  { id: "c2", title: "Salmo 23 — devocional", date: "Hoy" },
  { id: "c3", title: "Clase: la oración intercesora", date: "Ayer" },
  { id: "c4", title: "Mateo 5 — Bienaventuranzas", date: "Lun" },
  { id: "c5", title: "Avivamiento en Hechos 2", date: "12 May" },
  { id: "c6", title: "Día de la Madre 2026", date: "10 May" },
  { id: "c7", title: "Sermón del aniversario", date: "3 May" },
];

export type SavedSermon = {
  id: string;
  title: string;
  type: string;
  scripture: string;
  method: string;
  duration: string;
  framework: string;
  updated: string;
  excerpt: string;
};

export const SAVED: SavedSermon[] = [
  {
    id: "s1",
    title: "El temor que se rinde a la fe",
    type: "Sermón",
    scripture: "Hebreos 11:1–6",
    method: "Idea central · Robinson",
    duration: "27 min",
    framework: "Bautista",
    updated: "Hoy · 14:30",
    excerpt: "La fe no es la ausencia del temor, sino la convicción que se mueve a pesar de él. Cuando el corazón tiembla, la fe declara: aún así, confío.",
  },
  {
    id: "s2",
    title: "Reposo a la sombra del Pastor",
    type: "Devocional",
    scripture: "Salmo 23",
    method: "Narrativo · Lowry",
    duration: "11 min",
    framework: "Reformada",
    updated: "Ayer · 21:08",
    excerpt: "Un Pastor que no nos lleva alrededor del valle, sino a través de él. Y en medio de la sombra, prepara mesa.",
  },
  {
    id: "s3",
    title: "Permanecer en oración",
    type: "Clase",
    scripture: "Lucas 11:1–13",
    method: "Hook · Book · Look · Took",
    duration: "45 min",
    framework: "Asambleas de Dios",
    updated: "Lun · 19:42",
    excerpt: "La oración no es una técnica para conseguir cosas; es el aliento del alma que aprende a vivir con su Padre.",
  },
  {
    id: "s4",
    title: "Hijos de la promesa",
    type: "Sermón",
    scripture: "Gálatas 4:21–31",
    method: "Cristocéntrico · Chapell",
    duration: "30 min",
    framework: "Reformada",
    updated: "Sáb · 09:15",
    excerpt: "Donde la ley solo señala la deuda, la promesa abre un padre que corre a recibirnos.",
  },
  {
    id: "s5",
    title: "Bienaventurados los que lloran",
    type: "Sermón",
    scripture: "Mateo 5:4",
    method: "Cuatro Páginas · Wilson",
    duration: "22 min",
    framework: "Wesleyana",
    updated: "12 May",
    excerpt: "El cielo no consuela desde lejos; se acerca al lugar exacto de la pérdida y se queda hasta el amanecer.",
  },
  {
    id: "s6",
    title: "Madres que sostienen ríos",
    type: "Sermón",
    scripture: "Éxodo 2:1–10",
    method: "Biográfico",
    duration: "18 min",
    framework: "Pentecostal",
    updated: "10 May",
    excerpt: "Jocabed no calmó el Nilo; lo confió. Y allí, donde el agua amenaza, Dios escribió un éxodo.",
  },
];

export const TYPE_BADGE: Record<string, { color: string; label: string }> = {
  "Sermón": { color: "var(--accent)", label: "Sermón" },
  "Devocional": { color: "var(--gilt)", label: "Devocional" },
  "Clase": { color: "#2D6A9A", label: "Clase" },
};

export const SERMON_SAMPLE = {
  title: "El temor que se rinde a la fe",
  scripture: "Hebreos 11:1–6 · RVR1960",
  big_idea: "La fe genuina no espera a que el miedo se vaya; camina con él hasta que aprende a confiar.",
  meta: {
    "Marco": "Bautista · expositivo",
    "Estrategia": "Idea central (Robinson)",
    "Método": "PEICA",
    "Longitud": "Mediano · 27 min",
    "Ocasión": "Servicio dominical",
    "Modelo": "Claude (Opus)",
  } as Record<string, string>,
  intro:
    "Hay un temor que cierra las puertas por dentro y otro que despierta antes del amanecer para orar. Los discípulos conocían ambos. La primera carta que la iglesia leyó en voz alta no comenzaba con un manual, sino con un grito: «sin fe es imposible agradar a Dios». No porque la fe sea un mérito, sino porque sin ella ni siquiera escuchamos la voz del Padre que ya nos llama por nombre.",
  point1_title: "I. La fe es certeza, no ausencia de temblor",
  point1:
    "Hebreos no define la fe como un sentimiento limpio, sino como la sustancia de lo que se espera. En griego, hypostasis: «aquello que sostiene por debajo». La fe es el suelo invisible que aparece bajo el pie justo cuando das el paso. Abram salió «sin saber a dónde iba», pero su no-saber descansaba sobre el sí-conocer del que lo había llamado.",
  point2_title: "II. La fe encuentra su voz en la promesa",
  point2:
    "El temor habla primero; siempre. Pero la fe responde con un texto. Por eso David, en el valle de sombra, no inventa consuelo: cita la promesa. La oración que vence el temor no es la más elaborada, es la que se aferra a una sola línea: «no temeré mal alguno, porque tú estarás conmigo».",
  illustration:
    "Un guía de montaña en los Andes contaba que, en las tormentas, los caminantes nuevos miran hacia la nube; los veteranos miran la cuerda. La cuerda no quita la tormenta —la atraviesa contigo. Así es la promesa de Cristo: no promete cielos despejados, promete su mano sosteniendo la tuya.",
  applications: [
    "Identifica el temor que más te repite esta semana. Escríbelo. Frente a él, escribe una promesa concreta de la Escritura.",
    "Camina un paso con esa promesa antes de pedir certezas. Obediencia tiembla, pero obedece.",
    "Esta semana, llama a alguien que esté en su propio valle y léele la promesa. La fe se contagia en voz alta.",
  ],
  close:
    "Cristo no nos llama a una fe sin cicatrices. Nos llama a una fe que mira la cicatriz —la suya, en la mano abierta— y dice: si Él pudo amarme a este precio, puedo confiarle el día de mañana.",
};

export const OUTLINE_SAMPLE = [
  { roman: "I.", title: "La fe es certeza, no ausencia de temblor", refs: ["Heb 11:1", "Gn 12:1–4"] },
  { roman: "II.", title: "La fe encuentra su voz en la promesa", refs: ["Sal 23:4", "Ro 10:17"] },
  { roman: "III.", title: "La fe es probada en el silencio", refs: ["Heb 11:6", "1 P 1:7"] },
  { roman: "IV.", title: "La fe se hereda contándola", refs: ["Sal 78:4", "Heb 11:39–40"] },
];

export const SLIDE_STYLES = [
  { slug: "hillsong", name: "Hillsong", sub: "Atmosférico · adoración", cls: "deck-hillsong" },
  { slug: "elevation", name: "Elevation", sub: "Urbano · alto contraste", cls: "deck-elevation" },
  { slug: "arcilla", name: "Arcilla", sub: "Claymation · cálido", cls: "deck-arcilla" },
  { slug: "comics", name: "Comics", sub: "Ilustración · vibrante", cls: "deck-comics" },
  { slug: "realista", name: "Realista", sub: "Fotografía · natural", cls: "deck-realista" },
  { slug: "cine", name: "Cinematográfico", sub: "Film · dramático", cls: "deck-cine" },
  { slug: "pergamino", name: "Pergamino", sub: "Códice · clásico", cls: "deck-pergamino" },
  { slug: "vitral", name: "Vitral", sub: "Catedral · sagrado", cls: "deck-vitral" },
  { slug: "brutalista", name: "Brutalista", sub: "Crudo · tipográfico", cls: "deck-brutalista" },
  { slug: "minimal", name: "Minimal", sub: "Espacio · una línea", cls: "deck-minimal" },
  { slug: "acuarela", name: "Acuarela", sub: "Bleeds · pastel", cls: "deck-acuarela" },
  { slug: "neon", name: "Neón", sub: "Synthwave · juventud", cls: "deck-neon" },
  { slug: "mosaico", name: "Mosaico", sub: "Bizantino · dorado", cls: "deck-mosaico" },
  { slug: "editorial", name: "Editorial", sub: "Revista · grid", cls: "deck-editorial" },
  { slug: "tipografico", name: "Tipográfico", sub: "Letra colosal · negro", cls: "deck-tipografico" },
  { slug: "selva", name: "Selva", sub: "Botánico · luna", cls: "deck-selva" },
  { slug: "avivamiento", name: "Avivamiento", sub: "Fuego · pentecostés", cls: "deck-avivamiento" },
];

export const FRAMEWORKS_SHORT = [
  "Reformada", "Bautista", "Asambleas de Dios", "Pentecostal Unida",
  "Cuadrangular", "Metodista", "Nazareno", "Adventista", "Luterana",
  "Carismático", "Apostólico", "Vineyard", "Independiente",
];

export const THEMES_SAMPLE: [string, string[]][] = [
  ["Vida espiritual", ["Fe", "Oración", "Ayuno", "Santidad", "Arrepentimiento", "Identidad en Cristo"]],
  ["Espíritu Santo", ["Bautismo del Espíritu", "Dones", "Llenura", "Fruto"]],
  ["Doctrina", ["La Trinidad", "La cruz", "Resurrección", "Segunda venida", "Reino de Dios"]],
  ["Familia", ["Matrimonio", "Crianza", "Reconciliación"]],
  ["Pruebas y batallas", ["Sufrimiento", "Sanidad divina", "Ansiedad", "Temor", "Duelo"]],
];

export const COMMENTATORS = [
  "Matthew Henry", "Juan Calvino", "Charles Spurgeon", "John MacArthur",
  "John Stott", "Tim Keller", "R.C. Sproul", "Warren Wiersbe",
  "Pérez Millos", "Charles Swindoll",
];

export const METHODS = [
  { slug: "peica", name: "PEICA", sub: "Presentación · Explicación · Ilustración · Conclusión · Aplicación" },
  { slug: "robinson", name: "Idea central · Robinson", sub: "Del texto a una sola idea homilética" },
  { slug: "lowry", name: "Lowry Loop · narrativo", sub: "Tensión · complicación · giro · resolución" },
  { slug: "chapell", name: "Cristocéntrico · Chapell", sub: "Condición caída → respuesta de la gracia" },
  { slug: "wilson", name: "Cuatro Páginas · Wilson", sub: "Problema y gracia, en el texto y en el mundo" },
  { slug: "stott", name: "El Puente · Stott", sub: "Conectar el mundo del texto y el del oyente" },
  { slug: "hbht", name: "Hook · Book · Look · Took", sub: "Captar · estudiar · interpretar · aplicar" },
];

export const VERSE_PREVIEW = {
  reference: "Hebreos 11:1–3",
  version: "RVR1960",
  text:
    "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve. Porque por ella alcanzaron buen testimonio los antiguos. Por la fe entendemos haber sido constituido el universo por la palabra de Dios, de modo que lo que se ve fue hecho de lo que no se veía.",
};

export const PHRASES_SAMPLE = [
  "La fe no es ausencia de temblor; es el suelo invisible bajo el pie.",
  "Caminar con Dios es aprender a citar la promesa antes que al miedo.",
  "Cristo no promete cielos despejados — promete su mano en la tormenta.",
  "El temor habla primero; la fe siempre tiene la última palabra.",
];
