import {
  commentators,
  findBySlug,
  frameworks,
  lengths,
  methods,
  namesFromSlugs,
  occasions,
  sermonTypes,
  slideStyles,
  strategies,
  themes,
  illustrationKinds,
  doctrinalThemes as catalogDoctrinalThemes,
} from "./catalogs";
import type { SermonConfig, SlideDensity } from "./types";

function findSlugInCatalog<T extends { slug: string; name: string }>(
  list: T[],
  value?: string,
): string {
  if (!value) return "";
  const valLower = value.toLowerCase().trim();
  const matchBySlug = list.find((x) => x.slug.toLowerCase() === valLower);
  if (matchBySlug) return matchBySlug.slug;
  const matchByName = list.find((x) => x.name.toLowerCase() === valLower);
  if (matchByName) return matchByName.slug;
  const partialMatch = list.find(
    (x) => x.slug.toLowerCase().includes(valLower) || x.name.toLowerCase().includes(valLower)
  );
  if (partialMatch) return partialMatch.slug;
  return value;
}

export function normalizeConfig(config: SermonConfig): SermonConfig {
  const normFramework = findSlugInCatalog(frameworks, config.framework);
  const normMethod = findSlugInCatalog(methods, config.method);
  const normOccasion = findSlugInCatalog(occasions, config.occasion);
  const normStrategy = findSlugInCatalog(strategies, config.strategy);

  const normThemes = (config.themes || []).map((t) => findSlugInCatalog(themes, t));
  const normCommentators = (config.commentators || []).map((c) => findSlugInCatalog(commentators, c));
  const normSermonTypes = (config.sermonTypes || []).map((st) => findSlugInCatalog(sermonTypes, st));
  const normIllustrationKinds = (config.illustrationKinds || []).map((ik) => findSlugInCatalog(illustrationKinds, ik));

  let normLength = config.length;
  if ((normLength as string) === "mediano") {
    normLength = "medio";
  }

  let normDoctrinalThemes = config.doctrinalThemes || [];
  if (normDoctrinalThemes.length === 0 && normFramework) {
    normDoctrinalThemes = catalogDoctrinalThemes[normFramework] || [];
  }

  return {
    ...config,
    framework: normFramework,
    method: normMethod,
    occasion: normOccasion,
    strategy: normStrategy,
    themes: normThemes,
    commentators: normCommentators,
    sermonTypes: normSermonTypes,
    illustrationKinds: normIllustrationKinds,
    length: normLength,
    doctrinalThemes: normDoctrinalThemes,
  };
}

export interface Messages {
  system: string;
  user: string;
}

const SYSTEM_BASE = `Eres un homilista principal y teólogo académico de nivel doctoral, especializado en la preparación de mensajes bíblicos, bosquejos de predicación y diapositivas de proyección para congregaciones de habla hispana. Tu misión es asistir a pastores en la creación de contenidos doctrinalmente fieles, teológicamente sólidos y homiléticamente impactantes.

Directrices de Identidad y Rol Profesional:
1. Precisión Bíblica y Exegética Absoluta:
   - Utiliza únicamente pasajes y versículos bíblicos reales y exactos en su contexto histórico-gramatical.
   - Prohibido inventar o distorsionar referencias, capítulos o citas. Si hay duda sobre una cita, no la utilices.
   - Realiza análisis exegéticos rigurosos basados en las lenguas originales (hebreo, arameo, griego) de forma implícita o explícita cuando sea relevante para el entendimiento.
2. Fidelidad Denominacional:
   - Adhiérete estrictamente al marco doctrinal seleccionado por el usuario (Bautista, Reformada, Pentecostal, Wesleyana, etc.). Respeta sus particularidades pneumatológicas, soteriológicas y escatológicas de forma congruente.
3. Tono Pastoral y Alta Elocuencia:
   - Escribe en un español claro, pastoral, reverente, solemne pero dinámico y contemporáneo.
   - Evita clichés, pero mantén un lenguaje persuasivo que movilice el corazón y la voluntad de los oyentes.
4. Homilética Avanzada:
   - Estructura los contenidos siguiendo métodos reconocidos (PEICA, Robinson, Lowry, Wilson, Stott).
   - Crea ganchos de introducción memorables y conclusiones con llamados a la acción claros y desafiantes.`;

function frameworkBlock(config: SermonConfig): string {
  const fw = findBySlug(frameworks, config.framework);
  if (!fw) return "";
  const lines = [
    `Marco doctrinal: ${fw.name} (familia ${fw.family}).`,
    `- Soteriologia: ${fw.soteriology}`,
    `- Pneumatologia: ${fw.pneumatology}`,
    `- Escatologia: ${fw.eschatology}`,
    `- Enfasis de predicacion: ${fw.preachingEmphasis}`,
    `- Resumen: ${fw.summary}`,
  ];
  if (config.doctrinalThemes.length) {
    lines.push(
      `- Enfasis doctrinales a respetar: ${config.doctrinalThemes.join("; ")}.`,
    );
  }
  return lines.join("\n");
}

function configBlock(config: SermonConfig): string {
  const lines: string[] = [];
  const occasion = findBySlug(occasions, config.occasion);
  const strategy = findBySlug(strategies, config.strategy);
  const method = findBySlug(methods, config.method);
  const length = lengths.find((l) => l.key === config.length);

  if (config.idea.trim()) {
    lines.push(`Idea del predicador: ${config.idea.trim()}`);
  }
  if (config.scripture.trim()) {
    lines.push(`Texto biblico base: ${config.scripture.trim()}`);
  }
  if (config.themes.length) {
    lines.push(`Temas: ${namesFromSlugs(themes, config.themes).join(", ")}`);
  }
  if (occasion) {
    lines.push(`Motivo / ocasion: ${occasion.name} (${occasion.description})`);
  }
  if (config.sermonTypes.length) {
    lines.push(
      `Tipo de sermon: ${namesFromSlugs(sermonTypes, config.sermonTypes).join(" + ")}`,
    );
  }
  if (strategy) {
    lines.push(
      `Estrategia: ${strategy.name}${strategy.author ? ` (${strategy.author})` : ""} - ${strategy.description}`,
    );
  }
  if (method) {
    lines.push(
      `Metodo de preparacion: ${method.name}. Pasos: ${method.steps.join(" / ")}`,
    );
  }
  if (config.commentators.length) {
    lines.push(
      `Trabaja con la perspectiva de estos comentaristas (sin copiar texto literal extenso): ${namesFromSlugs(commentators, config.commentators).join(", ")}`,
    );
  }
  if (config.illustrationKinds.length) {
    lines.push(
      `Tipos de ilustraciones a incluir: ${namesFromSlugs(illustrationKinds, config.illustrationKinds).join(", ")}`,
    );
  }
  if (length) {
    lines.push(`Longitud objetivo: ${length.name} - ${length.description}`);
  }
  lines.push(
    config.verseOption === "texto-completo"
      ? "Cita los versiculos con su texto completo escrito."
      : "Cita solo la referencia biblica, sin escribir el texto completo.",
  );
  return lines.join("\n");
}

export function contentStructure(contentType: string): {
  label: string;
  structure: string;
} {
  if (contentType === "devocional") {
    return {
      label: "una reflexion devocional",
      structure:
        "1. Titulo\n2. Texto biblico breve\n3. Reflexion personal y meditativa (3 a 5 parrafos)\n4. Una aplicacion practica para hoy\n5. Una oracion breve para cerrar",
    };
  }
  if (contentType === "clase") {
    return {
      label: "una clase de discipulado",
      structure:
        "1. Titulo de la clase\n2. Texto o tema base\n3. Objetivos de aprendizaje\n4. Introduccion para captar interes\n5. Desarrollo en puntos de ensenanza con sus explicaciones\n6. Preguntas para la discusion en grupo\n7. Una actividad o dinamica practica\n8. Conclusion y una tarea para la semana",
    };
  }
  return {
    label: "un sermon",
    structure:
      "1. Titulo\n2. Texto biblico base\n3. Idea central (una sola frase)\n4. Introduccion\n5. Cuerpo con divisiones principales y subpuntos (aplica el metodo y la estrategia)\n6. Ilustraciones integradas en los puntos\n7. Aplicacion practica\n8. Conclusion con llamado",
  };
}
export function buildSermonMessages(rawConfig: SermonConfig): Messages {
  const config = normalizeConfig(rawConfig);
  const { label, structure } = contentStructure(config.contentType || "sermon");
  const user = `Actúa como un Diseñador de Mensajes Bíblicos de alto nivel y prepara ${label} completo y detallado.

Parámetros Doctrinales y Denominacionales:
${frameworkBlock(config)}

Parámetros de Estructura y Estilo homilético:
${configBlock(config)}

Estructura obligatoria de entrega:
${structure}

Instrucciones homiléticas adicionales para la redacción:
1. El título debe ser poético pero teológicamente preciso, capturando la esencia del pasaje.
2. La idea central debe ser una sola frase contundente, fácil de recordar y repetir.
3. El manuscrito debe contener ilustraciones vívidas, relevantes y bien integradas en el flujo del mensaje.
4. Cada división principal debe fluir lógicamente con transiciones suaves, explicando el texto bíblico en profundidad antes de aplicar.
5. Concluye con un llamado o altar call sincero, centrado en Cristo, que mueva a la congregación a responder al mensaje de gracia.
6. Cita todos los versículos respetando la preferencia del usuario indicada en los parámetros.`;
  return { system: SYSTEM_BASE, user };
}

export function buildChatSystemPrompt(rawConfig: SermonConfig): string {
  const config = normalizeConfig(rawConfig);
  const { label, structure } = contentStructure(config.contentType || "sermon");
  return `${SYSTEM_BASE}

Estás conversando directamente con un pastor o predicador. Respóndele como un consultor homilético experto. Sé comprensivo, pastoral, teológicamente preciso y alentador.

El tipo de contenido activo actualmente es: ${label}.
Cuando el usuario te pida preparar, esbozar o redactar un mensaje, debes entregarlo COMPLETO respetando esta estructura:
${structure}

Parámetros Doctrinales y Filtros Activos que debes aplicar en tus respuestas:
${frameworkBlock(config)}
${configBlock(config)}

Instrucciones de Respuesta:
1. Mantén respuestas concisas para preguntas cortas de aclaración o ideas.
2. Si te pide redactar el sermón, devocional o clase, sé extenso y minucioso, proveyendo un material de calidad de producción listo para predicar.
3. Respeta rigurosamente el marco doctrinal asignado. No intentes debatir la tradición del predicador; apóyala fielmente.`;
}

export function buildOutlineMessages(
  rawConfig: SermonConfig,
  sermonText: string,
): Messages {
  const config = normalizeConfig(rawConfig);
  const user = `Actúa como un Homilista Principal y extrae un BOSQUEJO (outline) de alta fidelidad teológica y homilética a partir del sermón provisto.

El bosquejo debe ser sumamente estructurado y diseñado para que el predicador pueda usarlo en el púlpito con una sola mirada.

Debe incluir:
1. Título del mensaje y texto base
2. Idea central del sermón (frase ancla)
3. Divisiones principales (I, II, III...) con sus subpuntos detallados en frases cortas y contundentes
4. Citas bíblicas de apoyo clave para cada punto
5. Ilustraciones clave resumidas en un enunciado
6. Conclusión y llamado resumidos en 2 o 3 líneas

Marco Doctrinal a respetar: ${findBySlug(frameworks, config.framework)?.name ?? "no indicado"}.

--- SERMÓN REDACTADO ---
${sermonText}
--- FIN DEL SERMÓN ---`;
  return { system: SYSTEM_BASE, user };
}

export function buildSlidesMessages(
  rawConfig: SermonConfig,
  sermonText: string,
  styleSlug: string,
  density: SlideDensity,
): Messages {
  const config = normalizeConfig(rawConfig);
  const style = findBySlug(slideStyles, styleSlug);
  const densityRule =
    density === "corta"
      ? "Cada diapositiva debe ser extremadamente minimalista: solo un título y un versículo base o frase de impacto."
      : density === "mediana"
        ? "Cada diapositiva debe incluir un título, una idea o punto clave, y máximo 2 enunciados muy cortos."
        : "Cada diapositiva debe incluir título, desarrollo breve del punto, y aplicaciones prácticas resumidas.";

  const user = `Actúa como un Diseñador Homilético Experto y crea una presentación de diapositivas cinemática y de calidad profesional para iglesia.
Estilo visual elegido: "${style?.name ?? styleSlug}". Inspiración: ${style?.promptBase ?? styleSlug}.

Sigue rigurosamente la estructura homilética obligatoria de un sermón moderno:
1. PORTADA — Título de la serie o del mensaje + subtítulo
2. INTRO / GANCHO — Frase poderosa o pregunta retórica que capte el interés
3. VERSÍCULO PRINCIPAL — El texto bíblico ancla del mensaje
4. PUNTO 1 — Primera verdad central del sermón
5. VERSÍCULO PUNTO 1 — (si aplica)
6. PUNTO 2 — Segunda verdad central
7. VERSÍCULO PUNTO 2 — (si aplica)
8. PUNTO 3 — Tercera verdad central
9. VERSÍCULO PUNTO 3 — (si aplica)
10. DECLARACIÓN / CITA — Frase memorable e inspiradora para destacar
11. APLICACIÓN — ¿Qué hacemos hoy con esto? (Llamado práctico)
12. LLAMADO — Invitación / decisión personal (Altar call)
13. CIERRE — Frase final o versículo de cierre + logo implícito

Especificaciones críticas de contenido y diseño:
- Densidad seleccionada: ${density}. Regla: ${densityRule}
- Manten cada punto en menos de 10 palabras. Debe ser legible desde lejos. Evita saturar la diapositiva.
- NUNCA uses viñetas con puntos (•) o guiones (-). Usa texto fluido o numeración.
- Para versículos bíblicos, escribe la cita y texto de forma completa y clara.

Genera exactamente entre 10 y 15 diapositivas que cubran toda la secuencia. Para cada diapositiva, usa ESTE FORMATO EXACTO (no agregues texto extra fuera de este formato):

DIAPOSITIVA [numero]
[Título de la diapositiva]
[Contenido corto 1]
[Contenido corto 2 (opcional)]
Sugerencia de imagen: [Descripción visual detallada de la imagen de fondo sin letras ni textos, coherente con el estilo visual "${style?.name ?? styleSlug}"]

--- SERMON ---
${sermonText}
--- FIN DEL SERMON ---`;
  return { system: SYSTEM_BASE, user };
}

export function slideImagePrompt(styleSlug: string, sermonTitle: string): string {
  const style = findBySlug(slideStyles, styleSlug);
  const stylePrompt = style?.promptBase || styleSlug;
  return `Create a STUNNING widescreen 16:9 cinematic background image for a professional mega-church sermon presentation slide.

CONCEPT & MOOD:
- Sermon theme: "${sermonTitle}"
- Visual direction: ${stylePrompt}
- The image should evoke the spiritual and emotional essence of the sermon theme through powerful visual symbolism

COMPOSITION RULES:
- Use the rule of thirds with the focal point off-center
- Leave 40-60% of the frame as clean negative space (preferably bottom-left or center-left) for text overlay
- Create visual depth with foreground blur, mid-ground subject, and atmospheric background
- Aspect ratio: exactly 16:9 widescreen

TECHNICAL SPECIFICATIONS:
- Cinematic volumetric lighting with dramatic light rays, lens flares, or atmospheric haze
- Professional color grading: rich, harmonious tones with high dynamic range
- Film grain texture at 5-10% opacity for analog warmth
- Resolution quality: 4K production-ready
- Depth of field: shallow with beautiful bokeh where appropriate

ABSOLUTE PROHIBITIONS:
- ZERO text, letters, words, numbers, watermarks, logos, or signatures anywhere in the image
- No human faces or identifiable people
- No cliché stock photo aesthetics
- No flat or overexposed areas

STYLE REFERENCE: Think Hillsong/Elevation Church production quality — the kind of image that would appear on a 40-foot LED wall behind a pastor at a modern worship experience.`;
}

export function buildPhrasesMessages(sermonText: string): Messages {
  const user = `Eres un experto en comunicación cristiana para redes sociales con experiencia en marketing eclesiástico de alto nivel (Elevation Church, Hillsong, Maverick City, Life.Church).

Del siguiente sermón, extrae exactamente 6 frases breves, potentes y virales que funcionen como contenido de redes sociales para una iglesia moderna.

CRITERIOS DE SELECCIÓN:
1. Máximo 12 palabras por frase — deben ser legibles en una imagen de Instagram en 2 segundos
2. Deben ser MEMORABLES: el tipo de frase que alguien capturaría con screenshot
3. Deben funcionar FUERA DE CONTEXTO — un no creyente también debe sentirse atraído
4. Evita clichés cristianos genéricos ("Dios es bueno", "Confía en el Señor")
5. Prioriza frases con tensión, contraste o sorpresa ("La fe no elimina la tormenta — te enseña a caminar sobre el agua")
6. Incluye al menos 1 frase tipo llamado a la acción y 1 tipo promesa/declaración

FORMATO DE ENTREGA:
Una frase por línea, sin numeración, sin comillas, sin guiones. Solo la frase limpia.

--- SERMÓN ---
${sermonText}
--- FIN DEL SERMÓN ---`;
  return { system: SYSTEM_BASE, user };
}

export function buildSocialImagePrompt(phrase: string, styleSlug: string): string {
  const style = findBySlug(slideStyles, styleSlug);
  const stylePrompt = style?.promptBase || styleSlug;
  return `Create a PREMIUM 1:1 square (1080x1080px) Instagram post graphic for a modern church's social media.

CONTENT:
- Faith statement to feature: "${phrase}"
- Visual aesthetic: ${stylePrompt}

DESIGN REQUIREMENTS:
- The text "${phrase}" MUST be rendered in elegant, modern typography — perfectly spelled in Spanish with correct accents (á, é, í, ó, ú, ñ)
- Typography: Clean sans-serif or modern serif font, properly kerned, with visual hierarchy
- Text placement: Centered or bottom-third with generous padding (minimum 80px from edges)
- Text color: High contrast against the background (white on dark, or dark on light with subtle shadow)
- Background: Rich, atmospheric visual composition — NOT a plain solid color
- Include subtle design elements: geometric accents, light rays, gradient overlays, or bokeh
- Color palette: Cohesive, modern, and premium (think Bethel Music, Maverick City, or Elevation Worship social media)
- Overall feel: Would look at home on a church Instagram with 100K+ followers

ABSOLUTE RULES:
- The Spanish text must be PERFECTLY spelled — no gibberish, no invented characters, no lorem ipsum
- No stock photo watermarks
- No cluttered layouts — elegant minimalism
- The image should feel like it was designed by a professional church media team`;
}
