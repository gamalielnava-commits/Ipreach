"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  commentators,
  doctrinalThemes,
  frameworks,
  illustrationKinds,
  lengths,
  methods,
  occasions,
  sermonTypes,
  strategies,
  themes,
  verseOptions,
} from "@/lib/catalogs";
import { newId, saveSermon } from "@/lib/store";
import type { LengthKey, Provider, SermonConfig, VerseOption } from "@/lib/types";

const STEPS = [
  "Idea",
  "Marco doctrinal",
  "Temas y motivo",
  "Tipo, estrategia y metodo",
  "Recursos",
  "Generar",
];

function toggle(list: string[], value: string, max?: number): string[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  if (max && list.length >= max) return [...list.slice(1), value];
  return [...list, value];
}

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [config, setConfig] = useState<SermonConfig>({
    idea: "",
    scripture: "",
    framework: "",
    doctrinalThemes: [],
    themes: [],
    occasion: "",
    sermonTypes: [],
    strategy: "",
    method: "",
    commentators: [],
    illustrationKinds: [],
    length: "medio",
    verseOption: "solo-cita",
    provider: "claude",
  });

  const set = (patch: Partial<SermonConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  const themeCategories = useMemo(() => {
    const groups: { category: string; items: typeof themes }[] = [];
    for (const t of themes) {
      let group = groups.find((g) => g.category === t.category);
      if (!group) {
        group = { category: t.category, items: [] };
        groups.push(group);
      }
      group.items.push(t);
    }
    return groups;
  }, []);

  const denomThemes = config.framework
    ? doctrinalThemes[config.framework] ?? []
    : [];

  async function handleGenerate() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "sermon", config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar.");
      const id = newId();
      const now = new Date().toISOString();
      saveSermon({
        id,
        title: title.trim() || config.idea.slice(0, 50) || "Sermon",
        createdAt: now,
        updatedAt: now,
        config,
        sermonText: data.text,
        outlineText: "",
        slideDecks: [],
      });
      router.push(`/sermon/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
      setBusy(false);
    }
  }

  const canNext =
    (step === 0 && config.idea.trim().length > 3) ||
    (step === 1 && config.framework !== "") ||
    (step === 2 && config.occasion !== "") ||
    (step === 3 &&
      config.sermonTypes.length > 0 &&
      config.strategy !== "" &&
      config.method !== "") ||
    step === 4 ||
    step === 5;

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap gap-2 text-xs">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`rounded-full px-3 py-1 ${
              i === step
                ? "bg-brand-600 text-white"
                : i < step
                  ? "bg-brand-100 text-brand-700"
                  : "bg-stone-100 text-stone-500"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="card space-y-5">
        {step === 0 && (
          <>
            <h2 className="text-lg font-semibold">Tu idea del sermon</h2>
            <div>
              <label className="label">Titulo (opcional)</label>
              <input
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Una fe que no se rinde"
              />
            </div>
            <div>
              <label className="label">
                Idea del sermon - escribela libremente
              </label>
              <textarea
                className="field min-h-32"
                value={config.idea}
                onChange={(e) => set({ idea: e.target.value })}
                placeholder="Describe la idea, el angulo o lo que Dios puso en tu corazon. Podras editarla y editar el sermon despues."
              />
            </div>
            <div>
              <label className="label">Texto biblico base (opcional)</label>
              <input
                className="field"
                value={config.scripture}
                onChange={(e) => set({ scripture: e.target.value })}
                placeholder="Ej. Santiago 1:2-12"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">Marco doctrinal</h2>
            <p className="text-sm text-stone-500">
              Es un filtro: puedes cambiarlo y regenerar el sermon bajo otra
              tradicion.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {frameworks.map((f) => (
                <button
                  key={f.slug}
                  onClick={() => set({ framework: f.slug, doctrinalThemes: [] })}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    config.framework === f.slug
                      ? "border-brand-600 bg-brand-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <span className="font-medium">{f.name}</span>
                  <span className="block text-xs text-stone-500">{f.family}</span>
                </button>
              ))}
            </div>
            {denomThemes.length > 0 && (
              <div>
                <label className="label">
                  Temas doctrinales de esta denominacion (opcional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {denomThemes.map((t) => (
                    <span
                      key={t}
                      onClick={() =>
                        set({ doctrinalThemes: toggle(config.doctrinalThemes, t) })
                      }
                      className={`chip ${
                        config.doctrinalThemes.includes(t) ? "chip-on" : "chip-off"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">Temas y motivo</h2>
            <div>
              <label className="label">Temas del sermon (uno o varios)</label>
              <div className="space-y-3">
                {themeCategories.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold uppercase text-stone-400">
                      {group.category}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {group.items.map((t) => (
                        <span
                          key={t.slug}
                          onClick={() =>
                            set({ themes: toggle(config.themes, t.slug) })
                          }
                          className={`chip ${
                            config.themes.includes(t.slug) ? "chip-on" : "chip-off"
                          }`}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Motivo / ocasion</label>
              <select
                className="field"
                value={config.occasion}
                onChange={(e) => set({ occasion: e.target.value })}
              >
                <option value="">Selecciona un motivo</option>
                {occasions.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Tipo, estrategia y metodo</h2>
            <div>
              <label className="label">
                Tipo de sermon (puedes combinar hasta 2)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sermonTypes.map((t) => (
                  <span
                    key={t.slug}
                    onClick={() =>
                      set({ sermonTypes: toggle(config.sermonTypes, t.slug, 2) })
                    }
                    className={`chip ${
                      config.sermonTypes.includes(t.slug) ? "chip-on" : "chip-off"
                    }`}
                    title={t.description}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Estrategia de predicacion</label>
              <select
                className="field"
                value={config.strategy}
                onChange={(e) => set({ strategy: e.target.value })}
              >
                <option value="">Selecciona una estrategia</option>
                {strategies.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                    {s.author ? ` - ${s.author}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Metodo de preparacion</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {methods.map((m) => (
                  <button
                    key={m.slug}
                    onClick={() => set({ method: m.slug })}
                    className={`rounded-lg border p-3 text-left text-sm transition ${
                      config.method === m.slug
                        ? "border-brand-600 bg-brand-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className="font-medium">{m.name}</span>
                    <span className="block text-xs text-stone-500">
                      {m.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold">Recursos del sermon</h2>
            <div>
              <label className="label">
                Comentaristas con los que trabajara la IA (opcional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {commentators.map((c) => (
                  <span
                    key={c.slug}
                    onClick={() =>
                      set({ commentators: toggle(config.commentators, c.slug) })
                    }
                    className={`chip ${
                      config.commentators.includes(c.slug)
                        ? "chip-on"
                        : "chip-off"
                    }`}
                    title={c.note}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Tipos de ilustraciones</label>
              <div className="flex flex-wrap gap-1.5">
                {illustrationKinds.map((k) => (
                  <span
                    key={k.slug}
                    onClick={() =>
                      set({
                        illustrationKinds: toggle(config.illustrationKinds, k.slug),
                      })
                    }
                    className={`chip ${
                      config.illustrationKinds.includes(k.slug)
                        ? "chip-on"
                        : "chip-off"
                    }`}
                  >
                    {k.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Longitud del mensaje</label>
                <select
                  className="field"
                  value={config.length}
                  onChange={(e) => set({ length: e.target.value as LengthKey })}
                >
                  {lengths.map((l) => (
                    <option key={l.key} value={l.key}>
                      {l.name} - {l.description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Versiculos</label>
                <select
                  className="field"
                  value={config.verseOption}
                  onChange={(e) =>
                    set({ verseOption: e.target.value as VerseOption })
                  }
                >
                  {verseOptions.map((v) => (
                    <option key={v.key} value={v.key}>
                      {v.name} - {v.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-lg font-semibold">Generar el sermon</h2>
            <div>
              <label className="label">Modelo de IA</label>
              <div className="flex gap-2">
                {(["claude", "gemini"] as Provider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => set({ provider: p })}
                    className={`chip ${
                      config.provider === p ? "chip-on" : "chip-off"
                    }`}
                  >
                    {p === "claude" ? "Claude (Opus)" : "Gemini"}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-stone-50 p-4 text-sm text-stone-600">
              <p className="font-semibold text-stone-700">Resumen</p>
              <ul className="mt-1 space-y-0.5">
                <li>Idea: {config.idea || "-"}</li>
                <li>Texto base: {config.scripture || "-"}</li>
                <li>
                  Marco:{" "}
                  {frameworks.find((f) => f.slug === config.framework)?.name || "-"}
                </li>
                <li>
                  Motivo:{" "}
                  {occasions.find((o) => o.slug === config.occasion)?.name || "-"}
                </li>
                <li>Temas: {config.themes.length} seleccionados</li>
                <li>
                  Tipo:{" "}
                  {config.sermonTypes
                    .map((s) => sermonTypes.find((t) => t.slug === s)?.name)
                    .join(" + ") || "-"}
                </li>
              </ul>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              onClick={handleGenerate}
              disabled={busy}
              className="btn-primary w-full"
            >
              {busy ? "Generando sermon..." : "Generar sermon"}
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || busy}
          className="btn-ghost disabled:opacity-40"
        >
          Atras
        </button>
        {step < 5 && (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="btn-primary disabled:opacity-40"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}
