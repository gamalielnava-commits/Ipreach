"use client";
import React from "react";
import { TopBar } from "./shell";
import { IcCheck, IcArrowRight, IcSpark } from "./icons";
import type { Profile } from "@/lib/types";

const PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "";

const GRATIS_FEATURES = [
  "3 sermones IA al mes",
  "1 serie activa",
  "Exportar a Word",
  "Planificador básico",
  "Acceso a biblioteca",
];

const PRO_FEATURES = [
  "Sermones IA ilimitados",
  "Series ilimitadas",
  "Exportar Word + PowerPoint",
  "Planificador completo",
  "Diapositivas con IA",
  "Soporte prioritario",
];

export function PlanesScreen({ profile }: { profile: Profile | null }) {
  const [busy, setBusy] = React.useState<"checkout" | "portal" | null>(null);
  const [error, setError] = React.useState("");
  const isPro = profile?.subscriptionStatus === "pro";
  const priceId = PRO_PRICE_ID;
  const stripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) && Boolean(PRO_PRICE_ID);

  async function subscribe() {
    setBusy("checkout");
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Error al iniciar el pago.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
      setBusy(null);
    }
  }

  async function openPortal() {
    setBusy("portal");
    setError("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Error al abrir el portal.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
      setBusy(null);
    }
  }

  return (
    <div className="main">
      <TopBar
        title="Planes"
        subtitle="Elige el plan que se adapta a tu ministerio"
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px 64px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* Status banner */}
          {isPro && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 18px", borderRadius: "var(--r-base)",
              background: "color-mix(in oklab, var(--accent) 8%, var(--paper-2))",
              border: "1px solid color-mix(in oklab, var(--accent) 20%, transparent)",
              marginBottom: 28,
            }}>
              <IcSpark size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
              <span className="ui" style={{ fontSize: 13, color: "var(--ink)" }}>
                <strong>Tu plan actual: Pro</strong>
                {profile?.subscriptionEndsAt && (
                  <span className="muted"> · Activo hasta {new Date(profile.subscriptionEndsAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</span>
                )}
              </span>
            </div>
          )}

          {/* Plans grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

            {/* Gratis */}
            <div style={{
              padding: 28,
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              background: "var(--paper-2)",
              display: "flex", flexDirection: "column",
            }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Gratis</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span className="display" style={{ fontSize: 40, fontWeight: 500 }}>$0</span>
                <span className="ui muted" style={{ fontSize: 13 }}>/mes</span>
              </div>
              <p className="serif muted" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
                Para pastores que están comenzando o quieren explorar la herramienta.
              </p>

              <ul className="col" style={{ gap: 10, marginBottom: 28, flex: 1 }}>
                {GRATIS_FEATURES.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <IcCheck size={14} style={{ color: "var(--ink-3)", flexShrink: 0, marginTop: 2 }} />
                    <span className="ui" style={{ fontSize: 13, color: "var(--ink-2)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <button type="button" disabled className="btn btn-ghost btn-sm" style={{ justifyContent: "center", opacity: 0.5 }}>
                Plan actual
              </button>
            </div>

            {/* Pro */}
            <div style={{
              padding: 28,
              border: "1.5px solid var(--accent)",
              borderRadius: "var(--r-lg)",
              background: "color-mix(in oklab, var(--accent) 3%, var(--paper))",
              display: "flex", flexDirection: "column",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: -12, left: 24,
                background: "var(--accent)", color: "var(--paper)",
                fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700,
                letterSpacing: ".12em", textTransform: "uppercase",
                padding: "3px 12px", borderRadius: 999,
              }}>
                Recomendado
              </div>

              <div className="eyebrow" style={{ marginBottom: 8, color: "var(--accent)" }}>Pro</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span className="display" style={{ fontSize: 40, fontWeight: 500 }}>$4.99</span>
                <span className="ui muted" style={{ fontSize: 13 }}>/mes</span>
              </div>
              <p className="serif muted" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
                Para el pastor que predica con regularidad y quiere preparar cada sermón con excelencia.
              </p>

              <ul className="col" style={{ gap: 10, marginBottom: 28, flex: 1 }}>
                {PRO_FEATURES.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <IcCheck size={14} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                    <span className="ui" style={{ fontSize: 13, color: "var(--ink)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              {isPro ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ justifyContent: "center" }}
                  onClick={openPortal}
                  disabled={busy === "portal"}
                >
                  {busy === "portal" ? "Abriendo…" : "Gestionar suscripción"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-accent"
                  style={{ justifyContent: "center" }}
                  onClick={subscribe}
                  disabled={busy === "checkout" || !stripeConfigured}
                >
                  {busy === "checkout" ? "Redirigiendo…" : "Suscribirse"}
                  {busy !== "checkout" && <IcArrowRight size={14} />}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: 18, padding: "10px 14px", borderRadius: "var(--r-base)",
              background: "color-mix(in oklab, var(--accent) 8%, var(--paper-2))",
              border: "1px solid color-mix(in oklab, var(--accent) 25%, transparent)",
              color: "var(--accent)", fontSize: 13, fontFamily: "var(--font-ui)",
            }}>
              {error}
            </div>
          )}

          {/* Setup guide — visible when Stripe not configured */}
          {!stripeConfigured && (
            <div style={{
              marginTop: 36, padding: 24,
              border: "1px dashed var(--line)",
              borderRadius: "var(--r-lg)",
              background: "var(--paper-2)",
            }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Configurar Stripe — guía rápida</div>
              <ol className="col" style={{ gap: 12, paddingLeft: 0, listStyle: "none" }}>
                {[
                  { n: "1", title: "Crea una cuenta gratuita en Stripe", body: "Ve a stripe.com → «Start now» → crea tu cuenta. Es gratis y no necesitas tarjeta." },
                  { n: "2", title: "Crea el producto «iPreach Pro»", body: "Dashboard → Productos → «Añadir producto» → Nombre: \"iPreach Pro\" → Precio: $4.99 USD / mensual → Guardar. Copia el Price ID (empieza con price_...)." },
                  { n: "3", title: "Copia las API keys", body: "Dashboard → Desarrolladores → Claves API. Copia la Clave publicable (pk_live_...) y la Clave secreta (sk_live_...)." },
                  { n: "4", title: "Configura el webhook", body: "Desarrolladores → Webhooks → «Añadir endpoint» → URL: https://tu-dominio.com/api/stripe/webhook → Eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted → Copia el Secreto de firma (whsec_...)." },
                  { n: "5", title: "Agrega las variables de entorno", body: "En tu .env.local (y en Vercel → Settings → Environment Variables) agrega: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRO_PRICE_ID, SUPABASE_SERVICE_ROLE_KEY." },
                ].map(({ n, title, body }) => (
                  <li key={n} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                      background: "var(--accent)", color: "var(--paper)",
                      display: "grid", placeItems: "center",
                      fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
                    }}>{n}</div>
                    <div>
                      <div className="ui" style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{title}</div>
                      <div className="ui muted" style={{ fontSize: 12, lineHeight: 1.5 }}>{body}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* FAQ */}
          <div style={{ marginTop: 36 }}>
            <div className="rule-fancy" style={{ marginBottom: 20 }}>
              <span className="eyebrow">Preguntas frecuentes</span>
            </div>
            <div className="col" style={{ gap: 16 }}>
              {[
                { q: "¿Puedo cancelar en cualquier momento?", a: "Sí. Puedes cancelar desde el portal de gestión de suscripción. Seguirás teniendo acceso Pro hasta el final del período facturado." },
                { q: "¿Qué métodos de pago aceptan?", a: "Tarjetas de crédito y débito (Visa, Mastercard, American Express). El pago es procesado de forma segura por Stripe." },
                { q: "¿Hay descuento anual?", a: "Próximamente. Por ahora el plan mensual es la opción más económica disponible." },
                { q: "¿Qué pasa con mis sermones si cancelo?", a: "Todos tus sermones y datos permanecen en tu cuenta. Solo perderás acceso a las funciones exclusivas de Pro." },
              ].map(({ q, a }) => (
                <div key={q} style={{ padding: "16px 20px", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--r-base)" }}>
                  <div className="ui" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{q}</div>
                  <div className="ui muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
