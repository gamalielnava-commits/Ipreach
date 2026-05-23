"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { slideDensities, slideStyles } from "@/lib/catalogs";
import { bibleVersions } from "@/lib/bible";
import { exportPptx, exportWord } from "@/lib/export";
import { slideImagePrompt } from "@/lib/prompt";
import { getSermon, newId, saveSermon } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import type { Sermon, SlideDeck, SlideDensity } from "@/lib/types";

type Tab = "sermon" | "bosquejo" | "diapositivas" | "imagenes" | "biblia";

const TAB_LABELS: Record<Tab, string> = {
  sermon: "Texto",
  bosquejo: "Bosquejo",
  diapositivas: "Diapositivas",
  imagenes: "Imagenes",
  biblia: "Biblia",
};

interface SocialImage {
  phrase: string;
  style: string;
  dataUrl: string;
}

export default function SermonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("sermon");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [styleSlug, setStyleSlug] = useState(slideStyles[0].slug);
  const [density, setDensity] = useState<SlideDensity>("mediana");
  const [phrases, setPhrases] = useState<string[]>([]);
  const [phrase, setPhrase] = useState("");
  const [imgStyle, setImgStyle] = useState(slideStyles[0].slug);
  const [socialImages, setSocialImages] = useState<SocialImage[]>([]);
  const [bibleRef, setBibleRef] = useState("");
  const [bibleVersion, setBibleVersion] = useState(bibleVersions[0].code);
  const [bibleResult, setBibleResult] = useState<{
    reference: string;
    text: string;
  } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      try {
        const s = await getSermon(params.id);
        if (active) setSermon(s);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Error.");
      }
      if (active) setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [params.id, router]);

  function persist(next: Sermon) {
    setSermon(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveSermon(next).catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo guardar."),
      );
    }, 1000);
  }

  async function persistNow(next: Sermon) {
    setSermon(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    try {
      await saveSermon(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    }
  }

  async function call(kind: string, extra: Record<string, unknown> = {}) {
    if (!sermon) return null;
    setError("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, config: sermon.config, ...extra }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al generar.");
    return data.text as string;
  }

  async function regenerate() {
    if (!sermon) return;
    setBusy("sermon");
    try {
      const text = await call("sermon");
      if (text) await persistNow({ ...sermon, sermonText: text });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    }
    setBusy("");
  }

  async function makeOutline() {
    if (!sermon) return;
    setBusy("bosquejo");
    try {
      const text = await call("outline", { sermonText: sermon.sermonText });
      if (text) await persistNow({ ...sermon, outlineText: text });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    }
    setBusy("");
  }

  async function makeSlides() {
    if (!sermon) return;
    setBusy("diapositivas");
    try {
      const text = await call("slides", {
        sermonText: sermon.sermonText,
        slideStyle: styleSlug,
        slideDensity: density,
      });
      if (text) {
        await persistNow({
          ...sermon,
          slideDecks: [
            {
              id: newId(),
              style: styleSlug,
              density,
              text,
              imagePrompt: slideImagePrompt(styleSlug, sermon.title),
              createdAt: new Date().toISOString(),
            },
            ...sermon.slideDecks,
          ],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    }
    setBusy("");
  }

  async function downloadWord() {
    if (!sermon) return;
    try {
      await exportWord(sermon);
    } catch {
      setError("No se pudo generar el archivo Word.");
    }
  }

  async function downloadPptx(deck: SlideDeck) {
    if (!sermon) return;
    try {
      await exportPptx(sermon, deck);
    } catch {
      setError("No se pudo generar el archivo PowerPoint.");
    }
  }

  async function suggestPhrases() {
    if (!sermon) return;
    setBusy("frases");
    try {
      const text = await call("phrases", { sermonText: sermon.sermonText });
      if (text) {
        const list = text
          .split("\n")
          .map((l) => l.replace(/^[\s\-*0-9.")]+/, "").trim())
          .filter((l) => l.length > 0);
        setPhrases(list);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    }
    setBusy("");
  }

  async function makeImage() {
    if (!phrase.trim()) {
      setError("Escribe o elige una frase para la imagen.");
      return;
    }
    setBusy("imagen");
    setError("");
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phrase, style: imgStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar la imagen.");
      setSocialImages((imgs) => [
        { phrase, style: imgStyle, dataUrl: data.image },
        ...imgs,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    }
    setBusy("");
  }

  function downloadImage(img: SocialImage) {
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = "imagen-redes.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function lookupVerse() {
    if (!bibleRef.trim()) {
      setError("Escribe una referencia, por ejemplo: Juan 3:16");
      return;
    }
    setBusy("biblia");
    setError("");
    setBibleResult(null);
    try {
      const res = await fetch("/api/bible", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reference: bibleRef, version: bibleVersion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al buscar el pasaje.");
      setBibleResult({ reference: data.reference, text: data.text });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    }
    setBusy("");
  }

  function insertVerse() {
    if (!sermon || !bibleResult) return;
    const block = `\n\n${bibleResult.reference} (${bibleVersion})\n"${bibleResult.text}"\n`;
    persistNow({ ...sermon, sermonText: sermon.sermonText + block });
    setTab("sermon");
  }

  if (!loaded)
    return <p className="p-6 text-sm text-stone-500">Cargando...</p>;
  if (!sermon)
    return (
      <div className="card mx-auto mt-6 max-w-md">
        <p className="text-stone-600">No se encontro este sermon.</p>
        <Link href="/" className="btn-ghost mt-3">
          Volver al chat
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pt-6 pb-20 md:pb-6">
      <div>
        <input
          className="w-full bg-transparent text-2xl font-bold text-stone-900 outline-none"
          value={sermon.title}
          onChange={(e) => persist({ ...sermon, title: e.target.value })}
        />
        <p className="text-sm text-stone-500">
          {sermon.config.scripture || "Sin texto base"}
        </p>
      </div>

      <div className="sticky top-14 z-10 -mx-4 flex gap-1 overflow-x-auto border-b border-stone-200 bg-white px-4">
        {(
          ["sermon", "bosquejo", "diapositivas", "imagenes", "biblia"] as Tab[]
        ).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {tab === "sermon" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={regenerate}
              disabled={busy !== ""}
              className="btn-ghost"
            >
              {busy === "sermon" ? "Regenerando..." : "Regenerar"}
            </button>
            <button onClick={downloadWord} className="btn-ghost">
              Descargar Word
            </button>
            <button
              onClick={() => window.open(`/sermon/${sermon.id}/print`, "_blank")}
              className="btn-ghost"
            >
              Descargar PDF
            </button>
            <span className="self-center text-xs text-stone-400">
              El texto se edita directamente y se guarda solo.
            </span>
          </div>
          <textarea
            className="field min-h-[28rem] font-serif leading-relaxed"
            value={sermon.sermonText}
            onChange={(e) => persist({ ...sermon, sermonText: e.target.value })}
          />
        </div>
      )}

      {tab === "bosquejo" && (
        <div className="space-y-3">
          <button
            onClick={makeOutline}
            disabled={busy !== ""}
            className="btn-primary"
          >
            {busy === "bosquejo"
              ? "Generando bosquejo..."
              : sermon.outlineText
                ? "Regenerar bosquejo"
                : "Generar bosquejo"}
          </button>
          {sermon.outlineText ? (
            <textarea
              className="field min-h-[24rem] leading-relaxed"
              value={sermon.outlineText}
              onChange={(e) => persist({ ...sermon, outlineText: e.target.value })}
            />
          ) : (
            <p className="text-sm text-stone-500">
              Genera el bosquejo a partir del sermon.
            </p>
          )}
        </div>
      )}

      {tab === "diapositivas" && (
        <div className="space-y-4">
          <div className="card space-y-3">
            <div>
              <label className="label">Estilo de diapositiva</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {slideStyles.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => setStyleSlug(s.slug)}
                    className={`rounded-lg border p-2 text-left text-sm ${
                      styleSlug === s.slug
                        ? "border-brand-600 bg-brand-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="block text-xs text-stone-500">
                      {s.example}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Densidad de contenido</label>
              <div className="flex flex-wrap gap-2">
                {slideDensities.map((d) => (
                  <button
                    type="button"
                    key={d.key}
                    onClick={() => setDensity(d.key)}
                    className={`chip ${
                      density === d.key ? "chip-on" : "chip-off"
                    }`}
                    title={d.description}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-stone-500">
                {slideDensities.find((d) => d.key === density)?.description}
              </p>
            </div>
            <button
              onClick={makeSlides}
              disabled={busy !== ""}
              className="btn-primary"
            >
              {busy === "diapositivas"
                ? "Generando diapositivas..."
                : "Generar diapositivas"}
            </button>
          </div>

          {sermon.slideDecks.map((deck) => (
            <div key={deck.id} className="card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-stone-700">
                  {slideStyles.find((s) => s.slug === deck.style)?.name} -{" "}
                  {deck.density}
                </p>
                <button
                  onClick={() => downloadPptx(deck)}
                  className="btn-ghost"
                >
                  Descargar PowerPoint
                </button>
              </div>
              <pre className="whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-sm">
                {deck.text}
              </pre>
              <details className="text-xs text-stone-500">
                <summary className="cursor-pointer">
                  Prompt de imagen para esta estetica
                </summary>
                <p className="mt-1">{deck.imagePrompt}</p>
              </details>
            </div>
          ))}
        </div>
      )}

      {tab === "imagenes" && (
        <div className="space-y-4">
          <div className="card space-y-3">
            <p className="text-sm text-stone-500">
              Genera imagenes para redes sociales con frases del sermon.
              Requiere Gemini configurado (GOOGLE_API_KEY).
            </p>
            <button
              onClick={suggestPhrases}
              disabled={busy !== ""}
              className="btn-ghost"
            >
              {busy === "frases"
                ? "Buscando frases..."
                : "Sugerir frases del sermon"}
            </button>
            {phrases.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {phrases.map((p, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setPhrase(p)}
                    className={`chip ${phrase === p ? "chip-on" : "chip-off"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            <div>
              <label className="label">Frase para la imagen</label>
              <textarea
                className="field"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="Escribe o elige una frase de arriba"
              />
            </div>
            <div>
              <label className="label">Estilo visual</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {slideStyles.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => setImgStyle(s.slug)}
                    className={`rounded-lg border p-2 text-left text-sm ${
                      imgStyle === s.slug
                        ? "border-brand-600 bg-brand-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="block text-xs text-stone-500">
                      {s.example}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={makeImage}
              disabled={busy !== ""}
              className="btn-primary"
            >
              {busy === "imagen" ? "Generando imagen..." : "Generar imagen"}
            </button>
          </div>

          {socialImages.map((img, i) => (
            <div key={i} className="card space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.dataUrl}
                alt={img.phrase}
                className="w-full max-w-md rounded-lg"
              />
              <p className="text-xs text-stone-500">{img.phrase}</p>
              <button
                onClick={() => downloadImage(img)}
                className="btn-ghost"
              >
                Descargar imagen
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "biblia" && (
        <div className="space-y-4">
          <div className="card space-y-3">
            <p className="text-sm text-stone-500">
              Busca un pasaje y agregalo al sermon. La version RV1909 es de
              dominio publico.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Referencia</label>
                <input
                  className="field"
                  value={bibleRef}
                  onChange={(e) => setBibleRef(e.target.value)}
                  placeholder="Ej. Juan 3:16 o Salmos 23"
                />
              </div>
              <div>
                <label className="label">Version</label>
                <select
                  className="field"
                  value={bibleVersion}
                  onChange={(e) => setBibleVersion(e.target.value)}
                >
                  {bibleVersions.map((v) => (
                    <option key={v.code} value={v.code}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={lookupVerse}
              disabled={busy !== ""}
              className="btn-primary"
            >
              {busy === "biblia" ? "Buscando..." : "Buscar pasaje"}
            </button>
          </div>

          {bibleResult && (
            <div className="card space-y-3">
              <p className="text-sm font-semibold text-brand-700">
                {bibleResult.reference} ({bibleVersion})
              </p>
              <p className="font-serif leading-relaxed text-stone-800">
                {bibleResult.text}
              </p>
              <button onClick={insertVerse} className="btn-ghost">
                Insertar en el sermon
              </button>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
