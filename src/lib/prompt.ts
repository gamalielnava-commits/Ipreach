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

const SYSTEM_BASE = `Eres un asistente experto en homiletica y teologia que ayuda a pastores y predicadores hispanohablantes a preparar sermones a nivel profesional.

Reglas importantes:
- Escribe siempre en espanol claro, pastoral y reverente.
- Respeta con fidelidad el marco doctrinal indicado por el usuario; no introduzcas enfasis ajenos a esa tradicion.
- Usa solo referencias biblicas reales y correctas. Nunca inventes versiculos, citas ni numeros de capitulo o verso. Si no estas seguro de una cita, no la incluyas.
- Maneja el texto biblico con exegesis solida y respeto del contexto.
- Estructura el contenido de forma ordenada y lista para predicar.`;

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

export function buildSermonMessages(config: SermonConfig): Messages {
  const user = `Prepara un sermon completo con los siguientes parametros.

${frameworkBlock(config)}

${configBlock(config)}

Entrega el sermon con esta estructura:
1. Titulo del sermon
2. Texto biblico base
3. Idea central (una sola frase)
4. Introduccion
5. Cuerpo con divisiones principales y subpuntos (aplica el metodo y la estrategia indicados)
6. Ilustraciones integradas en los puntos
7. Aplicacion practica
8. Conclusion con llamado

Usa subtitulos claros. El resultado debe estar listo para revisar y predicar.`;
  return { system: SYSTEM_BASE, user };
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
