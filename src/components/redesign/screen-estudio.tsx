"use client";
import React from "react";
import { TopBar } from "./shell";
import { SUGGESTIONS, SAVED } from "./data";
import { ICONS, IcSpark, IcBook, IcBookmark, IcCross, IcChevron, IcSliders, IcUser, IcRefresh, IcCopy, IcShare, IcArrowUp, IcAttach, IcMic, IcClose } from "./icons";
import type { SermonConfig, Profile } from "@/lib/types";
import { listMessages, addMessage, createConversation } from "@/lib/chat";
import { saveSermon, newId } from "@/lib/store";

type Message = { role: "user" | "ai"; text: string; id: any };

export function EstudioScreen({
  activeConvId,
  setActiveConvId,
  onOpenSermon,
  onOpenFilters,
  config,
  onRefreshConvs,
  profile,
}: {
  activeConvId: string | null;
  setActiveConvId: (id: string) => void;
  onOpenSermon: (sermonId: string) => void;
  onOpenFilters: () => void;
  config: SermonConfig;
  onRefreshConvs: () => void;
  profile?: Profile | null;
}) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [loadingMsg, setLoadingMsg] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const [attachedFile, setAttachedFile] = React.useState<{ name: string; content: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isCreatingConversation = React.useRef(false);

  function handleAttachClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || ext === "docx" || ext === "doc") {
      alert("Por el momento, solo se soportan formatos de texto plano (.txt, .md, .json).");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setAttachedFile({ name: file.name, content: content || "" });
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  React.useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  React.useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    // Skip fetch when we just created this conversation — messages are already
    // tracked locally and the DB write may not have completed yet.
    if (isCreatingConversation.current) {
      isCreatingConversation.current = false;
      return;
    }
    (async () => {
      setLoadingMsg(true);
      try {
        const list = await listMessages(activeConvId);
        setMessages(list.map((m) => ({ role: m.role === "assistant" ? "ai" : "user", text: m.content, id: m.id })));
      } catch (err) {
        console.error("Error cargando mensajes:", err);
      } finally {
        setLoadingMsg(false);
      }
    })();
  }, [activeConvId]);
  async function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t && !attachedFile) return;

    let currentConvId = activeConvId;
    let promptToSend = t;
    let dbContent = t;

    if (attachedFile) {
      promptToSend = `${t}\n\n[Archivo adjunto: ${attachedFile.name}]\nContenido del archivo:\n${attachedFile.content}`;
      dbContent = t ? `${t} (Adjunto: ${attachedFile.name})` : `Adjuntó archivo: ${attachedFile.name}`;
      setAttachedFile(null);
    }

    if (!currentConvId) {
      try {
        setSending(true);
        const convTitle = t || `Archivo: ${attachedFile?.name || "Conversación"}`;
        const newConv = await createConversation(convTitle);
        currentConvId = newConv.id;
        isCreatingConversation.current = true;
        setActiveConvId(newConv.id);
        onRefreshConvs();
      } catch (err: any) {
        console.error("Error al crear conversación:", err);
        alert("Inicia sesión para poder utilizar el asistente.");
        setSending(false);
        return;
      }
    }

    const userMsgLocal = { role: "user" as const, text: dbContent, id: Date.now() };
    setMessages((m) => [...m, userMsgLocal]);
    setInput("");
    setSending(true);

    try {
      await addMessage(currentConvId, "user", dbContent);

      const chatHistory = [
        ...messages.map((m) => ({
          role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
          content: m.text,
        })),
        { role: "user" as const, content: promptToSend },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          messages: chatHistory,
        }),
      });

      if (!res.ok) {
        const errDetail = await res.json();
        throw new Error(errDetail.error || "Error al obtener respuesta de la IA.");
      }

      const data = await res.json();
      const aiText = data.text;

      await addMessage(currentConvId, "assistant", aiText);
      setMessages((m) => [...m, { role: "ai", text: aiText, id: Date.now() + 1 }]);
    } catch (err: any) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "ai", text: `Error: ${err.message || "No se pudo comunicar con el servidor."}`, id: Date.now() + 1 },
      ]);
    } finally {
      setSending(false);
    }
  }
  async function handleOpenAsSermon() {
    setSending(true);
    try {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.text || "Sermón Nuevo";

      const sermonConfig = {
        ...config,
        idea: lastUserMessage,
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "sermon",
          config: sermonConfig,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo generar el sermón.");
      }

      const { text: sermonText } = await res.json();

      const resOutline = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "outline",
          config: sermonConfig,
          sermonText,
        }),
      });

      let outlineText = "";
      if (resOutline.ok) {
        const outlineData = await resOutline.json();
        outlineText = outlineData.text;
      }

      const sermonId = newId();
      await saveSermon({
        id: sermonId,
        title: sermonConfig.idea.slice(0, 100),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        config: sermonConfig,
        sermonText,
        outlineText,
        slideDecks: [],
      });

      onOpenSermon(sermonId);
    } catch (err: any) {
      console.error(err);
      alert(`Error al generar el sermón: ${err.message}`);
    } finally {
      setSending(false);
    }
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
            <button className="btn btn-ghost btn-sm" onClick={onOpenFilters}>
              <IcUser size={14} /> {config.framework}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onOpenFilters}>
              <IcSpark size={14} /> {config.provider === "claude" ? "Claude · Opus" : "Gemini · Pro"}
            </button>
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {loadingMsg ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--ink-3)" }}>Cargando conversación...</div>
          ) : messages.length === 0 ? <EmptyState onPick={send} name={profile?.displayName} /> : (
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
                  <button className="btn btn-accent btn-sm" onClick={handleOpenAsSermon} disabled={sending}>
                    <IcBook size={14} /> Abrir como sermón
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    const lastUser = [...messages].reverse().find(m => m.role === "user")?.text;
                    if (lastUser) send(lastUser);
                  }}><IcRefresh size={14} /> Regenerar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    const lastAi = [...messages].reverse().find(m => m.role === "ai")?.text;
                    if (lastAi) navigator.clipboard.writeText(lastAi);
                  }}><IcCopy size={14} /> Copiar</button>
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
        config={config}
        attachedFile={attachedFile}
        setAttachedFile={setAttachedFile}
        onAttachClick={handleAttachClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".txt,.md,.pdf,.docx,.json"
      />
    </div>
  );
}

function EmptyState({ onPick, name }: { onPick: (text: string) => void; name?: string | null }) {
  const now = new Date();
  const hour = now.getHours();
  const greet = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const dayName = now.toLocaleDateString("es-MX", { weekday: "long" });
  const weekNum = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 86400000));
  const displayName = name?.split(" ")[0] ?? "Pastor";
  return (
    <div style={{ paddingTop: 24 }}>
      <div className="row" style={{ gap: 10, marginBottom: 6 }}>
        <span className="pill"><IcSpark size={11} /> Hoy es {dayName} · semana {weekNum}</span>
        <span className="pill pill-quiet">Próximo servicio · domingo 10:30</span>
      </div>
      <h1 className="display" style={{ fontSize: 44, margin: "8px 0 6px", fontWeight: 400 }}>
        {greet}, <span style={{ fontStyle: "italic", color: "var(--accent)" }}>{displayName}</span>.
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

function Composer({
  value,
  onChange,
  onSend,
  disabled,
  config,
  attachedFile,
  setAttachedFile,
  onAttachClick,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  config: SermonConfig;
  attachedFile?: { name: string } | null;
  setAttachedFile?: (f: null) => void;
  onAttachClick?: () => void;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = Math.min(200, ref.current.scrollHeight) + "px";
  }, [value]);

  return (
    <div className="composer">
      {attachedFile && (
        <div className="row" style={{
          background: "var(--paper-2)",
          border: "1px solid var(--line)",
          padding: "4px 8px",
          borderRadius: "var(--r-md)",
          margin: "0 16px 8px",
          alignSelf: "flex-start",
          gap: 6,
          fontSize: 12.5,
          color: "var(--ink-2)",
        }}>
          <IcAttach size={12} style={{ color: "var(--accent)" }} />
          <span className="serif" style={{ fontStyle: "italic", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {attachedFile.name}
          </span>
          <button type="button" onClick={() => setAttachedFile?.(null)} style={{ padding: 1, color: "var(--ink-4)", cursor: "pointer", background: "none", border: "none" }}>
            <IcClose size={12} />
          </button>
        </div>
      )}
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
          <button className="btn-icon" onClick={onAttachClick} title="Adjuntar"><IcAttach size={16} /></button>
          <button className="btn-icon" title="Pasaje bíblico"><IcBook size={16} /></button>
          <button className="btn-icon" title="Dictar"><IcMic size={16} /></button>
          <button
            className="btn btn-accent btn-sm"
            onClick={onSend}
            disabled={disabled || (!value.trim() && !attachedFile)}
            style={{ padding: "8px 12px", opacity: disabled || (!value.trim() && !attachedFile) ? 0.5 : 1 }}
            title="Enviar  ⌘↵">
            <IcArrowUp size={14} />
          </button>
        </div>
      </div>
      <div className="composer-chips muted">
        <span>Ajustes activos:</span>
        <span className="chip">{config.framework}</span>
        <span className="chip" style={{ textTransform: "capitalize" }}>{config.contentType}</span>
        <span className="chip" style={{ textTransform: "uppercase" }}>{config.method}</span>
        <span className="chip" style={{ textTransform: "capitalize" }}>{config.length === "medio" ? "Mediano" : config.length === "corto" ? "Corto" : "Largo"}</span>
        <span className="chip">{config.provider === "claude" ? "Claude" : "Gemini"}</span>
        <span className="spacer" style={{ flex: 1 }}></span>
        <span className="muted" style={{ fontSize: 11 }}>Enviar con <kbd>↵</kbd></span>
      </div>
    </div>
  );
}
