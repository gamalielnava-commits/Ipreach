"use client";

import type { Sermon, SlideDeck } from "./types";

export interface ExportOptions {
  logoUrl?: string;
  includeLogo?: boolean;
  churchName?: string;
}

function dataUrlToBase64(dataUrl: string): { data: string; ext: "png" | "jpeg" | "gif" } | null {
  const m = dataUrl.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
  if (!m) return null;
  const ext = (m[1] === "jpg" ? "jpeg" : m[1]) as "png" | "jpeg" | "gif";
  return { data: m[2], ext };
}

function cleanInline(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/^#+\s*/, "")
    .trim();
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

export async function exportWord(sermon: Sermon, opts: ExportOptions = {}): Promise<void> {
  const { Document, Packer, Paragraph, HeadingLevel, ImageRun, AlignmentType } = await import("docx");

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

  const children: InstanceType<typeof Paragraph>[] = [];

  if (opts.includeLogo && opts.logoUrl) {
    const parsed = dataUrlToBase64(opts.logoUrl);
    if (parsed) {
      try {
        const bytes = Uint8Array.from(atob(parsed.data), (c) => c.charCodeAt(0));
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: bytes,
                transformation: { width: 100, height: 100 },
                type: parsed.ext,
              } as any),
            ],
          }),
        );
        if (opts.churchName) {
          children.push(new Paragraph({ text: opts.churchName, alignment: AlignmentType.CENTER }));
        }
        children.push(new Paragraph({ text: "" }));
      } catch (err) {
        console.warn("No se pudo incrustar el logo en Word:", err);
      }
    }
  }

  children.push(new Paragraph({ text: sermon.title || "Sermon", heading: HeadingLevel.TITLE }));
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
  title: string;
  body: string;
  accent: string;
}

const pptxThemes: Record<string, PptxTheme> = {
  hillsong: { bg: "1E1B4B", title: "FFFFFF", body: "E0E7FF", accent: "818CF8" },
  "elevation-worship": {
    bg: "0A0A0A",
    title: "FFFFFF",
    body: "D4D4D4",
    accent: "F59E0B",
  },
  arcilla: { bg: "FDF2F8", title: "9D174D", body: "57534E", accent: "F9A8D4" },
  comics: { bg: "FEF9C3", title: "1E3A8A", body: "1C1917", accent: "EF4444" },
  realista: { bg: "F5F5F4", title: "1C1917", body: "44403C", accent: "A8A29E" },
  cinematografico: {
    bg: "0C0A09",
    title: "FAFAF9",
    body: "A8A29E",
    accent: "B91C1C",
  },
};

function themeFor(style: string): PptxTheme {
  return pptxThemes[style] ?? pptxThemes.realista;
}

export async function exportPptx(sermon: Sermon, deck: SlideDeck, opts: ExportOptions = {}): Promise<void> {
  const pptxgen = (await import("pptxgenjs")).default;
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  const theme = themeFor(deck.style);

  const useLogo = !!(opts.includeLogo && opts.logoUrl);

  const cover = pptx.addSlide();
  cover.background = { color: theme.bg };
  if (useLogo && opts.logoUrl) {
    cover.addImage({ data: opts.logoUrl, x: 5.92, y: 0.55, w: 1.5, h: 1.5 });
  }
  cover.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 3.05,
    w: 13.33,
    h: 0.06,
    fill: { color: theme.accent },
  });
  cover.addText(sermon.title || "Sermon", {
    x: 0.8,
    y: 2.0,
    w: 11.7,
    h: 1.1,
    fontSize: 40,
    bold: true,
    color: theme.title,
    align: "center",
  });
  if (sermon.config.scripture) {
    cover.addText(sermon.config.scripture, {
      x: 0.8,
      y: 3.3,
      w: 11.7,
      h: 0.8,
      fontSize: 22,
      color: theme.accent,
      align: "center",
    });
  }

  const blocks = deck.text
    .split(/^[ \t]*DIAPOSITIVA[^\n]*$/im)
    .map((b) => b.trim())
    .filter(Boolean);
  const sections = blocks.length ? blocks : [deck.text];

  for (const block of sections) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const slideTitle = cleanInline(lines[0] || "Diapositiva");
    const body = lines.slice(1).map(cleanInline).join("\n");
    const slide = pptx.addSlide();
    slide.background = { color: theme.bg };
    if (useLogo && opts.logoUrl) {
      slide.addImage({ data: opts.logoUrl, x: 12.3, y: 0.3, w: 0.7, h: 0.7 });
    }
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.32,
      w: 1.4,
      h: 0.09,
      fill: { color: theme.accent },
    });
    slide.addText(slideTitle, {
      x: 0.5,
      y: 0.45,
      w: 12.3,
      h: 0.85,
      fontSize: 28,
      bold: true,
      color: theme.title,
    });
    if (body) {
      slide.addText(body, {
        x: 0.55,
        y: 1.65,
        w: 12.2,
        h: 5.4,
        fontSize: 18,
        color: theme.body,
        valign: "top",
        lineSpacingMultiple: 1.15,
      });
    }
  }

  await pptx.writeFile({ fileName: fileName(sermon.title, "pptx") });
}
