"use client";
import React from "react";
import { TopBar } from "./shell";
import { IcCalendar, IcPlus, IcChevron, IcEye } from "./icons";

type CalEvent = { kind: string; title: string; scripture: string; color: string };

export function PlanificadorScreen() {
  const [view, setView] = React.useState("mes");
  const [year, setYear] = React.useState(2026);
  const [month, setMonth] = React.useState(4); // May

  const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const events: Record<string, CalEvent[]> = {
    "2026-5-3": [{ kind: "Dominical", title: "Hijos de la promesa", scripture: "Gálatas 4:21–31", color: "var(--accent)" }],
    "2026-5-7": [{ kind: "Juventud", title: "Identidad", scripture: "Ef 1:3–14", color: "#2D6A9A" }],
    "2026-5-10": [{ kind: "Día de la Madre", title: "Madres que sostienen ríos", scripture: "Éxodo 2:1–10", color: "var(--gilt)" }],
    "2026-5-14": [{ kind: "Mujeres", title: "Ester · esquema", scripture: "Est 4", color: "#2D6A9A" }],
    "2026-5-17": [{ kind: "Dominical · serie", title: "Bienaventurados los que lloran", scripture: "Mateo 5:4", color: "var(--accent)" }],
    "2026-5-21": [{ kind: "Bautismos", title: "Servicio de bautismos", scripture: "Mt 28:18–20", color: "var(--gilt)" }],
    "2026-5-24": [{ kind: "Dominical · serie", title: "Bienaventurados los mansos", scripture: "Mateo 5:5", color: "var(--accent)" }],
    "2026-5-29": [{ kind: "Discipulado", title: "Permanecer en oración", scripture: "Lc 11:1–13", color: "#2D6A9A" }],
    "2026-5-31": [{ kind: "Dominical · serie", title: "Bienaventurados los que tienen hambre y sed de justicia", scripture: "Mateo 5:6", color: "var(--accent)" }],
  };

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function dateKey(d: number) { return `${year}-${month + 1}-${d}`; }

  function changeMonth(delta: number) {
    let m = month + delta, y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m); setYear(y);
  }

  return (
    <div className="main">
      <TopBar
        title="Planificador"
        subtitle="Calendario de predicación · series, ocasiones y servicios"
        right={
          <div className="row" style={{ gap: 6 }}>
            <div className="row" style={{ gap: 0, border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden", background: "var(--paper-2)" }}>
              {["año", "mes", "sem"].map((v) => (
                <button key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "6px 12px", fontFamily: "var(--font-ui)", fontSize: 12,
                    background: view === v ? "var(--ink)" : "transparent",
                    color: view === v ? "var(--paper)" : "var(--ink-3)",
                    textTransform: "capitalize",
                    borderRight: v !== "sem" ? "1px solid var(--line)" : "none",
                  }}>{v}</button>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm"><IcCalendar size={14} /> Hoy</button>
            <button className="btn btn-accent btn-sm"><IcPlus size={14} /> Programar</button>
          </div>
        }
      />

      <div className="plan-grid" style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "20px 28px", overflowY: "auto" }}>
          <div className="row" style={{ marginBottom: 14 }}>
            <button className="btn-icon" onClick={() => changeMonth(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <h2 className="display" style={{ fontSize: 26, margin: "0 12px", fontWeight: 500 }}>
              {MONTHS[month]} <span style={{ color: "var(--ink-3)" }}>{year}</span>
            </h2>
            <button className="btn-icon" onClick={() => changeMonth(1)}><IcChevron size={16} /></button>
            <span className="spacer" />
            <div className="row" style={{ gap: 14, fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--ink-3)" }}>
              <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)" }} />Dominical</span>
              <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--gilt)" }} />Ocasión</span>
              <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#2D6A9A" }} />Grupo / clase</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 6 }}>
            {DAYS.map((d) => (
              <div key={d} className="eyebrow" style={{ padding: "6px 8px", fontSize: 9.5 }}>{d}</div>
            ))}
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1, background: "var(--line)", border: "1px solid var(--line)",
            borderRadius: "var(--r-md)", overflow: "hidden",
          }}>
            {cells.map((d, i) => {
              const k = d ? dateKey(d) : null;
              const evs: CalEvent[] = k ? (events[k] || []) : [];
              const isToday = d != null && year === 2026 && month === 4 && d === 22;
              return (
                <div key={i} style={{
                  background: d ? "var(--paper)" : "color-mix(in oklab, var(--paper) 50%, var(--paper-2))",
                  minHeight: 96, padding: 8,
                  display: "flex", flexDirection: "column", gap: 4,
                  position: "relative",
                }}>
                  {d && (
                    <span style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 12, fontWeight: 600,
                      color: isToday ? "var(--paper)" : "var(--ink-2)",
                      background: isToday ? "var(--accent)" : "transparent",
                      width: 22, height: 22, borderRadius: 999,
                      display: "grid", placeItems: "center",
                      alignSelf: "flex-start",
                    }}>{d}</span>
                  )}
                  {evs.map((e, ei) => (
                    <div key={ei} style={{
                      borderLeft: `2px solid ${e.color}`,
                      padding: "3px 6px",
                      background: `color-mix(in oklab, ${e.color} 8%, transparent)`,
                      borderRadius: 4,
                      fontFamily: "var(--font-ui)", fontSize: 10.5,
                      color: "var(--ink)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis" }}>{e.scripture}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <aside style={{
          borderLeft: "1px solid var(--line)",
          background: "color-mix(in oklab, var(--paper) 40%, var(--paper-2))",
          overflowY: "auto",
        }}>
          <div className="rail-section">
            <span className="eyebrow">Próximo servicio</span>
            <div className="card" style={{
              marginTop: 10, padding: 18,
              background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 6%, var(--paper-2)) 0%, var(--paper-2) 100%)",
            }}>
              <div className="row" style={{ marginBottom: 6 }}>
                <span className="pill"><IcCalendar size={10} /> Domingo · 24 May</span>
                <span className="spacer" />
                <span className="ui muted" style={{ fontSize: 11 }}>en 2 días</span>
              </div>
              <h3 className="display" style={{ fontSize: 20, lineHeight: 1.15, marginBottom: 6 }}>
                Bienaventurados los mansos
              </h3>
              <p className="ui muted" style={{ fontSize: 12 }}>Mateo 5:5 · serie Bienaventuranzas · 2/9</p>
              <div className="row" style={{ gap: 6, marginTop: 14 }}>
                <button className="btn btn-accent btn-sm" style={{ flex: 1, justifyContent: "center" }}>Abrir sermón</button>
                <button className="btn btn-ghost btn-sm"><IcEye size={14} /></button>
              </div>
            </div>
          </div>

          <div className="rail-section">
            <span className="eyebrow">Series activas</span>
            <div className="col" style={{ gap: 8, marginTop: 10 }}>
              {[
                { name: "Bienaventuranzas", count: "2 / 9", done: 22 },
                { name: "Hijos de Dios — Gálatas", count: "5 / 6", done: 83 },
                { name: "Salmos de ascensión", count: "0 / 15", done: 0 },
              ].map((s) => (
                <div key={s.name} style={{ padding: "10px 12px", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                  <div className="row" style={{ marginBottom: 6 }}>
                    <span className="ui" style={{ fontSize: 12.5, fontWeight: 600 }}>{s.name}</span>
                    <span className="spacer" />
                    <span className="ui muted" style={{ fontSize: 11 }}>{s.count}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--paper-3)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.done}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              ))}
              <button className="btn-quiet" style={{ justifyContent: "flex-start", padding: "6px 0" }}>
                <IcPlus size={12} /> Nueva serie
              </button>
            </div>
          </div>

          <div className="rail-section">
            <span className="eyebrow">Ocasiones próximas</span>
            <div className="col" style={{ marginTop: 8 }}>
              {([
                ["31 May", "Pentecostés"],
                ["07 Jun", "Día del padre · MX"],
                ["21 Jun", "Día del padre · US"],
                ["02 Ago", "Aniversario de la iglesia"],
              ] as [string, string][]).map(([d, n]) => (
                <div key={n} className="row" style={{ padding: "8px 0", borderBottom: "1px dashed var(--line-soft)" }}>
                  <span className="ui" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, letterSpacing: ".08em", minWidth: 56 }}>{d}</span>
                  <span className="ui" style={{ fontSize: 12.5 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
