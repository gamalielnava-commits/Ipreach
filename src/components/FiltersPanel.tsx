"use client";

import { useMemo } from "react";
import {
  commentators,
  contentTypes,
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
import type { LengthKey, Provider, SermonConfig, VerseOption } from "@/lib/types";

function toggle(list: string[], value: string, max?: number): string[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  if (max && list.length >= max) return [...list.slice(1), value];
  return [...list, value];
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-xl border border-stone-200 bg-white">
      <summary className="flex cursor-pointer select-none items-center justify-between px-3 py-2.5 text-sm font-semibold text-stone-700">
        {title}
        <span className="text-stone-400 transition group-open:rotate-180">v</span>
      </summary>
      <div className="border-t border-stone-100 p-3">{children}</div>
    </details>
  );
}

interface Props {
  config: SermonConfig;
  onChange: (config: SermonConfig) => void;
  open: boolean;
  onClose: () => void;
}

export default function FiltersPanel({ config, onChange, open, onClose }: Props) {
  const set = (patch: Partial<SermonConfig>) => onChange({ ...config, ...patch });

  const themeCategories = useMemo(() => {
    const groups: { category: string; items: typeof themes }[] = [];
    for (const t of themes) {
      let g = groups.find((x) => x.category === t.category);
      if (!g) {
        g = { category: t.category, items: [] };
        groups.push(g);
      }
      g.items.push(t);
    }
    return groups;
  }, []);

  const denomThemes = config.framework
    ? doctrinalThemes[config.framework] ?? []
    : [];

  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-stone-50 shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
          <h2 className="font-bold text-stone-900">Filtros</h2>
          <button onClick={onClose} className="btn-primary px-3 py-1.5">
            Listo
          </button>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <label className="label">Que quieres preparar</label>
            <div className="flex flex-wrap gap-1.5">
              {contentTypes.map((c) => (
                <span
                  key={c.slug}
                  onClick={() => set({ contentType: c.slug })}
                  className={`chip ${
                    (config.contentType || "sermon") === c.slug
                      ? "chip-on"
                      : "chip-off"
                  }`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <label className="label">Marco doctrinal</label>
            <select
              className="field"
              value={config.framework}
              onChange={(e) =>
                set({ framework: e.target.value, doctrinalThemes: [] })
              }
            >
              {frameworks.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {denomThemes.length > 0 && (
            <Section title="Enfasis doctrinales">
              <div className="flex flex-wrap gap-1.5">
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
            </Section>
          )}

          <Section title="Temas">
            <div className="space-y-2">
              {themeCategories.map((g) => (
                <div key={g.category}>
                  <p className="text-xs font-semibold uppercase text-stone-400">
                    {g.category}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {g.items.map((t) => (
                      <span
                        key={t.slug}
                        onClick={() => set({ themes: toggle(config.themes, t.slug) })}
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
          </Section>

          <Section title="Motivo / ocasion">
            <select
              className="field"
              value={config.occasion}
              onChange={(e) => set({ occasion: e.target.value })}
            >
              <option value="">Sin motivo especifico</option>
              {occasions.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </select>
          </Section>

          <Section title="Tipo de sermon">
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
                >
                  {t.name}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Estrategia y metodo">
            <label className="label">Estrategia</label>
            <select
              className="field"
              value={config.strategy}
              onChange={(e) => set({ strategy: e.target.value })}
            >
              <option value="">Sin estrategia especifica</option>
              {strategies.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <label className="label mt-3">Metodo de preparacion</label>
            <select
              className="field"
              value={config.method}
              onChange={(e) => set({ method: e.target.value })}
            >
              <option value="">Sin metodo especifico</option>
              {methods.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
          </Section>

          <Section title="Comentaristas">
            <div className="flex flex-wrap gap-1.5">
              {commentators.map((c) => (
                <span
                  key={c.slug}
                  onClick={() =>
                    set({ commentators: toggle(config.commentators, c.slug) })
                  }
                  className={`chip ${
                    config.commentators.includes(c.slug) ? "chip-on" : "chip-off"
                  }`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Ilustraciones">
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
          </Section>

          <Section title="Longitud, versiculos y modelo">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Longitud</label>
                <select
                  className="field"
                  value={config.length}
                  onChange={(e) => set({ length: e.target.value as LengthKey })}
                >
                  {lengths.map((l) => (
                    <option key={l.key} value={l.key}>
                      {l.name}
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
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="label mt-3">Modelo de IA</label>
            <div className="flex gap-2">
              {(["claude", "gemini"] as Provider[]).map((p) => (
                <span
                  key={p}
                  onClick={() => set({ provider: p })}
                  className={`chip ${
                    config.provider === p ? "chip-on" : "chip-off"
                  }`}
                >
                  {p === "claude" ? "Claude (Opus)" : "Gemini"}
                </span>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
