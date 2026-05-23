"use client";
import React from "react";
import { TYPE_BADGE } from "./data";

export function TypePill({ type }: { type: string }) {
  const t = TYPE_BADGE[type] || TYPE_BADGE["Sermón"];
  return (
    <span className="ui" style={{
      fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase",
      color: t.color, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: t.color }} />
      {t.label}
    </span>
  );
}

export function SectionHead({ roman, kicker, title }: { roman?: string; kicker: string; title?: string }) {
  return (
    <header style={{ margin: "30px 0 12px" }}>
      <div className="row" style={{ gap: 12, marginBottom: 6 }}>
        {roman && <span className="display" style={{
          fontStyle: "italic", color: "var(--accent)", fontSize: 22, fontWeight: 500,
        }}>{roman}</span>}
        <span className="eyebrow">{kicker}</span>
      </div>
      {title && <h3 className="display" style={{ fontSize: 24, fontWeight: 500 }}>{title}</h3>}
    </header>
  );
}
