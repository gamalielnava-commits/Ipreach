"use client";
import React from "react";
import { TopBar } from "./shell";
import { SAVED, SavedSermon } from "./data";
import { TypePill } from "./shared";
import { IcSearch, IcSliders, IcPlus, IcOutline, IcMenu, IcChevronD, IcSpark, IcArrowRight, IcDownload, IcSlide, IcEdit, IcMore } from "./icons";

export function BibliotecaScreen({ onOpenSermon }: { onOpenSermon: () => void }) {
  const [filter, setFilter] = React.useState("Todos");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const filters = ["Todos", "Sermón", "Devocional", "Clase"];
  const filtered = filter === "Todos" ? SAVED : SAVED.filter((s) => s.type === filter);

  return (
    <div className="main">
      <TopBar
        title="Biblioteca"
        subtitle="24 piezas guardadas · 6 series · 142 versículos citados"
        right={
          <div className="row" style={{ gap: 6 }}>
            <div className="row" style={{
              gap: 6, padding: "4px 6px 4px 10px",
              border: "1px solid var(--line)", borderRadius: 8,
              background: "var(--paper-2)",
            }}>
              <IcSearch size={14} className="muted" />
              <input
                placeholder="Buscar sermones, pasajes, temas…"
                style={{ fontSize: 12, width: 240, padding: "6px 0" }}
              />
              <kbd>⌘K</kbd>
            </div>
            <button className="btn btn-ghost btn-sm"><IcSliders size={14} /> Filtros</button>
            <button className="btn btn-accent btn-sm"><IcPlus size={14} /> Nuevo</button>
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 18, gap: 8 }}>
            <div className="row chip-row" style={{ gap: 6, flex: 1, overflowX: "auto", paddingBottom: 2 }}>
              {filters.map((f) => (
                <button key={f}
                  className={"chip " + (filter === f ? "chip-on" : "")}
                  onClick={() => setFilter(f)}>
                  {f} <span className="ui" style={{ fontSize: 10, opacity: 0.65, marginLeft: 2 }}>
                    {f === "Todos" ? SAVED.length : SAVED.filter((s) => s.type === f).length}
                  </span>
                </button>
              ))}
              <span style={{ width: 1, height: 18, background: "var(--line)", margin: "0 4px" }} />
              <button className="chip">Esta semana</button>
              <button className="chip">Por marco</button>
              <button className="chip">Por ocasión</button>
            </div>
            <div className="row" style={{ gap: 4 }}>
              <button className="btn-icon"
                onClick={() => setView("grid")}
                style={{ color: view === "grid" ? "var(--ink)" : "var(--ink-4)" }}>
                <IcOutline size={16} />
              </button>
              <button className="btn-icon"
                onClick={() => setView("list")}
                style={{ color: view === "list" ? "var(--ink)" : "var(--ink-4)" }}>
                <IcMenu size={16} />
              </button>
              <span style={{ width: 1, height: 18, background: "var(--line)", margin: "0 4px" }} />
              <button className="btn-quiet" style={{ fontSize: 11.5 }}>
                Más recientes <IcChevronD size={12} />
              </button>
            </div>
          </div>

          <FeaturedCard sermon={SAVED[0]} onOpen={onOpenSermon} />

          <div className="rule-fancy" style={{ margin: "28px 0 16px" }}>
            <span className="eyebrow">Recientes</span>
          </div>

          {view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {filtered.slice(1).map((s) => <LibCard key={s.id} sermon={s} onOpen={onOpenSermon} />)}
            </div>
          ) : (
            <div className="col" style={{ gap: 10 }}>
              {filtered.slice(1).map((s) => <LibRow key={s.id} sermon={s} onOpen={onOpenSermon} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ sermon, onOpen }: { sermon: SavedSermon; onOpen: () => void }) {
  return (
    <div className="featured-card" style={{
      background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 4%, var(--paper-2)) 0%, var(--paper-2) 100%)",
    }}>
      <div className="featured-thumb">
        <div className="lib-thumb" style={{ aspectRatio: "3/4" }}>
          <span>El temor que se rinde a la fe</span>
          <div style={{
            position: "absolute", bottom: 10, left: 10, right: 10,
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 9, color: "var(--ink-3)", textAlign: "center",
          }}>Hebreos 11</div>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <TypePill type={sermon.type} />
          <span className="ui muted" style={{ fontSize: 11 }}>· {sermon.scripture}</span>
          <span className="pill"><IcSpark size={10} /> En curso</span>
        </div>
        <h2 className="display" style={{ fontSize: 30, marginBottom: 8, lineHeight: 1.1 }}>{sermon.title}</h2>
        <p className="serif" style={{ fontSize: 15.5, color: "var(--ink-2)", maxWidth: 560, fontStyle: "italic", lineHeight: 1.5 }}>
          “{sermon.excerpt}”
        </p>
        <div className="meta-strip" style={{ marginTop: 14 }}>
          <div><strong>Método</strong> · {sermon.method}</div>
          <div><strong>Marco</strong> · {sermon.framework}</div>
          <div><strong>Duración</strong> · {sermon.duration}</div>
          <div><strong>Actualizado</strong> · {sermon.updated}</div>
        </div>
        <div className="row featured-actions" style={{ gap: 8, marginTop: 16 }}>
          <button className="btn btn-accent" onClick={onOpen}>
            Continuar <IcArrowRight size={14} />
          </button>
          <button className="btn btn-ghost btn-sm">
            <IcDownload size={14} /> Exportar
          </button>
          <button className="btn btn-ghost btn-sm">
            <IcSlide size={14} /> Diapositivas
          </button>
          <span className="spacer" />
        </div>
      </div>
    </div>
  );
}

function LibCard({ sermon, onOpen }: { sermon: SavedSermon; onOpen: () => void }) {
  return (
    <button className="lib-card" onClick={onOpen}
      style={{ gridTemplateColumns: "1fr", padding: 18, alignItems: "stretch", textAlign: "left" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <TypePill type={sermon.type} />
          <span className="ui muted" style={{ fontSize: 11 }}>{sermon.updated}</span>
        </div>
        <h3 className="display" style={{ fontSize: 20, lineHeight: 1.2 }}>{sermon.title}</h3>
        <p className="serif" style={{ fontSize: 14, color: "var(--ink-2)", fontStyle: "italic", lineHeight: 1.5, flex: 1 }}>
          “{sermon.excerpt}”
        </p>
        <div className="row" style={{ justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--line-soft)" }}>
          <span className="ui muted" style={{ fontSize: 11 }}>{sermon.scripture}</span>
          <span className="ui muted" style={{ fontSize: 11 }}>{sermon.duration}</span>
        </div>
      </div>
    </button>
  );
}

function LibRow({ sermon, onOpen }: { sermon: SavedSermon; onOpen: () => void }) {
  return (
    <button className="lib-card" onClick={onOpen}>
      <div className="lib-thumb">
        <span>{sermon.title}</span>
      </div>
      <div style={{ minWidth: 0, textAlign: "left" }}>
        <div className="row" style={{ gap: 10, marginBottom: 6 }}>
          <TypePill type={sermon.type} />
          <span className="ui muted" style={{ fontSize: 11 }}>{sermon.scripture}</span>
        </div>
        <h3 className="display" style={{ fontSize: 19, marginBottom: 4 }}>{sermon.title}</h3>
        <p className="serif" style={{ fontSize: 13.5, color: "var(--ink-2)", fontStyle: "italic" }}>
          “{sermon.excerpt}”
        </p>
        <div className="meta-strip" style={{ marginTop: 8 }}>
          <span>{sermon.method}</span>
          <span>{sermon.framework}</span>
          <span>{sermon.duration}</span>
        </div>
      </div>
      <div className="col" style={{ alignItems: "flex-end", gap: 6 }}>
        <span className="ui muted" style={{ fontSize: 11 }}>{sermon.updated}</span>
        <div className="row" style={{ gap: 2 }}>
          <button className="btn-icon" onClick={(e) => e.stopPropagation()}><IcEdit size={14} /></button>
          <button className="btn-icon" onClick={(e) => e.stopPropagation()}><IcMore size={14} /></button>
        </div>
      </div>
    </button>
  );
}
