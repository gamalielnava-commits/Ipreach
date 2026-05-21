"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { slideDensities, slideStyles } from "@/lib/catalogs";
import { exportPptx, exportWord } from "@/lib/export";
import { slideImagePrompt } from "@/lib/prompt";
import { getSermon, newId, saveSermon } from "@/lib/store";
import type { Sermon, SlideDeck, SlideDensity } from "@/lib/types";

type Tab = "sermon" | "bosquejo" | "diapositivas" | "imagenes";

interface SocialImage {
  phrase: string;
  style: string;
  dataUrl: string;
}

export default function SermonPage({ params }: { params: { id: string } }) {
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

  useEffect(() => {
    setSermon(getSermon(params.id) ?? null);
    setLoaded(true);
  }, [params.id]);

  function persist(next: Sermon) {
    setSermon(next);
    saveSermon(next);
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
      if (text) persist({ ...sermon, sermonText: text });
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
      if (text) persist({ ...sermon, outlineText: text });
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
        persist({
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

  if (!loaded) return <p className="text-sm text-stone-500">Cargando...</p>;
  if (!sermon)
    return (
      <div className="card">
        <p className="text-stone-600">No se encontro este sermon.</p>
        <Link href="/" className="btn-ghost mt-3">
          Volver al inicio
        </Link>
      </div>
    );

  return (
    <div className="space-y-5">
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

      <div className="flex gap-2 border-b border-stone-200">
        {(["sermon", "bosquejo", "diapositivas", "imagenes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium capitalize ${
              tab === t
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            {t}
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
                  <span
                    key={i}
                    onClick={() => setPhrase(p)}
                    className={`chip ${phrase === p ? "chip-on" : "chip-off"}`}
                  >
                    {p}
                  </span>
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
    </div>
  );
}
