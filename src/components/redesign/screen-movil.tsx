"use client";
import React from "react";
import { TopBar } from "./shell";
import { SAVED } from "./data";
import { TypePill } from "./shared";
import { IOSDevice, AndroidDevice } from "./frames";
import {
  ICONS, IcSpark, IcChat, IcLibrary, IcBook, IcSlide, IcCalendar, IcChevron,
  IcAttach, IcMic, IcSearch, IcMore, IcArrowRight, IcEye, IcPlus, IcShare,
  IcRefresh, IcSliders, IcMenu, IcCheck,
} from "./icons";

export function MovilScreen() {
  const [device, setDevice] = React.useState("both");
  const [screen, setScreen] = React.useState("estudio");

  const SCREENS: [string, string][] = [
    ["estudio", "Estudio"],
    ["sermon", "Sermón"],
    ["biblio", "Biblioteca"],
    ["serie", "Serie"],
  ];

  return (
    <div className="main">
      <TopBar
        title="Móvil"
        subtitle="iOS · Android — mockups de las pantallas clave"
        right={
          <div className="row" style={{ gap: 6 }}>
            <div className="row" style={{ gap: 0, border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden", background: "var(--paper-2)" }}>
              {SCREENS.map(([k, n]) => (
                <button key={k} onClick={() => setScreen(k)}
                  style={{
                    padding: "6px 12px", fontFamily: "var(--font-ui)", fontSize: 12,
                    background: screen === k ? "var(--ink)" : "transparent",
                    color: screen === k ? "var(--paper)" : "var(--ink-3)",
                    borderRight: "1px solid var(--line)",
                  }}>{n}</button>
              ))}
            </div>
            <div className="row" style={{ gap: 0, border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden", background: "var(--paper-2)" }}>
              {([["both", "Ambos"], ["ios", "iOS"], ["android", "Android"]] as [string, string][]).map(([k, n]) => (
                <button key={k} onClick={() => setDevice(k)}
                  style={{
                    padding: "6px 12px", fontFamily: "var(--font-ui)", fontSize: 12,
                    background: device === k ? "var(--ink)" : "transparent",
                    color: device === k ? "var(--paper)" : "var(--ink-3)",
                    borderRight: k !== "android" ? "1px solid var(--line)" : "none",
                  }}>{n}</button>
              ))}
            </div>
          </div>
        }
      />

      <div className="movil-stage" style={{
        flex: 1, overflow: "auto",
        background:
          `radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--accent) 5%, transparent), transparent 50%),
           radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--gilt) 6%, transparent), transparent 50%),
           color-mix(in oklab, var(--paper) 90%, var(--paper-2))`,
      }}>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
          {(device === "both" || device === "ios") && (
            <PhoneStage label="iOS · iPhone 16 Pro">
              <IOSDevice width={372} height={780} dark={false}>
                <IOSScreen screen={screen} />
              </IOSDevice>
            </PhoneStage>
          )}
          {(device === "both" || device === "android") && (
            <PhoneStage label="Android · Pixel 9">
              <AndroidDevice width={372} height={780} dark={false}>
                <AndroidScreen screen={screen} />
              </AndroidDevice>
            </PhoneStage>
          )}
        </div>
      </div>
    </div>
  );
}

function PhoneStage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="col" style={{ alignItems: "center", gap: 14 }}>
      <div className="row" style={{ gap: 6 }}>
        <span className="eyebrow">{label}</span>
      </div>
      {children}
    </div>
  );
}

/* ===================== iOS screens ===================== */
function IOSScreen({ screen }: { screen: string }) {
  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: "var(--paper)", color: "var(--ink)",
      paddingTop: 56,
      fontFamily: "var(--font-body)",
    }}>
      {screen === "estudio" && <IOSEstudio />}
      {screen === "sermon" && <IOSSermon />}
      {screen === "biblio" && <IOSBiblio />}
      {screen === "serie" && <IOSSerie />}
    </div>
  );
}

function IOSEstudio() {
  return (
    <>
      <div style={{ padding: "10px 20px 14px" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="wordmark-mark" style={{ width: 30, height: 30 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5a2 2 0 0 1 2-2h12v17H6a2 2 0 0 0-2 2V5Z" />
              <path d="M12 7v9M9 11h6" />
            </svg>
          </div>
          <span className="display" style={{ fontSize: 18, color: "var(--accent)", fontStyle: "italic" }}>ipreach</span>
          <div style={{
            width: 30, height: 30, borderRadius: 999,
            background: "linear-gradient(135deg, var(--gilt), var(--accent))",
            display: "grid", placeItems: "center",
            color: "var(--paper)", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 600,
          }}>GN</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 96px" }}>
        <span className="pill" style={{ fontSize: 9, padding: "2px 8px" }}>· Semana 21</span>
        <h1 className="display" style={{ fontSize: 28, lineHeight: 1.05, marginTop: 8, fontWeight: 500 }}>
          Buenas tardes,<br />
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}>Gamaliel.</span>
        </h1>
        <p className="serif muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>
          Empieza con una idea, una cita o elige una sugerencia.
        </p>

        <div className="rule-fancy" style={{ margin: "10px 0 12px" }}>
          <span className="eyebrow" style={{ fontSize: 9 }}>Sugerencias</span>
        </div>

        <div className="col" style={{ gap: 8 }}>
          {([
            ["Sermón sobre la fe que vence el temor", "Expositivo · 25 min", "IcSpark"],
            ["Reflexión sobre el Salmo 23", "Devocional · 10 min", "IcBook"],
            ["Clase sobre la oración", "Clase · 45 min", "IcCross"],
          ] as [string, string, string][]).map(([t, s, ic], i) => {
            const I = ICONS[ic] || IcSpark;
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "30px 1fr auto", gap: 10,
                padding: "10px 12px",
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                borderRadius: 14, alignItems: "center",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "color-mix(in oklab, var(--accent) 10%, transparent)",
                  color: "var(--accent)",
                  display: "grid", placeItems: "center",
                }}><I size={14} /></div>
                <div>
                  <div className="serif" style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.25 }}>{t}</div>
                  <div className="ui muted" style={{ fontSize: 10.5 }}>{s}</div>
                </div>
                <IcChevron size={14} className="muted" />
              </div>
            );
          })}
        </div>

        <div className="rule-fancy" style={{ margin: "20px 0 12px" }}>
          <span className="eyebrow" style={{ fontSize: 9 }}>Recientes</span>
        </div>

        <div className="col" style={{ gap: 8 }}>
          {SAVED.slice(0, 2).map((s) => (
            <div key={s.id} style={{
              padding: "12px 14px",
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--paper)",
            }}>
              <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                <TypePill type={s.type} />
                <span className="ui muted" style={{ fontSize: 10 }}>· {s.scripture}</span>
              </div>
              <div className="display" style={{ fontSize: 16, lineHeight: 1.2 }}>{s.title}</div>
              <p className="serif muted" style={{ fontSize: 12, marginTop: 4, fontStyle: "italic" }}>
                “{s.excerpt.slice(0, 80)}…”
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 50, left: 16, right: 16, zIndex: 10 }}>
        <div style={{
          background: "color-mix(in oklab, var(--paper) 80%, transparent)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "0.5px solid color-mix(in oklab, var(--ink) 12%, transparent)",
          borderRadius: 24,
          padding: "10px 12px",
          boxShadow: "0 8px 30px color-mix(in oklab, var(--ink) 15%, transparent)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <IcAttach size={16} className="muted" />
          <span className="serif muted" style={{ fontSize: 14, fontStyle: "italic", flex: 1 }}>
            Pregunta o pide un sermón…
          </span>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--accent)",
            display: "grid", placeItems: "center",
            color: "#fff",
          }}><IcMic size={14} /></div>
        </div>

        <div style={{
          marginTop: 8, padding: "8px 12px",
          background: "color-mix(in oklab, var(--paper) 60%, transparent)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "0.5px solid color-mix(in oklab, var(--ink) 10%, transparent)",
          borderRadius: 22,
          display: "flex", justifyContent: "space-around",
        }}>
          {([
            ["Estudio", IcChat, true],
            ["Bibli.", IcLibrary, false],
            ["Serm.", IcBook, false],
            ["Series", IcSlide, false],
            ["Plan", IcCalendar, false],
          ] as [string, (p: { size?: number; style?: React.CSSProperties }) => React.JSX.Element, boolean][]).map(([n, I, active], i) => (
            <div key={i} className="col" style={{ alignItems: "center", gap: 2, opacity: active ? 1 : 0.55 }}>
              <I size={18} style={{ color: active ? "var(--accent)" : "var(--ink-3)" }} />
              <span className="ui" style={{
                fontSize: 9, fontWeight: 600, letterSpacing: ".04em",
                color: active ? "var(--accent)" : "var(--ink-3)",
              }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function IOSSermon() {
  return (
    <>
      <div style={{ padding: "8px 16px 12px" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <button style={{ color: "var(--accent)", fontFamily: "var(--font-ui)", fontSize: 14 }}>
            <IcArrowRight size={16} style={{ transform: "rotate(180deg)", verticalAlign: -3 }} /> Atrás
          </button>
          <span className="ui muted" style={{ fontSize: 11 }}>27 min · 2.4k pal.</span>
          <button><IcMore size={18} className="muted" /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 80px" }}>
        <TypePill type="Sermón" />
        <h1 className="display" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.1, marginTop: 8 }}>
          El temor que se rinde a la fe
        </h1>
        <p className="serif" style={{ fontSize: 14, fontStyle: "italic", color: "var(--ink-2)", marginTop: 6 }}>
          La fe no espera a que el miedo se vaya; camina con él hasta confiar.
        </p>
        <div className="ui muted" style={{ fontSize: 11, marginTop: 8 }}>
          Hebreos 11:1–6 · Bautista · PEICA
        </div>

        <div className="row" style={{ gap: 4, marginTop: 16, background: "var(--paper-2)", padding: 4, borderRadius: 10 }}>
          {["Texto", "Bosquejo", "Slides", "Imágenes"].map((t, i) => (
            <div key={t} style={{
              flex: 1, padding: "6px 0", textAlign: "center",
              background: i === 0 ? "var(--paper)" : "transparent",
              borderRadius: 7,
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 500,
              color: i === 0 ? "var(--accent)" : "var(--ink-3)",
              boxShadow: i === 0 ? "0 1px 3px color-mix(in oklab, var(--ink) 10%, transparent)" : "none",
            }}>{t}</div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 6, fontSize: 9 }}>0 · Introducción</div>
          <p className="dropcap" style={{ fontSize: 14.5, lineHeight: 1.65 }}>
            Hay un temor que cierra las puertas por dentro y otro que despierta antes del amanecer para orar. Los discípulos conocían ambos.
          </p>

          <blockquote className="scripture" style={{ margin: "14px 0", padding: "12px 14px", fontSize: 13.5 }}>
            Es, pues, la fe la certeza de lo que se espera.
            <cite style={{ fontSize: 9.5 }}>Hebreos 11:1 · RVR1960</cite>
          </blockquote>

          <div className="eyebrow" style={{ marginTop: 16, marginBottom: 6, fontSize: 9 }}>I · Punto 1</div>
          <h3 className="display" style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
            Certeza, no ausencia de temblor
          </h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.6 }}>
            En griego, <em>hypostasis</em>: aquello que sostiene por debajo. La fe es el suelo invisible bajo el pie.
          </p>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 50, left: 16, right: 16, display: "flex", gap: 8 }}>
        <div style={{
          flex: 1, padding: "12px 14px",
          background: "color-mix(in oklab, var(--paper) 80%, transparent)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "0.5px solid color-mix(in oklab, var(--ink) 12%, transparent)",
          borderRadius: 16,
          fontFamily: "var(--font-ui)", fontSize: 12,
          color: "var(--ink-3)",
        }}>Notas, ilustración, ✠ cierre…</div>
        <div style={{
          width: 44, height: 44,
          background: "var(--accent)", color: "#fff",
          display: "grid", placeItems: "center", borderRadius: 16,
          boxShadow: "0 10px 20px color-mix(in oklab, var(--accent) 30%, transparent)",
        }}><IcEye size={18} /></div>
      </div>
    </>
  );
}

function IOSBiblio() {
  return (
    <>
      <div style={{ padding: "8px 20px 8px" }}>
        <h1 className="display" style={{ fontSize: 28, fontWeight: 500 }}>Biblioteca</h1>
        <p className="ui muted" style={{ fontSize: 11 }}>24 piezas · 6 series</p>
        <div style={{
          marginTop: 12,
          background: "var(--paper-2)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          padding: "8px 12px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <IcSearch size={14} className="muted" />
          <span className="ui muted" style={{ fontSize: 13 }}>Buscar sermones, pasajes…</span>
        </div>

        <div className="row" style={{ gap: 6, marginTop: 12, overflowX: "auto" }}>
          {["Todos", "Sermón", "Devocional", "Clase", "Esta semana"].map((c, i) => (
            <span key={c} className={"chip " + (i === 0 ? "chip-on" : "")} style={{ fontSize: 11 }}>{c}</span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 90px" }}>
        <div className="col" style={{ gap: 10 }}>
          {SAVED.map((s, i) => (
            <div key={s.id} style={{
              padding: 14,
              background: i === 0 ? "color-mix(in oklab, var(--accent) 4%, var(--paper-2))" : "var(--paper-2)",
              border: "1px solid var(--line)",
              borderRadius: 14,
            }}>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <TypePill type={s.type} />
                <span className="ui muted" style={{ fontSize: 10 }}>{s.scripture}</span>
                {i === 0 && <span className="pill" style={{ fontSize: 8.5, padding: "2px 6px", marginLeft: "auto" }}>En curso</span>}
              </div>
              <div className="display" style={{ fontSize: 16.5, lineHeight: 1.15, fontWeight: 500 }}>{s.title}</div>
              <p className="serif muted" style={{ fontSize: 12, marginTop: 4, fontStyle: "italic", lineHeight: 1.4 }}>
                “{s.excerpt.slice(0, 72)}…”
              </p>
              <div className="row" style={{ marginTop: 8, justifyContent: "space-between" }}>
                <span className="ui muted" style={{ fontSize: 10.5 }}>{s.duration} · {s.method.split(" · ")[0]}</span>
                <span className="ui muted" style={{ fontSize: 10.5 }}>{s.updated.split(" · ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 62, right: 18,
        width: 52, height: 52, borderRadius: "50%",
        background: "var(--accent)",
        color: "#fff",
        display: "grid", placeItems: "center",
        boxShadow: "0 12px 28px color-mix(in oklab, var(--accent) 40%, transparent)",
      }}>
        <IcPlus size={22} />
      </div>
    </>
  );
}

function IOSSerie() {
  return (
    <>
      <div style={{ padding: "8px 16px" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <button style={{ color: "var(--accent)", fontFamily: "var(--font-ui)", fontSize: 14 }}>
            <IcArrowRight size={16} style={{ transform: "rotate(180deg)", verticalAlign: -3 }} /> Series
          </button>
          <button><IcShare size={18} className="muted" /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 70 }}>
        <div className="deck-hillsong" style={{
          margin: "8px 20px 18px",
          aspectRatio: "4/5", borderRadius: 18,
          padding: 20, color: "#fff",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <small style={{
              fontFamily: "var(--font-ui)", fontSize: 9, letterSpacing: ".14em",
              textTransform: "uppercase", fontWeight: 600, opacity: 0.7,
            }}>Serie · 09 partes</small>
            <span style={{
              fontSize: 9, padding: "2px 8px", borderRadius: 999,
              background: "rgba(255,255,255,.15)",
              fontFamily: "var(--font-ui)", letterSpacing: ".14em",
              textTransform: "uppercase", fontWeight: 600,
            }}>En curso</span>
          </div>
          <div>
            <div className="display" style={{ fontSize: 26, fontStyle: "italic", lineHeight: 1.05 }}>
              Bienaventuranzas
            </div>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 10, marginTop: 10,
              letterSpacing: ".14em", textTransform: "uppercase",
              opacity: 0.65, fontWeight: 600,
            }}>Mateo 5:1–12</div>
          </div>
        </div>

        <div style={{ padding: "0 20px" }}>
          <p className="serif" style={{ fontSize: 15, fontStyle: "italic", color: "var(--ink-2)", lineHeight: 1.5 }}>
            “Una serie sobre los gestos del corazón que reciben el reino. Cada parte es una bienaventuranza encarnada.”
          </p>

          <div className="row" style={{ gap: 4, marginTop: 14 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 2,
                background: i < 2 ? "var(--accent)" :
                  i === 2 ? "color-mix(in oklab, var(--accent) 35%, var(--paper-3))" :
                    "var(--paper-3)",
              }} />
            ))}
          </div>
          <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
            <span className="ui muted" style={{ fontSize: 11 }}>2/9 partes · 22%</span>
            <span className="ui" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>+1 esta semana</span>
          </div>

          <div className="eyebrow" style={{ marginTop: 20, marginBottom: 8, fontSize: 9 }}>Partes</div>
          {([
            ["01", "Bienaventurados los pobres en espíritu", "Predicado · 17 May", true],
            ["02", "Bienaventurados los que lloran", "Predicado · 24 May", true],
            ["03", "Bienaventurados los mansos", "Próximo · 31 May", false],
            ["04", "Hambre y sed de justicia", "Borrador", false],
            ["05", "Bienaventurados los misericordiosos", "Borrador", false],
          ] as [string, string, string, boolean][]).map(([n, t, s, done], i) => (
            <div key={i} className="row" style={{ gap: 10, padding: "10px 0", borderBottom: "1px dashed var(--line-soft)" }}>
              <div style={{
                width: 24, height: 24, borderRadius: 999,
                border: "1.5px solid " + (done ? "var(--accent)" : "var(--ink-4)"),
                background: done ? "var(--accent)" : "transparent",
                color: done ? "#fff" : "var(--ink-4)",
                display: "grid", placeItems: "center",
                fontFamily: "var(--font-ui)", fontSize: 9, fontWeight: 700,
                flexShrink: 0,
              }}>{done ? <IcCheck size={12} /> : n}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 13.5, lineHeight: 1.25 }}>{t}</div>
                <div className="ui muted" style={{ fontSize: 10.5 }}>{s}</div>
              </div>
              <IcChevron size={14} className="muted" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ===================== Android screens ===================== */
function AndroidScreen({ screen }: { screen: string }) {
  return (
    <div style={{
      height: "100%", background: "var(--paper)", color: "var(--ink)",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-body)",
    }}>
      {screen === "estudio" && <AndroidEstudio />}
      {screen === "sermon" && <AndroidSermon />}
      {screen === "biblio" && <AndroidBiblio />}
      {screen === "serie" && <AndroidSerie />}
    </div>
  );
}

function AndroidEstudio() {
  return (
    <>
      <div style={{ padding: "8px 12px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <IcMenu size={20} className="muted" />
        <div style={{
          flex: 1, height: 38,
          background: "var(--paper-2)", borderRadius: 999,
          display: "flex", alignItems: "center", gap: 10, padding: "0 14px",
        }}>
          <IcSearch size={16} className="muted" />
          <span className="ui muted" style={{ fontSize: 13 }}>Buscar o pedir un sermón…</span>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 999,
          background: "linear-gradient(135deg, var(--gilt), var(--accent))",
          display: "grid", placeItems: "center",
          color: "#fff", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600,
        }}>GN</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 92px" }}>
        <span className="eyebrow">Tarde · Jueves 22 May</span>
        <h1 className="display" style={{ fontSize: 28, lineHeight: 1.05, marginTop: 6, fontWeight: 500 }}>
          Hola, <span style={{ color: "var(--accent)", fontStyle: "italic" }}>Gamaliel</span>.
        </h1>
        <p className="serif muted" style={{ fontSize: 13.5, marginTop: 6 }}>
          ¿Qué quieres preparar hoy?
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
          {([
            ["La fe que vence el temor", "Sermón · 25 min", "var(--accent)"],
            ["Salmo 23 · devocional", "Devocional · 10 min", "var(--gilt)"],
            ["La oración intercesora", "Clase · 45 min", "#2D6A9A"],
            ["Día de la Madre", "Tópico · 20 min", "var(--accent)"],
          ] as [string, string, string][]).map(([t, s, c], i) => (
            <div key={i} style={{
              padding: 12, background: "var(--paper-2)",
              border: "1px solid var(--line)", borderRadius: 16,
              minHeight: 88,
            }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `color-mix(in oklab, ${c} 14%, transparent)`, display: "grid", placeItems: "center", color: c, marginBottom: 8 }}>
                <IcSpark size={14} />
              </div>
              <div className="serif" style={{ fontSize: 13.5, lineHeight: 1.2, fontWeight: 500 }}>{t}</div>
              <div className="ui muted" style={{ fontSize: 10, marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>

        <div className="rule-fancy" style={{ margin: "20px 0 10px" }}>
          <span className="eyebrow" style={{ fontSize: 9 }}>Próximo servicio</span>
        </div>

        <div style={{
          padding: 14,
          background: "color-mix(in oklab, var(--accent) 5%, var(--paper-2))",
          border: "1px solid var(--accent)",
          borderRadius: 16,
        }}>
          <div className="row" style={{ gap: 8, marginBottom: 6 }}>
            <span className="pill"><IcCalendar size={10} /> Dom · 24 May</span>
            <span className="ui muted" style={{ fontSize: 11 }}>en 2 días</span>
          </div>
          <div className="display" style={{ fontSize: 18, lineHeight: 1.2, fontWeight: 500 }}>
            Bienaventurados los mansos
          </div>
          <div className="ui muted" style={{ fontSize: 11, marginTop: 4 }}>
            Mateo 5:5 · serie Bienaventuranzas · 2/9
          </div>
          <button style={{
            marginTop: 12, width: "100%", padding: "10px 0",
            background: "var(--accent)", color: "#fff",
            border: 0, borderRadius: 999, fontFamily: "var(--font-ui)",
            fontSize: 13, fontWeight: 500,
          }}>Abrir sermón →</button>
        </div>
      </div>

      <div style={{
        background: "color-mix(in oklab, var(--paper-2) 80%, transparent)",
        borderTop: "1px solid var(--line)",
        padding: "8px 6px",
        display: "flex", justifyContent: "space-around",
      }}>
        {([
          ["Estudio", IcChat, true],
          ["Biblio.", IcLibrary, false],
          ["Sermón", IcBook, false],
          ["Series", IcSlide, false],
          ["Plan", IcCalendar, false],
        ] as [string, (p: { size?: number; style?: React.CSSProperties }) => React.JSX.Element, boolean][]).map(([n, I, active], i) => (
          <div key={i} className="col" style={{ alignItems: "center", gap: 2 }}>
            <div style={{
              padding: "5px 18px", borderRadius: 999,
              background: active ? "var(--accent-soft)" : "transparent",
            }}>
              <I size={18} style={{ color: active ? "var(--accent)" : "var(--ink-3)" }} />
            </div>
            <span className="ui" style={{
              fontSize: 10, marginTop: 1,
              color: active ? "var(--accent)" : "var(--ink-3)",
              fontWeight: active ? 600 : 400,
            }}>{n}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function AndroidSermon() {
  return (
    <>
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <IcArrowRight size={20} className="muted" style={{ transform: "rotate(180deg)" }} />
        <span className="spacer" />
        <IcRefresh size={18} className="muted" />
        <IcShare size={18} className="muted" />
        <IcMore size={18} className="muted" />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 90px" }}>
        <div className="row" style={{ gap: 8, marginBottom: 4 }}>
          <TypePill type="Sermón" />
          <span className="pill" style={{ fontSize: 8.5, padding: "2px 7px" }}>Guardado</span>
        </div>
        <h1 className="display" style={{ fontSize: 24, lineHeight: 1.1, fontWeight: 500 }}>
          El temor que se rinde a la fe
        </h1>
        <p className="serif" style={{ fontSize: 13.5, fontStyle: "italic", color: "var(--ink-2)", marginTop: 6 }}>
          La fe genuina no espera a que el miedo se vaya; camina con él hasta confiar.
        </p>

        <div style={{
          marginTop: 12, padding: "10px 12px",
          background: "var(--paper-2)", borderRadius: 12,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 14px",
          fontFamily: "var(--font-ui)", fontSize: 11,
        }}>
          <div className="muted"><strong style={{ color: "var(--ink)" }}>Marco</strong> Bautista</div>
          <div className="muted"><strong style={{ color: "var(--ink)" }}>Método</strong> PEICA</div>
          <div className="muted"><strong style={{ color: "var(--ink)" }}>Longitud</strong> 27 min</div>
          <div className="muted"><strong style={{ color: "var(--ink)" }}>Ocasión</strong> Dominical</div>
        </div>

        <div className="row" style={{ gap: 0, borderBottom: "1px solid var(--line)", marginTop: 14 }}>
          {([["Texto", true], ["Bosquejo", false], ["Slides", false], ["Biblia", false]] as [string, boolean][]).map(([t, a]) => (
            <div key={t} style={{
              flex: 1, padding: "10px 0", textAlign: "center",
              borderBottom: "2px solid " + (a ? "var(--accent)" : "transparent"),
              fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 500,
              color: a ? "var(--accent)" : "var(--ink-3)",
            }}>{t}</div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>I · Punto 1</div>
          <h3 className="display" style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>
            Certeza, no ausencia de temblor
          </h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.6 }}>
            Hebreos no define la fe como un sentimiento limpio, sino como la sustancia de lo que se espera. En griego, <em>hypostasis</em>: aquello que sostiene por debajo.
          </p>

          <blockquote className="scripture" style={{ margin: "12px 0", padding: "11px 14px", fontSize: 13 }}>
            Es, pues, la fe la certeza de lo que se espera.
            <cite style={{ fontSize: 9.5 }}>Hebreos 11:1</cite>
          </blockquote>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 78, right: 16,
        padding: "12px 20px",
        background: "var(--accent)",
        color: "#fff",
        borderRadius: 16,
        boxShadow: "0 6px 20px color-mix(in oklab, var(--accent) 35%, transparent)",
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13,
      }}>
        <IcEye size={16} /> Presentar
      </div>
    </>
  );
}

function AndroidBiblio() {
  return (
    <>
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <IcMenu size={20} className="muted" />
        <h1 className="display" style={{ fontSize: 20, fontWeight: 500, flex: 1, marginLeft: 4 }}>Biblioteca</h1>
        <IcSearch size={20} className="muted" />
        <IcSliders size={20} className="muted" />
      </div>

      <div style={{ padding: "0 14px", display: "flex", gap: 6, overflowX: "auto" }}>
        {["Todos 24", "Sermón 18", "Devocional 4", "Clase 2"].map((c, i) => (
          <div key={c} style={{
            padding: "6px 12px", borderRadius: 999,
            background: i === 0 ? "var(--accent-soft)" : "transparent",
            border: "1px solid " + (i === 0 ? "var(--accent)" : "var(--line)"),
            fontFamily: "var(--font-ui)", fontSize: 11.5,
            color: i === 0 ? "var(--accent)" : "var(--ink-2)",
            whiteSpace: "nowrap",
          }}>{c}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {SAVED.slice(0, 6).map((s) => (
            <div key={s.id} style={{
              padding: 12, background: "var(--paper-2)",
              border: "1px solid var(--line)", borderRadius: 16,
              minHeight: 140, display: "flex", flexDirection: "column",
            }}>
              <TypePill type={s.type} />
              <div className="display" style={{ fontSize: 13.5, lineHeight: 1.2, fontWeight: 500, marginTop: 6, flex: 1 }}>
                {s.title}
              </div>
              <div className="ui muted" style={{ fontSize: 9.5, marginTop: 6 }}>
                {s.scripture} · {s.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 75, right: 16,
        width: 56, height: 56, borderRadius: 18,
        background: "var(--accent)",
        color: "#fff",
        display: "grid", placeItems: "center",
        boxShadow: "0 8px 24px color-mix(in oklab, var(--accent) 40%, transparent)",
      }}>
        <IcPlus size={24} />
      </div>
    </>
  );
}

function AndroidSerie() {
  return (
    <>
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <IcArrowRight size={20} className="muted" style={{ transform: "rotate(180deg)" }} />
        <span className="ui" style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>Series · Bienaventuranzas</span>
        <IcShare size={18} className="muted" />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 18px 80px" }}>
        <div className="deck-hillsong" style={{
          aspectRatio: "2/1", borderRadius: 16, padding: 18,
          color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <small style={{
              fontFamily: "var(--font-ui)", fontSize: 9, letterSpacing: ".14em",
              textTransform: "uppercase", fontWeight: 600, opacity: 0.7,
            }}>Serie · 09 partes</small>
            <span style={{
              fontSize: 9, padding: "2px 8px", borderRadius: 999,
              background: "rgba(255,255,255,.15)",
              fontFamily: "var(--font-ui)", letterSpacing: ".14em",
              textTransform: "uppercase", fontWeight: 600,
            }}>2 / 9 · 22%</span>
          </div>
          <div className="display" style={{ fontSize: 26, fontStyle: "italic", lineHeight: 1.05 }}>
            Bienaventuranzas
          </div>
        </div>

        <div className="row" style={{ gap: 4, marginTop: 14 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 5, borderRadius: 2,
              background: i < 2 ? "var(--accent)" :
                i === 2 ? "color-mix(in oklab, var(--accent) 35%, var(--paper-3))" :
                  "var(--paper-3)",
            }} />
          ))}
        </div>

        <p className="serif" style={{ fontSize: 14.5, fontStyle: "italic", color: "var(--ink-2)", marginTop: 14, lineHeight: 1.5 }}>
          “Cada parte es una bienaventuranza encarnada en la vida cotidiana.”
        </p>

        <div className="eyebrow" style={{ marginTop: 18, marginBottom: 8, fontSize: 9 }}>Partes</div>
        {([
          ["01", "Los pobres en espíritu", "17 May", true],
          ["02", "Los que lloran", "24 May", true],
          ["03", "Los mansos", "31 May", false],
          ["04", "Hambre y sed de justicia", "07 Jun", false],
          ["05", "Los misericordiosos", "Borrador", false],
        ] as [string, string, string, boolean][]).map(([n, t, s, done], i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "32px 1fr auto",
            gap: 12, padding: "12px 0",
            borderBottom: "1px solid var(--line-soft)",
            alignItems: "center",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: done ? "var(--accent)" : "var(--paper-2)",
              border: "1px solid " + (done ? "var(--accent)" : "var(--line)"),
              color: done ? "#fff" : "var(--ink-3)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600,
            }}>{done ? <IcCheck size={14} /> : n}</div>
            <div>
              <div className="serif" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>{t}</div>
              <div className="ui muted" style={{ fontSize: 11 }}>{s}</div>
            </div>
            <IcChevron size={16} className="muted" />
          </div>
        ))}
      </div>
    </>
  );
}
