"use client";
import React from "react";
import { TopBar } from "./shell";
import { IcCheck } from "./icons";
import { getProfile, saveProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { frameworks, roles, sermonTypes, strategies, methods, lengths } from "@/lib/catalogs";
import type { Profile, LengthKey } from "@/lib/types";

export function PerfilScreen({ onBack, onProfileSaved }: {
  onBack: () => void;
  onProfileSaved?: (p: Profile) => void;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loadedProfile, setLoadedProfile] = React.useState<Profile | null>(null);

  const [displayName, setDisplayName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [churchName, setChurchName] = React.useState("");
  const [churchContext, setChurchContext] = React.useState("");
  const [framework, setFramework] = React.useState("");
  const [sermonType, setSermonType] = React.useState("expositivo");
  const [strategy, setStrategy] = React.useState("idea-central");
  const [method, setMethod] = React.useState("peica");
  const [length, setLength] = React.useState<LengthKey>("medio");

  const families = React.useMemo(() => {
    const list: string[] = [];
    for (const f of frameworks) if (!list.includes(f.family)) list.push(f.family);
    return list;
  }, []);

  React.useEffect(() => {
    (async () => {
      const p = await getProfile();
      if (p) {
        setLoadedProfile(p);
        setDisplayName(p.displayName);
        setRole(p.role);
        setCountry(p.country);
        setChurchName(p.churchName);
        setChurchContext(p.churchContext);
        setFramework(p.framework);
        setSermonType(p.defaults.sermonTypes?.[0] ?? "expositivo");
        setStrategy(p.defaults.strategy ?? "idea-central");
        setMethod(p.defaults.method ?? "peica");
        setLength(p.defaults.length ?? "medio");
      }
      setLoaded(true);
    })();
  }, []);

  async function handleSave() {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const input = {
        displayName: displayName.trim(),
        role,
        country: country.trim(),
        framework,
        churchName: churchName.trim(),
        churchContext: churchContext.trim(),
        defaults: { sermonTypes: [sermonType], strategy, method, length, verseOption: "solo-cita" as const, provider: "claude" as const, bibleVersion: "RV1909" },
        onboarded: true,
      };
      await saveProfile(input);
      setSaved(true);
      onProfileSaved?.({
        id: "",
        ...input,
        subscriptionStatus: loadedProfile?.subscriptionStatus ?? "free",
        stripeCustomerId: loadedProfile?.stripeCustomerId,
        subscriptionEndsAt: loadedProfile?.subscriptionEndsAt,
        isAdmin: loadedProfile?.isAdmin ?? false,
      });
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    }
    setBusy(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const initials = displayName.trim() ? displayName.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";

  return (
    <div className="main">
      <TopBar
        title="Perfil"
        subtitle={displayName ? displayName + (role ? " · " + role : "") : "Configura tu cuenta"}
        right={
          <div className="row" style={{ gap: 8 }}>
            {saved && (
              <span className="ui" style={{ fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
                <IcCheck size={13} /> Guardado
              </span>
            )}
            {error && <span className="ui" style={{ fontSize: 12, color: "var(--accent)" }}>{error}</span>}
            <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>Volver</button>
            <button type="button" className="btn btn-accent btn-sm" onClick={handleSave} disabled={busy}>
              {busy ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px 64px" }}>
        {!loaded ? (
          <div className="serif muted" style={{ fontSize: 15, fontStyle: "italic", padding: "40px 0" }}>Cargando perfil…</div>
        ) : (
          <div style={{ maxWidth: 680, margin: "0 auto", display: "grid", gap: 28 }}>

            {/* Avatar + nombre */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--gilt), var(--accent))",
                display: "grid", placeItems: "center",
                color: "var(--paper)", fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600,
              }}>
                {initials}
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Tu nombre</div>
                <input
                  className="field"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej. Pastor Juan García"
                />
              </div>
            </div>

            {/* Perfil personal */}
            <section>
              <div className="rule-fancy" style={{ marginBottom: 18 }}>
                <span className="eyebrow">Perfil personal</span>
              </div>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Eres…</div>
                  <div className="row" style={{ flexWrap: "wrap", gap: 6 }}>
                    {roles.map((r) => (
                      <button
                        key={r.slug}
                        type="button"
                        className={"chip " + (role === r.slug ? "chip-on" : "")}
                        onClick={() => setRole(role === r.slug ? "" : r.slug)}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>País</div>
                  <input className="field" type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej. México" />
                </div>
              </div>
            </section>

            {/* Iglesia */}
            <section>
              <div className="rule-fancy" style={{ marginBottom: 18 }}>
                <span className="eyebrow">Iglesia o ministerio</span>
              </div>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Nombre</div>
                  <input className="field" type="text" value={churchName} onChange={(e) => setChurchName(e.target.value)} placeholder="Ej. Primera Iglesia Bautista" />
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Contexto</div>
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
            </section>

            {/* Marco teológico */}
            <section>
              <div className="rule-fancy" style={{ marginBottom: 18 }}>
                <span className="eyebrow">Marco teológico</span>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Marco doctrinal</div>
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
                  <p className="ui muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {frameworks.find((f) => f.slug === framework)?.summary}
                  </p>
                )}
              </div>
            </section>

            {/* Preferencias de sermón */}
            <section>
              <div className="rule-fancy" style={{ marginBottom: 18 }}>
                <span className="eyebrow">Preferencias de sermón</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Tipo preferido</div>
                  <select className="field" value={sermonType} onChange={(e) => setSermonType(e.target.value)}>
                    {sermonTypes.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Estrategia</div>
                  <select className="field" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                    {strategies.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Método</div>
                  <select className="field" value={method} onChange={(e) => setMethod(e.target.value)}>
                    {methods.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Longitud</div>
                  <select className="field" value={length} onChange={(e) => setLength(e.target.value as LengthKey)}>
                    {lengths.map((l) => <option key={l.key} value={l.key}>{l.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Sign out */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24, marginTop: 8 }}>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--accent)", borderColor: "color-mix(in oklab, var(--accent) 30%, transparent)" }}
              >
                Cerrar sesión
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
