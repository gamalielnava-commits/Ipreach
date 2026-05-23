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
import type { LengthKey, Profile } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [framework, setFramework] = useState("");
  const [churchName, setChurchName] = useState("");
  const [churchContext, setChurchContext] = useState("");
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
      if (p) {
        setName(p.displayName);
        setRole(p.role);
        setCountry(p.country);
        setFramework(p.framework);
        setChurchName(p.churchName);
        setChurchContext(p.churchContext);
        setSermonType(p.defaults.sermonTypes?.[0] ?? "expositivo");
        setStrategy(p.defaults.strategy ?? "idea-central");
        setMethod(p.defaults.method ?? "peica");
        setLength(p.defaults.length ?? "medio");
      }
      setLoaded(true);
    })();
  }, [router]);

  const families = useMemo(() => {
    const list: string[] = [];
    for (const f of frameworks) if (!list.includes(f.family)) list.push(f.family);
    return list;
  }, []);

  async function handleSave() {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      await saveProfile({
        displayName: name.trim(),
        role,
        country: country.trim(),
        framework,
        churchName: churchName.trim(),
        churchContext: churchContext.trim(),
        defaults: {
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
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    }
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!loaded) {
    return <p className="p-6 text-sm text-stone-500">Cargando...</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Configuración</h1>
        <p className="mt-1 text-sm text-stone-500">Edita tu perfil y preferencias en cualquier momento.</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">Perfil personal</h2>
        <div>
          <label className="label">Tu nombre</label>
          <input className="field" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Pastor Gamaliel" />
        </div>
        <div>
          <label className="label">Eres...</label>
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button type="button" key={r.slug}
                onClick={() => setRole(r.slug === role ? "" : r.slug)}
                className={`chip ${role === r.slug ? "chip-on" : "chip-off"}`}>
                {r.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">País</label>
          <input className="field" type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej. México" />
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">Mi iglesia o ministerio</h2>
        <div>
          <label className="label">Nombre de la iglesia o ministerio</label>
          <input className="field" type="text" value={churchName} onChange={(e) => setChurchName(e.target.value)} placeholder="Ej. Primera Iglesia Bautista" />
        </div>
        <div>
          <label className="label">Contexto</label>
          <textarea
            className="field"
            value={churchContext}
            onChange={(e) => setChurchContext(e.target.value)}
            placeholder="Ej. Iglesia urbana, 200 personas, enfoque en jóvenes…"
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">Marco teológico</h2>
        <div>
          <label className="label">Marco doctrinal</label>
          <select className="field" value={framework} onChange={(e) => setFramework(e.target.value)}>
            <option value="">Selecciona tu tradición</option>
            {families.map((fam) => (
              <optgroup key={fam} label={fam}>
                {frameworks.filter((f) => f.family === fam).map((f) => (
                  <option key={f.slug} value={f.slug}>{f.name}</option>
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
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">Preferencias de sermón</h2>
        <div>
          <label className="label">Tipo de sermón preferido</label>
          <select className="field" value={sermonType} onChange={(e) => setSermonType(e.target.value)}>
            {sermonTypes.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Estrategia preferida</label>
          <select className="field" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
            {strategies.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Método preferido</label>
          <select className="field" value={method} onChange={(e) => setMethod(e.target.value)}>
            {methods.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Longitud preferida</label>
          <select className="field" value={length} onChange={(e) => setLength(e.target.value as LengthKey)}>
            {lengths.map((l) => <option key={l.key} value={l.key}>{l.name}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Cambios guardados correctamente.</p>}

      <div className="flex flex-col gap-3">
        <button type="button" onClick={handleSave} disabled={busy} className="btn-primary w-full disabled:opacity-40">
          {busy ? "Guardando..." : "Guardar cambios"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost w-full">
          Volver
        </button>
        <hr className="border-stone-200" />
        <button type="button" onClick={signOut} className="text-sm text-red-500 hover:text-red-700 text-center py-1">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
