"use client";
import React from "react";
import { TopBar } from "./shell";
import { SUGGESTIONS, SAVED } from "./data";
import { ICONS, IcSpark, IcBook, IcBookmark, IcCross, IcChevron, IcSliders, IcUser, IcRefresh, IcCopy, IcShare, IcArrowUp, IcAttach, IcMic } from "./icons";

type Message = { role: "user" | "ai"; text: string; id: number };

export function EstudioScreen({ onOpenSermon, onOpenFilters }: { onOpenSermon: () => void; onOpenFilters: () => void }) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t, id: Date.now() }]);
    setInput("");
    setSending(true);
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "ai",
        text: `Trabajemos sobre eso. Aquí va una primera dirección:\n\nIdea central: ${t.toLowerCase().includes("fe") ? "La fe no es ausencia de temblor; es el suelo invisible que aparece bajo el pie justo cuando das el paso." : "Buscamos una sola idea, clara y memorable, que sostenga todo el mensaje."}\n\n¿Quieres que lo desarrolle como expositivo de Hebreos 11, o prefieres un tópico que cruce varios pasajes?`,
        id: Date.now() + 1,
      }]);
      setSending(false);
    }, 950);
  }

  return (
    <div className="main">
      <TopBar
        title="Estudio"
        subtitle="Una conversación con la Escritura, asistida"
        right={
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={onOpenFilters}>
              <IcSliders size={14} /> Filtros
              <span className="pill pill-quiet" style={{ marginLeft: 4 }}>7</span>
            </button>
            <button className="btn btn-ghost btn-sm">
              <IcUser size={14} /> Bautista
            </button>
            <button className="btn btn-ghost btn-sm">
              <IcSpark size={14} /> Claude · Opus
            </button>
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {messages.length === 0 ? <EmptyState onPick={send} /> : (
            <div className="col" style={{ gap: 16 }}>
              {messages.map((m) => (
                <div key={m.id} className={"bubble " + (m.role === "user" ? "bubble-user" : "bubble-ai")}>
                  {m.text}
                </div>
              ))}
              {sending && (
                <div className="bubble bubble-ai" style={{ display: "inline-flex", alignItems: "center", gap: 8, maxWidth: 100 }}>
                  <span className="typing"><span></span><span></span><span></span></span>
                </div>
              )}
              {!sending && messages.length >= 2 && (
                <div className="row" style={{ gap: 8, marginTop: 6 }}>
                  <button className="btn btn-accent btn-sm" onClick={onOpenSermon}>
                    <IcBook size={14} /> Abrir como sermón
                  </button>
                  <button className="btn btn-ghost btn-sm"><IcRefresh size={14} /> Regenerar</button>
                  <button className="btn btn-ghost btn-sm"><IcCopy size={14} /> Copiar</button>
                  <button className="btn btn-ghost btn-sm"><IcShare size={14} /> Compartir</button>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      <Composer
        value={input}
        onChange={setInput}
        onSend={() => send()}
        disabled={sending}
      />
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  return (
    <div style={{ paddingTop: 24 }}>
      <div className="row" style={{ gap: 10, marginBottom: 6 }}>
        <span className="pill"><IcSpark size={11} /> Hoy es jueves · semana 21</span>
        <span className="pill pill-quiet">Próximo servicio · domingo 10:30</span>
      </div>
      <h1 className="display" style={{ fontSize: 44, margin: "8px 0 6px", fontWeight: 400 }}>
        {greet}, <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Gamaliel</span>.
      </h1>
      <p className="serif muted" style={{ fontSize: 18, maxWidth: 560, lineHeight: 1.5 }}>
        ¿Qué quieres preparar hoy? Empieza con una idea, una cita, o elige una sugerencia.
      </p>

      <div className="rule-fancy" style={{ margin: "28px 0 14px" }}>
        <span className="eyebrow">Sugerencias para ti</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {SUGGESTIONS.map((s, i) => {
          const I = ICONS[s.icon] || IcSpark;
          return (
            <button key={i} className="sugg" onClick={() => onPick(s.title)}>
              <div className="sugg-icon"><I size={18} /></div>
              <div style={{ minWidth: 0 }}>
                <div className="sugg-title">{s.title}</div>
                <div className="sugg-sub">{s.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rule-fancy" style={{ margin: "30px 0 14px" }}>
        <span className="eyebrow">Continuar donde lo dejaste</span>
      </div>

      <div className="col" style={{ gap: 8 }}>
        {SAVED.slice(0, 3).map((s) => (
          <button key={s.id} className="sugg" style={{ padding: "12px 16px" }}>
            <div className="sugg-icon" style={{
              background: s.type === "Devocional" ? "color-mix(in oklab, var(--gilt) 14%, transparent)" :
                s.type === "Clase" ? "color-mix(in oklab, #2D6A9A 14%, transparent)" : undefined,
              color: s.type === "Devocional" ? "var(--gilt)" :
                s.type === "Clase" ? "#2D6A9A" : undefined,
            }}>
              {s.type === "Devocional" ? <IcBookmark size={16} /> :
                s.type === "Clase" ? <IcCross size={16} /> :
                  <IcBook size={16} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row" style={{ gap: 8 }}>
                <span className="sugg-title" style={{ fontSize: 15 }}>{s.title}</span>
              </div>
              <div className="sugg-sub">
                {s.scripture} · {s.duration} · actualizado {s.updated}
              </div>
            </div>
            <IcChevron size={16} className="muted" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Composer({ value, onChange, onSend, disabled }: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = Math.min(200, ref.current.scrollHeight) + "px";
  }, [value]);

  return (
    <div className="composer">
      <div className="composer-inner">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
          }}
          rows={1}
          placeholder="Empieza con una idea, una cita o un pasaje…"
        />
        <div className="row" style={{ gap: 4, paddingBottom: 4 }}>
          <button className="btn-icon" title="Adjuntar"><IcAttach size={16} /></button>
          <button className="btn-icon" title="Pasaje bíblico"><IcBook size={16} /></button>
          <button className="btn-icon" title="Dictar"><IcMic size={16} /></button>
          <button
            className="btn btn-accent btn-sm"
            onClick={onSend}
            disabled={disabled || !value.trim()}
            style={{ padding: "8px 12px", opacity: disabled || !value.trim() ? 0.5 : 1 }}
            title="Enviar  ⌘↵">
            <IcArrowUp size={14} />
          </button>
        </div>
      </div>
      <div className="composer-chips muted">
        <span>Ajustes activos:</span>
        <span className="chip">Bautista</span>
        <span className="chip">Expositivo</span>
        <span className="chip">Idea central · Robinson</span>
        <span className="chip">Mediano · 20–30 min</span>
        <span className="chip">RVR1960</span>
        <span className="spacer" style={{ flex: 1 }}></span>
        <span className="muted" style={{ fontSize: 11 }}>Enviar con <kbd>↵</kbd></span>
      </div>
    </div>
  );
}
