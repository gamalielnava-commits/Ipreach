"use client";
import React from "react";
import { IcClose, IcArrowRight } from "./icons";
import { saveProfile } from "@/lib/profile";

export function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [framework, setFramework] = React.useState("Asambleas de Dios");
  const [country, setCountry] = React.useState("");
  const [sermonType, setSermonType] = React.useState("Expositivo");
  const [method, setMethod] = React.useState("PEICA");
  const [length, setLength] = React.useState("Mediano");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleFinish() {
    setLoading(true);
    setErrorMsg("");
    try {
      await saveProfile({
        displayName: name || "Predicador",
        role: role || "Predicador",
        country: country || "",
        framework: framework || "Ninguno",
        churchName: "",
        churchContext: "",
        defaults: {
          sermonTypes: [sermonType],
          method: method.toLowerCase(),
          length: (length.toLowerCase() === "mediano" ? "medio" : length.toLowerCase() === "corto" ? "corto" : "largo") as any,
        },
        onboarded: true,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al guardar el perfil.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-bg">
      <div style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-xl)",
        width: 560, maxWidth: "calc(100% - 32px)",
        boxShadow: "0 30px 80px color-mix(in oklab, var(--ink) 35%, transparent)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "26px 30px 22px",
          background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 6%, var(--paper-2)) 0%, var(--paper-2) 100%)",
          borderBottom: "1px solid var(--line)",
          position: "relative",
        }}>
          <div className="row" style={{ marginBottom: 6 }}>
            <span className="eyebrow">Paso {step + 1} de 3</span>
            <span className="spacer" />
            <button className="btn-icon" onClick={onClose} title="Cerrar"><IcClose size={16} /></button>
          </div>
          <h2 className="display" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.15 }}>
            {step === 0 && <>Bienvenido a <em style={{ color: "var(--accent)", fontStyle: "italic" }}>ipreach</em>.</>}
            {step === 1 && "Tu perfil teológico"}
            {step === 2 && "Tus preferencias"}
          </h2>
          <p className="serif muted" style={{ fontSize: 15, marginTop: 6 }}>
            {step === 0 && "Configuremos tu estudio en menos de un minuto. Lo recordaremos para siempre."}
            {step === 1 && "Tu marco doctrinal vendrá preseleccionado en cada sermón."}
            {step === 2 && "Valores por defecto. Podrás cambiarlos en cualquier momento."}
          </p>

          <div className="row" style={{ marginTop: 18, gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                height: 3, flex: 1,
                background: i <= step ? "var(--accent)" : "var(--line)",
                borderRadius: 999, transition: "background .2s",
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "26px 30px" }}>
          {errorMsg && (
            <div style={{ color: "#E11D48", fontSize: 13, background: "rgba(225,29,72,0.1)", padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
              {errorMsg}
            </div>
          )}
          {step === 0 && (
            <div className="col" style={{ gap: 16 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Tu nombre</label>
                <input className="field" value={name} onChange={(e) => setName(e.target.value)}
                  disabled={loading} placeholder="Pastor Gamaliel Nava" />
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Eres…</label>
                <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                  {["Pastor", "Predicador", "Líder o maestro", "Evangelista", "Estudiante"].map((r) => (
                    <button key={r} className={"chip " + (role === r ? "chip-on" : "")}
                      disabled={loading} onClick={() => setRole(r)}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="col" style={{ gap: 16 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>País (opcional)</label>
                <input className="field" value={country} onChange={(e) => setCountry(e.target.value)}
                  disabled={loading} placeholder="México" />
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Marco doctrinal</label>
                <select className="field" value={framework} onChange={(e) => setFramework(e.target.value)} disabled={loading}>
                  <option value="">Selecciona tu tradición…</option>
                  <optgroup label="Reformada">
                    <option>Reformada / Presbiteriana</option>
                  </optgroup>
                  <optgroup label="Bautista">
                    <option>Bautista</option>
                  </optgroup>
                  <optgroup label="Pentecostal clásica">
                    <option>Asambleas de Dios</option>
                    <option>Iglesia de Dios (Cleveland)</option>
                    <option>Pentecostal Unida</option>
                    <option>Cuadrangular</option>
                  </optgroup>
                  <optgroup label="Wesleyana / Santidad">
                    <option>Metodista / Wesleyana</option>
                    <option>Iglesia del Nazareno</option>
                  </optgroup>
                  <optgroup label="Carismática / No denominacional">
                    <option>Carismático no denominacional</option>
                    <option>Apostólico / Redes apostólicas</option>
                    <option>Vineyard / Tercera Ola</option>
                  </optgroup>
                </select>
                {framework && (
                  <p className="serif muted" style={{ fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                    Tradición reformada centrada en la soberanía de Dios, la gracia y la Confesión de Westminster.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="col" style={{ gap: 16 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Tipo de sermón preferido</label>
                <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                  {["Expositivo", "Textual", "Temático", "Narrativo", "Doctrinal", "Devocional"].map((t) => (
                    <button key={t} className={"chip " + (sermonType === t ? "chip-on" : "")}
                      disabled={loading} onClick={() => setSermonType(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Método preferido</label>
                <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                  {["PEICA", "Robinson", "Lowry", "Chapell", "Wilson", "Stott"].map((t) => (
                    <button key={t} className={"chip " + (method === t ? "chip-on" : "")}
                      disabled={loading} onClick={() => setMethod(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Longitud preferida</label>
                <div className="row" style={{ gap: 6 }}>
                  {([["Corto", "10–15 min"], ["Mediano", "20–30 min"], ["Largo", "35–45 min"]] as [string, string][]).map(([n, d]) => (
                    <button key={n}
                      onClick={() => setLength(n)}
                      disabled={loading}
                      style={{
                        flex: 1, padding: "10px 12px",
                        border: "1px solid " + (length === n ? "var(--ink)" : "var(--line)"),
                        borderRadius: "var(--r-md)",
                        background: length === n ? "var(--paper)" : "var(--paper-2)",
                        textAlign: "center", cursor: "pointer",
                      }}>
                      <div className="ui" style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
                      <div className="ui muted" style={{ fontSize: 10.5, marginTop: 2 }}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "16px 30px 22px", borderTop: "1px solid var(--line)" }}>
          <div className="row">
            <button className="btn btn-ghost" disabled={step === 0 || loading}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={{ opacity: step === 0 ? 0.4 : 1 }}>
              Atrás
            </button>
            <span className="spacer" />
            {step < 2 ? (
              <button className="btn btn-accent" onClick={() => setStep((s) => s + 1)} disabled={loading}>
                Siguiente <IcArrowRight size={14} />
              </button>
            ) : (
              <button className="btn btn-accent" onClick={handleFinish} disabled={loading}>
                {loading ? "Guardando..." : "Empezar a predicar"} {!loading && <IcArrowRight size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
