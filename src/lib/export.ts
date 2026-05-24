"use client";

import type { Sermon, SlideDeck } from "./types";

export interface ExportOptions {
  logoUrl?: string;
  includeLogo?: boolean;
  churchName?: string;
}

function cleanInline(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/^#+\s*/, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/^titulo:\s*/i, "")
    .replace(/^título:\s*/i, "")
    .replace(/^contenido:\s*/i, "")
    .replace(/^texto:\s*/i, "")
    .trim();
}

function cleanBulletPrefix(line: string): string {
  return line.replace(/^[-*•]\s*/, "").trim();
}

function fileName(title: string, ext: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return `${base || "sermon"}.${ext}`;
}

function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportWord(sermon: Sermon, _opts?: ExportOptions): Promise<void> {
  const { Document, Packer, Paragraph, HeadingLevel } = await import("docx");

  const toParagraphs = (text: string) => {
    const out: InstanceType<typeof Paragraph>[] = [];
    for (const raw of text.split("\n")) {
      const line = raw.trimEnd();
      if (!line.trim()) {
        out.push(new Paragraph({ text: "" }));
        continue;
      }
      const heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        const level = heading[1].length;
        out.push(
          new Paragraph({
            text: cleanInline(heading[2]),
            heading:
              level <= 1
                ? HeadingLevel.HEADING_1
                : level === 2
                  ? HeadingLevel.HEADING_2
                  : HeadingLevel.HEADING_3,
          }),
        );
        continue;
      }
      const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
      if (bullet) {
        out.push(
          new Paragraph({ text: cleanInline(bullet[1]), bullet: { level: 0 } }),
        );
        continue;
      }
      out.push(new Paragraph({ text: cleanInline(line) }));
    }
    return out;
  };

  const children: InstanceType<typeof Paragraph>[] = [
    new Paragraph({ text: sermon.title || "Sermon", heading: HeadingLevel.TITLE }),
  ];
  if (sermon.config.scripture) {
    children.push(new Paragraph({ text: sermon.config.scripture }));
  }
  children.push(new Paragraph({ text: "" }));
  children.push(...toParagraphs(sermon.sermonText));

  if (sermon.outlineText.trim()) {
    children.push(
      new Paragraph({
        text: "Bosquejo",
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      }),
    );
    children.push(...toParagraphs(sermon.outlineText));
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  download(blob, fileName(sermon.title, "docx"));
}

interface PptxTheme {
  bg: string;
  bgAlt?: string;
  title: string;
  body: string;
  accent: string;
  accentCool?: string;
  accentWarm?: string;
  series?: string;
  fontHeader?: string;
  fontBody?: string;
  isDark?: boolean;
}

const pptxThemes: Record<string, PptxTheme> = {
  // Existing themes
  arcilla: { bg: "FDF2F8", title: "9D174D", body: "57534E", accent: "F9A8D4", fontHeader: "Georgia", fontBody: "Calibri", isDark: false },
  comics: { bg: "FEF9C3", title: "1E3A8A", body: "1C1917", accent: "EF4444", fontHeader: "Impact", fontBody: "Arial", isDark: false },
  realista: { bg: "F5F5F4", title: "1C1917", body: "44403C", accent: "A8A29E", fontHeader: "Trebuchet MS", fontBody: "Calibri", isDark: false },
  
  // Cinematic / Church themes (New and mapped)
  "cinematic-dark": {
    bg: "0A0A0A",
    bgAlt: "111827",
    title: "FFFFFF",
    body: "D4D4D4",
    accent: "F59E0B",
    accentCool: "3B82F6",
    series: "EF4444",
    fontHeader: "Arial Black",
    fontBody: "Calibri",
    isDark: true,
  },
  elevation: {
    bg: "0A0A0A",
    bgAlt: "111827",
    title: "FFFFFF",
    body: "D4D4D4",
    accent: "F59E0B",
    accentCool: "3B82F6",
    series: "EF4444",
    fontHeader: "Arial Black",
    fontBody: "Calibri",
    isDark: true,
  },
  "elevation-worship": {
    bg: "0A0A0A",
    bgAlt: "111827",
    title: "FFFFFF",
    body: "D4D4D4",
    accent: "F59E0B",
    accentCool: "3B82F6",
    series: "EF4444",
    fontHeader: "Arial Black",
    fontBody: "Calibri",
    isDark: true,
  },
  "holy-atmosphere": {
    bg: "0D0B1E",
    bgAlt: "1A1033",
    title: "FFFFFF",
    body: "C4B5FD",
    accent: "F7C948",
    accentCool: "A78BFA",
    series: "C4B5FD",
    fontHeader: "Georgia",
    fontBody: "Calibri Light",
    isDark: true,
  },
  hillsong: {
    bg: "0D0B1E",
    bgAlt: "1A1033",
    title: "FFFFFF",
    body: "C4B5FD",
    accent: "F7C948",
    accentCool: "A78BFA",
    series: "C4B5FD",
    fontHeader: "Georgia",
    fontBody: "Calibri Light",
    isDark: true,
  },
  "urban-bold": {
    bg: "FFFFFF",
    bgAlt: "111827",
    title: "111827",
    body: "374151",
    accent: "EF4444",
    accentCool: "0EA5E9",
    series: "F97316",
    fontHeader: "Impact",
    fontBody: "Arial",
    isDark: false,
  },
  urban: {
    bg: "FFFFFF",
    bgAlt: "111827",
    title: "111827",
    body: "374151",
    accent: "EF4444",
    accentCool: "0EA5E9",
    series: "F97316",
    fontHeader: "Impact",
    fontBody: "Arial",
    isDark: false,
  },
  "light-minimalist": {
    bg: "FAFAFA",
    bgAlt: "F3F4F6",
    title: "111827",
    body: "4B5563",
    accent: "0EA5E9",
    accentWarm: "D97706",
    series: "0284C7",
    fontHeader: "Trebuchet MS",
    fontBody: "Calibri",
    isDark: false,
  },
  minimalist: {
    bg: "FAFAFA",
    bgAlt: "F3F4F6",
    title: "111827",
    body: "4B5563",
    accent: "0EA5E9",
    accentWarm: "D97706",
    series: "0284C7",
    fontHeader: "Trebuchet MS",
    fontBody: "Calibri",
    isDark: false,
  },
  minimal: {
    bg: "FAFAFA",
    bgAlt: "F3F4F6",
    title: "111827",
    body: "4B5563",
    accent: "0EA5E9",
    accentWarm: "D97706",
    series: "0284C7",
    fontHeader: "Trebuchet MS",
    fontBody: "Calibri",
    isDark: false,
  },
  "sermon-fire": {
    bg: "1A0505",
    bgAlt: "2D0808",
    title: "FFFFFF",
    body: "FCA5A5",
    accent: "F97316",
    accentCool: "EF4444",
    series: "FCA5A5",
    fontHeader: "Arial Black",
    fontBody: "Arial",
    isDark: true,
  },
  fire: {
    bg: "1A0505",
    bgAlt: "2D0808",
    title: "FFFFFF",
    body: "FCA5A5",
    accent: "F97316",
    accentCool: "EF4444",
    series: "FCA5A5",
    fontHeader: "Arial Black",
    fontBody: "Arial",
    isDark: true,
  },
  cinematografico: {
    bg: "0A0A0A",
    bgAlt: "111827",
    title: "FFFFFF",
    body: "D4D4D4",
    accent: "F59E0B",
    accentCool: "3B82F6",
    series: "EF4444",
    fontHeader: "Arial Black",
    fontBody: "Calibri",
    isDark: true,
  },
  cine: {
    bg: "0A0A0A",
    bgAlt: "111827",
    title: "FFFFFF",
    body: "D4D4D4",
    accent: "F59E0B",
    accentCool: "3B82F6",
    series: "EF4444",
    fontHeader: "Arial Black",
    fontBody: "Calibri",
    isDark: true,
  },
  pergamino: {
    bg: "F5E6C8",
    bgAlt: "EAD9B5",
    title: "3B2314",
    body: "5C3D2E",
    accent: "C19A49",
    accentWarm: "8B6914",
    series: "6B4226",
    fontHeader: "Georgia",
    fontBody: "Palatino",
    isDark: false,
  },
  vitral: {
    bg: "0F1B4C",
    bgAlt: "0A1235",
    title: "FFFFFF",
    body: "B8C4E0",
    accent: "E63946",
    accentCool: "2EC4B6",
    accentWarm: "F4A261",
    series: "FFD700",
    fontHeader: "Georgia",
    fontBody: "Calibri Light",
    isDark: true,
  },
  brutalista: {
    bg: "FFFFFF",
    bgAlt: "E5E5E5",
    title: "000000",
    body: "1A1A1A",
    accent: "DC2626",
    series: "000000",
    fontHeader: "Impact",
    fontBody: "Arial",
    isDark: false,
  },
  acuarela: {
    bg: "F0E8F8",
    bgAlt: "E8DFF0",
    title: "2D1B4E",
    body: "3D2B5E",
    accent: "0D9488",
    accentCool: "7C3AED",
    accentWarm: "F472B6",
    series: "0D9488",
    fontHeader: "Georgia",
    fontBody: "Calibri",
    isDark: false,
  },
  neon: {
    bg: "0A0A14",
    bgAlt: "0F0F1E",
    title: "00F5FF",
    body: "B0E0E6",
    accent: "FF1493",
    accentCool: "00F5FF",
    accentWarm: "FF1493",
    series: "7B2FFF",
    fontHeader: "Arial Black",
    fontBody: "Calibri",
    isDark: true,
  },
  mosaico: {
    bg: "1A1408",
    bgAlt: "2A2010",
    title: "D4A934",
    body: "C8B67A",
    accent: "D97706",
    accentCool: "1E40AF",
    accentWarm: "D97706",
    series: "D4A934",
    fontHeader: "Georgia",
    fontBody: "Palatino",
    isDark: true,
  },
  editorial: {
    bg: "FAFAFA",
    bgAlt: "F3F4F6",
    title: "1F2937",
    body: "374151",
    accent: "FF6B6B",
    accentCool: "6366F1",
    series: "FF6B6B",
    fontHeader: "Trebuchet MS",
    fontBody: "Calibri",
    isDark: false,
  },
  tipografico: {
    bg: "000000",
    bgAlt: "111111",
    title: "FFFFFF",
    body: "D4D4D4",
    accent: "FFD700",
    series: "FFFFFF",
    fontHeader: "Impact",
    fontBody: "Arial",
    isDark: true,
  },
  selva: {
    bg: "0A1A0A",
    bgAlt: "0F2A0F",
    title: "FDF5E6",
    body: "C6D9B7",
    accent: "10B981",
    accentCool: "059669",
    accentWarm: "D97706",
    series: "10B981",
    fontHeader: "Georgia",
    fontBody: "Calibri",
    isDark: true,
  },
  avivamiento: {
    bg: "1A0505",
    bgAlt: "2D0808",
    title: "FFFFFF",
    body: "FCA5A5",
    accent: "F97316",
    accentCool: "EF4444",
    accentWarm: "F97316",
    series: "FCA5A5",
    fontHeader: "Arial Black",
    fontBody: "Arial",
    isDark: true,
  },
};

function themeFor(style: string): PptxTheme {
  return pptxThemes[style] ?? pptxThemes.realista;
}

export async function exportPptx(sermon: Sermon, deck: SlideDeck, _opts?: ExportOptions): Promise<void> {
  const pptxgen = (await import("pptxgenjs")).default;
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE"; // Widescreen 16:9 (13.33 x 7.5 inches)
  
  const theme = themeFor(deck.style);
  
  // Slide 1: Portada (Title & Subtitle)
  const cover = pptx.addSlide();
  cover.background = { color: theme.bg };
  
  // Theme-specific shapes for cover
  if (deck.style === "hillsong" || deck.style === "holy-atmosphere") {
    // Holy Atmosphere style: Centered text with etéreo look
    cover.addText(sermon.config?.occasion?.toUpperCase() || "SERVICIO DOMINICAL", {
      x: 0.8, y: 2.0, w: 11.73, h: 0.5,
      fontSize: 14, bold: true, color: theme.accent,
      fontFace: theme.fontHeader || "Georgia", align: "center", charSpacing: 3
    });
    cover.addText(sermon.title, {
      x: 0.8, y: 2.6, w: 11.73, h: 2.2,
      fontSize: 48, bold: true, color: theme.title,
      fontFace: theme.fontHeader || "Georgia", align: "center", valign: "middle"
    });
    if (sermon.config.scripture) {
      cover.addText(sermon.config.scripture, {
        x: 0.8, y: 4.8, w: 11.73, h: 0.8,
        fontSize: 22, color: theme.body,
        fontFace: theme.fontBody || "Calibri", align: "center", italic: true
      });
    }
  } else if (deck.style === "urban" || deck.style === "urban-bold") {
    // Urban Bold: large oversized text, left-aligned, high contrast
    cover.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 1.5, w: 0.15, h: 4.0,
      fill: { color: theme.accent }
    });
    cover.addText(sermon.title.toUpperCase(), {
      x: 1.2, y: 1.5, w: 11.0, h: 3.0,
      fontSize: 54, bold: true, color: theme.title,
      fontFace: theme.fontHeader || "Impact", valign: "middle"
    });
    cover.addText(`${sermon.config?.occasion || ""} · ${sermon.config.scripture || ""}`, {
      x: 1.2, y: 4.6, w: 11.0, h: 0.8,
      fontSize: 20, bold: true, color: theme.accent,
      fontFace: theme.fontBody || "Arial"
    });
  } else if (deck.style === "minimal" || deck.style === "light-minimalist") {
    // Light Minimalist: extremely clean and premium, light gray borders
    cover.addShape(pptx.ShapeType.rect, {
      x: 1.5, y: 3.5, w: 10.33, h: 0.02,
      fill: { color: theme.accent }
    });
    cover.addText(sermon.title, {
      x: 1.5, y: 1.8, w: 10.33, h: 1.6,
      fontSize: 44, bold: true, color: theme.title,
      fontFace: theme.fontHeader || "Trebuchet MS", align: "center", valign: "middle"
    });
    cover.addText(sermon.config.scripture || sermon.config.idea || "", {
      x: 1.5, y: 3.8, w: 10.33, h: 1.0,
      fontSize: 20, color: theme.body,
      fontFace: theme.fontBody || "Calibri", align: "center"
    });
  } else {
    // Cinematic Dark / Sermon Fire & others: dramatic centered titles
    cover.addShape(pptx.ShapeType.rect, {
      x: 5.16, y: 1.8, w: 3.0, h: 0.08,
      fill: { color: theme.accent }
    });
    cover.addText(sermon.title, {
      x: 0.8, y: 2.1, w: 11.73, h: 2.2,
      fontSize: 46, bold: true, color: theme.title,
      fontFace: theme.fontHeader || "Arial Black", align: "center", valign: "middle"
    });
    cover.addText(sermon.config.scripture || sermon.config.idea || "", {
      x: 0.8, y: 4.5, w: 11.73, h: 0.8,
      fontSize: 22, color: theme.accent,
      fontFace: theme.fontBody || "Calibri", align: "center"
    });
    cover.addText(sermon.config.occasion || "", {
      x: 0.8, y: 5.4, w: 11.73, h: 0.5,
      fontSize: 12, color: theme.body,
      fontFace: theme.fontBody || "Calibri", align: "center", charSpacing: 2
    });
  }

  // Speaker notes for Cover
  cover.addNotes(`PORTADA — ${sermon.title}\n- Transición de inicio e introducción.\n- Tiempo aproximado: 2-3 minutos.`);

  // Parse deck slides
  const blocks = deck.text
    .split(/^[ \t]*DIAPOSITIVA[^\n]*$/im)
    .map((b) => b.trim())
    .filter(Boolean);
  const sections = blocks.length ? blocks : [deck.text];

  let slideIndex = 1;
  for (const block of sections) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    // Filter out image suggestions and meta lines
    const filtered = lines.filter((l) => {
      const low = l.toLowerCase();
      return !low.startsWith("sugerencia de imagen") &&
             !low.startsWith("sugerencia visual") &&
             !low.startsWith("imagen:") &&
             !low.startsWith("fondo:") &&
             !low.startsWith("nota:") &&
             !low.startsWith("---");
    });
    const rawTitle = filtered[0] || "Diapositiva";
    const slideTitle = cleanInline(rawTitle);
    const contentLines = filtered.slice(1)
      .map(cleanInline)
      .filter(Boolean);

    const isVerse = slideTitle.toLowerCase().includes("versículo") ||
                    slideTitle.toLowerCase().includes("cita") ||
                    slideTitle.toLowerCase().includes("texto") ||
                    slideTitle.toLowerCase().includes("pasaje") ||
                    contentLines.some(l => l.startsWith("“") || l.endsWith("”"));

    const slide = pptx.addSlide();
    slide.background = { color: theme.bg };

    // Layout configuration per style & type
    if (isVerse) {
      // Styling for Scripture quote slides
      if (theme.isDark) {
        // Dark theme: quote block box outline
        slide.addShape(pptx.ShapeType.rect, {
          x: 1.0, y: 1.2, w: 11.33, h: 5.1,
          fill: { color: "FFFFFF", transparency: 96 },
          line: { color: theme.accent, width: 1.5 }
        });
      } else {
        // Light theme: elegant subtle grey box outline
        slide.addShape(pptx.ShapeType.rect, {
          x: 1.0, y: 1.2, w: 11.33, h: 5.1,
          fill: { color: "000000", transparency: 97 },
          line: { color: theme.accent, width: 1.5 }
        });
      }

      // Format body text: join content lines
      const quoteText = contentLines.filter(l => !l.match(/^\[?\w+\s+\d+:\d+\]?$/)).join("\n\n");
      const referenceText = contentLines.find(l => l.match(/^\[?\w+\s+\d+:\d+\]?$/)) || sermon.config.scripture || "";

      slide.addText(quoteText, {
        x: 1.5, y: 1.6, w: 10.33, h: 3.5,
        fontSize: 24, italic: true, color: theme.title,
        fontFace: theme.fontBody || "Calibri", valign: "middle", lineSpacingMultiple: 1.25
      });

      if (referenceText) {
        slide.addText(referenceText, {
          x: 1.5, y: 5.2, w: 10.33, h: 0.7,
          fontSize: 20, bold: true, color: theme.accent,
          fontFace: theme.fontHeader || "Arial Black", align: "right"
        });
      }
      
      slide.addNotes(`VERSÍCULO BÍBLICO\n- Leer despacio y con reverencia.\n- Enfatizar en la aplicación práctica.`);
    } else {
      // Styling for Point/Truth slides
      let hasNumber = false;
      let pointNumStr = "";
      const numMatch = slideTitle.match(/^(i+|[0-9]+)\.?\s+(.*)$/i);
      if (numMatch) {
        hasNumber = true;
        pointNumStr = numMatch[1].toUpperCase();
      } else if (slideTitle.toLowerCase().includes("punto")) {
        hasNumber = true;
        const words = slideTitle.split(" ");
        pointNumStr = words.find(w => w.match(/^[0-9]+$/)) || String(slideIndex);
      }

      // 1. Accent shapes
      if (deck.style === "urban" || deck.style === "urban-bold") {
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.8, y: 1.0, w: 0.1, h: 1.2,
          fill: { color: theme.accent }
        });
      } else if (deck.style === "minimal" || deck.style === "light-minimalist") {
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.8, y: 1.25, w: 0.8, h: 0.05,
          fill: { color: theme.accent }
        });
      } else {
        // Vertical side bar
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.6, y: 1.1, w: 0.06, h: 1.5,
          fill: { color: theme.accent }, line: { color: theme.accent }
        });
      }

      // Point Number highlight circle
      if (hasNumber) {
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 0.8, y: 1.1, w: 0.8, h: 0.8,
          fill: { color: theme.accent }
        });
        slide.addText(pointNumStr, {
          x: 0.8, y: 1.1, w: 0.8, h: 0.8,
          fontSize: 22, bold: true, color: theme.isDark ? "000000" : "FFFFFF",
          fontFace: theme.fontHeader || "Arial Black", align: "center", valign: "middle"
        });
      }

      // Title text
      slide.addText(slideTitle, {
        x: hasNumber ? 1.8 : 1.0,
        y: 1.1,
        w: hasNumber ? 10.5 : 11.3,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: theme.title,
        fontFace: theme.fontHeader || "Arial Black",
        valign: "middle"
      });

      // Body bullet lines without bullet prefixes
      const cleanedBodyLines = contentLines.map(cleanBulletPrefix);
      const bodyText = cleanedBodyLines.join("\n\n");

      if (bodyText) {
        slide.addText(bodyText, {
          x: 1.0,
          y: 2.3,
          w: 11.3,
          h: 4.5,
          fontSize: 20,
          color: theme.body,
          fontFace: theme.fontBody || "Calibri",
          valign: "top",
          lineSpacingMultiple: 1.3
        });
      }

      slide.addNotes(`PUNTO PRINCIPAL: ${slideTitle}\n- Desarrollar la idea central.\n- Duración aproximada: 3-5 minutos.`);
    }

    slideIndex++;
  }

  await pptx.writeFile({ fileName: fileName(sermon.title, "pptx") });
}
