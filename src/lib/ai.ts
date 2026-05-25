import type { Provider } from "./types";

export type Role = "user" | "assistant";

export interface Turn {
  role: Role;
  content: string;
}

const MAX_TOKENS = 8000;

async function callClaude(system: string, turns: Turn[]): Promise<string> {
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
      max_tokens: MAX_TOKENS,
      system,
      messages: turns.map((t) => ({ role: t.role, content: t.content })),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    let msg = `Claude respondió ${res.status}`;
    try { const p = JSON.parse(detail); msg = p?.error?.message || msg; } catch { /* keep */ }
    throw new Error(msg);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error("Claude no devolvio texto.");
  return text as string;
}

async function callGemini(system: string, turns: Turn[]): Promise<string> {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("Falta configurar GOOGLE_API_KEY en el servidor.");
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: turns.map((t) => ({
          role: t.role === "assistant" ? "model" : "user",
          parts: [{ text: t.content }],
        })),
        generationConfig: { maxOutputTokens: MAX_TOKENS },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    let msg = `Gemini respondió ${res.status}`;
    try { const p = JSON.parse(detail); msg = p?.error?.message || msg; } catch { /* keep */ }
    throw new Error(msg);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text || "")
    .join("");
  if (!text) throw new Error("Gemini no devolvio texto.");
  return text as string;
}

export function generateText(
  provider: Provider,
  system: string,
  turns: Turn[],
): Promise<string> {
  return provider === "gemini"
    ? callGemini(system, turns)
    : callClaude(system, turns);
}
