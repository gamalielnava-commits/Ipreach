"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  frameworks,
  lengths,
  methods,
  roles,
  sermonTypes,
  strategies,
} from "@/lib/catalogs";
import { getProfile, saveProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import type { LengthKey } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [churchName, setChurchName] = useState("");
  const [churchContext, setChurchContext] = useState("");
  const [country, setCountry] = useState("");
  const [framework, setFramework] = useState("asambleas-de-dios");
  const [sermonType, setSermonType] = useState("expositivo");
  const [strategy, setStrategy] = useState("idea-central");
  const [method, setMethod] = useState("peica");
  const [length, setLength] = useState<LengthKey>("medio");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const p = await getProfile();
      if (p?.onboarded) {
        router.replace("/");
        return;
      }
      setReady(true);
    })();
  }, [router]);

  const families = useMemo(() => {
    const list: string[] = [];
    for (const f of frameworks) if (!list.includes(f.family)) list.push(f.family);
    return list;
  }, []);

  async function finish(skipAll = false) {
    setBusy(true);
    setError("");
    try {
      await saveProfile({
        displayName: skipAll ? "" : name.trim(),
        role: skipAll ? "" : role,
        country: skipAll ? "" : country.trim(),
        framework: skipAll ? "" : framework,
        churchName: skipAll ? "" : churchName.trim(),
        churchContext: skipAll ? "" : churchContext.trim(),
        defaults: skipAll ? {} : {
          sermonTypes: [sermonType],
          strategy,
          method,
          length,
          verseOption: "solo-cita",
          provider: "claude",
          bibleVersion: "RV1909",
        },
        onboarded: true,
      });
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el perfil.");
      setBusy(false);
    }
  }

  if (!ready) {
    return <p className="p-6 text-sm text-stone-500">Cargando...</p>;
  }

  const canNext =
    step === 0
      ? name.trim().length > 1
      : step === 1
        ? true
        : true;

  const stepTitles = [
    "Bienvenido a Ipreach",
    "Tu perfil teologico",
    "Tus preferencias",
  ];
  const stepSubs = [
    "Cuéntanos sobre ti y tu ministerio.",
    "El marco doctrinal quedara preseleccionado en cada sermon.",
    "Valores por defecto; podras cambiarlos cuando quieras.",
  ];

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="card space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Paso {step + 1} de 3
          </p>
          <h1 className="mt-1 text-xl font-bold text-stone-900">
            {stepTitles[step]}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{stepSubs[step]}</p>
        </div>

        {step === 0 && (
          <>
            <div>
              <label className="label">Tu nombre</label>
              <input
                className="field"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Pastor Gamaliel"
              />
            </div>
            <div>
              <label className="label">Eres... (opcional)</label>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.slug}
                    onClick={() => setRole(r.slug === role ? "" : r.slug)}
                    className={`chip ${role === r.slug ? "chip-on" : "chip-off"}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Nombre de tu iglesia o ministerio (opcional)</label>
              <input
                className="field"
                type="text"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                placeholder="Ej. Primera Iglesia Bautista"
              />
            </div>
            <div>
              <label className="label">Contexto de tu iglesia (opcional)</label>
              <textarea
                className="field"
                value={churchContext}
                onChange={(e) => setChurchContext(e.target.value)}
                placeholder="Ej. Iglesia urbana, 200 personas, enfoque en jóvenes, contexto latinoamericano…"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="label">Pais (opcional)</label>
              <input
                className="field"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ej. Mexico"
              />
            </div>
            <div>
              <label className="label">Marco doctrinal (opcional)</label>
              <select
                className="field"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
              >
                <option value="">Selecciona tu tradicion</option>
                {families.map((fam) => (
                  <optgroup key={fam} label={fam}>
                    {frameworks
                      .filter((f) => f.family === fam)
                      .map((f) => (
                        <option key={f.slug} value={f.slug}>
                          {f.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              {framework && (
                <p className="mt-1.5 text-xs text-stone-500">
                  {frameworks.find((f) => f.slug === framework)?.summary}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="label">Tipo de sermon preferido</label>
              <select
                className="field"
                value={sermonType}
                onChange={(e) => setSermonType(e.target.value)}
              >
                {sermonTypes.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Estrategia preferida</label>
              <select
                className="field"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
              >
                {strategies.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Metodo preferido</label>
              <select
                className="field"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {methods.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Longitud preferida</label>
              <select
                className="field"
                value={length}
                onChange={(e) => setLength(e.target.value as LengthKey)}
              >
                {lengths.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>
        )}

        <div className="flex justify-between gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || busy}
            className="btn-ghost disabled:opacity-40"
          >
            Atras
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => finish(true)}
              disabled={busy}
              className="btn-ghost disabled:opacity-40 text-stone-400"
            >
              Omitir todo
            </button>
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="btn-primary disabled:opacity-40"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={() => finish(false)}
                disabled={busy}
                className="btn-primary"
              >
                {busy ? "Guardando..." : "Empezar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
