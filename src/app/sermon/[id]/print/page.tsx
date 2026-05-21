"use client";

import { useEffect, useState } from "react";
import { getSermon } from "@/lib/store";
import type { Sermon } from "@/lib/types";

function clean(s: string): string {
  return s.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");
}

function Rendered({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h) {
          const lvl = h[1].length;
          const cls =
            lvl <= 1
              ? "mt-5 text-xl font-bold"
              : lvl === 2
                ? "mt-4 text-lg font-semibold"
                : "mt-3 font-semibold";
          return (
            <p key={i} className={cls}>
              {clean(h[2])}
            </p>
          );
        }
        const b = line.match(/^\s*[-*•]\s+(.*)$/);
        if (b) {
          return (
            <p key={i} className="ml-5">
              • {clean(b[1])}
            </p>
          );
        }
        if (!line.trim()) return <div key={i} className="h-3" />;
        return (
          <p key={i} className="mt-1">
            {clean(line)}
          </p>
        );
      })}
    </>
  );
}

export default function PrintPage({ params }: { params: { id: string } }) {
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = getSermon(params.id) ?? null;
    setSermon(s);
    setLoaded(true);
    if (s) {
      const t = setTimeout(() => window.print(), 600);
      return () => clearTimeout(t);
    }
  }, [params.id]);

  if (!loaded) return <p className="text-sm text-stone-500">Cargando...</p>;
  if (!sermon) return <p className="text-sm text-stone-500">Sermon no encontrado.</p>;

  return (
    <div className="mx-auto max-w-3xl font-serif leading-relaxed text-stone-900">
      <button onClick={() => window.print()} className="btn-primary no-print mb-6">
        Imprimir / Guardar como PDF
      </button>
      <h1 className="text-2xl font-bold">{sermon.title}</h1>
      {sermon.config.scripture && (
        <p className="text-stone-600">{sermon.config.scripture}</p>
      )}
      <hr className="my-4" />
      <Rendered text={sermon.sermonText} />
      {sermon.outlineText.trim() && (
        <>
          <h2 className="mt-8 text-xl font-bold" style={{ pageBreakBefore: "always" }}>
            Bosquejo
          </h2>
          <Rendered text={sermon.outlineText} />
        </>
      )}
    </div>
  );
}
