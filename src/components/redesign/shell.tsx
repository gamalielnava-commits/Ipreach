"use client";
import React from "react";
import { IcChat, IcBook, IcLibrary, IcPlus, IcSlide, IcCalendar, IcSettings, IcSpark } from "./icons";

export type Screen =
  | "estudio" | "biblioteca" | "sermon" | "series" | "planificador" | "movil" | "marca" | "perfil" | "planes";

export function Wordmark() {
  return (
    <div className="wordmark" style={{ padding: "18px 18px 14px" }}>
      <div className="col" style={{ lineHeight: 1, gap: 4 }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic", fontWeight: 500,
          fontSize: 32, letterSpacing: "-.018em",
          color: "var(--ink)", lineHeight: 1,
        }}>
          i<span style={{ color: "var(--accent)" }}>preach</span>
        </span>
        <span className="ui" style={{
          fontSize: 9, letterSpacing: ".22em",
          textTransform: "uppercase", color: "var(--ink-3)",
          fontWeight: 600,
        }}>
          predicación · estudio
        </span>
      </div>
    </div>
  );
}

type Conversation = { id: string; title: string; date?: string; active?: boolean; updatedAt?: string; createdAt?: string };

export function Sidebar({
  screen, setScreen, conversations, activeConv, setActiveConv, profile, open = false, onClose,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  conversations: Conversation[];
  activeConv: string;
  setActiveConv: (id: string) => void;
  profile?: { displayName: string; role: string } | null;
  open?: boolean;
  onClose?: () => void;
}) {
  const go = (s: Screen) => { setScreen(s); onClose?.(); };
  return (
    <aside className={"sidebar " + (open ? "open" : "")}>
      <Wordmark />

      <div style={{ padding: "0 12px 8px" }}>
        <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center" }}
          onClick={() => { setActiveConv("c1"); go("estudio"); }}>
          <IcPlus size={16} /> Nuevo estudio
        </button>
      </div>

      <div className="side-heading">Navegación</div>
      <nav style={{ padding: "0 12px" }}>
        <button className={"nav-item " + (screen === "estudio" ? "active" : "")} onClick={() => go("estudio")}>
          <IcChat size={16} /> Estudio
          <span className="spacer" />
          <kbd>⌘1</kbd>
        </button>
        <button className={"nav-item " + (screen === "biblioteca" ? "active" : "")} onClick={() => go("biblioteca")}>
          <IcLibrary size={16} /> Biblioteca
          <span className="spacer" />
          <span className="ui" style={{ fontSize: 11, color: "var(--ink-4)" }}>24</span>
        </button>
        <button className={"nav-item " + (screen === "sermon" ? "active" : "")} onClick={() => go("sermon")}>
          <IcBook size={16} /> Sermón actual
          <span className="spacer" />
        </button>
        <button className={"nav-item " + (screen === "series" ? "active" : "")} onClick={() => go("series")}>
          <IcSlide size={16} /> Series
          <span className="spacer" />
          <span className="ui" style={{ fontSize: 11, color: "var(--ink-4)" }}>3</span>
        </button>
        <button className={"nav-item " + (screen === "planificador" ? "active" : "")} onClick={() => go("planificador")}>
          <IcCalendar size={16} /> Planificador
          <span className="spacer" />
          <span className="pill" style={{ fontSize: 9, padding: "2px 6px" }}>Dom</span>
        </button>
        <button className={"nav-item " + (screen === "planes" ? "active" : "")} onClick={() => setScreen("planes")}>
          <IcSpark size={16} /> Planes
          <span className="spacer" />
          <span className="pill" style={{ fontSize: 9, padding: "2px 6px" }}>Pro</span>
        </button>
      </nav>

      <div className="side-heading row" style={{ justifyContent: "space-between", paddingRight: 12 }}>
        <span>Conversaciones</span>
        <button className="btn-quiet" style={{ padding: "1px 6px", fontSize: 10 }}>Ver todas</button>
      </div>
      <div style={{ padding: "0 12px", overflowY: "auto", flex: 1 }}>
        {conversations.map((c) => (
          <button key={c.id}
            className={"nav-item " + (activeConv === c.id ? "active" : "")}
            onClick={() => { setActiveConv(c.id); go("estudio"); }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: activeConv === c.id ? "var(--accent)" : "var(--ink-4)",
              flexShrink: 0,
            }} />
            <span style={{
              flex: 1, minWidth: 0, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{c.title}</span>
            <span className="ui" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
              {c.date || (c.updatedAt ? new Date(c.updatedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" }) : "")}
            </span>
          </button>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--line)", padding: 12 }}>
        <button type="button" className={"nav-item " + (screen === "perfil" ? "active" : "")} onClick={() => setScreen("perfil")}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gilt), var(--accent))",
            display: "grid", placeItems: "center",
            color: "var(--paper)", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600,
            flexShrink: 0,
          }}>
            {profile?.displayName ? profile.displayName.slice(0, 2).toUpperCase() : "?"}
          </div>
          <div className="col" style={{ lineHeight: 1.2, minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.displayName ?? "Perfil"}
            </span>
            <span className="ui" style={{ fontSize: 10.5, color: "var(--ink-4)", whiteSpace: "nowrap" }}>
              {profile?.role ? profile.role : "Configurar perfil"}
            </span>
          </div>
          <span className="spacer" />
          <IcSettings size={14} />
        </button>
      </div>
    </aside>
  );
}

export function TopBar({
  title, subtitle, right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="col" style={{ lineHeight: 1.1 }}>
        <span className="sec-title">{title}</span>
        {subtitle && <span className="ui muted" style={{ fontSize: 11.5, marginTop: 2 }}>{subtitle}</span>}
      </div>
      <span className="spacer" />
      {right}
    </header>
  );
}
