"use client";
import React from "react";
import { SERMON_SAMPLE, OUTLINE_SAMPLE, SLIDE_STYLES, VERSE_PREVIEW, PHRASES_SAMPLE } from "./data";
import { TypePill, SectionHead } from "./shared";
import {
  IcType, IcOutline, IcSlide, IcImage, IcBook, IcSpark, IcRefresh, IcDownload,
  IcEye, IcSliders, IcMore, IcCopy, IcPlus, IcBookmark, IcSearch, IcChevron, IcShare,
} from "./icons";

export function SermonScreen({ onOpenFilters, onPresent, onPrint }: {
  onOpenFilters: () => void;
  onPresent: () => void;
  onPrint: () => void;
}) {
  const [tab, setTab] = React.useState("texto");
  const TABS = [
    { id: "texto", label: "Texto", icon: IcType, count: "2.4k" },
    { id: "bosquejo", label: "Bosquejo", icon: IcOutline, count: "IV" },
    { id: "diapositivas", label: "Diapositivas", icon: IcSlide, count: "12" },
    { id: "imagenes", label: "Imágenes", icon: IcImage, count: "4" },
    { id: "biblia", label: "Biblia", icon: IcBook, count: null as string | null },
  ];

  return (
    <div className="main">
      <div style={{ padding: "22px 32px 14px", borderBottom: "1px solid var(--line)" }}>
        <div className="row" style={{ gap: 14, marginBottom: 10 }}>
          <TypePill type="Sermón" />
          <span className="ui muted" style={{ fontSize: 11.5 }}>{SERMON_SAMPLE.scripture}</span>
          <span className="pill"><IcSpark size={10} /> Guardado · hace 2 min</span>
          <span className="spacer" />
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><IcRefresh size={14} /> Regenerar</button>
            <button className="btn btn-ghost btn-sm" onClick={onPrint}><IcDownload size={14} /> Word</button>
            <button className="btn btn-ghost btn-sm" onClick={onPrint}><IcDownload size={14} /> PDF</button>
            <button className="btn btn-accent btn-sm" onClick={onPresent}><IcEye size={14} /> Presentar</button>
            <button className="btn-icon" onClick={onOpenFilters} title="Filtros del sermón"><IcSliders size={16} /></button>
            <button className="btn-icon"><IcMore size={16} /></button>
          </div>
        </div>
        <h1 className="display" style={{ fontSize: 38, fontWeight: 400, letterSpacing: "-0.018em" }}>
          {SERMON_SAMPLE.title}
        </h1>
        <p className="serif" style={{ fontSize: 17, fontStyle: "italic", color: "var(--ink-2)", marginTop: 8, maxWidth: 720 }}>
          {SERMON_SAMPLE.big_idea}
        </p>
        <div className="meta-strip" style={{ marginTop: 14 }}>
          {Object.entries(SERMON_SAMPLE.meta).map(([k, v]) => (
            <div key={k}><strong>{k}</strong> · {v}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 32px" }}>
        <div className="tabs">
          {TABS.map((t) => {
            const I = t.icon;
            return (
              <button key={t.id} className="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
                <I size={14} /> {t.label}
                {t.count && <span className="tab-count">{t.count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "26px 32px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {tab === "texto" && <TextoTab />}
          {tab === "bosquejo" && <BosquejoTab />}
          {tab === "diapositivas" && <DiapositivasTab />}
          {tab === "imagenes" && <ImagenesTab />}
          {tab === "biblia" && <BibliaTab />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Texto ---------- */
function TextoTab() {
  const [mode, setMode] = React.useState("manuscrito");
  return (
    <article style={{ fontFamily: "var(--font-display)", lineHeight: 1.7, color: "var(--ink)" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <div className="row" style={{ gap: 6 }}>
          {([
            ["manuscrito", "Manuscrito"],
            ["notas", "Notas para predicar"],
            ["teleprompter", "Teleprompter"],
            ["congregacion", "Versión congregación"],
          ] as [string, string][]).map(([k, n]) => (
            <button key={k} className={"chip " + (mode === k ? "chip-on" : "")}
              onClick={() => setMode(k)}>{n}</button>
          ))}
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn-quiet" style={{ fontSize: 11 }}><IcEye size={13} /> Lectura</button>
          <button className="btn-quiet" style={{ fontSize: 11 }}><IcType size={13} /> Aa</button>
        </div>
      </div>

      {mode === "manuscrito" && <ManuscritoView />}
      {mode === "notas" && <NotasView />}
      {mode === "teleprompter" && <TeleprompterView />}
      {mode === "congregacion" && <CongregacionView />}
    </article>
  );
}

function ManuscritoView() {
  return (
    <>
      <SectionHead roman="0." kicker="Introducción" />
      <p className="dropcap" style={{ fontSize: 17 }}>{SERMON_SAMPLE.intro}</p>

      <blockquote className="scripture">
        Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve. Sin fe es imposible agradar a Dios; porque es necesario que el que se acerca a Dios crea que le hay.
        <cite>Hebreos 11:1, 6 · RVR1960</cite>
      </blockquote>

      <SectionHead roman="I." kicker="Punto 1" title={SERMON_SAMPLE.point1_title} />
      <p style={{ fontSize: 16.5 }}>{SERMON_SAMPLE.point1}</p>

      <SectionHead roman="II." kicker="Punto 2" title={SERMON_SAMPLE.point2_title} />
      <p style={{ fontSize: 16.5 }}>{SERMON_SAMPLE.point2}</p>

      <SectionHead kicker="Ilustración" />
      <p style={{
        fontSize: 16.5,
        borderLeft: "2px solid var(--gilt)",
        fontStyle: "italic",
        color: "var(--ink-2)",
        background: "color-mix(in oklab, var(--gilt) 5%, transparent)",
        padding: "12px 22px",
        borderRadius: "0 8px 8px 0",
      }}>
        {SERMON_SAMPLE.illustration}
      </p>

      <SectionHead kicker="Aplicación" />
      <ol style={{ paddingLeft: 0, listStyle: "none", counterReset: "ap" }}>
        {SERMON_SAMPLE.applications.map((a, i) => (
          <li key={i} style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 14,
            counterIncrement: "ap", padding: "12px 0",
            borderBottom: i < SERMON_SAMPLE.applications.length - 1 ? "1px dashed var(--line-soft)" : "none",
          }}>
            <span className="ui" style={{
              fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
              color: "var(--accent)", fontWeight: 600, paddingTop: 4, whiteSpace: "nowrap",
            }}>Acción · {String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 16 }}>{a}</span>
          </li>
        ))}
      </ol>

      <SectionHead roman="✠" kicker="Cierre" />
      <p style={{ fontSize: 17, fontWeight: 500 }}>{SERMON_SAMPLE.close}</p>

      <hr className="rule" style={{ margin: "30px 0" }} />
      <p className="ui muted" style={{ fontSize: 11.5, textAlign: "center" }}>
        Aprox. 2 480 palabras · 27 min · última edición hace 2 min
      </p>
    </>
  );
}

function NotasView() {
  const blocks = [
    { time: "00:00", min: "2 min", section: "Intro", notes: ["Saludo · una respiración", "“El temor que cierra puertas vs. el que despierta a orar”", "Pausa 3 segundos antes de leer el texto"] },
    { time: "02:00", min: "8 min", section: "Punto I — Certeza, no ausencia de temblor", notes: ["Leer Heb 11:1", "Hypostasis · suelo invisible", "Génesis 12:1 · sin saber", "🔑 Repetir IDEA CENTRAL aquí"] },
    { time: "10:00", min: "7 min", section: "Punto II — La voz de la promesa", notes: ["Salmo 23 · valle de sombra", "Cita Romanos 10:17", "→ Ilustración del guía de montaña", "🎭 Bajar el tono, hablar despacio"] },
    { time: "17:00", min: "6 min", section: "Punto III — Probada en el silencio", notes: ["1 Pedro 1:7", "“Dios no se ha ido — está afinando la voz”", "Testimonio breve (controlar tiempo)"] },
    { time: "23:00", min: "3 min", section: "Aplicación", notes: ["3 acciones esta semana", "Pedir que alguien comparta brevemente"] },
    { time: "26:00", min: "1 min", section: "Cierre y bendición", notes: ["Frase clave + 3s silencio", "Romanos 15:13"] },
  ];
  return (
    <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.55, color: "var(--ink)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 20 }}>
        {blocks.map((b, i) => (
          <React.Fragment key={i}>
            <div style={{ textAlign: "right", paddingTop: 4 }}>
              <div className="ui" style={{
                fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 500,
                color: "var(--accent)", letterSpacing: "-.01em",
              }}>{b.time}</div>
              <div className="ui muted" style={{ fontSize: 11 }}>+{b.min}</div>
            </div>
            <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 18, paddingBottom: 16, marginBottom: 6 }}>
              <div className="display" style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>
                {b.section}
              </div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {b.notes.map((n, ni) => (
                  <li key={ni} style={{ padding: "2px 0", fontFamily: "var(--font-ui)", fontSize: 14 }}>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function TeleprompterView() {
  return (
    <div style={{
      fontFamily: "var(--font-display)",
      background: "#0a0805",
      color: "#f0e8d5",
      padding: "40px 50px",
      borderRadius: "var(--r-lg)",
      lineHeight: 1.45,
      fontSize: 28,
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 14, right: 18, left: 18,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "var(--font-ui)", fontSize: 11,
        color: "rgba(240,232,213,.5)", letterSpacing: ".14em", textTransform: "uppercase",
      }}>
        <span><span style={{ color: "#d4a64e" }}>●</span> Teleprompter · 60 WPM</span>
        <span>Espacio para iniciar</span>
      </div>

      <p style={{ marginTop: 30 }}>
        Hay un <span style={{ color: "#d4a64e" }}>temor que cierra</span> las puertas por dentro y otro que despierta antes del amanecer para orar.
      </p>
      <p>/ pausa /</p>
      <p>
        La primera carta que la iglesia leyó en voz alta no comenzaba con un manual, sino con un <span style={{ color: "#d4a64e", fontWeight: 500 }}>grito</span>:
      </p>
      <p style={{ fontStyle: "italic", color: "#fff" }}>
        “Sin fe es imposible agradar a Dios.”
      </p>
      <p>/ 3 segundos de silencio /</p>
      <p style={{ opacity: 0.5 }}>
        ▶ Hebreos no define la fe como un sentimiento limpio…
      </p>

      <div style={{ position: "absolute", bottom: 14, left: 18, right: 18, display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: 11, color: "rgba(240,232,213,.45)" }}>
        <span>Línea 1 de 184</span>
        <span>00:00 / 27:00</span>
      </div>
    </div>
  );
}

function CongregacionView() {
  const secs = [
    { h: "I. La fe es certeza, no ausencia de temblor", b: "La fe es el suelo invisible que aparece bajo el pie cuando das el paso. Como Abram, que salió «sin saber a dónde iba», nuestra confianza descansa en quien nos llama por nombre." },
    { h: "II. La fe encuentra su voz en la promesa", b: "El temor habla primero; la fe responde con un texto. Aférrate a una sola línea cuando el corazón tiemble: «no temeré mal alguno, porque tú estarás conmigo» (Sal 23:4)." },
    { h: "III. La fe es probada en el silencio", b: "Cuando Dios calla, no se ha ido —está afinando la voz con la que volverá a hablar en nosotros (1 P 1:7)." },
  ];
  return (
    <div>
      <div className="card-flat" style={{ padding: 24, marginBottom: 18 }}>
        <span className="eyebrow">Versión simplificada para entregar a la congregación</span>
        <h3 className="display" style={{ fontSize: 26, marginTop: 8, marginBottom: 4 }}>
          El temor que se rinde a la fe
        </h3>
        <p className="ui muted" style={{ fontSize: 12 }}>Hebreos 11:1–6 · Domingo 24 de mayo · Pastor Gamaliel</p>
      </div>

      {secs.map((s, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <h4 className="display" style={{ fontSize: 17, marginBottom: 6 }}>{s.h}</h4>
          <p style={{ fontSize: 15 }}>{s.b}</p>
        </div>
      ))}

      <div style={{ padding: "16px 20px", border: "1px solid var(--accent)", background: "color-mix(in oklab, var(--accent) 5%, transparent)", borderRadius: "var(--r-md)", marginTop: 24 }}>
        <span className="eyebrow" style={{ color: "var(--accent)" }}>Para llevar esta semana</span>
        <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 14.5, lineHeight: 1.55 }}>
          <li>Identifica un temor concreto y escribe una promesa frente a él.</li>
          <li>Camina un paso con esa promesa antes de pedir certezas.</li>
          <li>Llama a alguien en su valle y léele la promesa en voz alta.</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- Bosquejo ---------- */
function BosquejoTab() {
  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
        <h2 className="sec-title">Bosquejo predicable</h2>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn-ghost btn-sm"><IcRefresh size={14} /> Regenerar</button>
          <button className="btn btn-ghost btn-sm"><IcCopy size={14} /> Copiar</button>
          <button className="btn btn-ghost btn-sm"><IcDownload size={14} /> Word</button>
        </div>
      </div>

      <div className="card-flat" style={{ padding: 28 }}>
        <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 26, marginLeft: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Texto base</div>
          <p className="serif" style={{ fontSize: 18, marginBottom: 4 }}>Hebreos 11:1–6 · RVR1960</p>
          <div className="eyebrow" style={{ marginTop: 22, marginBottom: 8 }}>Idea central</div>
          <p className="serif" style={{ fontSize: 17, fontStyle: "italic", color: "var(--ink-2)" }}>
            {SERMON_SAMPLE.big_idea}
          </p>

          <hr className="rule" style={{ margin: "26px -26px 26px 0" }} />

          <div className="eyebrow" style={{ marginBottom: 14 }}>Divisiones</div>
          <div className="col" style={{ gap: 18 }}>
            {OUTLINE_SAMPLE.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 14 }}>
                <span className="display" style={{ fontSize: 24, fontStyle: "italic", color: "var(--accent)" }}>{p.roman}</span>
                <div>
                  <h4 className="display" style={{ fontSize: 18, marginBottom: 6 }}>{p.title}</h4>
                  <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                    {p.refs.map((r) => (
                      <span key={r} className="chip chip-accent">{r}</span>
                    ))}
                    <button className="chip"><IcPlus size={11} /> Subpunto</button>
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-ghost" style={{ alignSelf: "flex-start" }}>
              <IcPlus size={14} /> Añadir división
            </button>
          </div>

          <hr className="rule" style={{ margin: "26px -26px 26px 0" }} />

          <div className="eyebrow" style={{ marginBottom: 8 }}>Llamado y aplicación</div>
          <p className="serif" style={{ fontSize: 16, color: "var(--ink-2)" }}>
            Cierra con un acto concreto: que cada oyente escriba el temor con el que entró y la promesa que se llevará. Ofrece un momento de oración silenciosa antes de la respuesta congregacional.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Diapositivas ---------- */
function DiapositivasTab() {
  const [style, setStyle] = React.useState("hillsong");
  const [density, setDensity] = React.useState("mediana");

  const deck = [
    { kind: "Título", big: "El temor que se\nrinde a la fe", sub: "Hebreos 11:1–6" },
    { kind: "Idea central", big: "La fe es el suelo\ninvisible bajo el pie", sub: "Idea homilética" },
    { kind: "Texto", big: "“Sin fe es imposible\nagradar a Dios.”", sub: "Hebreos 11:6" },
    { kind: "Punto I", big: "Certeza, no\nausencia de temblor", sub: "Hebreos 11:1" },
    { kind: "Sub-punto", big: "hypostasis · lo que\nsostiene por debajo", sub: "exégesis" },
    { kind: "Texto", big: "Salió sin saber\na dónde iba.", sub: "Génesis 12:1" },
    { kind: "Punto II", big: "La fe encuentra\nsu voz en la promesa", sub: "Salmo 23" },
    { kind: "Ilustración", big: "Los veteranos\nmiran la cuerda.", sub: "ilustración" },
    { kind: "Punto III", big: "La fe es probada\nen el silencio", sub: "1 Pedro 1:7" },
    { kind: "Aplicación", big: "Camina un paso\ncon la promesa.", sub: "esta semana" },
    { kind: "Cierre", big: "Mira la cicatriz\nen la mano abierta.", sub: "evangelio" },
    { kind: "Bendición", big: "Que el Dios de\nla esperanza…", sub: "Romanos 15:13" },
  ];

  return (
    <div className="col" style={{ gap: 22 }}>
      <div className="card-flat" style={{ padding: 22 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <h2 className="sec-title">Generar diapositivas</h2>
          <button className="btn btn-accent btn-sm"><IcSpark size={14} /> Generar mazo</button>
        </div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Estilo visual</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {SLIDE_STYLES.map((s) => (
            <button key={s.slug}
              onClick={() => setStyle(s.slug)}
              style={{
                textAlign: "left", padding: 4,
                border: "1px solid " + (style === s.slug ? "var(--accent)" : "var(--line)"),
                borderRadius: "var(--r-md)",
                background: style === s.slug ? "color-mix(in oklab, var(--accent) 6%, transparent)" : "transparent",
                cursor: "pointer",
              }}>
              <div className={"slide-tile " + s.cls} style={{ aspectRatio: "16/9", padding: 12 }}>
                <small>{s.name}</small>
                <div style={{ fontSize: 12 }}>Idea central</div>
              </div>
              <div style={{ padding: "8px 8px 6px" }}>
                <div className="ui" style={{ fontSize: 12.5, fontWeight: 600 }}>{s.name}</div>
                <div className="ui muted" style={{ fontSize: 11 }}>{s.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Densidad de contenido</div>
        <div className="row" style={{ gap: 6 }}>
          {([
            ["corta", "Corta", "Solo título y versículos"],
            ["mediana", "Mediana", "Idea central + puntos breves"],
            ["larga", "Larga", "Desarrollo + ilustración + aplicación"],
          ] as [string, string, string][]).map(([k, n, d]) => (
            <button key={k}
              onClick={() => setDensity(k)}
              className="sugg"
              style={{
                flex: 1, padding: 12,
                border: "1px solid " + (density === k ? "var(--ink)" : "var(--line)"),
                background: density === k ? "var(--paper)" : "var(--paper-2)",
              }}>
              <div className="col" style={{ lineHeight: 1.25 }}>
                <span className="ui" style={{ fontSize: 13, fontWeight: 600 }}>{n}</span>
                <span className="ui muted" style={{ fontSize: 11 }}>{d}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <h3 className="sec-title" style={{ fontSize: 19 }}>Mazo · Hillsong · 12 diapositivas</h3>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><IcEye size={14} /> Presentar</button>
            <button className="btn btn-ghost btn-sm"><IcDownload size={14} /> .pptx</button>
            <button className="btn btn-ghost btn-sm"><IcDownload size={14} /> Keynote</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {deck.map((d, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div className={"slide-tile " + (SLIDE_STYLES.find((s) => s.slug === style)?.cls || "deck-hillsong")}
                style={{ aspectRatio: "16/9" }}>
                <small>{d.kind} · {String(i + 1).padStart(2, "0")}</small>
                <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "pre-wrap" }}>{d.big}</div>
                <div style={{ fontSize: 9.5, opacity: 0.7, marginTop: 4, letterSpacing: ".1em", textTransform: "uppercase" }}>{d.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Imágenes ---------- */
function ImagenesTab() {
  const [phrase, setPhrase] = React.useState(PHRASES_SAMPLE[0]);
  const [imgStyle, setImgStyle] = React.useState("cine");

  return (
    <div className="col" style={{ gap: 22 }}>
      <div className="card-flat" style={{ padding: 22 }}>
        <h2 className="sec-title" style={{ marginBottom: 6 }}>Imágenes para redes</h2>
        <p className="serif muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Sugerencias de frases extraídas del sermón. Elige una y genera la imagen con la estética que prefieras.
        </p>

        <div className="eyebrow" style={{ marginBottom: 8 }}>Frases sugeridas</div>
        <div className="col" style={{ gap: 8 }}>
          {PHRASES_SAMPLE.map((p, i) => (
            <button key={i}
              onClick={() => setPhrase(p)}
              className="sugg"
              style={{
                padding: "12px 14px",
                borderColor: phrase === p ? "var(--accent)" : "var(--line)",
                background: phrase === p ? "color-mix(in oklab, var(--accent) 6%, var(--paper-2))" : undefined,
              }}>
              <div className="sugg-icon" style={{ width: 28, height: 28 }}>
                <IcType size={14} />
              </div>
              <span className="serif" style={{ fontSize: 15, fontStyle: "italic" }}>{p}</span>
            </button>
          ))}
        </div>

        <div className="eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Estilo visual</div>
        <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
          {SLIDE_STYLES.map((s) => (
            <button key={s.slug}
              onClick={() => setImgStyle(s.slug)}
              className={"chip " + (imgStyle === s.slug ? "chip-on" : "")}>
              {s.name}
            </button>
          ))}
        </div>

        <div className="row" style={{ justifyContent: "flex-end", marginTop: 18 }}>
          <button className="btn btn-accent"><IcSpark size={14} /> Generar 4 variaciones</button>
        </div>
      </div>

      <h3 className="sec-title" style={{ fontSize: 19 }}>Generadas · 4</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {SLIDE_STYLES.slice(0, 4).map((s) => (
          <div key={s.slug} className="col" style={{ gap: 8 }}>
            <div className={"slide-tile " + s.cls} style={{ aspectRatio: "1/1", padding: 28 }}>
              <small>frase</small>
              <div style={{ fontSize: 18, lineHeight: 1.3, fontStyle: "italic", maxWidth: "90%" }}>
                {phrase}
              </div>
              <div style={{ fontSize: 9, opacity: 0.7, marginTop: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>
                ipreach · {s.name}
              </div>
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="ui muted" style={{ fontSize: 11 }}>{s.name} · 1080×1080</span>
              <div className="row" style={{ gap: 4 }}>
                <button className="btn-icon"><IcRefresh size={14} /></button>
                <button className="btn-icon"><IcDownload size={14} /></button>
                <button className="btn-icon"><IcShare size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Biblia ---------- */
function BibliaTab() {
  const [version, setVersion] = React.useState("RVR1960");
  const [query, setQuery] = React.useState("Hebreos 11:1-3");
  const verses: [string, string][] = [
    ["Hebreos 11:1", "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve."],
    ["Hebreos 11:6", "Sin fe es imposible agradar a Dios; porque es necesario que el que se acerca…"],
    ["Salmo 23:4", "Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo."],
    ["Génesis 12:1", "Vete de tu tierra y de tu parentela, y de la casa de tu padre, a la tierra que te mostraré."],
    ["Romanos 10:17", "Así que la fe es por el oír, y el oír, por la palabra de Dios."],
  ];
  return (
    <div className="col" style={{ gap: 22 }}>
      <div className="card-flat" style={{ padding: 22 }}>
        <div className="row" style={{ gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 2 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Referencia</div>
            <input className="field" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej. Juan 3:16 o Salmos 23" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Versión</div>
            <select className="field" value={version} onChange={(e) => setVersion(e.target.value)}>
              <option>RVR1960</option>
              <option>RV1909</option>
              <option>NVI</option>
              <option>LBLA</option>
              <option>NTV</option>
            </select>
          </div>
          <button className="btn btn-accent"><IcSearch size={14} /> Buscar</button>
        </div>
      </div>

      <div className="passage-card">
        <span className="versemark">“</span>
        <div className="row" style={{ gap: 10, marginBottom: 12 }}>
          <span className="ui" style={{
            fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
            color: "var(--accent)", fontWeight: 700,
          }}>{VERSE_PREVIEW.reference} · {VERSE_PREVIEW.version}</span>
          <span className="pill pill-quiet">Dominio público</span>
        </div>
        <p className="serif" style={{ fontSize: 19, lineHeight: 1.7, color: "var(--ink)", fontStyle: "italic" }}>
          {VERSE_PREVIEW.text}
        </p>
        <div className="row" style={{ gap: 6, marginTop: 16 }}>
          <button className="btn btn-accent btn-sm"><IcPlus size={14} /> Insertar en el sermón</button>
          <button className="btn btn-ghost btn-sm"><IcCopy size={14} /> Copiar</button>
          <button className="btn btn-ghost btn-sm"><IcBookmark size={14} /> Marcar</button>
          <span className="spacer" />
          <button className="btn-quiet" style={{ fontSize: 11 }}>Comparar versiones <IcChevron size={12} /></button>
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <h3 className="sec-title" style={{ fontSize: 18 }}>Pasajes citados en este sermón</h3>
          <button className="btn-quiet" style={{ fontSize: 11 }}>Ver todos · 14</button>
        </div>
        <div className="card-flat" style={{ padding: "4px 22px" }}>
          {verses.map(([ref, txt]) => (
            <div key={ref} className="verse-row">
              <span className="verse-ref">{ref}</span>
              <div>
                <p className="serif" style={{ fontSize: 15, color: "var(--ink-2)", fontStyle: "italic" }}>“{txt}”</p>
                <div className="row" style={{ gap: 4, marginTop: 4 }}>
                  <button className="btn-quiet" style={{ fontSize: 11 }}>Ir al manuscrito</button>
                  <span className="muted">·</span>
                  <button className="btn-quiet" style={{ fontSize: 11 }}>Comentarios</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
