"use client";
import React from "react";
import { TopBar } from "./shell";
import { IcCheck } from "./icons";
import { getProfile, saveProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { frameworks, roles, sermonTypes, strategies, methods, lengths } from "@/lib/catalogs";
import type { Profile, LengthKey } from "@/lib/types";

const FONT_FAMILIES = [
  { value: '"Newsreader", Georgia, serif', name: "Serif clásica (Newsreader)" },
  { value: '"Cormorant Garamond", Georgia, serif', name: "Serif elegante (Cormorant)" },
  { value: '"Source Serif 4", Georgia, serif', name: "Serif moderna (Source Serif)" },
  { value: '"EB Garamond", Georgia, serif', name: "Serif Garamond" },
  { value: '"Geist", ui-sans-serif, system-ui, sans-serif', name: "Sans (Geist)" },
  { value: '"DM Sans", ui-sans-serif, system-ui, sans-serif', name: "Sans humanista (DM Sans)" },
];

const FONT_SIZES = [
  { value: 14, name: "Pequeño (14)" },
  { value: 16, name: "Normal (16)" },
  { value: 18, name: "Grande (18)" },
  { value: 20, name: "Muy grande (20)" },
];

export function applyAppearance(fontFamily?: string, fontSize?: number) {
  if (typeof document === "undefined") return;
  if (fontFamily) {
    document.documentElement.style.setProperty("--font-body", fontFamily);
  }
  if (fontSize) {
    document.body.style.fontSize = `${fontSize}px`;
  }
}

export function PerfilScreen({ onBack, onProfileSaved, onOpenPlanes }: {
  onBack: () => void;
  onProfileSaved?: (p: Profile) => void;
  onOpenPlanes?: () => void;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loadedProfile, setLoadedProfile] = React.useState<Profile | null>(null);
  const [email, setEmail] = React.useState("");

  const [displayName, setDisplayName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [churchName, setChurchName] = React.useState("");
  const [churchContext, setChurchContext] = React.useState("");
  const [framework, setFramework] = React.useState("asambleas-de-dios");
  const [sermonType, setSermonType] = React.useState("expositivo");
  const [strategy, setStrategy] = React.useState("idea-central");
  const [method, setMethod] = React.useState("peica");
  const [length, setLength] = React.useState<LengthKey>("medio");

  const [fontFamily, setFontFamily] = React.useState(FONT_FAMILIES[0].value);
  const [fontSize, setFontSize] = React.useState<number>(16);
  const [churchLogoUrl, setChurchLogoUrl] = React.useState("");
  const [includeLogoInExports, setIncludeLogoInExports] = React.useState(true);
  const [logoUploading, setLogoUploading] = React.useState(false);

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleteWord, setDeleteWord] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  const families = React.useMemo(() => {
    const list: string[] = [];
    for (const f of frameworks) if (!list.includes(f.family)) list.push(f.family);
    return list;
  }, []);

  React.useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (auth?.user?.email) setEmail(auth.user.email);
      const p = await getProfile();
      if (p) {
        setLoadedProfile(p);
        setDisplayName(p.displayName);
        setRole(p.role);
        setCountry(p.country);
        setChurchName(p.churchName);
        setChurchContext(p.churchContext);
        setFramework(p.framework || "asambleas-de-dios");
        setSermonType(p.defaults.sermonTypes?.[0] ?? "expositivo");
        setStrategy(p.defaults.strategy ?? "idea-central");
        setMethod(p.defaults.method ?? "peica");
        setLength(p.defaults.length ?? "medio");
        if (p.defaults.appearance?.fontFamily) setFontFamily(p.defaults.appearance.fontFamily);
        if (p.defaults.appearance?.fontSize) setFontSize(p.defaults.appearance.fontSize);
        if (p.defaults.churchLogoUrl) setChurchLogoUrl(p.defaults.churchLogoUrl);
        if (typeof p.defaults.includeLogoInExports === "boolean") {
          setIncludeLogoInExports(p.defaults.includeLogoInExports);
        }
      }
      setLoaded(true);
    })();
  }, []);

  React.useEffect(() => {
    applyAppearance(fontFamily, fontSize);
  }, [fontFamily, fontSize]);

  async function handleLogoUpload(file: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("El logo debe pesar menos de 2 MB.");
      return;
    }
    setLogoUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setChurchLogoUrl(dataUrl);
    } catch (e) {
      setError("No se pudo cargar el logo.");
    } finally {
      setLogoUploading(false);
    }
  }

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
        defaults: {
          sermonTypes: [sermonType],
          strategy,
          method,
          length,
          verseOption: "solo-cita" as const,
          provider: "claude" as const,
          bibleVersion: "RV1909",
          appearance: { fontFamily, fontSize },
          churchLogoUrl,
          includeLogoInExports,
        },
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

  async function handleOpenStripePortal() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo abrir el portal.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error abriendo Stripe.");
    }
  }

  async function handleDeleteAccount() {
    if (deleteWord !== "ELIMINAR") return;
    setDeleting(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Sesion expirada. Vuelve a iniciar sesion.");
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar la cuenta.");
      await supabase.auth.signOut();
      window.location.href = "/login?deleted=1";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar la cuenta.");
      setDeleting(false);
    }
  }

  const initials = displayName.trim() ? displayName.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";
  const isPro = loadedProfile?.subscriptionStatus === "pro";

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
            {error && <span className="ui" style={{ fontSize: 12, color: "#E11D48" }}>{error}</span>}
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

            {/* Avatar + nombre + email */}
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
                {email && (
                  <div className="ui muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {email}
                  </div>
                )}
              </div>
            </div>

            {/* Suscripción */}
            <section>
              <div className="rule-fancy" style={{ marginBottom: 18 }}>
                <span className="eyebrow">Suscripción</span>
              </div>
              <div className="row" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span className="pill" style={{
                  background: isPro ? "var(--accent)" : "var(--ink-4)",
                  color: "var(--paper)", padding: "4px 10px", fontWeight: 700,
                }}>
                  Plan {isPro ? "PRO" : "GRATIS"}
                </span>
                {isPro && loadedProfile?.subscriptionEndsAt && (
                  <span className="ui muted" style={{ fontSize: 12 }}>
                    Próxima renovación: {new Date(loadedProfile.subscriptionEndsAt).toLocaleDateString("es")}
                  </span>
                )}
                <span className="spacer" />
                {isPro ? (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleOpenStripePortal}>
                    Gestionar en Stripe
                  </button>
                ) : (
                  <button type="button" className="btn btn-accent btn-sm" onClick={onOpenPlanes}>
                    Ver planes
                  </button>
                )}
              </div>
            </section>

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

                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Logo de la iglesia</div>
                  <div className="row" style={{ gap: 14, alignItems: "center" }}>
                    {churchLogoUrl ? (
                      <img src={churchLogoUrl} alt="Logo" style={{
                        width: 64, height: 64, objectFit: "contain",
                        borderRadius: 8, border: "1px solid var(--line)", background: "#fff",
                      }} />
                    ) : (
                      <div style={{
                        width: 64, height: 64, borderRadius: 8,
                        border: "1px dashed var(--line)",
                        display: "grid", placeItems: "center",
                        fontSize: 11, color: "var(--ink-4)",
                      }}>Sin logo</div>
                    )}
                    <div className="col" style={{ gap: 8 }}>
                      <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
                        {logoUploading ? "Cargando..." : (churchLogoUrl ? "Cambiar logo" : "Subir logo")}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleLogoUpload(f);
                          }}
                        />
                      </label>
                      {churchLogoUrl && (
                        <button type="button" className="btn-quiet" style={{ fontSize: 11, color: "#E11D48" }}
                          onClick={() => setChurchLogoUrl("")}>
                          Quitar logo
                        </button>
                      )}
                    </div>
                  </div>
                  <label className="row" style={{ gap: 8, marginTop: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={includeLogoInExports}
                      onChange={(e) => setIncludeLogoInExports(e.target.checked)} />
                    <span className="ui" style={{ fontSize: 13 }}>
                      Incluir el logo en los archivos generados (Word, PDF, PowerPoint)
                    </span>
                  </label>
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

            {/* Apariencia */}
            <section>
              <div className="rule-fancy" style={{ marginBottom: 18 }}>
                <span className="eyebrow">Apariencia</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Tipo de letra</div>
                  <select className="field" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Tamaño base</div>
                  <select className="field" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
                    {FONT_SIZES.map((s) => <option key={s.value} value={s.value}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <p className="serif" style={{
                marginTop: 14, padding: 14,
                background: "var(--cream-2, #f5edd2)", borderRadius: 8,
                fontFamily, fontSize,
                fontStyle: "italic", color: "var(--ink-2)",
              }}>
                "La fe es la certeza de lo que se espera, la convicción de lo que no se ve." — Hebreos 11:1
              </p>
            </section>

            {/* Cerrar sesión */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24, marginTop: 8 }}>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-ghost btn-sm"
              >
                Cerrar sesión
              </button>
            </div>

            {/* Zona de peligro */}
            <section style={{
              border: "1px solid rgba(225,29,72,.3)",
              borderRadius: 12, padding: 20, marginTop: 8,
              background: "rgba(225,29,72,.04)",
            }}>
              <div className="eyebrow" style={{ color: "#E11D48", marginBottom: 8 }}>Zona de peligro</div>
              <p className="ui" style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 12 }}>
                Eliminar tu cuenta borra permanentemente tu perfil, conversaciones, sermones y suscripción. No se puede deshacer.
              </p>
              {!confirmDelete ? (
                <button type="button" className="btn btn-ghost btn-sm"
                  style={{ color: "#E11D48", borderColor: "rgba(225,29,72,.4)" }}
                  onClick={() => setConfirmDelete(true)}>
                  Eliminar mi cuenta
                </button>
              ) : (
                <div className="col" style={{ gap: 10 }}>
                  <p className="ui" style={{ fontSize: 13 }}>
                    Para confirmar, escribe <strong>ELIMINAR</strong> en mayúsculas:
                  </p>
                  <input className="field" type="text" value={deleteWord}
                    onChange={(e) => setDeleteWord(e.target.value)} placeholder="ELIMINAR" />
                  <div className="row" style={{ gap: 8 }}>
                    <button type="button" className="btn btn-ghost btn-sm"
                      onClick={() => { setConfirmDelete(false); setDeleteWord(""); }}>
                      Cancelar
                    </button>
                    <button type="button" className="btn btn-sm"
                      style={{ background: "#E11D48", color: "#fff", border: "1px solid #E11D48" }}
                      onClick={handleDeleteAccount}
                      disabled={deleteWord !== "ELIMINAR" || deleting}>
                      {deleting ? "Eliminando..." : "Eliminar definitivamente"}
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
