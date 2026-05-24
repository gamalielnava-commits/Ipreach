"use client";
import React from "react";
import { IcArrowRight } from "./icons";
import { supabase } from "@/lib/supabase";

export function LoginScreen({ onSignIn }: { onSignIn: () => void }) {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleGoogle() {
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "No se pudo iniciar sesión con Google.");
      setLoading(false);
    }
  }

  async function handleAuth() {
    if (!email || !pass) {
      setErrorMsg("Por favor, rellena todos los campos.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: pass,
        });
        if (error) throw error;
        alert("¡Registro exitoso! Si se configuró confirmación por correo, por favor verifícalo.");
      }
      onSignIn();
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error durante la autenticación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--paper)",
    }}>
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, color-mix(in oklab, var(--accent) 12%, var(--ink)) 0%, var(--ink) 100%)",
        color: "var(--paper)",
        padding: "56px 56px 44px",
        display: "flex", flexDirection: "column",
      }}>
        <div className="row" style={{ gap: 12, marginBottom: "auto" }}>
          <div className="wordmark-mark" style={{ width: 36, height: 36, background: "color-mix(in oklab, var(--gilt) 60%, transparent)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5a2 2 0 0 1 2-2h12v17H6a2 2 0 0 0-2 2V5Z" />
              <path d="M12 7v9M9 11h6" />
            </svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div className="display" style={{ fontSize: 22, color: "var(--paper)" }}>i<em style={{ color: "var(--gilt)", fontStyle: "italic" }}>preach</em></div>
            <div className="ui" style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", opacity: 0.7, marginTop: 2 }}>Predicación · estudio</div>
          </div>
        </div>

        <div style={{ maxWidth: 480 }}>
          <span className="eyebrow" style={{ color: "var(--gilt)" }}>Año litúrgico 2026 · semana 21</span>
          <blockquote style={{
            margin: "20px 0 24px", padding: 0, border: 0,
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 34, lineHeight: 1.2, color: "var(--paper)",
          }}>
            “Predica la palabra; <br />
            insta a tiempo <br />
            y fuera de tiempo.”
          </blockquote>
          <p className="ui" style={{
            fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase",
            color: "var(--gilt)", fontWeight: 600,
          }}>2 Timoteo 4:2 · RVR1960</p>
        </div>

        <div style={{ position: "absolute", right: -120, bottom: -160, opacity: 0.08 }}>
          <svg width="560" height="560" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth=".3">
            <circle cx="50" cy="50" r="48" />
            <circle cx="50" cy="50" r="38" />
            <circle cx="50" cy="50" r="28" />
            <circle cx="50" cy="50" r="18" />
            <path d="M50 6v88M6 50h88" strokeWidth=".4" />
          </svg>
        </div>

        <div className="ui" style={{ marginTop: "auto", fontSize: 11, opacity: 0.55, display: "flex", gap: 16 }}>
          <span>© 2026 ipreach</span>
          <span>·</span>
          <span>Privacidad</span>
          <span>·</span>
          <span>Términos</span>
        </div>
      </div>

      <div style={{ display: "grid", placeItems: "center", padding: "40px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <span className="eyebrow">Bienvenido de vuelta</span>
          <h1 className="display" style={{ fontSize: 36, fontWeight: 500, margin: "8px 0 8px", lineHeight: 1.1 }}>
            {mode === "signin" ? "Continúa preparando tu mensaje." : "Comienza a predicar hoy."}
          </h1>
          <p className="serif muted" style={{ fontSize: 15, marginBottom: 28 }}>
            {mode === "signin" ? "Tus conversaciones y sermones esperan." : "Configura tu perfil en menos de un minuto."}
          </p>

          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            onClick={handleGoogle} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4 5.5l6.3 5.3C41 35.3 44 30.1 44 24c0-1.3-.1-2.7-.4-3.9z" />
            </svg>
            Continuar con Google
          </button>

          <div className="rule-fancy" style={{ margin: "22px 0 16px" }}>
            <span className="eyebrow">O con tu correo</span>
          </div>

          <div className="col" style={{ gap: 12 }}>
            {errorMsg && (
              <div style={{ color: "#E11D48", fontSize: 13, background: "rgba(225,29,72,0.1)", padding: "10px 14px", borderRadius: 8 }}>
                {errorMsg}
              </div>
            )}
            <div>
              <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Correo electrónico</label>
              <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={loading} placeholder="pastor@iglesia.org" />
            </div>
            <div>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                <label className="eyebrow">Contraseña</label>
                {mode === "signin" && <button className="btn-quiet" style={{ fontSize: 10.5, padding: 0 }}>Recuperar</button>}
              </div>
              <input className="field" type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                disabled={loading} placeholder="••••••••" />
            </div>

            <button className="btn btn-accent" style={{ justifyContent: "center", padding: "12px" }} onClick={handleAuth} disabled={loading}>
              {loading ? "Procesando..." : (mode === "signin" ? "Entrar" : "Crear cuenta")} {!loading && <IcArrowRight size={14} />}
            </button>
            <button type="button" className="btn btn-ghost" style={{ justifyContent: "center", padding: "12px", border: "1px dashed var(--line)" }} onClick={onSignIn} disabled={loading}>
              Continuar como Invitado (Sin Registro)
            </button>
          </div>

          <p className="ui muted" style={{ textAlign: "center", marginTop: 22, fontSize: 12 }}>
            {mode === "signin" ? "¿Es tu primera vez? " : "¿Ya tienes cuenta? "}
            <button className="btn-quiet" style={{ padding: 0, color: "var(--accent)", fontSize: 12 }}
              onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}>
              {mode === "signin" ? "Crea una cuenta gratis" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
