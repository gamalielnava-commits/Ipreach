"use client";
import React from "react";
import { IcClose } from "./icons";
import type { Sermon } from "@/lib/types";

function slugToTemplate(slug: string): string {
  const map: Record<string, string> = {
    'cine': 'deck-cine', 'cinematografico': 'deck-cine', 'cinematic-dark': 'deck-cine',
    'elevation': 'deck-elevation', 'elevation-worship': 'deck-elevation',
    'hillsong': 'deck-hillsong', 'holy-atmosphere': 'deck-hillsong',
    'urban': 'deck-brutalista', 'urban-bold': 'deck-brutalista',
    'minimal': 'deck-minimal', 'light-minimalist': 'deck-minimal', 'minimalist': 'deck-minimal',
    'sermon-fire': 'deck-avivamiento', 'fire': 'deck-avivamiento',
  };
  return map[slug] || `deck-${slug}`;
}

function adaptiveFontSize(text: string, base: 'main' | 'preview' = 'main'): number {
  const len = text.length;
  if (base === 'preview') {
    return len < 50 ? 22 : len < 120 ? 17 : len < 250 ? 14 : 11;
  }
  return len < 50 ? 48 : len < 120 ? 34 : len < 250 ? 24 : 18;
}

export function PresenterScreen({
  sermon,
  onClose,
}: {
  sermon: Sermon;
  onClose: () => void;
}) {
  const [slide, setSlide] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [template, setTemplate] = React.useState("deck-hillsong");
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (sermon.slideDecks?.[0]?.style) {
      setTemplate(slugToTemplate(sermon.slideDecks[0].style));
    }
  }, [sermon]);

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  React.useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

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

  const cleanLine = (s: string) => {
    return s
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/^#+\s*/, "")
      .replace(/^titulo:\s*/i, "")
      .replace(/^título:\s*/i, "")
      .replace(/^contenido:\s*/i, "")
      .replace(/^texto:\s*/i, "")
      .replace(/^[-*•]\s*/, "")
      .trim();
  };

  // Parse slides
  const activeDeck = sermon.slideDecks?.[0];
  const parsedSlides = activeDeck
    ? activeDeck.text
        .split(/^[ \t]*[*#_\s-]*DIAPOSITIVA[^\n]*$/im)
        .map((b) => b.trim())
        .filter(Boolean)
        .map((block) => {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          const kind = cleanLine(lines[0] || "Diapositiva");
          const contentLines = lines.slice(1)
            .filter((l) => !l.toLowerCase().includes("sugerencia"))
            .map(cleanLine);
          return {
            kind,
            big: contentLines.join("\n"),
            sub: sermon.config?.scripture || "",
          };
        })
    : [];

  const SLIDES = parsedSlides.length > 0 ? parsedSlides : [
    { kind: "Título", big: sermon.title, sub: sermon.config?.scripture || "" },
    { kind: "Introducción", big: sermon.sermonText ? (sermon.sermonText.slice(0, 150) + "...") : "No hay contenido generado.", sub: "" },
    { kind: "Instrucción", big: "Genera las diapositivas en la pestaña Diapositivas antes de presentar.", sub: "" }
  ];

  const total = SLIDES.length;

  const NOTES = SLIDES.map((s, i) => {
    if (sermon.outlineText) {
      const outlinePoints = sermon.outlineText.split("\n").map(l => l.trim()).filter(Boolean);
      const aligned = outlinePoints.find(l => l.toLowerCase().includes(s.kind.toLowerCase()) || l.includes(String(i)));
      if (aligned) return aligned;
      if (outlinePoints[i]) return outlinePoints[i];
    }
    return `Repasa el punto central de esta diapositiva: "${s.kind}". Conecta con una ilustración o aplicación si corresponde.`;
  });

  React.useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setSlide((s) => Math.min(total - 1, s + 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSlide((s) => Math.max(0, s - 1));
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [total, onClose]);

  const mins = Math.floor(elapsed / 60), secs = elapsed % 60;
  const target = 27 * 60;
  const pct = Math.min(100, (elapsed / target) * 100);

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
          {sermon.title}
        </span>
        <span style={{ fontSize: 11, color: "rgba(240,232,213,.55)" }}>{sermon.config?.scripture}</span>
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

        <button onClick={toggleFullscreen} className="row" style={{ gap: 6, fontSize: 11.5, color: "rgba(240,232,213,.6)", padding: "6px 10px", border: "1px solid rgba(255,255,255,.12)", borderRadius: 6, cursor: "pointer", background: "none" }}>
          {isFullscreen ? '⊡' : '⊞'} Pantalla completa
        </button>
        <button onClick={onClose} className="row" style={{ gap: 6, fontSize: 11.5, color: "rgba(240,232,213,.6)", padding: "6px 10px", border: "1px solid rgba(255,255,255,.12)", borderRadius: 6, cursor: "pointer", background: "none" }}>
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
                    padding: 0, position: "relative", cursor: "pointer"
                  }}>
                  <div className={"slide-tile " + t.cls} style={{
                    position: "absolute", inset: 0, padding: 0, borderRadius: 0, border: 0, aspectRatio: "auto",
                  }} />
                </button>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "rgba(240,232,213,.45)", marginLeft: 8 }}>{SLIDES[slide].kind}</span>
          </div>

          <div className={"slide-tile " + template} style={{
            flex: 1, borderRadius: 12, position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: 56, aspectRatio: "auto",
            border: "1px solid rgba(255,255,255,.1)",
          }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", opacity: 0.65, marginBottom: 14 }}>
              {SLIDES[slide].kind} · {String(slide + 1).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: adaptiveFontSize(SLIDES[slide].big, 'main'), lineHeight: 1.1, fontWeight: 400, whiteSpace: "pre-wrap", letterSpacing: "-.014em", wordBreak: "break-word", overflow: "hidden" }}>
              {SLIDES[slide].big}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.65, marginTop: 18, fontWeight: 600 }}>
              {SLIDES[slide].sub}
            </div>
          </div>

          <div className="row" style={{ gap: 4, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
            {SLIDES.map((s, i) => (
              <button key={i} onClick={() => setSlide(i)} className={"slide-tile " + template} style={{
                flex: "0 0 64px", aspectRatio: "16/9", borderRadius: 4,
                border: i === slide ? "2px solid #d4a64e" : "1px solid rgba(255,255,255,.1)",
                opacity: i === slide ? 1 : 0.55,
                position: "relative", padding: 4,
                display: "flex", alignItems: "flex-end", cursor: "pointer"
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
            }}>
              {NOTES[slide]}
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 16 }}>
            <div className="row" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,213,.45)", fontWeight: 600 }}>
                Siguiente · {String(slide + 2).padStart(2, "0")} / {total}
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
                  {SLIDES[slide + 1].kind}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: adaptiveFontSize(SLIDES[slide + 1].big, 'preview'), lineHeight: 1.15, whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "hidden" }}>
                  {SLIDES[slide + 1].big}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 22px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setSlide((s) => Math.max(0, s - 1))} style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.15)", borderRadius: 6, fontSize: 12, color: "#f0e8d5", display: "inline-flex", gap: 8, alignItems: "center", cursor: "pointer", background: "none" }}>
          <kbd style={{ background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "rgba(240,232,213,.7)" }}>←</kbd> Anterior
        </button>
        <button onClick={() => setSlide((s) => Math.min(total - 1, s + 1))} style={{ padding: "8px 14px", border: "1px solid #d4a64e", background: "#d4a64e", borderRadius: 6, fontSize: 12, color: "#0a0805", fontWeight: 600, display: "inline-flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
          Siguiente <kbd style={{ background: "rgba(0,0,0,.15)", color: "#0a0805", border: 0 }}>→</kbd>
        </button>
        <span className="spacer" />
        <span style={{ fontSize: 11.5, color: "rgba(240,232,213,.5)" }}>
          {SLIDES[slide].kind} · {SLIDES[slide].sub}
        </span>
        <span className="spacer" />
        <span style={{ fontSize: 11, color: "rgba(240,232,213,.4)" }}>
          Espacio o Flechas para navegar · Esc para salir
        </span>
      </div>
    </div>
  );
}
