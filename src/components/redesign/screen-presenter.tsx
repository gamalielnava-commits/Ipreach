"use client";
import React from "react";
import { IcClose } from "./icons";

export function PresenterScreen({ onClose }: { onClose: () => void }) {
  const [slide, setSlide] = React.useState(2);
  const [elapsed, setElapsed] = React.useState(8 * 60 + 14);
  const [template, setTemplate] = React.useState("deck-hillsong");
  const total = 12;

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

  const SLIDES = [
    { kind: "Título", big: "El temor que se\nrinde a la fe", sub: "Hebreos 11:1–6" },
    { kind: "Idea central", big: "La fe es el suelo\ninvisible bajo el pie", sub: "idea homilética" },
    { kind: "Texto", big: "“Sin fe es imposible\nagradar a Dios.”", sub: "Hebreos 11:6" },
    { kind: "Punto I", big: "Certeza, no\nausencia de temblor", sub: "Hebreos 11:1" },
    { kind: "Sub-punto", big: "hypostasis · lo que\nsostiene por debajo", sub: "exégesis" },
    { kind: "Texto", big: "Salió sin saber\na dónde iba.", sub: "Génesis 12:1" },
    { kind: "Punto II", big: "La fe encuentra\nsu voz en la promesa", sub: "Salmo 23" },
    { kind: "Ilustración", big: "Los veteranos\nmiran la cuerda.", sub: "Andes · guía de montaña" },
    { kind: "Punto III", big: "La fe es probada\nen el silencio", sub: "1 Pedro 1:7" },
    { kind: "Aplicación", big: "Camina un paso\ncon la promesa.", sub: "esta semana" },
    { kind: "Cierre", big: "Mira la cicatriz\nen la mano abierta.", sub: "evangelio" },
    { kind: "Bendición", big: "Que el Dios de\nla esperanza…", sub: "Romanos 15:13" },
  ];

  const NOTES = [
    "Saluda. Una respiración antes de empezar. Comparte que el texto que vas a leer no fue para una iglesia tranquila, sino para creyentes asustados.",
    "Repite la idea central despacio. Pausa después de “suelo invisible” — deja que la imagen entre.",
    "Lee el versículo en voz alta. Después haz silencio 2 segundos antes de la pregunta: ¿cómo nos acercamos a Dios sin fe?",
    "Aquí entra el primer punto. La gente debe escribir: certeza, no ausencia de temblor. Repite tres veces.",
    "Define hypostasis sin sonar académico. Compara con un puente: no lo ves desde el aire, pero está debajo.",
    "Lee Génesis 12:1 con énfasis en “sin saber”. Hazlo personal: ¿qué te ha pedido Dios sin GPS?",
    "Transición. Cambia el tono — más íntimo. Conduce a la oración del Salmo 23.",
    "La historia del guía. No abuses, una sola anécdota. Cuenta la línea final mirando a un punto fijo: “miran la cuerda”.",
    "Aplicación congregacional. Pide que alguien comparta brevemente (controlar tiempo).",
    "Llamado pastoral. Habla más despacio. No insistas en cerrar — deja que descanse.",
    "Cita la frase clave. Espera 3 segundos. Lee el versículo de cierre.",
    "Bendición con manos levantadas. Lectura de Romanos 15:13.",
  ];

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
  }, [onClose]);

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
          El temor que se rinde a la fe
        </span>
        <span style={{ fontSize: 11, color: "rgba(240,232,213,.55)" }}>Hebreos 11:1–6</span>
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
            <div style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1.05, fontWeight: 400, whiteSpace: "pre-wrap", letterSpacing: "-.014em" }}>
              {SLIDES[slide].big}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.65, marginTop: 18, fontWeight: 600 }}>
              {SLIDES[slide].sub}
            </div>
          </div>

          <div className="row" style={{ gap: 4, marginTop: 12, overflowX: "auto" }}>
            {SLIDES.map((s, i) => (
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
              <span className="spacer" />
              <button style={{ fontSize: 11, color: "rgba(240,232,213,.55)" }}>Texto +</button>
              <button style={{ fontSize: 11, color: "rgba(240,232,213,.55)", marginLeft: 8 }}>−</button>
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
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.15, whiteSpace: "pre-wrap" }}>
                  {SLIDES[slide + 1].big}
                </div>
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 16 }}>
            <span style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,213,.45)", fontWeight: 600 }}>
              Versículos a citar
            </span>
            <div className="col" style={{ gap: 8, marginTop: 10 }}>
              {([
                ["Hebreos 11:1", "Es, pues, la fe la certeza…"],
                ["Salmo 23:4", "Aunque ande en valle…"],
                ["1 Pedro 1:7", "La prueba de vuestra fe…"],
              ] as [string, string][]).map(([r, t]) => (
                <div key={r} className="row" style={{ gap: 12, padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,.08)" }}>
                  <span style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#d4a64e", fontWeight: 700, minWidth: 100 }}>{r}</span>
                  <span className="serif" style={{ fontSize: 13.5, fontStyle: "italic", color: "rgba(240,232,213,.85)" }}>“{t}”</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 22px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setSlide((s) => Math.max(0, s - 1))} style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.15)", borderRadius: 6, fontSize: 12, color: "#f0e8d5", display: "inline-flex", gap: 8, alignItems: "center" }}>
          <kbd style={{ background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "rgba(240,232,213,.7)" }}>←</kbd> Anterior
        </button>
        <button onClick={() => setSlide((s) => Math.min(total - 1, s + 1))} style={{ padding: "8px 14px", border: "1px solid #d4a64e", background: "#d4a64e", borderRadius: 6, fontSize: 12, color: "#0a0805", fontWeight: 600, display: "inline-flex", gap: 8, alignItems: "center" }}>
          Siguiente <kbd style={{ background: "rgba(0,0,0,.15)", color: "#0a0805", border: 0 }}>→</kbd>
        </button>
        <button style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.15)", borderRadius: 6, fontSize: 12, color: "rgba(240,232,213,.65)" }}>Pausar tiempo</button>
        <span className="spacer" />
        <span style={{ fontSize: 11.5, color: "rgba(240,232,213,.5)" }}>
          {SLIDES[slide].kind} · {SLIDES[slide].sub}
        </span>
        <span className="spacer" />
        <span style={{ fontSize: 11, color: "rgba(240,232,213,.4)" }}>
          Espacio para avanzar · ⌘B para ocultar pantalla
        </span>
      </div>
    </div>
  );
}
