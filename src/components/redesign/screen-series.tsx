"use client";
import React, { useState, useEffect, useCallback } from "react";
import { TopBar } from "./shell";
import { IcSliders, IcPlus, IcEye, IcEdit, IcCheck, IcChevronD, IcClose } from "./icons";
import { listSeries, saveSeries, deleteSeries, listSeriesParts, saveSeriesPart, newSeriesId } from "@/lib/series";
import type { Series, SeriesPart } from "@/lib/types";

type Serie = {
  id: string; title: string; sub: string; cover: string;
  parts: number; done: number; status: string; next: string; excerpt: string; tags: string[];
};

export function SeriesScreen({ onOpenSermon }: { onOpenSermon: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [parts, setParts] = useState<Record<string, SeriesPart[]>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadSeries = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listSeries();
      setSeries(list);
      for (const s of list) {
        const p = await listSeriesParts(s.id);
        setParts(prev => ({ ...prev, [s.id]: p }));
      }
    } catch (err) {
      console.error("Error loading series:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  const seriesData: Serie[] = series.map(s => ({
    id: s.id,
    title: s.title,
    sub: `${s.scriptureReference || "Sin texto"} · ${s.totalParts} partes`,
    cover: s.coverStyle || "deck-hillsong",
    parts: s.totalParts,
    done: s.completedParts,
    status: s.status === "active" ? "En curso" : s.status === "completed" ? "Completada" : "Borrador",
    next: s.nextScheduledDate ? `Próximo: ${new Date(s.nextScheduledDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}` : "Sin fecha",
    excerpt: s.description || "Sin descripción",
    tags: s.tags || [],
  }));

  return (
    <div className="main">
      <TopBar
        title="Series"
        subtitle="Predica con arco · agrupa sermones que comparten texto, tema o estación"
        right={
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><IcSliders size={14} /> Filtros</button>
            <button className="btn btn-accent btn-sm" onClick={() => setModalOpen(true)}><IcPlus size={14} /> Nueva serie</button>
          </div>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 48px" }}>
        {loading ? (
          <div className="ui muted" style={{ textAlign: "center", padding: 40 }}>Cargando series...</div>
        ) : seriesData.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <p className="display" style={{ fontSize: 18, marginBottom: 8 }}>No hay series aún</p>
            <p className="ui muted" style={{ marginBottom: 16 }}>Crea tu primera serie para organizar tus sermones</p>
            <button className="btn btn-accent" onClick={() => setModalOpen(true)}><IcPlus size={14} /> Nueva serie</button>
          </div>
        ) : (
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 18 }}>
            {seriesData.map((s) => (
              <SeriesCard key={s.id} s={s} parts={parts[s.id] || []} onOpen={onOpenSermon}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)} 
                onDelete={async () => {
                  if (confirm("¿Eliminar esta serie?")) {
                    await deleteSeries(s.id);
                    loadSeries();
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
      {modalOpen && <NewSeriesModal onClose={() => setModalOpen(false)} onSaved={loadSeries} />}
    </div>
  );
}

const PART_TITLES: Record<string, string[]> = {
  beat: [
    "Bienaventurados los pobres en espíritu",
    "Bienaventurados los que lloran",
    "Bienaventurados los mansos",
    "Hambre y sed de justicia",
    "Bienaventurados los misericordiosos",
    "Bienaventurados los de limpio corazón",
    "Bienaventurados los pacificadores",
    "Bienaventurados los perseguidos",
    "Conclusión — sal y luz del mundo",
  ],
  gal: [
    "Introducción — otra doctrina",
    "Justificados por la fe",
    "La promesa y la ley",
    "Hijos y herederos",
    "Vivir por el Espíritu",
    "Conclusión — nueva creación",
  ],
};

function SeriesCard({ s, parts, onOpen, expanded, onToggle, onDelete }: { s: Serie; parts: SeriesPart[]; onOpen: () => void; expanded: boolean; onToggle: () => void; onDelete: () => void }) {
  const pct = Math.round((s.done / s.parts) * 100);
  const actualParts = parts.length > 0 ? parts : Array.from({ length: s.parts }, (_, i) => ({ 
    id: `p${i}`, partNumber: i + 1, title: PART_TITLES[s.id]?.[i] || `Parte ${i + 1}`, 
    scripture: "", scheduledDate: "", deliveredDate: "" 
  } as SeriesPart));

  return (
    <>
    <div className="series-card-grid" style={{
      padding: 22,
      border: "1px solid var(--line)",
      borderRadius: expanded ? "var(--r-lg) var(--r-lg) 0 0" : "var(--r-lg)",
      background: "var(--paper-2)",
    }}>
      <div className={"slide-tile " + s.cover} style={{ aspectRatio: "4/5", padding: 18, justifyContent: "space-between" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <small>Serie · {String(s.parts).padStart(2, "0")} partes</small>
          <span className="ui" style={{
            fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase",
            background: "rgba(255,255,255,.15)", padding: "2px 8px", borderRadius: 999,
            fontWeight: 600, color: "rgba(255,255,255,.9)",
          }}>{s.status}</span>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.1, fontWeight: 500 }}>
            {s.title}
          </div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 10, marginTop: 12,
            letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.7, fontWeight: 600,
          }}>{s.sub.split(" · ")[0]}</div>
        </div>
      </div>

      <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div className="row" style={{ gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {s.tags.map((t) => <span key={t} className="chip chip-accent" style={{ fontSize: 11 }}>{t}</span>)}
        </div>
        <h2 className="display" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.1, marginBottom: 4 }}>{s.title}</h2>
        <p className="ui muted" style={{ fontSize: 12.5, marginBottom: 12 }}>{s.sub}</p>
        <p className="serif" style={{ fontSize: 15.5, color: "var(--ink-2)", fontStyle: "italic", lineHeight: 1.55, marginBottom: 14, maxWidth: 620 }}>
          "{s.excerpt}"
        </p>

        <div className="row" style={{ gap: 4, marginBottom: 12 }}>
          {Array.from({ length: s.parts }).map((_, i) => (
            <div key={i} title={`Parte ${i + 1}`} style={{
              flex: 1, height: 8, borderRadius: 2,
              background: i < s.done ? "var(--accent)" :
                i === s.done ? "color-mix(in oklab, var(--accent) 35%, var(--paper-3))" :
                  "var(--paper-3)",
            }} />
          ))}
        </div>
        <div className="row" style={{ gap: 14, marginBottom: 16 }}>
          <span className="ui" style={{ fontSize: 12, color: "var(--ink-3)" }}>
            <strong style={{ color: "var(--ink)" }}>{s.done}/{s.parts}</strong> partes predicadas
          </span>
          <span className="ui muted" style={{ fontSize: 12 }}>·</span>
          <span className="ui muted" style={{ fontSize: 12 }}>{pct}% completado</span>
        </div>

        <div className="row" style={{ gap: 8, marginTop: "auto", justifyContent: "space-between" }}>
          <div className="ui muted" style={{ fontSize: 12 }}>
            <span className="eyebrow" style={{ marginRight: 8 }}>Próximo</span>
            {s.next}
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onToggle}>
              <IcEye size={14} /> Ver partes
              <IcChevronD size={12} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .15s", marginLeft: 2 }} />
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onOpen}><IcEdit size={14} /> Continuar</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onDelete} style={{ color: "var(--danger)" }}><IcClose size={14} /></button>
          </div>
        </div>
      </div>
    </div>

    {expanded && (
      <div style={{
        border: "1px solid var(--line)", borderTop: "none",
        borderRadius: "0 0 var(--r-lg) var(--r-lg)",
        background: "var(--paper)", padding: "16px 24px 20px", marginTop: -6,
      }}>
        <div className="eyebrow" style={{ marginBottom: 12, fontSize: 9.5 }}>Partes de la serie</div>
        <div className="col" style={{ gap: 0 }}>
          {actualParts.map((part, i) => {
            const done = part.deliveredDate != null;
            const next = !done && i === actualParts.findIndex(p => !p.deliveredDate);
            return (
              <div key={part.id || i} style={{
                display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 12, alignItems: "center",
                padding: "10px 0",
                borderBottom: i < actualParts.length - 1 ? "1px dashed var(--line-soft)" : "none",
                background: next ? "color-mix(in oklab, var(--accent) 3%, transparent)" : "transparent",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                  border: "1.5px solid " + (done ? "var(--accent)" : next ? "var(--accent)" : "var(--ink-4)"),
                  background: done ? "var(--accent)" : "transparent",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-ui)", fontSize: 9, fontWeight: 700,
                  color: done ? "#fff" : next ? "var(--accent)" : "var(--ink-4)",
                }}>
                  {done ? <IcCheck size={11} /> : String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="serif" style={{
                    fontSize: 13.5, lineHeight: 1.3,
                    color: done ? "var(--ink-3)" : "var(--ink)",
                    textDecoration: done ? "line-through" : "none",
                  }}>{part.title}</div>
                  {next && <div className="ui" style={{ fontSize: 10.5, color: "var(--accent)", fontWeight: 600, marginTop: 2 }}>Siguiente a predicar</div>}
                </div>
                {next && (
                  <button type="button" className="btn btn-accent btn-sm" onClick={onOpen} style={{ fontSize: 11 }}>
                    Abrir
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="row" style={{ gap: 8, marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
          <button type="button" className="btn btn-accent btn-sm" onClick={onOpen}>
            <IcPlus size={14} /> Nueva parte
          </button>
        </div>
      </div>
    )}
  </>
  );
}

function NewSeriesModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [scripture, setScripture] = useState("");
  const [totalParts, setTotalParts] = useState(4);
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const newSeries: Series = {
        id: newSeriesId(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        scriptureReference: scripture.trim(),
        coverStyle: "deck-hillsong",
        totalParts,
        completedParts: 0,
        status: "draft",
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveSeries(newSeries);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Error saving series:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "grid", placeItems: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: "var(--paper)", borderRadius: "var(--r-lg)",
        border: "1px solid var(--line)", padding: 32,
        maxWidth: 500, width: "90%",
      }} onClick={e => e.stopPropagation()}>
        <h2 className="display" style={{ fontSize: 22, marginBottom: 20 }}>Nueva serie</h2>
        <div className="col" style={{ gap: 16 }}>
          <div>
            <label className="ui" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Título *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Bienaventuranzas" style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "var(--r-md)", fontFamily: "var(--font-ui)" }} />
          </div>
          <div>
            <label className="ui" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Subtítulo</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ej: Mateo 5:1-12 · 9 partes" style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "var(--r-md)", fontFamily: "var(--font-ui)" }} />
          </div>
          <div>
            <label className="ui" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Texto bíblico</label>
            <input value={scripture} onChange={e => setScripture(e.target.value)} placeholder="Ej: Mateo 5-7" style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "var(--r-md)", fontFamily: "var(--font-ui)" }} />
          </div>
          <div>
            <label className="ui" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Breve descripción de la serie..." style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "var(--r-md)", fontFamily: "var(--font-body)", resize: "vertical" }} />
          </div>
          <div>
            <label className="ui" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Número de partes</label>
            <select value={totalParts} onChange={e => setTotalParts(Number(e.target.value))} style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "var(--r-md)", fontFamily: "var(--font-ui)" }}>
              {[3,4,5,6,7,8,9,10,12,15].map(n => <option key={n} value={n}>{n} partes</option>)}
            </select>
          </div>
        </div>
        <div className="row" style={{ gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancelar</button>
          <span style={{ flex: 1 }} />
          <button className="btn btn-accent" onClick={handleSave} disabled={!title.trim() || saving}>
            {saving ? "Guardando..." : "Crear serie"}
          </button>
        </div>
      </div>
    </div>
  );
}
