import { NextResponse } from "next/server";
import { buildSocialImagePrompt } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  phrase: string;
  style: string;
}

interface InlinePart {
  inlineData?: { data?: string; mimeType?: string };
  inline_data?: { data?: string; mime_type?: string };
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo invalido." }, { status: 400 });
  }

  if (!body.phrase || !body.phrase.trim()) {
    return NextResponse.json({ error: "Falta la frase." }, { status: 400 });
  }

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "La generacion de imagenes requiere configurar GOOGLE_API_KEY." },
      { status: 400 },
    );
  }

  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const prompt = buildSocialImagePrompt(body.phrase, body.style || "realista");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: `Gemini respondio ${res.status}: ${detail.slice(0, 300)}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const parts: InlinePart[] = data?.candidates?.[0]?.content?.parts ?? [];
    const part = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
    const inline = part?.inlineData ?? part?.inline_data;
    if (!inline?.data) {
      return NextResponse.json(
        { error: "Gemini no devolvio una imagen." },
        { status: 502 },
      );
    }
    const mime =
      (part?.inlineData?.mimeType ?? part?.inline_data?.mime_type) || "image/png";
    return NextResponse.json({ image: `data:${mime};base64,${inline.data}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
