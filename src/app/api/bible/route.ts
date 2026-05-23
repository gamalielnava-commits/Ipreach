import { NextResponse } from "next/server";
import { parseReference, referenceLabel } from "@/lib/bible";

export const runtime = "nodejs";
export const maxDuration = 30;

interface Body {
  reference: string;
  version: string;
}

interface BollsVerse {
  verse: number;
  text: string;
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo invalido." }, { status: 400 });
  }

  const parsed = parseReference(body.reference || "");
  if (!parsed) {
    return NextResponse.json(
      { error: "No se reconocio la referencia. Ejemplo: Juan 3:16" },
      { status: 400 },
    );
  }

  let version = (body.version || "RV1960").trim();
  if (version === "RVR1960" || version === "RV1909") {
    version = "RV1960";
  }

  try {
    const res = await fetch(
      `https://bolls.life/get-text/${version}/${parsed.book}/${parsed.chapter}/`,
      { headers: { accept: "application/json" } },
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `No se pudo obtener el texto biblico (${res.status}).` },
        { status: 502 },
      );
    }
    const all = (await res.json()) as BollsVerse[];
    if (!Array.isArray(all) || all.length === 0) {
      return NextResponse.json(
        { error: "No se encontro el pasaje." },
        { status: 404 },
      );
    }

    let verses = all;
    if (parsed.verseStart) {
      const end = parsed.verseEnd ?? parsed.verseStart;
      verses = all.filter(
        (v) => v.verse >= parsed.verseStart! && v.verse <= end,
      );
    }
    if (verses.length === 0) {
      return NextResponse.json(
        { error: "No se encontro el versiculo indicado." },
        { status: 404 },
      );
    }

    const text =
      verses.length === 1
        ? stripHtml(verses[0].text)
        : verses.map((v) => `${v.verse} ${stripHtml(v.text)}`).join(" ");

    return NextResponse.json({
      reference: referenceLabel(parsed),
      version,
      text,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
