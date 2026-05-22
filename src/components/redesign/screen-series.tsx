"use client";
import React from "react";
import { TopBar } from "./shell";
import { IcSliders, IcPlus, IcEye, IcEdit } from "./icons";

type Serie = {
  id: string; title: string; sub: string; cover: string;
  parts: number; done: number; status: string; next: string; excerpt: string; tags: string[];
};

export function SeriesScreen({ onOpenSermon }: { onOpenSermon: () => void }) {
  const series: Serie[] = [
    {
      id: "beat",
      title: "Bienaventuranzas",
      sub: "Mateo 5:1–12 · serie expositiva de 9 partes",
      cover: "deck-hillsong",
      parts: 9, done: 2,
      status: "En curso",
      next: "Bienaventurados los mansos · 24 May",
      excerpt: "Una serie sobre los gestos del corazón que reciben el reino. Cada parte es una bienaventuranza encarnada en la vida cotidiana.",
      tags: ["Reino", "Discipulado", "Ética del Sermón del Monte"],
    },
    {
      id: "gal",
      title: "Hijos de Dios — Gálatas",
      sub: "Carta a los Gálatas · 6 partes",
      cover: "deck-cine",
      parts: 6, done: 5,
      status: "Por terminar",
      next: "Conclusión — vivir por el Espíritu · 31 May",
      excerpt: "De la esclavitud a la herencia. Recorremos la carta de Pablo siguiendo el contraste entre ley y promesa.",
      tags: ["Gracia", "Ley y Evangelio", "Pablo"],
    },
    {
      id: "ps",
      title: "Salmos de ascensión",
      sub: "Salmos 120–134 · 15 partes",
      cover: "deck-realista",
      parts: 15, done: 0,
      status: "Borrador",
      next: "Empieza el 14 Jun",
      excerpt: "Los cánticos del peregrino. Un recorrido contemplativo por los quince salmos que se cantaban subiendo a Jerusalén.",
      tags: ["Salmos", "Peregrinaje", "Contemplativo"],
    },
  ];

  return (
    <div className="main">
      <TopBar
        title="Series"
        subtitle="Predica con arco · agrupa sermones que comparten texto, tema o estación"
        right={
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><IcSliders size={14} /> Filtros</button>
            <button className="btn btn-accent btn-sm"><IcPlus size={14} /> Nueva serie</button>
          </div>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 18 }}>
          {series.map((s) => <SeriesCard key={s.id} s={s} onOpen={onOpenSermon} />)}
        </div>
      </div>
    </div>
  );
}

function SeriesCard({ s, onOpen }: { s: Serie; onOpen: () => void }) {
  const pct = Math.round((s.done / s.parts) * 100);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      gap: 24,
      padding: 22,
      border: "1px solid var(--line)",
      borderRadius: "var(--r-lg)",
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
          “{s.excerpt}”
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
            <button className="btn btn-ghost btn-sm"><IcEye size={14} /> Ver partes</button>
            <button className="btn btn-ghost btn-sm" onClick={onOpen}><IcEdit size={14} /> Continuar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
