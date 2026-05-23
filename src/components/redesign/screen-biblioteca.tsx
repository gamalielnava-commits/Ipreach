"use client";
import React from "react";
import { TopBar } from "./shell";
import { SAVED } from "./data";
import { TypePill } from "./shared";
import { IcSearch, IcSliders, IcPlus, IcOutline, IcMenu, IcChevronD, IcSpark, IcArrowRight, IcDownload, IcSlide, IcEdit, IcMore } from "./icons";
import { listSermons } from "@/lib/store";
import type { Sermon } from "@/lib/types";

export function BibliotecaScreen({ onOpenSermon }: { onOpenSermon: (id: string) => void }) {
  const [sermons, setSermons] = React.useState<Sermon[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState("Todos");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const filters = ["Todos", "Sermón", "Devocional", "Clase"];

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listSermons();
        setSermons(data);
      } catch (err) {
        console.error("Error al cargar la biblioteca:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const safeData = sermons ?? [];
  const filtered = filter === "Todos"
    ? safeData
    : safeData.filter((s) => {
        const type = s.config?.contentType || "sermon";
        if (filter === "Sermón") return type.toLowerCase() === "sermon";
        return type.toLowerCase() === filter.toLowerCase();
      });

  if (loading) {
    return (
      <div className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div className="typing"><span></span><span></span><span></span></div>
      </div>
    );
  }

  if (!safeData.length) {
    return (
      <div className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p className="serif muted" style={{ fontSize: 16, fontStyle: "italic" }}>No hay sermones guardados aún. Ve a "Estudio" para preparar uno.</p>
      </div>
    );
  }

  return (
    <div className="main">
      <TopBar
        title="Biblioteca"
        subtitle={`${safeData.length} sermones guardados`}
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
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 18, gap: 8 }}>
            <div className="row chip-row" style={{ gap: 6, flex: 1, overflowX: "auto", paddingBottom: 2 }}>
              {filters.map((f) => (
                <button type="button" key={f}
                  className={"chip " + (filter === f ? "chip-on" : "")}
                  onClick={() => setFilter(f)}>
                  {f} <span className="ui" style={{ fontSize: 10, opacity: 0.65, marginLeft: 2 }}>
                    {f === "Todos" ? safeData.length : safeData.filter((s) => {
                      const type = s.config?.contentType || "sermon";
                      if (f === "Sermón") return type.toLowerCase() === "sermon";
                      return type.toLowerCase() === f.toLowerCase();
                    }).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="row" style={{ gap: 4 }}>
              <button type="button" className="btn-icon"
                onClick={() => setView("grid")}
                style={{ color: view === "grid" ? "var(--ink)" : "var(--ink-4)" }}>
                <IcOutline size={16} />
              </button>
              <button type="button" className="btn-icon"
                onClick={() => setView("list")}
                style={{ color: view === "list" ? "var(--ink)" : "var(--ink-4)" }}>
                <IcMenu size={16} />
              </button>
            </div>
          </div>

          <FeaturedCard sermon={filtered[0] || safeData[0]} onOpen={() => onOpenSermon((filtered[0] || safeData[0]).id)} />

          <div className="rule-fancy" style={{ margin: "28px 0 16px" }}>
            <span className="eyebrow">Recientes</span>
          </div>

          {view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {filtered.slice(1).map((s) => <LibCard key={s.id} sermon={s} onOpen={() => onOpenSermon(s.id)} />)}
            </div>
          ) : (
            <div className="col" style={{ gap: 10 }}>
              {filtered.slice(1).map((s) => <LibRow key={s.id} sermon={s} onOpen={() => onOpenSermon(s.id)} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ sermon, onOpen }: { sermon: Sermon; onOpen: () => void }) {
  const type = sermon.config?.contentType || "Sermón";
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const scripture = sermon.config?.scripture || sermon.config?.idea || "Sin cita";
  const excerpt = sermon.sermonText ? (sermon.sermonText.slice(0, 150) + "...") : "Sin contenido todavía.";
  const wordCount = sermon.sermonText ? sermon.sermonText.split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.round(wordCount / 130);

  return (
    <div className="featured-card" style={{
      background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 4%, var(--paper-2)) 0%, var(--paper-2) 100%)",
    }}>
      <div className="featured-thumb">
        <div className="lib-thumb" style={{ aspectRatio: "3/4" }}>
          <span>{sermon.title}</span>
          <div style={{
            position: "absolute", bottom: 10, left: 10, right: 10,
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 9, color: "var(--ink-3)", textAlign: "center",
          }}>{scripture}</div>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <TypePill type={typeLabel} />
          <span className="ui muted" style={{ fontSize: 11 }}>· {scripture}</span>
        </div>
        <h2 className="display" style={{ fontSize: 30, marginBottom: 8, lineHeight: 1.1 }}>{sermon.title}</h2>
        <p className="serif" style={{ fontSize: 15.5, color: "var(--ink-2)", maxWidth: 560, fontStyle: "italic", lineHeight: 1.5 }}>
          “{excerpt}”
        </p>
        <div className="meta-strip" style={{ marginTop: 14 }}>
          <div><strong>Método</strong> · {sermon.config?.method || "Ninguno"}</div>
          <div><strong>Marco</strong> · {sermon.config?.framework || "Ninguno"}</div>
          <div><strong>Duración</strong> · {readTime} min</div>
          <div><strong>Actualizado</strong> · {new Date(sermon.updatedAt).toLocaleDateString()}</div>
        </div>
        <div className="row featured-actions" style={{ gap: 8, marginTop: 16 }}>
          <button className="btn btn-accent" onClick={onOpen}>
            Continuar <IcArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LibCard({ sermon, onOpen }: { sermon: Sermon; onOpen: () => void }) {
  const type = sermon.config?.contentType || "Sermón";
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const scripture = sermon.config?.scripture || sermon.config?.idea || "Sin cita";
  const excerpt = sermon.sermonText ? (sermon.sermonText.slice(0, 120) + "...") : "Sin contenido todavía.";
  const wordCount = sermon.sermonText ? sermon.sermonText.split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.round(wordCount / 130);

  return (
    <button className="lib-card" onClick={onOpen}
      style={{ gridTemplateColumns: "1fr", padding: 18, alignItems: "stretch", textAlign: "left" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <TypePill type={typeLabel} />
          <span className="ui muted" style={{ fontSize: 11 }}>{new Date(sermon.updatedAt).toLocaleDateString()}</span>
        </div>
        <h3 className="display" style={{ fontSize: 20, lineHeight: 1.2 }}>{sermon.title}</h3>
        <p className="serif" style={{ fontSize: 14, color: "var(--ink-2)", fontStyle: "italic", lineHeight: 1.5, flex: 1 }}>
          “{excerpt}”
        </p>
        <div className="row" style={{ justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--line-soft)" }}>
          <span className="ui muted" style={{ fontSize: 11 }}>{scripture}</span>
          <span className="ui muted" style={{ fontSize: 11 }}>{readTime} min</span>
        </div>
      </div>
    </button>
  );
}

function LibRow({ sermon, onOpen }: { sermon: Sermon; onOpen: () => void }) {
  const type = sermon.config?.contentType || "Sermón";
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const scripture = sermon.config?.scripture || sermon.config?.idea || "Sin cita";
  const excerpt = sermon.sermonText ? (sermon.sermonText.slice(0, 100) + "...") : "Sin contenido todavía.";
  const wordCount = sermon.sermonText ? sermon.sermonText.split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.round(wordCount / 130);

  return (
    <button className="lib-card" onClick={onOpen}>
      <div className="lib-thumb">
        <span>{sermon.title}</span>
      </div>
      <div style={{ minWidth: 0, textAlign: "left", flex: 1 }}>
        <div className="row" style={{ gap: 10, marginBottom: 6 }}>
          <TypePill type={typeLabel} />
          <span className="ui muted" style={{ fontSize: 11 }}>{scripture}</span>
        </div>
        <h3 className="display" style={{ fontSize: 19, marginBottom: 4 }}>{sermon.title}</h3>
        <p className="serif" style={{ fontSize: 13.5, color: "var(--ink-2)", fontStyle: "italic" }}>
          “{excerpt}”
        </p>
        <div className="meta-strip" style={{ marginTop: 8 }}>
          <span>{sermon.config?.method || "Ninguno"}</span>
          <span>{sermon.config?.framework || "Ninguno"}</span>
          <span>{readTime} min</span>
        </div>
      </div>
      <div className="col" style={{ alignItems: "flex-end", gap: 6 }}>
        <span className="ui muted" style={{ fontSize: 11 }}>{new Date(sermon.updatedAt).toLocaleDateString()}</span>
      </div>
    </button>
  );
}
