"use client";

import type { Sermon, SlideDeck } from "./types";

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

export async function exportWord(sermon: Sermon): Promise<void> {
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

export async function exportPptx(sermon: Sermon, deck: SlideDeck): Promise<void> {
  const pptxgen = (await import("pptxgenjs")).default;
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";

  const title = pptx.addSlide();
  title.background = { color: "1C1917" };
  title.addText(sermon.title || "Sermon", {
    x: 0.5,
    y: 2.4,
    w: 12.3,
    h: 1.6,
    fontSize: 40,
    bold: true,
    color: "FFFFFF",
    align: "center",
  });
  if (sermon.config.scripture) {
    title.addText(sermon.config.scripture, {
      x: 0.5,
      y: 4.1,
      w: 12.3,
      h: 0.8,
      fontSize: 22,
      color: "C4B5FD",
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
    slide.addText(slideTitle, {
      x: 0.5,
      y: 0.4,
      w: 12.3,
      h: 1,
      fontSize: 28,
      bold: true,
      color: "5B21B6",
    });
    if (body) {
      slide.addText(body, {
        x: 0.6,
        y: 1.6,
        w: 12.1,
        h: 5.4,
        fontSize: 18,
        color: "1C1917",
        valign: "top",
      });
    }
  }

  await pptx.writeFile({ fileName: fileName(sermon.title, "pptx") });
}
