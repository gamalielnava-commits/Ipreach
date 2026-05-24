import React from "react";
import { getSermon, saveSermon } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { exportWord, exportPptx } from "@/lib/export";
import type { Sermon, SlideDeck, SlideDensity } from "@/lib/types";
import { SERMON_SAMPLE, OUTLINE_SAMPLE, SLIDE_STYLES, VERSE_PREVIEW, PHRASES_SAMPLE } from "./data";
import { TypePill, SectionHead } from "./shared";
import {
  IcType, IcOutline, IcSlide, IcImage, IcBook, IcSpark, IcRefresh, IcDownload,
  IcEye, IcSliders, IcMore, IcCopy, IcPlus, IcBookmark, IcSearch, IcChevron, IcShare,
  IcCalendar, IcClose,
} from "./icons";

export function SermonScreen({
  sermonId,
  onOpenFilters,
  onPresent,
  onPrint,
}: {
  sermonId: string | null;
  onOpenFilters: () => void;
  onPresent: (sermon: Sermon) => void;
  onPrint: () => void;
}) {
  const [sermon, setSermon] = React.useState<Sermon | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [tab, setTab] = React.useState("texto");
  const [generatingOutline, setGeneratingOutline] = React.useState(false);
  const isDirty = React.useRef(false);

  const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [scheduleType, setScheduleType] = React.useState("sermon");
  const [scheduling, setScheduling] = React.useState(false);

  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [shareEmails, setShareEmails] = React.useState("");
  const [sharePhone, setSharePhone] = React.useState("");

  React.useEffect(() => {
    if (!sermonId) return;
    isDirty.current = false;
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
    if (!sermon || !isDirty.current) return;
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

  const updateSermon: React.Dispatch<React.SetStateAction<Sermon | null>> = (updater) => {
    isDirty.current = true;
    setSermon(updater);
  };

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
      updateSermon({ ...sermon, outlineText: data.text });
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
      updateSermon({ ...sermon, sermonText: data.text });
    } catch (err: any) {
      alert(`Error al regenerar sermón: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleScheduleSermon() {
    if (!sermon || !scheduleDate) return;
    setScheduling(true);
    try {
      let success = false;
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const { error } = await supabase.from("schedule_events").insert({
          user_id: auth.user.id,
          title: sermon.title,
          event_date: scheduleDate,
          type: scheduleType,
          description: sermon.config?.scripture || "",
        });
        if (!error) success = true;
      }
      
      if (!success && typeof window !== "undefined") {
        const local = localStorage.getItem("ipreach_schedule_events");
        const list = local ? JSON.parse(local) : [];
        list.push({
          id: crypto.randomUUID(),
          title: sermon.title,
          event_date: scheduleDate,
          type: scheduleType,
          description: sermon.config?.scripture || "",
        });
        localStorage.setItem("ipreach_schedule_events", JSON.stringify(list));
      }
      
      alert("¡Sermón programado con éxito!");
      setScheduleModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Error al programar el sermón.");
    } finally {
      setScheduling(false);
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
            <button className="btn btn-ghost btn-sm" onClick={() => setScheduleModalOpen(true)}><IcCalendar size={14} /> Programar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShareModalOpen(true)}><IcShare size={14} /> Compartir</button>
            <button className="btn btn-ghost btn-sm" onClick={() => exportWord(sermon)}><IcDownload size={14} /> Word</button>
            <button className="btn btn-ghost btn-sm" onClick={onPrint}><IcDownload size={14} /> PDF</button>
            <button className="btn btn-accent btn-sm" onClick={() => onPresent(sermon)}><IcEye size={14} /> Presentar</button>
            <button className="btn-icon" onClick={onOpenFilters} title="Filtros del sermón"><IcSliders size={16} /></button>
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
          {tab === "texto" && <TextoTab sermon={sermon} onChange={(txt) => updateSermon({ ...sermon, sermonText: txt })} />}
          {tab === "bosquejo" && <BosquejoTab sermon={sermon} onChange={(txt) => updateSermon({ ...sermon, outlineText: txt })} onRegenerate={handleGenerateOutline} generating={generatingOutline} />}
          {tab === "diapositivas" && <DiapositivasTab sermon={sermon} setSermon={updateSermon} />}
          {tab === "imagenes" && <ImagenesTab sermon={sermon} setSermon={updateSermon} />}
          {tab === "biblia" && <BibliaTab sermon={sermon} setSermon={updateSermon} />}
        </div>
      </div>

      {scheduleModalOpen && (
        <>
          <div onClick={() => setScheduleModalOpen(false)} style={{ position: "fixed", inset: 0, background: "color-mix(in oklab, var(--ink) 40%, transparent)", backdropFilter: "blur(2px)", zIndex: 90 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "min(420px, 95vw)", zIndex: 100,
            background: "var(--paper)", borderRadius: "var(--r-lg)",
            boxShadow: "0 24px 64px color-mix(in oklab, var(--ink) 24%, transparent)",
            padding: 24,
            color: "var(--ink)"
          }}>
            <div className="row" style={{ marginBottom: 16 }}>
              <h2 className="display" style={{ fontSize: 20, fontWeight: 500 }}>Programar en Calendario</h2>
              <span className="spacer" />
              <button type="button" className="btn-icon" onClick={() => setScheduleModalOpen(false)}><IcClose size={16} /></button>
            </div>
            <div className="col" style={{ gap: 14 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Fecha de predicación</label>
                <input type="date" className="field" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Tipo de evento</label>
                <select className="field" value={scheduleType} onChange={(e) => setScheduleType(e.target.value)}>
                  <option value="sermon">Sermón</option>
                  <option value="devocional">Devocional</option>
                  <option value="clase">Clase</option>
                </select>
              </div>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 24 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setScheduleModalOpen(false)}>Cancelar</button>
              <span className="spacer" />
              <button type="button" className="btn btn-accent" onClick={handleScheduleSermon} disabled={!scheduleDate || scheduling}>
                {scheduling ? "Guardando..." : "Programar"}
              </button>
            </div>
          </div>
        </>
      )}

      {shareModalOpen && (
        <>
          <div onClick={() => setShareModalOpen(false)} style={{ position: "fixed", inset: 0, background: "color-mix(in oklab, var(--ink) 40%, transparent)", backdropFilter: "blur(2px)", zIndex: 90 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "min(460px, 95vw)", zIndex: 100,
            background: "var(--paper)", borderRadius: "var(--r-lg)",
            boxShadow: "0 24px 64px color-mix(in oklab, var(--ink) 24%, transparent)",
            padding: 24,
            color: "var(--ink)"
          }}>
            <div className="row" style={{ marginBottom: 16 }}>
              <h2 className="display" style={{ fontSize: 20, fontWeight: 500 }}>Compartir contenido</h2>
              <span className="spacer" />
              <button type="button" className="btn-icon" onClick={() => setShareModalOpen(false)}><IcClose size={16} /></button>
            </div>
            <div className="col" style={{ gap: 16 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Enviar por WhatsApp</label>
                <div className="row" style={{ gap: 6 }}>
                  <input type="tel" className="field" placeholder="Ej. +52 5512345678" value={sharePhone} onChange={(e) => setSharePhone(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn-accent" onClick={() => {
                    const text = `*${sermon.title}*\n${sermon.config?.scripture ? `Pasaje: ${sermon.config.scripture}\n` : ""}\n${sermon.sermonText?.slice(0, 500)}...`;
                    const url = `https://wa.me/${sharePhone.replace(/[\s+()-]/g, "")}?text=${encodeURIComponent(text)}`;
                    window.open(url, "_blank");
                  }}>Enviar WA</button>
                </div>
              </div>
              
              <div style={{ borderTop: "1px dashed var(--line)", margin: "12px 0" }} />

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Enviar por Correo Electrónico</label>
                <div className="row" style={{ gap: 6, marginBottom: 8 }}>
                  <input type="text" className="field" placeholder="correo1@iglesia.org, correo2@..." value={shareEmails} onChange={(e) => setShareEmails(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn-accent" onClick={() => {
                    const subject = sermon.title;
                    const body = `${sermon.title}\n\n${sermon.config?.scripture ? `Pasaje: ${sermon.config.scripture}\n` : ""}\n\n${sermon.sermonText}`;
                    const url = `mailto:${shareEmails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(url, "_self");
                  }}>Enviar Correo</button>
                </div>
                <p className="ui muted" style={{ fontSize: 11 }}>Ingresa correos separados por comas para enviar a varias personas.</p>
              </div>
            </div>
          </div>
        </>
      )}
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
      .replace(/^\d+\.\s*/, "")
      .trim();
  };

  const activeDeck = sermon.slideDecks?.[0];
  const slides = activeDeck
    ? activeDeck.text
        .split(/^[ \t]*[*#_\s-]*DIAPOSITIVA[^\n]*$/im)
        .map((b) => b.trim())
        .filter(Boolean)
        .map((block) => {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          // Filter out image suggestions and meta lines
          const filtered = lines.filter((l) => {
            const low = l.toLowerCase();
            return !low.startsWith("sugerencia de imagen") &&
                   !low.startsWith("sugerencia visual") &&
                   !low.startsWith("imagen:") &&
                   !low.startsWith("fondo:") &&
                   !low.startsWith("nota:") &&
                   !low.startsWith("---");
          });
          const kind = cleanLine(filtered[0] || "Diapositiva");
          const contentLines = filtered.slice(1).map(cleanLine).filter(Boolean);
          return {
            kind,
            big: contentLines.join("\n"),
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
          <div style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed var(--line)", borderRadius: "var(--r-md)", color: "var(--ink-3)" }}>
            <IcSlide size={32} />
            <p style={{ marginTop: 12, fontSize: 14 }}>Haz clic en &quot;Generar mazo&quot; para crear diapositivas profesionales con IA.</p>
            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Se generarán entre 10 y 15 diapositivas cinemáticas basadas en tu sermón.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {slides.map((d, i) => {
              const tileClass = SLIDE_STYLES.find((s) => s.slug === (activeDeck?.style || style))?.cls
                || SLIDE_STYLES.find((s) => s.slug === style)?.cls
                || "deck-hillsong";
              const truncBig = d.big.length > 120 ? d.big.slice(0, 120) + "…" : d.big;
              const fontSize = d.big.length < 40 ? 14 : d.big.length < 80 ? 12 : 10;
              return (
                <div key={i} style={{ position: "relative" }}>
                  <div className={"slide-tile " + tileClass}
                    style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                    <small>{d.kind} · {String(i + 1).padStart(2, "0")}</small>
                    <div style={{ fontSize, fontWeight: 500, whiteSpace: "pre-wrap", overflow: "hidden", lineHeight: 1.3 }}>{truncBig}</div>
                    <div style={{ fontSize: 9.5, opacity: 0.7, marginTop: 4, letterSpacing: ".1em", textTransform: "uppercase" }}>{d.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Imágenes ---------- */
function ImagenesTab({
  sermon,
  setSermon,
}: {
  sermon: Sermon;
  setSermon: React.Dispatch<React.SetStateAction<Sermon | null>>;
}) {
  const [phrases, setPhrases] = React.useState<string[]>(PHRASES_SAMPLE);
  const [loadingPhrases, setLoadingPhrases] = React.useState(false);
  const [phrase, setPhrase] = React.useState(PHRASES_SAMPLE[0]);
  const [imgStyle, setImgStyle] = React.useState("cine");
  const [generating, setGenerating] = React.useState(false);
  const [generatedImages, setGeneratedImages] = React.useState<string[]>([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!sermon.sermonText) return;
    (async () => {
      setLoadingPhrases(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "phrases",
            config: sermon.config,
            sermonText: sermon.sermonText,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.text
            .split("\n")
            .map((x: string) => x.replace(/^\d+\.\s*/, "").replace(/^[-*•]\s*/, "").trim())
            .filter(Boolean)
            .slice(0, 4);
          if (list.length > 0) {
            setPhrases(list);
            setPhrase(list[0]);
          }
        }
      } catch (err) {
        console.error("Error al cargar frases:", err);
      } finally {
        setLoadingPhrases(false);
      }
    })();
  }, [sermon.sermonText]);

  async function handleGenerateImages() {
    if (!phrase) return;
    setGenerating(true);
    setError("");
    setGeneratedImages([]);
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase, style: imgStyle }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo generar la imagen.");
      }
      const data = await res.json();
      setGeneratedImages([data.image, data.image, data.image, data.image]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="col" style={{ gap: 22 }}>
      <div className="card-flat" style={{ padding: 22 }}>
        <h2 className="sec-title" style={{ marginBottom: 6 }}>Imágenes para redes</h2>
        <p className="serif muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Sugerencias de frases extraídas del sermón. Elige una y genera la imagen con la estética que prefieras.
        </p>

        <div className="eyebrow" style={{ marginBottom: 8 }}>Frases sugeridas</div>
        {loadingPhrases ? (
          <p className="ui muted" style={{ fontSize: 13 }}>Cargando frases sugeridas...</p>
        ) : (
          <div className="col" style={{ gap: 8 }}>
            {phrases.map((p, i) => (
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
        )}

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

        <div className="row" style={{ justifyContent: "flex-end", marginTop: 18, gap: 12, alignItems: "center" }}>
          {error && <span style={{ color: "#E11D48", fontSize: 13 }}>⚠️ {error}</span>}
          <button className="btn btn-accent" onClick={handleGenerateImages} disabled={generating || !phrase}>
            <IcSpark size={14} /> {generating ? "Generando..." : "Generar 4 variaciones"}
          </button>
        </div>
      </div>

      <h3 className="sec-title" style={{ fontSize: 19 }}>Generadas · {generatedImages.length}</h3>
      {generatedImages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--line)", borderRadius: "var(--r-md)", color: "var(--ink-3)" }}>
          Elige una frase y haz clic en "Generar 4 variaciones" para crear imágenes con IA.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {generatedImages.map((imgData, i) => {
            const s = SLIDE_STYLES[i % SLIDE_STYLES.length];
            return (
              <div key={i} className="col" style={{ gap: 8 }}>
                <div style={{ aspectRatio: "1/1", position: "relative", borderRadius: "var(--r-md)", overflow: "hidden", border: "1px solid var(--line)" }}>
                  <img src={imgData} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Visual" />
                  <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, padding: "8px 12px", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", borderRadius: 6, color: "#fff", fontSize: 11, fontStyle: "italic" }}>
                    “{phrase}”
                  </div>
                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="ui muted" style={{ fontSize: 11 }}>{s.name} · 1080×1080</span>
                  <div className="row" style={{ gap: 4 }}>
                    <a href={imgData} download={`ipreach-img-${i + 1}.png`} className="btn-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IcDownload size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Biblia ---------- */
function BibliaTab({
  sermon,
  setSermon,
}: {
  sermon: Sermon;
  setSermon: React.Dispatch<React.SetStateAction<Sermon | null>>;
}) {
  const [version, setVersion] = React.useState("RVR1960");
  const [query, setQuery] = React.useState("Hebreos 11:1-3");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ reference: string; version: string; text: string } | null>({
    reference: VERSE_PREVIEW.reference,
    version: VERSE_PREVIEW.version,
    text: VERSE_PREVIEW.text,
  });
  const [error, setError] = React.useState("");

  const verses: [string, string][] = [
    ["Hebreos 11:1", "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve."],
    ["Hebreos 11:6", "Sin fe es imposible agradar a Dios; porque es necesario que el que se acerca…"],
    ["Salmo 23:4", "Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo."],
    ["Génesis 12:1", "Vete de tu tierra y de tu parentela, y de la casa de padre, a la tierra que te mostraré."],
    ["Romanos 10:17", "Así que la fe es por el oír, y el oír, por la palabra de Dios."],
  ];

  async function handleSearch(overrideQuery?: string) {
    const q = (overrideQuery ?? query).trim();
    if (!q) return;
    if (overrideQuery) setQuery(overrideQuery);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: q, version }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo obtener el pasaje.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handleInsert() {
    if (!result) return;
    const toInsert = `\n\n> **${result.reference} (${result.version})**\n> ${result.text}\n\n`;
    setSermon({
      ...sermon,
      sermonText: sermon.sermonText + toInsert,
    });
    alert("Pasaje insertado al final del manuscrito.");
  }

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
              <option value="RVR1960">RVR1960</option>
              <option value="RV1909">RV1909</option>
              <option value="NVI">NVI</option>
              <option value="LBLA">LBLA</option>
              <option value="NTV">NTV</option>
            </select>
          </div>
          <button className="btn btn-accent" onClick={() => handleSearch()} disabled={loading}>
            <IcSearch size={14} /> {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: "#E11D48", fontSize: 13, background: "rgba(225,29,72,0.1)", padding: "10px 14px", borderRadius: 8 }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="passage-card">
          <span className="versemark">“</span>
          <div className="row" style={{ gap: 10, marginBottom: 12 }}>
            <span className="ui" style={{
              fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
              color: "var(--accent)", fontWeight: 700,
            }}>{result.reference} · {result.version}</span>
            <span className="pill pill-quiet">Biblia Online</span>
          </div>
          <p className="serif" style={{ fontSize: 19, lineHeight: 1.7, color: "var(--ink)", fontStyle: "italic" }}>
            {result.text}
          </p>
          <div className="row" style={{ gap: 6, marginTop: 16 }}>
            <button className="btn btn-accent btn-sm" onClick={handleInsert}><IcPlus size={14} /> Insertar en el sermón</button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(`"${result.text}" (${result.reference})`)}><IcCopy size={14} /> Copiar</button>
          </div>
        </div>
      )}

      <div>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <h3 className="sec-title" style={{ fontSize: 18 }}>Pasajes citados sugeridos</h3>
        </div>
        <div className="card-flat" style={{ padding: "4px 22px" }}>
          {verses.map(([ref, txt]) => (
            <div key={ref} className="verse-row">
              <span className="verse-ref" style={{ cursor: "pointer" }} onClick={() => { setQuery(ref); setVersion("RVR1960"); }}>{ref}</span>
              <div>
                <p className="serif" style={{ fontSize: 15, color: "var(--ink-2)", fontStyle: "italic" }}>“{txt}”</p>
                <div className="row" style={{ gap: 4, marginTop: 4 }}>
                  <button className="btn-quiet" style={{ fontSize: 11 }} onClick={() => handleSearch(ref)}>Buscar pasaje</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
