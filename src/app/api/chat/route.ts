import { NextResponse } from "next/server";
import { generateText, type Turn } from "@/lib/ai";
import { buildChatSystemPrompt } from "@/lib/prompt";
import type { SermonConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  config: SermonConfig;
  messages: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo invalido." }, { status: 400 });
  }

  if (!body.config || !body.config.provider || !body.messages?.length) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }

  const system = buildChatSystemPrompt(body.config);
  const turns: Turn[] = body.messages
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const text = await generateText(body.config.provider, system, turns);
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
