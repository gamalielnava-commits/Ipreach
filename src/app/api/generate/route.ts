import { NextResponse } from "next/server";
import {
  buildOutlineMessages,
  buildPhrasesMessages,
  buildSermonMessages,
  buildSlidesMessages,
  type Messages,
} from "@/lib/prompt";
import type { GenerateKind, Provider, SermonConfig, SlideDensity } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  kind: GenerateKind;
  config: SermonConfig;
  sermonText?: string;
  slideStyle?: string;
  slideDensity?: SlideDensity;
}

async function callClaude(messages: Messages): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Falta configurar ANTHROPIC_API_KEY en el servidor.");
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      system: messages.system,
      messages: [{ role: "user", content: messages.user }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Claude respondio ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error("Claude no devolvio texto.");
  return text as string;
}

async function callGemini(messages: Messages): Promise<string> {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("Falta configurar GOOGLE_API_KEY en el servidor.");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-pro";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: messages.system }] },
        contents: [{ role: "user", parts: [{ text: messages.user }] }],
        generationConfig: { maxOutputTokens: 8000 },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini respondio ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text || "")
    .join("");
  if (!text) throw new Error("Gemini no devolvio texto.");
  return text as string;
}

function generate(provider: Provider, messages: Messages): Promise<string> {
  return provider === "gemini" ? callGemini(messages) : callClaude(messages);
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo invalido." }, { status: 400 });
  }

  const { kind, config, sermonText, slideStyle, slideDensity } = body;
  if (!config || !config.provider) {
    return NextResponse.json({ error: "Configuracion incompleta." }, { status: 400 });
  }

  let messages: Messages;
  if (kind === "sermon") {
    messages = buildSermonMessages(config);
  } else if (kind === "outline") {
    if (!sermonText) {
      return NextResponse.json({ error: "Falta el texto del sermon." }, { status: 400 });
    }
    messages = buildOutlineMessages(config, sermonText);
  } else if (kind === "slides") {
    if (!sermonText || !slideStyle || !slideDensity) {
      return NextResponse.json(
        { error: "Faltan datos para generar las diapositivas." },
        { status: 400 },
      );
    }
    messages = buildSlidesMessages(config, sermonText, slideStyle, slideDensity);
  } else if (kind === "phrases") {
    if (!sermonText) {
      return NextResponse.json({ error: "Falta el texto del sermon." }, { status: 400 });
    }
    messages = buildPhrasesMessages(sermonText);
  } else {
    return NextResponse.json({ error: "Tipo de generacion no valido." }, { status: 400 });
  }

  try {
    const text = await generate(config.provider, messages);
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
