import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import {
  buildOutlineMessages,
  buildSermonMessages,
  buildSlidesMessages,
  type Messages,
} from "@/lib/prompt";
import type { GenerateKind, SermonConfig, SlideDensity } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  kind: GenerateKind;
  config: SermonConfig;
  sermonText?: string;
  slideStyle?: string;
  slideDensity?: SlideDensity;
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
    const { buildPhrasesMessages } = await import("@/lib/prompt");
    messages = buildPhrasesMessages(sermonText);
  } else {
    return NextResponse.json({ error: "Tipo de generacion no valido." }, { status: 400 });
  }

  try {
    const text = await generateText(config.provider, messages.system, [
      { role: "user", content: messages.user },
    ]);
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
