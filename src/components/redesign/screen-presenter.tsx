"use client";
import React from "react";
import { IcClose } from "./icons";
import type { Sermon } from "@/lib/types";

interface Slide {
  kind: string;
  big: string;
  sub: string;
}

const FALLBACK_SLIDES: Slide[] = [
  { kind: "Aviso", big: "Sin sermón\nseleccionado", sub: "Abre un sermón en la biblioteca y vuelve a presentar" },
];

function parseSlidesFromDeck(deckText: string): Slide[] {
  const blocks = deckText
    .split(/^[ \t]*DIAPOSITIVA[^\n]*$/im)
    .map((b) => b.trim())
    .filter(Boolean);
  if (!blocks.length) return [];
  return blocks.map((block, i) => {
    const titleMatch = block.match(/T[ií]tulo\s*:\s*(.+?)(?=\n|$)/i);
    const contentMatch = block.match(/Contenido\s*:\s*([\s\S]*?)(?=\n\s*Sugerencia|\n\s*[A-ZÁÉÍÓÚ][a-záéíóú]+\s*:|$)/i);
    const big = (titleMatch?.[1]?.trim()) || (contentMatch?.[1]?.split("\n")[0]?.trim()) || `Diapositiva ${i + 1}`;
    const sub = (contentMatch?.[1]?.split("\n").slice(1).join(" ").trim().slice(0, 90)) || "";
    return { kind: `Diapositiva ${i + 1}`, big, sub };
  });
}

function parseSlidesFromSermonText(text: string, title: string, scripture: string): Slide[] {
  if (!text.trim()) return [];
  const slides: Slide[] = [];

  if (title) slides.push({ kind: "Título", big: title, sub: scripture });

  const ideaMatch = text.match(/idea\s+central[^\n:]*:\s*([^\n]+)/i);
  if (ideaMatch) slides.push({ kind: "Idea central", big: ideaMatch[1].trim(), sub: "" });

  const textoMatch = text.match(/(?:texto\s+b[ií]blico\s+base|texto\s+base)[^\n:]*:\s*([^\n]+)/i);
  if (textoMatch) slides.push({ kind: "Texto base", big: textoMatch[1].trim(), sub: scripture });

  const divisionRegex = /^\s*(?:divisi[oó]n|punto|i{1,3}v?|v?i{0,3})\s*([0-9ivx]+)?\s*[:.\-—]\s*(.+)$/gim;
  const headingRegex = /^\s*(\d+)\.\s+(.{4,120})$/gm;
  const matches = new Set<string>();

  let m: RegExpExecArray | null;
  while ((m = divisionRegex.exec(text))) {
    const label = (m[0] || "").trim();
    const title = (m[2] || "").trim();
    if (title && !matches.has(title)) {
      matches.add(title);
      slides.push({ kind: label.split(":")[0].slice(0, 20), big: title, sub: "" });
    }
  }
  if (matches.size === 0) {
    while ((m = headingRegex.exec(text))) {
      const title = (m[2] || "").trim();
      if (title.length > 4 && title.length < 100 && !matches.has(title)) {
        matches.add(title);
        slides.push({ kind: `Punto ${m[1]}`, big: title, sub: "" });
      }
    }
  }

  const concMatch = text.match(/conclusi[oó]n[^\n:]*:?\s*([^\n]+)/i);
  if (concMatch) slides.push({ kind: "Conclusión", big: concMatch[1].trim().slice(0, 120), sub: "" });

  const llamMatch = text.match(/(?:llamado|aplicaci[oó]n\s+final|invitaci[oó]n)[^\n:]*:?\s*([^\n]+)/i);
  if (llamMatch) slides.push({ kind: "Llamado", big: llamMatch[1].trim().slice(0, 120), sub: "" });

  return slides;
}

function extractVerses(text: string): [string, string][] {
  if (!text) return [];
  const refRegex = /([1-3]?\s?[A-ZÁÉÍÓÚ][a-záéíóúñ]+(?:\s[A-ZÁÉÍÓÚ][a-záéíóúñ]+)?)\s(\d+):(\d+)(?:-(\d+))?/g;
  const counts = new Map<string, number>();
  let m: RegExpExecArray | null;
  while ((m = refRegex.exec(text))) {
    const ref = `${m[1]} ${m[2]}:${m[3]}${m[4] ? `-${m[4]}` : ""}`;
    counts.set(ref, (counts.get(ref) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ref]) => [ref, ""] as [string, string]);
}

function extractNotes(text: string, slidesCount: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < slidesCount; i++) out.push("");
  const notesMatch = text.match(/notas\s+del\s+predicador[^\n]*\n([\s\S]+?)(?=\n\s*\n|$)/i);
  if (notesMatch) {
    const lines = notesMatch[1].split("\n").filter((l) => l.trim());
    lines.forEach((line, i) => { if (i < out.length) out[i] = line.trim(); });
  }
  return out;
}

export function PresenterScreen({ sermon, onClose }: { sermon: Sermon | null; onClose: () => void }) {
  const [slide, setSlide] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [template, setTemplate] = React.useState("deck-hillsong");

  const TEMPLATES = [
    { cls: "deck-hillsong", name: "Hillsong" },
    { cls: "deck-elevation", name: "Elevation" },
    { cls: "deck-arcilla", name: "Arcilla" },
    { cls: "deck-comics", name: "Comics" },
    { cls: "deck-realista", name: "Realista" },
    { cls: "deck-cine", name: "Cine" },
    { cls: "deck-pergamino", name: "Pergamino" },
    { cls: "deck-vitral", name: "Vitral" },
    { cls: "deck-brutalista", name: "Brutalista" },
    { cls: "deck-minimal", name: "Minimal" },
    { cls: "deck-acuarela", name: "Acuarela" },
    { cls: "deck-neon", name: "Neón" },
    { cls: "deck-mosaico", name: "Mosaico" },
    { cls: "deck-editorial", name: "Editorial" },
    { cls: "deck-tipografico", name: "Tipográfico" },
    { cls: "deck-selva", name: "Selva" },
    { cls: "deck-avivamiento", name: "Avivamiento" },
  ];

  const slides = React.useMemo<Slide[]>(() => {
    if (!sermon) return FALLBACK_SLIDES;
    const deckText = sermon.slideDecks?.[0]?.text;
    if (deckText) {
      const fromDeck = parseSlidesFromDeck(deckText);
      if (fromDeck.length) return fromDeck;
    }
    const fromText = parseSlidesFromSermonText(
      sermon.sermonText || "",
      sermon.title || "",
      sermon.config?.scripture || "",
    );
    if (fromText.length) return fromText;
    return [{ kind: "Título", big: sermon.title || "Sin contenido", sub: sermon.config?.scripture || "" }];
  }, [sermon]);

  const verses = React.useMemo(() => extractVerses(sermon?.sermonText || ""), [sermon]);
  const notes = React.useMemo(() => extractNotes(sermon?.sermonText || "", slides.length), [sermon, slides.length]);

  const total = slides.length;
  const current = slides[Math.min(slide, total - 1)] ?? FALLBACK_SLIDES[0];

  React.useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setSlide((s) => Math.min(total - 1, s + 1)); }
      if (e.key === "ArrowLeft") { setSlide((s) => Math.max(0, s - 1)); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, total]);

  const mins = Math.floor(elapsed / 60), secs = elapsed % 60;
  const target = 27 * 60;
  const pct = Math.min(100, (elapsed / target) * 100);

  const title = sermon?.title || "Sin sermón";
  const scripture = sermon?.config?.scripture || "";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80,
      background: "#0a0805", color: "#f0e8d5",
      display: "grid", gridTemplateRows: "auto 1fr auto",
      fontFamily: "var(--font-ui)",
    }}>
      <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 14 }}>
        <div className="row" style={{ gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: "#d94d4d", boxShadow: "0 0 12px #d94d4d" }} />
          <span style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600, color: "#d4a64e" }}>
            En vivo · presentando
          </span>
        </div>
        <span style={{ height: 16, width: 1, background: "rgba(255,255,255,.15)" }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontStyle: "italic" }}>
          {title}
        </span>
        {scripture && <span style={{ fontSize: 11, color: "rgba(240,232,213,.55)" }}>{scripture}</span>}
        <span className="spacer" />

        <div className="row" style={{ gap: 10 }}>
          <span style={{ fontSize: 11, color: "rgba(240,232,213,.55)", letterSpacing: ".1em", textTransform: "uppercase" }}>Tiempo</span>
          <span className="tabular" style={{
            fontFamily: "var(--font-mono)",
            fontSize: 22, fontWeight: 500, letterSpacing: "-.01em",
            color: elapsed > target ? "#e57373" : "#f0e8d5",
          }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 11, color: "rgba(240,232,213,.4)" }}>/ 27:00</span>
        </div>

        <span style={{ width: 80, height: 4, background: "rgba(255,255,255,.1)", borderRadius: 999, overflow: "hidden" }}>
          <span style={{ display: "block", height: "100%", width: pct + "%", background: "#d4a64e" }} />
        </span>

        <button onClick={onClose} className="row" style={{ gap: 6, fontSize: 11.5, color: "rgba(240,232,213,.6)", padding: "6px 10px", border: "1px solid rgba(255,255,255,.12)", borderRadius: 6 }}>
          <IcClose size={13} /> Salir · Esc
        </button>
      </div>

      <div className="presenter-grid" style={{ overflow: "hidden" }}>
        <div style={{ padding: 26, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,.08)" }}>
          <div className="row" style={{ marginBottom: 10, gap: 10 }}>
            <span style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,213,.5)", fontWeight: 600 }}>
              Diapositiva actual · {String(slide + 1).padStart(2, "0")} / {total}
            </span>
            <span className="spacer" />
            <div className="row" style={{ gap: 4 }}>
              {TEMPLATES.map((t) => (
                <button key={t.cls} onClick={() => setTemplate(t.cls)} title={t.name}
                  style={{
                    width: 22, height: 14, borderRadius: 3,
                    border: template === t.cls ? "1.5px solid #d4a64e" : "1px solid rgba(255,255,255,.18)",
                    overflow: "hidden",
                    padding: 0, position: "relative",
                  }}>
                  <div className={"slide-tile " + t.cls} style={{
                    position: "absolute", inset: 0, padding: 0, borderRadius: 0, border: 0, aspectRatio: "auto",
                  }} />
                </button>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "rgba(240,232,213,.45)", marginLeft: 8 }}>{current.kind}</span>
          </div>

          <div className={"slide-tile " + template} style={{
            flex: 1, borderRadius: 12, position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: 56, aspectRatio: "auto",
            border: "1px solid rgba(255,255,255,.1)",
          }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", opacity: 0.65, marginBottom: 14 }}>
              {current.kind} · {String(slide + 1).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1.05, fontWeight: 400, whiteSpace: "pre-wrap", letterSpacing: "-.014em" }}>
              {current.big}
            </div>
            {current.sub && (
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.65, marginTop: 18, fontWeight: 600 }}>
                {current.sub}
              </div>
            )}
          </div>

          <div className="row" style={{ gap: 4, marginTop: 12, overflowX: "auto" }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={"slide-tile " + template} style={{
                flex: "0 0 64px", aspectRatio: "16/9", borderRadius: 4,
                border: i === slide ? "2px solid #d4a64e" : "1px solid rgba(255,255,255,.1)",
                opacity: i === slide ? 1 : 0.55,
                position: "relative", padding: 4,
                display: "flex", alignItems: "flex-end",
              }}>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,.85)", fontFamily: "var(--font-display)", fontStyle: "italic", position: "relative", zIndex: 3 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18, overflowY: "auto" }}>
          <div>
            <div className="row" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#d4a64e", fontWeight: 700 }}>
                Notas del predicador
              </span>
            </div>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: 22, lineHeight: 1.5, fontStyle: "italic",
              color: "#f0e8d5",
              whiteSpace: "pre-wrap",
            }}>
              {notes[slide] || "(Sin notas para esta diapositiva)"}
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 16 }}>
            <div className="row" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,213,.45)", fontWeight: 600 }}>
                Siguiente · {String(Math.min(slide + 2, total)).padStart(2, "0")} / {total}
              </span>
            </div>
            {slide + 1 < total && (
              <div className={"slide-tile " + template} style={{
                borderRadius: 8, padding: 22, color: "#fff",
                border: "1px solid rgba(255,255,255,.08)",
                aspectRatio: "auto",
                position: "relative",
              }}>
                <div style={{ fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase", opacity: 0.55, marginBottom: 8, fontFamily: "var(--font-ui)", fontWeight: 600 }}>
                  {slides[slide + 1].kind}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.15, whiteSpace: "pre-wrap" }}>
                  {slides[slide + 1].big}
                </div>
              </div>
            )}
          </div>

          {verses.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 16 }}>
              <span style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,213,.45)", fontWeight: 600 }}>
                Versículos citados
              </span>
              <div className="col" style={{ gap: 8, marginTop: 10 }}>
                {verses.map(([r]) => (
                  <div key={r} className="row" style={{ gap: 12, padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,.08)" }}>
                    <span style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#d4a64e", fontWeight: 700, minWidth: 100 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "12px 22px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setSlide((s) => Math.max(0, s - 1))} style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.15)", borderRadius: 6, fontSize: 12, color: "#f0e8d5", display: "inline-flex", gap: 8, alignItems: "center" }}>
          <kbd style={{ background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "rgba(240,232,213,.7)" }}>←</kbd> Anterior
        </button>
        <button onClick={() => setSlide((s) => Math.min(total - 1, s + 1))} style={{ padding: "8px 14px", border: "1px solid #d4a64e", background: "#d4a64e", borderRadius: 6, fontSize: 12, color: "#0a0805", fontWeight: 600, display: "inline-flex", gap: 8, alignItems: "center" }}>
          Siguiente <kbd style={{ background: "rgba(0,0,0,.15)", color: "#0a0805", border: 0 }}>→</kbd>
        </button>
        <span className="spacer" />
        <span style={{ fontSize: 11.5, color: "rgba(240,232,213,.5)" }}>
          {current.kind}{current.sub ? ` · ${current.sub}` : ""}
        </span>
        <span className="spacer" />
        <span style={{ fontSize: 11, color: "rgba(240,232,213,.4)" }}>
          Espacio para avanzar · Esc para salir
        </span>
      </div>
    </div>
  );
}
