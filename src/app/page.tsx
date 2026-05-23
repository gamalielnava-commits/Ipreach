"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import FiltersPanel from "@/components/FiltersPanel";
import { frameworks } from "@/lib/catalogs";
import {
  addMessage,
  createConversation,
  deleteConversation,
  listConversations,
  listMessages,
} from "@/lib/chat";
import { getProfile } from "@/lib/profile";
import { newId, saveSermon } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import type {
  ChatMessage,
  Conversation,
  Profile,
  SermonConfig,
} from "@/lib/types";

const SUGGESTIONS = [
  "Preparame un sermon sobre la fe que vence el temor",
  "Escribe una reflexion devocional sobre el Salmo 23",
  "Prepara una clase de discipulado sobre la oracion",
  "Dame ideas para predicar el Dia de la Madre",
];

function configFromProfile(p: Profile): SermonConfig {
  const d = p.defaults || {};
  return {
    contentType: "sermon",
    idea: "",
    scripture: "",
    framework: p.framework || frameworks[0].slug,
    doctrinalThemes: [],
    themes: d.themes ?? [],
    occasion: d.occasion ?? "",
    sermonTypes: d.sermonTypes ?? ["expositivo"],
    strategy: d.strategy ?? "idea-central",
    method: d.method ?? "peica",
    commentators: d.commentators ?? [],
    illustrationKinds: d.illustrationKinds ?? [],
    length: d.length ?? "medio",
    verseOption: d.verseOption ?? "solo-cita",
    provider: d.provider ?? "claude",
  };
}

function clean(s: string): string {
  return s.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");
}

function MessageText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h) {
          return (
            <p key={i} className="mt-2 font-bold">
              {clean(h[2])}
            </p>
          );
        }
        const b = line.match(/^\s*[-*]\s+(.*)$/);
        if (b) {
          return (
            <p key={i} className="ml-3">
              {"• "}
              {clean(b[1])}
            </p>
          );
        }
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <p key={i}>{clean(line)}</p>;
      })}
    </>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [config, setConfig] = useState<SermonConfig | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const p = await getProfile();
      if (!p || !p.onboarded) {
        router.replace("/onboarding");
        return;
      }
      setProfile(p);
      setConfig(configFromProfile(p));
      try {
        const convs = await listConversations();
        setConversations(convs);
        if (convs.length > 0) {
          setActiveId(convs[0].id);
          setMessages(await listMessages(convs[0].id));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error.");
      }
      setReady(true);
    })();
  }, [router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function openConversation(id: string) {
    setActiveId(id);
    setShowSidebar(false);
    try {
      setMessages(await listMessages(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error.");
    }
  }

  function newChat() {
    setActiveId(null);
    setMessages([]);
    setShowSidebar(false);
  }

  async function removeConversation(id: string) {
    if (!confirm("Eliminar esta conversacion?")) return;
    await deleteConversation(id);
    const convs = await listConversations();
    setConversations(convs);
    if (activeId === id) newChat();
  }

  async function send(text: string) {
    if (!text.trim() || sending || !config) return;
    setSending(true);
    setError("");
    setInput("");
    const userMsg: ChatMessage = {
      id: "tmp-" + Date.now(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    const history = [...messages, userMsg];
    setMessages(history);

    try {
      let convId = activeId;
      if (!convId) {
        const conv = await createConversation(text);
        convId = conv.id;
        setActiveId(convId);
        setConversations(await listConversations());
      }
      await addMessage(convId, "user", text);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          config,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error del asistente.");
      const saved = await addMessage(convId, "assistant", data.text);
      setMessages([...history, saved]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error.");
    }
    setSending(false);
  }

  async function saveAsSermon(content: string) {
    if (!config) return;
    const id = newId();
    const now = new Date().toISOString();
    const title =
      clean(
        content.split("\n").find((l) => l.trim()) || "Sermon",
      )
        .replace(/^#+\s*/, "")
        .slice(0, 70) || "Sermon";
    try {
      await saveSermon({
        id,
        title,
        createdAt: now,
        updatedAt: now,
        config,
        sermonText: content,
        outlineText: "",
        slideDecks: [],
      });
      router.push(`/sermon/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    }
  }

  if (!ready || !config) {
    return <p className="p-6 text-sm text-stone-500">Cargando...</p>;
  }

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] flex-col md:h-[calc(100dvh-3.5rem)]">
      <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-3 py-2">
        <button
          onClick={() => setShowSidebar(true)}
          className="btn-ghost px-2.5 py-1.5"
          aria-label="Conversaciones"
        >
          Chats
        </button>
        <button onClick={newChat} className="btn-ghost px-2.5 py-1.5">
          + Nuevo
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowFilters(true)}
          className="btn-primary px-3 py-1.5"
        >
          Filtros
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-stone-50 px-3 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.length === 0 && (
            <div className="space-y-4 pt-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-2xl font-bold text-white">
                I
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Hola{profile?.displayName ? `, ${profile.displayName}` : ""}
                </h2>
                <p className="text-sm text-stone-500">
                  Preguntame lo que quieras, o pideme un sermon, una reflexion
                  devocional o una clase de discipulado.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-left">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 shadow-sm hover:border-brand-400"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="bubble-user">
                {m.content}
              </div>
            ) : (
              <div key={m.id} className="space-y-2">
                <div className="bubble-ai">
                  <MessageText text={m.content} />
                </div>
                {m.content.length > 400 && (
                  <button
                    onClick={() => saveAsSermon(m.content)}
                    className="btn-ghost ml-1 px-3 py-1.5 text-xs"
                  >
                    Guardar y abrir (diapositivas, imagenes, exportar)
                  </button>
                )}
              </div>
            ),
          )}

          {sending && (
            <div className="bubble-ai text-stone-400">Escribiendo...</div>
          )}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-stone-200 bg-white p-3">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            rows={1}
            className="field max-h-32 min-h-[2.75rem] flex-1 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Escribe un mensaje..."
          />
          <button
            onClick={() => send(input)}
            disabled={sending || !input.trim()}
            className="btn-primary"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Sidebar de conversaciones */}
      <div className={`fixed inset-0 z-40 ${showSidebar ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setShowSidebar(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            showSidebar ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <h2 className="font-bold text-stone-900">Conversaciones</h2>
            <button onClick={newChat} className="text-sm text-brand-700">
              + Nuevo
            </button>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {conversations.length === 0 && (
              <p className="p-3 text-sm text-stone-400">Aun no hay chats.</p>
            )}
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`flex items-center gap-2 rounded-lg px-2 ${
                  activeId === c.id ? "bg-brand-50" : ""
                }`}
              >
                <button
                  onClick={() => openConversation(c.id)}
                  className="flex-1 truncate py-2 text-left text-sm text-stone-700"
                >
                  {c.title}
                </button>
                <button
                  onClick={() => removeConversation(c.id)}
                  className="text-xs text-stone-400 hover:text-red-600"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 p-3">
            <Link
              href="/sermones"
              className="btn-ghost w-full justify-center"
            >
              Mis sermones guardados
            </Link>
          </div>
        </div>
      </div>

      <FiltersPanel
        config={config}
        onChange={setConfig}
        open={showFilters}
        onClose={() => setShowFilters(false)}
      />
      <BottomNav />
    </div>
  );
}
