"use client";
import React from "react";
import { FRAMEWORKS_SHORT, THEMES_SAMPLE, COMMENTATORS, METHODS } from "./data";
import { IcBook, IcBookmark, IcCross, IcChevron, IcChevronD, IcClose, IcCheck } from "./icons";

export function FiltersRail({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [framework, setFramework] = React.useState("Bautista");
  const [length, setLength] = React.useState("mediano");
  const [method, setMethod] = React.useState("robinson");
  const [contentType, setContentType] = React.useState("sermon");
  const [themes, setThemes] = React.useState<string[]>(["Fe", "Temor"]);
  const [commentators, setCommentators] = React.useState<string[]>(["Tim Keller"]);
  const [provider, setProvider] = React.useState("claude");
  const [verseOpt, setVerseOpt] = React.useState("solo-cita");
  const [openSection, setOpenSection] = React.useState<Record<string, boolean>>({ themes: true, method: true });

  if (!open) return null;

  function toggle(list: string[], val: string, set: (v: string[]) => void) {
    set(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  }

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "color-mix(in oklab, var(--ink) 40%, transparent)",
        backdropFilter: "blur(2px)", zIndex: 50,
      }} />
      <aside style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 400, zIndex: 60,
        background: "var(--paper)", borderLeft: "1px solid var(--line)",
        boxShadow: "-20px 0 60px color-mix(in oklab, var(--ink) 18%, transparent)",
        display: "flex", flexDirection: "column",
      }}>
        <div className="row" style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
          <div className="col" style={{ lineHeight: 1.1 }}>
            <span className="eyebrow">Preparación</span>
            <span className="sec-title" style={{ fontSize: 22 }}>Filtros del sermón</span>
          </div>
          <span className="spacer" />
          <button className="btn btn-ghost btn-sm">Restablecer</button>
          <button className="btn-icon" onClick={onClose} style={{ marginLeft: 6 }}><IcClose size={16} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className="rail-section">
            <span className="eyebrow">¿Qué quieres preparar?</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 4 }}>
              {([
                ["sermon", "Sermón", IcBook],
                ["devocional", "Devocional", IcBookmark],
                ["clase", "Clase", IcCross],
              ] as [string, string, (p: { size?: number; style?: React.CSSProperties }) => React.JSX.Element][]).map(([k, n, I]) => (
                <button key={k}
                  onClick={() => setContentType(k)}
                  style={{
                    padding: "10px 8px",
                    border: "1px solid " + (contentType === k ? "var(--ink)" : "var(--line)"),
                    borderRadius: "var(--r-md)",
                    background: contentType === k ? "var(--paper)" : "var(--paper-2)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}>
                  <I size={18} style={{ color: contentType === k ? "var(--accent)" : "var(--ink-3)", marginBottom: 4 }} />
                  <div className="ui" style={{ fontSize: 12, fontWeight: 600 }}>{n}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rail-section">
            <span className="eyebrow">Marco doctrinal</span>
            <select className="field" value={framework} onChange={(e) => setFramework(e.target.value)}>
              {FRAMEWORKS_SHORT.map((f) => <option key={f}>{f}</option>)}
            </select>
            <p className="serif muted" style={{ fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
              Énfasis bautista · autoridad de la Escritura · salvación por gracia · seguridad eterna.
            </p>
          </div>

          <div className="rail-section">
            <span className="eyebrow">Tipo de sermón · máx. 2</span>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {["Expositivo", "Textual", "Temático", "Narrativo", "Biográfico", "Doctrinal", "Devocional", "Evangelístico"].map((t) => (
                <button key={t} className={"chip " + (t === "Expositivo" ? "chip-on" : "")}>{t}</button>
              ))}
            </div>
          </div>

          <Collapsible title="Método de preparación" open={openSection.method}
            onToggle={() => setOpenSection((o) => ({ ...o, method: !o.method }))}>
            <div className="col" style={{ gap: 6 }}>
              {METHODS.slice(0, 5).map((m) => (
                <button key={m.slug}
                  onClick={() => setMethod(m.slug)}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    border: "1px solid " + (method === m.slug ? "var(--accent)" : "var(--line)"),
                    background: method === m.slug ? "color-mix(in oklab, var(--accent) 6%, var(--paper-2))" : "var(--paper-2)",
                    borderRadius: "var(--r-md)",
                    cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: "16px 1fr",
                    gap: 10,
                    alignItems: "flex-start",
                  }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: "1.5px solid " + (method === m.slug ? "var(--accent)" : "var(--ink-4)"),
                    background: method === m.slug ? "var(--accent)" : "transparent",
                    marginTop: 3,
                    boxShadow: method === m.slug ? "inset 0 0 0 2px var(--paper)" : "none",
                  }} />
                  <div>
                    <div className="ui" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{m.name}</div>
                    <div className="ui muted" style={{ fontSize: 11.5, marginTop: 2 }}>{m.sub}</div>
                  </div>
                </button>
              ))}
              <button className="btn-quiet" style={{ fontSize: 11, alignSelf: "flex-start", marginTop: 4 }}>
                Ver los 9 métodos <IcChevron size={12} />
              </button>
            </div>
          </Collapsible>

          <Collapsible title="Temas" open={openSection.themes}
            onToggle={() => setOpenSection((o) => ({ ...o, themes: !o.themes }))}>
            {THEMES_SAMPLE.map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div className="eyebrow" style={{ marginBottom: 6, fontSize: 9.5 }}>{cat}</div>
                <div className="row" style={{ gap: 5, flexWrap: "wrap" }}>
                  {items.map((t) => (
                    <button key={t} className={"chip " + (themes.includes(t) ? "chip-on" : "")}
                      onClick={() => toggle(themes, t, setThemes)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Collapsible>

          <Collapsible title="Comentaristas">
            <div className="row" style={{ gap: 5, flexWrap: "wrap" }}>
              {COMMENTATORS.map((c) => (
                <button key={c} className={"chip " + (commentators.includes(c) ? "chip-on" : "")}
                  onClick={() => toggle(commentators, c, setCommentators)}>
                  {c}
                </button>
              ))}
            </div>
          </Collapsible>

          <div className="rail-section">
            <span className="eyebrow">Longitud y versículos</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 4, marginBottom: 14 }}>
              {([
                ["corto", "Corto", "10–15 min"],
                ["mediano", "Mediano", "20–30 min"],
                ["largo", "Largo", "35–45 min"],
              ] as [string, string, string][]).map(([k, n, d]) => (
                <button key={k}
                  onClick={() => setLength(k)}
                  style={{
                    padding: "10px 8px",
                    border: "1px solid " + (length === k ? "var(--ink)" : "var(--line)"),
                    borderRadius: "var(--r-md)",
                    background: length === k ? "var(--paper)" : "var(--paper-2)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}>
                  <div className="ui" style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
                  <div className="ui muted" style={{ fontSize: 10.5, marginTop: 2 }}>{d}</div>
                </button>
              ))}
            </div>
            <div className="row" style={{ gap: 6 }}>
              {([["solo-cita", "Solo la cita"], ["texto-completo", "Texto completo"]] as [string, string][]).map(([k, n]) => (
                <button key={k}
                  onClick={() => setVerseOpt(k)}
                  className={"chip " + (verseOpt === k ? "chip-on" : "")}
                  style={{ flex: 1, justifyContent: "center" }}>{n}</button>
              ))}
            </div>
          </div>

          <div className="rail-section" style={{ borderBottom: 0 }}>
            <span className="eyebrow">Modelo de IA</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
              {([
                ["claude", "Claude · Opus", "Profundo y matizado"],
                ["gemini", "Gemini · Pro", "Rápido y visual"],
              ] as [string, string, string][]).map(([k, n, d]) => (
                <button key={k}
                  onClick={() => setProvider(k)}
                  style={{
                    padding: "12px",
                    border: "1px solid " + (provider === k ? "var(--accent)" : "var(--line)"),
                    background: provider === k ? "color-mix(in oklab, var(--accent) 6%, var(--paper-2))" : "var(--paper-2)",
                    borderRadius: "var(--r-md)",
                    textAlign: "left",
                    cursor: "pointer",
                  }}>
                  <div className="ui" style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
                  <div className="ui muted" style={{ fontSize: 11, marginTop: 2 }}>{d}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: 18, borderTop: "1px solid var(--line)" }}>
          <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center" }}
            onClick={onClose}>
            <IcCheck size={16} /> Aplicar filtros · 7 activos
          </button>
        </div>
      </aside>
    </>
  );
}

function Collapsible({ title, open: openIn, onToggle, children }: {
  title: string;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(openIn ?? false);
  const isOpen = onToggle ? openIn : open;
  const handle = onToggle ?? (() => setOpen((o) => !o));
  return (
    <div className="rail-section">
      <button onClick={handle} style={{
        display: "flex", width: "100%", alignItems: "center",
        marginBottom: isOpen ? 10 : 0, cursor: "pointer",
      }}>
        <span className="eyebrow">{title}</span>
        <span className="spacer" />
        <IcChevronD size={14}
          style={{ color: "var(--ink-4)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
