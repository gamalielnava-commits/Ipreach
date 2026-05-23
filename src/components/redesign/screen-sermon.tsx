import React from "react";
import { getSermon, saveSermon } from "@/lib/store";
import { exportWord, exportPptx } from "@/lib/export";
import type { Sermon, SlideDeck, SlideDensity } from "@/lib/types";
import { SERMON_SAMPLE, OUTLINE_SAMPLE, SLIDE_STYLES, VERSE_PREVIEW, PHRASES_SAMPLE } from "./data";
import { TypePill, SectionHead } from "./shared";
import {
  IcType, IcOutline, IcSlide, IcImage, IcBook, IcSpark, IcRefresh, IcDownload,
  IcEye, IcSliders, IcMore, IcCopy, IcPlus, IcBookmark, IcSearch, IcChevron, IcShare,
} from "./icons";

export function SermonScreen({
  sermonId,
  onOpenFilters,
  onPresent,
  onPrint,
}: {
  sermonId: string | null;
  onOpenFilters: () => void;
  onPresent: () => void;
  onPrint: () => void;
}) {
  const [sermon, setSermon] = React.useState<Sermon | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [tab, setTab] = React.useState("texto");
  const [generatingOutline, setGeneratingOutline] = React.useState(false);

  React.useEffect(() => {
    if (!sermonId) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getSermon(sermonId);
        setSermon(data);
      } catch (err) {
        console.error("Error al cargar el sermón:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [sermonId]);

  React.useEffect(() => {
    if (!sermon) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await saveSermon(sermon);
      } catch (err) {
        console.error("Error al auto-guardar sermón:", err);
      } finally {
        setSaving(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [sermon]);

  async function handleGenerateOutline() {
    if (!sermon) return;
    setGeneratingOutline(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "outline",
          config: sermon.config,
          sermonText: sermon.sermonText,
        }),
      });
      if (!res.ok) throw new Error("Error en la generación de bosquejo.");
      const data = await res.json();
      setSermon({ ...sermon, outlineText: data.text });
    } catch (err: any) {
      alert(`Error al generar bosquejo: ${err.message}`);
    } finally {
      setGeneratingOutline(false);
    }
  }

  async function handleRegenerateSermon() {
    if (!sermon) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "sermon",
          config: sermon.config,
        }),
      });
      if (!res.ok) throw new Error("Error en la regeneración de sermón.");
      const data = await res.json();
      setSermon({ ...sermon, sermonText: data.text });
    } catch (err: any) {
      alert(`Error al regenerar sermón: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (!sermonId) {
    return (
      <div className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p className="serif muted" style={{ fontSize: 18, fontStyle: "italic" }}>
          Selecciona un sermón de la biblioteca o inicia un nuevo estudio para comenzar a redactar.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <div className="typing"><span></span><span></span><span></span></div>
          <p className="ui muted" style={{ fontSize: 13, marginTop: 12 }}>Cargando o generando sermón...</p>
        </div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p className="serif muted" style={{ fontSize: 18, fontStyle: "italic", color: "#E11D48" }}>
          No se encontró el sermón seleccionado.
        </p>
      </div>
    );
  }

  const wordCount = sermon.sermonText ? sermon.sermonText.split(/\s+/).filter(Boolean).length : 0;
  const slideCount = sermon.slideDecks?.[0]
    ? sermon.slideDecks[0].text.split(/^[ \t]*DIAPOSITIVA[^\n]*$/im).filter(Boolean).length
    : 0;

  const TABS = [
    { id: "texto", label: "Texto", icon: IcType, count: `${(wordCount / 1000).toFixed(1)}k` },
    { id: "bosquejo", label: "Bosquejo", icon: IcOutline, count: sermon.outlineText ? "IV" : "0" },
    { id: "diapositivas", label: "Diapositivas", icon: IcSlide, count: slideCount.toString() },
    { id: "imagenes", label: "Imágenes", icon: IcImage, count: "4" },
    { id: "biblia", label: "Biblia", icon: IcBook, count: null as string | null },
  ];

  return (
    <div className="main">
      <div style={{ padding: "22px 32px 14px", borderBottom: "1px solid var(--line)" }}>
        <div className="row" style={{ gap: 14, marginBottom: 10 }}>
          <TypePill type="Sermón" />
          <span className="ui muted" style={{ fontSize: 11.5 }}>{sermon.config.scripture || sermon.config.idea}</span>
          <span className="pill"><IcSpark size={10} /> {saving ? "Guardando..." : "Guardado"}</span>
          <span className="spacer" />
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={handleRegenerateSermon}><IcRefresh size={14} /> Regenerar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => exportWord(sermon)}><IcDownload size={14} /> Word</button>
            <button className="btn btn-ghost btn-sm" onClick={onPrint}><IcDownload size={14} /> PDF</button>
            <button className="btn btn-accent btn-sm" onClick={onPresent}><IcEye size={14} /> Presentar</button>
            <button className="btn-icon" onClick={onOpenFilters} title="Filtros del sermón"><IcSliders size={16} /></button>
            <button className="btn-icon"><IcMore size={16} /></button>
          </div>
        </div>
        <h1 className="display" style={{ fontSize: 38, fontWeight: 400, letterSpacing: "-0.018em" }}>
          {sermon.title}
        </h1>
        <p className="serif" style={{ fontSize: 17, fontStyle: "italic", color: "var(--ink-2)", marginTop: 8, maxWidth: 720 }}>
          {sermon.config.idea}
        </p>
        <div className="meta-strip" style={{ marginTop: 14 }}>
          <div><strong>Marco</strong> · {sermon.config.framework}</div>
          <div><strong>Método</strong> · {sermon.config.method}</div>
          <div><strong>Longitud</strong> · {sermon.config.length === "medio" ? "Mediana · 20-30 min" : sermon.config.length === "corto" ? "Corta · 10-15 min" : "Larga · 35-45 min"}</div>
          <div><strong>Modelo</strong> · {sermon.config.provider === "claude" ? "Claude (Opus)" : "Gemini (Pro)"}</div>
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
          {tab === "texto" && <TextoTab sermon={sermon} onChange={(txt) => setSermon({ ...sermon, sermonText: txt })} />}
          {tab === "bosquejo" && <BosquejoTab sermon={sermon} onChange={(txt) => setSermon({ ...sermon, outlineText: txt })} onRegenerate={handleGenerateOutline} generating={generatingOutline} />}
          {tab === "diapositivas" && <DiapositivasTab sermon={sermon} setSermon={setSermon} />}
          {tab === "imagenes" && <ImagenesTab />}
          {tab === "biblia" && <BibliaTab />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Texto ---------- */
function TextoTab({ sermon, onChange }: { sermon: Sermon; onChange: (text: string) => void }) {
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
      </div>

      {mode === "manuscrito" && <ManuscritoView sermon={sermon} onChange={onChange} />}
      {mode === "notas" && <NotasView text={sermon.sermonText} />}
      {mode === "teleprompter" && <TeleprompterView text={sermon.sermonText} />}
      {mode === "congregacion" && <CongregacionView text={sermon.sermonText} title={sermon.title} scripture={sermon.config.scripture || sermon.config.idea} />}
    </article>
  );
}

function ManuscritoView({ sermon, onChange }: { sermon: Sermon; onChange: (text: string) => void }) {
  const wordCount = sermon.sermonText ? sermon.sermonText.split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.round(wordCount / 130);
  return (
    <div style={{ background: "var(--paper)", padding: "26px 30px", border: "1px solid var(--line)", borderRadius: "var(--r-md)", minHeight: "500px", marginTop: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
      <textarea
        value={sermon.sermonText}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          minHeight: "450px",
          background: "transparent",
          color: "var(--ink)",
          fontFamily: "var(--font-display)",
          fontSize: "17px",
          lineHeight: 1.8,
          border: "none",
          outline: "none",
          resize: "none",
        }}
        placeholder="Escribe o edita el manuscrito del sermón aquí..."
      />
      <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 14, marginTop: 14, display: "flex", justifyContent: "space-between" }}>
        <span className="ui muted" style={{ fontSize: 11 }}>Aprox. {wordCount} palabras · {readTime} min</span>
      </div>
    </div>
  );
}

function NotasView({ text }: { text: string }) {
  const paragraphs = text ? text.split("\n").map(p => p.trim()).filter(Boolean) : [];
  return (
    <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.55, color: "var(--ink)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 20 }}>
        {paragraphs.length === 0 ? (
          <div style={{ gridColumn: "span 2", textAlign: "center", padding: "40px", color: "var(--ink-3)" }}>
            No hay párrafos en el sermón para generar notas.
          </div>
        ) : (
          paragraphs.map((p, i) => {
            const time = `${String(Math.min(59, i * 3)).padStart(2, "0")}:00`;
            return (
              <React.Fragment key={i}>
                <div style={{ textAlign: "right", paddingTop: 4 }}>
                  <div className="ui" style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 500, color: "var(--accent)" }}>{time}</div>
                  <div className="ui muted" style={{ fontSize: 11 }}>+{Math.min(10, Math.round(p.split(" ").length / 130))} min</div>
                </div>
                <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 18, paddingBottom: 16, marginBottom: 6 }}>
                  <div style={{ fontSize: 15, fontFamily: "var(--font-ui)" }}>{p}</div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}

function TeleprompterView({ text }: { text: string }) {
  const paragraphs = text ? text.split("\n").map(p => p.trim()).filter(Boolean) : [];
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
        <span>● Teleprompter</span>
        <span>Espacio para iniciar</span>
      </div>
      <div style={{ marginTop: 30, display: "grid", gap: 20 }}>
        {paragraphs.length === 0 ? (
          <p style={{ opacity: 0.5 }}>Escribe texto en el manuscrito para verlo en el teleprompter.</p>
        ) : (
          paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))
        )}
      </div>
    </div>
  );
}

function CongregacionView({ text, title, scripture }: { text: string; title: string; scripture: string }) {
  const paragraphs = text ? text.split("\n").map(p => p.trim()).filter(Boolean).slice(0, 5) : [];
  return (
    <div>
      <div className="card-flat" style={{ padding: 24, marginBottom: 18 }}>
        <span className="eyebrow">Versión simplificada para entregar a la congregación</span>
        <h3 className="display" style={{ fontSize: 26, marginTop: 8, marginBottom: 4 }}>
          {title}
        </h3>
        <p className="ui muted" style={{ fontSize: 12 }}>{scripture}</p>
      </div>
      {paragraphs.length === 0 ? (
        <p className="serif muted" style={{ fontStyle: "italic" }}>El sermón no tiene texto aún.</p>
      ) : (
        paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 15 }}>{p}</p>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------- Bosquejo ---------- */
function BosquejoTab({
  sermon,
  onChange,
  onRegenerate,
  generating,
}: {
  sermon: Sermon;
  onChange: (text: string) => void;
  onRegenerate: () => void;
  generating: boolean;
}) {
  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
        <h2 className="sec-title">Bosquejo predicable</h2>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={onRegenerate} disabled={generating}>
            <IcRefresh size={14} /> {generating ? "Generando..." : "Regenerar bosquejo"}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(sermon.outlineText)}>
            <IcCopy size={14} /> Copiar
          </button>
        </div>
      </div>

      <div className="card-flat" style={{ padding: 28 }}>
        <textarea
          value={sermon.outlineText}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            minHeight: "450px",
            background: "transparent",
            color: "var(--ink)",
            fontFamily: "var(--font-display)",
            fontSize: "17px",
            lineHeight: 1.8,
            border: "none",
            outline: "none",
            resize: "none",
          }}
          placeholder="El bosquejo se generará aquí..."
        />
      </div>
    </div>
  );
}

/* ---------- Diapositivas ---------- */
function DiapositivasTab({
  sermon,
  setSermon,
}: {
  sermon: Sermon;
  setSermon: React.Dispatch<React.SetStateAction<Sermon | null>>;
}) {
  const [style, setStyle] = React.useState("hillsong");
  const [density, setDensity] = React.useState("mediana");
  const [generating, setGenerating] = React.useState(false);

  const activeDeck = sermon.slideDecks?.[0];
  const slides = activeDeck
    ? activeDeck.text
        .split(/^[ \t]*DIAPOSITIVA[^\n]*$/im)
        .map((b) => b.trim())
        .filter(Boolean)
        .map((block) => {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          return {
            kind: lines[0] || "Diapositiva",
            big: lines.slice(1).join("\n"),
            sub: sermon.config.scripture || "",
          };
        })
    : [];

  async function handleGenerateSlides() {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "slides",
          config: sermon.config,
          sermonText: sermon.sermonText,
          slideStyle: style,
          slideDensity: density,
        }),
      });
      if (!res.ok) throw new Error("Error al generar diapositivas.");
      const data = await res.json();
      
      const newDeck: SlideDeck = {
        id: crypto.randomUUID(),
        style,
        density: density as SlideDensity,
        text: data.text,
        imagePrompt: "",
        createdAt: new Date().toISOString(),
      };

      setSermon({
        ...sermon,
        slideDecks: [newDeck, ...(sermon.slideDecks || [])],
      });
    } catch (err: any) {
      alert(`Error al generar diapositivas: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="col" style={{ gap: 22 }}>
      <div className="card-flat" style={{ padding: 22 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <h2 className="sec-title">Generar diapositivas</h2>
          <button className="btn btn-accent btn-sm" onClick={handleGenerateSlides} disabled={generating || !sermon.sermonText}>
            <IcSpark size={14} /> {generating ? "Generando..." : "Generar mazo"}
          </button>
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
          <h3 className="sec-title" style={{ fontSize: 19 }}>
            Mazo · {SLIDE_STYLES.find((s) => s.slug === style)?.name || style} · {slides.length} diapositivas
          </h3>
          {slides.length > 0 && (
            <div className="row" style={{ gap: 6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => exportPptx(sermon, activeDeck!)}><IcDownload size={14} /> .pptx</button>
            </div>
          )}
        </div>
        
        {slides.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--line)", borderRadius: "var(--r-md)", color: "var(--ink-3)" }}>
            Haz clic en "Generar mazo" en la parte superior para crear diapositivas reales con Inteligencia Artificial.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {slides.map((d, i) => (
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
        )}
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
