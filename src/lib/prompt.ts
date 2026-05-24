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
} from "./catalogs";
import type { SermonConfig, SlideDensity } from "./types";

export interface Messages {
  system: string;
  user: string;
}

const SYSTEM_BASE = `Eres un asistente experto en homiletica, exegesis biblica y teologia pastoral que ayuda a pastores y predicadores hispanohablantes a preparar contenido a nivel profesional, listo para predicar en el pulpito.

REGLAS DE INTEGRIDAD BIBLICA Y TEOLOGICA:
- Escribe siempre en espanol claro, pastoral, reverente, sin jerga academica innecesaria.
- Respeta con fidelidad estricta el marco doctrinal indicado por el usuario; no introduzcas enfasis ajenos a esa tradicion.
- Usa solo referencias biblicas reales y correctas. Nunca inventes versiculos, citas, numeros de capitulo o verso. Si no estas absolutamente seguro de una cita exacta, no la incluyas.
- Respeta el genero literario del texto: narrativo, profetico, sapiencial, epistolar, apocaliptico o poetico. Cada genero exige una hermeneutica propia.
- Distingue descripcion de prescripcion: no toda narrativa es un mandato para imitar.
- Maneja el texto con exegesis solida: contexto historico-cultural, contexto literario inmediato, contexto canonico.
- Prohibido: eisegesis (leer en el texto lo que no esta), alegorias forzadas, predicacion proof-text fuera de contexto, moralismo desconectado del evangelio.
- Cuando el genero y el pasaje lo permitan, conecta organicamente con la persona y obra de Cristo, sin alegoria forzada.

REGLAS DE CALIDAD HOMILETICA:
- Tono pastoral antes que erudicion. Claridad antes que sofisticacion. Aplicacion concreta antes que abstraccion piadosa.
- Estructura jerarquica visible: titulos, divisiones numeradas, transiciones explicitas entre puntos.
- Ilustraciones que iluminan el punto, no que entretienen sin servir al texto.
- Aplicaciones especificas, verificables, contextualizadas (no genericas tipo 'ora mas', 'lee la Biblia').
- Llamado o respuesta concreta al final.

REGLAS DE FORMATO:
- Usa subtitulos claros y consistentes. Numera las divisiones principales.
- Para cada division, si el metodo del usuario lo exige, usa exactamente los subtitulos del metodo (ej. PEICA: 'Presentacion', 'Explicacion', 'Ilustracion', 'Conclusion', 'Aplicacion').
- El resultado debe estar listo para revisar, imprimir y predicar sin reescritura mayor.`;

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
    const typeNames = namesFromSlugs(sermonTypes, config.sermonTypes).join(" + ");
    lines.push(`Tipo de sermon: ${typeNames}`);
    for (const slug of config.sermonTypes) {
      const t = findBySlug(sermonTypes, slug);
      if (t?.homileticGuide) {
        lines.push(`Guia homiletica del tipo (${t.name}):\n${t.homileticGuide}`);
      }
    }
  }
  if (strategy) {
    lines.push(
      `Estrategia: ${strategy.name}${strategy.author ? ` (${strategy.author})` : ""} - ${strategy.description}`,
    );
    if (strategy.homileticGuide) {
      lines.push(`Guia estrategica:\n${strategy.homileticGuide}`);
    }
  }
  if (method) {
    lines.push(`Metodo de preparacion: ${method.name}${method.author ? ` (${method.author})` : ""}.`);
    lines.push(
      `Pasos operativos (sigue exactamente este orden y usa estos nombres como subtitulos en cada division del cuerpo):\n- ${method.steps.join("\n- ")}`,
    );
    if (method.homileticGuide) {
      lines.push(`Notas del metodo:\n${method.homileticGuide}`);
    }
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
      "1. Titulo (frase corta, evocadora; no doctrinaria salvo en sermon doctrinal)\n" +
      "2. Texto biblico base (con referencia exacta, version reconocida)\n" +
      "3. Idea central homiletica (UNA sola oracion: sujeto + complemento)\n" +
      "4. Introduccion (gancho concreto + contexto del oyente + puente al texto + tesis)\n" +
      "5. Contexto del pasaje (historico, literario, canonico; breve pero solido)\n" +
      "6. Cuerpo: divisiones principales numeradas siguiendo el metodo y la estrategia indicados. Si el metodo es PEICA, cada division debe contener los cinco subtitulos en orden: 'Presentacion', 'Explicacion', 'Ilustracion', 'Conclusion', 'Aplicacion'. Si es otro metodo, usa sus pasos como subtitulos visibles. Cada subpunto debe incluir: exegesis breve, ilustracion integrada (no decorativa) y aplicacion especifica.\n" +
      "7. Conclusion del sermon (recapitulacion de la idea central + llamado claro y concreto)\n" +
      "8. Versiculo para memorizar o frase final para llevarse",
  };
}

export function buildSermonMessages(config: SermonConfig): Messages {
  const { label, structure } = contentStructure(config.contentType || "sermon");
  const user = `Prepara ${label} completo con los siguientes parametros.

${frameworkBlock(config)}

${configBlock(config)}

Entrega el contenido con esta estructura:
${structure}

Usa subtitulos claros. El resultado debe estar listo para revisar y usar.`;
  return { system: SYSTEM_BASE, user };
}

export function buildChatSystemPrompt(config: SermonConfig): string {
  const { label, structure } = contentStructure(config.contentType || "sermon");
  return `${SYSTEM_BASE}

Estas conversando con un predicador en un chat. Responde sus preguntas sobre homiletica, Biblia, teologia y preparacion de contenido de forma clara, pastoral y util.

El tipo de contenido activo es: ${label}. Cuando el usuario te pida preparar, crear o mejorar contenido, redactalo COMPLETO en tu respuesta con esta estructura:
${structure}
Respeta el marco doctrinal y los filtros activos.

Contexto del usuario y filtros activos:
${frameworkBlock(config)}
${configBlock(config)}

Se breve cuando la pregunta es breve; extenso solo cuando se pide preparar contenido.`;
}

export function buildOutlineMessages(
  config: SermonConfig,
  sermonText: string,
): Messages {
  const user = `A partir del siguiente sermon ya redactado, genera un BOSQUEJO claro y conciso para el predicador.

El bosquejo debe incluir: titulo, texto base, idea central, divisiones principales con sus subpuntos (frases breves), citas biblicas clave y un cierre. Usa numeracion y vinetas. No reescribas el sermon completo.

Marco doctrinal: ${findBySlug(frameworks, config.framework)?.name ?? "no indicado"}.

--- SERMON ---
${sermonText}
--- FIN DEL SERMON ---`;
  return { system: SYSTEM_BASE, user };
}

export function buildSlidesMessages(
  config: SermonConfig,
  sermonText: string,
  styleSlug: string,
  density: SlideDensity,
): Messages {
  const style = findBySlug(slideStyles, styleSlug);
  const densityRule =
    density === "corta"
      ? "Cada diapositiva lleva solo lo esencial: titulo, titulos de las divisiones y versiculos."
      : density === "mediana"
        ? "Cada diapositiva incluye titulo, idea central y puntos breves por division."
        : "Cada diapositiva incluye desarrollo, ilustracion resumida y aplicaciones, sin saturar.";

  const user = `A partir del siguiente sermon, genera el contenido de una presentacion de diapositivas.

Densidad: ${density}. ${densityRule}

Para cada diapositiva entrega:
- DIAPOSITIVA n
- Titulo
- Contenido (texto que va en la lamina, en vinetas breves)
- Sugerencia de imagen: una descripcion corta de la imagen ideal para esa lamina, coherente con el estilo visual "${style?.name ?? styleSlug}".

Estilo visual de referencia: ${style?.promptBase ?? styleSlug}.

Manten el texto de cada lamina breve y legible desde lejos.

--- SERMON ---
${sermonText}
--- FIN DEL SERMON ---`;
  return { system: SYSTEM_BASE, user };
}

export function slideImagePrompt(styleSlug: string, sermonTitle: string): string {
  const style = findBySlug(slideStyles, styleSlug);
  return `${style?.promptBase ?? styleSlug}. Tema del sermon: "${sermonTitle}". Sin texto sobre la imagen, composicion limpia para colocar texto encima.`;
}

export function buildPhrasesMessages(sermonText: string): Messages {
  const user = `Del siguiente sermon, extrae 6 frases breves, potentes y citables (maximo 12 palabras cada una), ideales para publicar en redes sociales de una iglesia.

Devuelvelas como una lista simple, una frase por linea, sin numeracion, sin comillas y sin guiones.

--- SERMON ---
${sermonText}
--- FIN DEL SERMON ---`;
  return { system: SYSTEM_BASE, user };
}

export function buildSocialImagePrompt(phrase: string, styleSlug: string): string {
  const style = findBySlug(slideStyles, styleSlug);
  return `Crea una imagen cuadrada para una publicacion de redes sociales de una iglesia.
Estilo visual: ${style?.promptBase ?? styleSlug}.
Integra esta frase como tipografia elegante, legible y bien compuesta sobre la imagen: "${phrase}".
La frase debe escribirse exactamente asi, en espanol y sin errores ortograficos.
Composicion equilibrada y de aspecto profesional.`;
}
