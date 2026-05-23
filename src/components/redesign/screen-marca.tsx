"use client";
import React from "react";
import { TopBar } from "./shell";
import { IcDownload, IcCheck, IcClose } from "./icons";

export function MarcaScreen() {
  return (
    <div className="main">
      <TopBar
        title="Marca"
        subtitle="ipreach — sistema de identidad visual"
        right={
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><IcDownload size={14} /> .svg</button>
            <button className="btn btn-ghost btn-sm"><IcDownload size={14} /> .png</button>
            <button className="btn btn-accent btn-sm"><IcDownload size={14} /> Kit completo</button>
          </div>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <section style={{
            padding: "60px 50px",
            background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 4%, var(--paper-2)) 0%, var(--paper-2) 100%)",
            border: "1px solid var(--line)", borderRadius: "var(--r-xl)",
            marginBottom: 40,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -100, right: -100, opacity: 0.06 }}>
              <svg width="500" height="500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth=".3">
                <circle cx="50" cy="50" r="48" />
                <circle cx="50" cy="50" r="38" />
                <circle cx="50" cy="50" r="28" />
                <path d="M50 6v88M6 50h88" />
              </svg>
            </div>
            <div style={{ position: "relative" }}>
              <span className="eyebrow" style={{ color: "var(--accent)" }}>Logotipo principal</span>
              <div style={{ marginTop: 30, marginBottom: 14 }}>
                <LogoPrimary scale={1.6} />
              </div>
              <p className="serif" style={{ fontSize: 17, fontStyle: "italic", color: "var(--ink-2)", maxWidth: 460, marginTop: 24 }}>
                “Predica la palabra; insta a tiempo y fuera de tiempo.”
              </p>
              <p className="ui" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
                2 Timoteo 4:2
              </p>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <span className="eyebrow">Construcción del símbolo</span>
            <h2 className="sec-title" style={{ marginBottom: 8, fontSize: 26 }}>Libro abierto · cruz · llama</h2>
            <p className="serif muted" style={{ fontSize: 15, fontStyle: "italic", marginBottom: 22, maxWidth: 560 }}>
              Tres elementos en uno: la página abierta sostiene la cruz; sobre ella, la pequeña llama del Espíritu corona el conjunto. Mismo gesto, tres lecturas.
            </p>
            <div className="marca-grid-4">
              {([
                ["Libro abierto", "book"],
                ["Más cruz", "cross"],
                ["Más llama", "flame"],
                ["Símbolo final", "final"],
              ] as [string, string][]).map(([n, step], i) => (
                <div key={i} className="card-flat" style={{ padding: 18, textAlign: "center" }}>
                  <div style={{ display: "grid", placeItems: "center", padding: "10px 0 14px" }}>
                    <LogoConstruction step={step} />
                  </div>
                  <div className="ui muted" style={{ fontSize: 11.5, letterSpacing: ".08em" }}>
                    Paso {i + 1} · {n}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <span className="eyebrow">Variantes del logotipo</span>
            <h2 className="sec-title" style={{ marginBottom: 22, fontSize: 26 }}>Cinco bloques · un sistema</h2>
            <div className="marca-grid-3">
              <LogoCard label="Lockup horizontal" sub="Uso principal" bg="var(--paper)">
                <LogoPrimary scale={1} />
              </LogoCard>
              <LogoCard label="Lockup vertical" sub="Pósters · stories" bg="var(--paper)">
                <LogoStack scale={1} />
              </LogoCard>
              <LogoCard label="Solo wordmark" sub="Footers · firmas" bg="var(--paper)">
                <LogoWordmark scale={1.4} />
              </LogoCard>
              <LogoCard label="Solo símbolo" sub="App · favicon" bg="var(--paper)">
                <LogoMark size={72} />
              </LogoCard>
              <LogoCard label="Sello circular" sub="Editorial · sellos" bg="var(--paper)">
                <LogoRoundel size={120} />
              </LogoCard>
              <LogoCard label="Monograma" sub="Marca pequeña" bg="var(--paper)">
                <LogoMonogram size={84} />
              </LogoCard>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <span className="eyebrow">Sobre superficies</span>
            <h2 className="sec-title" style={{ marginBottom: 22, fontSize: 26 }}>Comportamiento en contexto</h2>
            <div className="marca-grid-3">
              <LogoCard label="Sobre crema" sub="Versión por defecto" bg="var(--paper)" big>
                <LogoPrimary scale={1.1} />
              </LogoCard>
              <LogoCard label="Sobre tinta" sub="Modo oscuro · noches" bg="var(--ink)" big dark>
                <LogoPrimary scale={1.1} dark />
              </LogoCard>
              <LogoCard label="Sobre acento" sub="Promo · campañas" bg="var(--accent)" big invert>
                <LogoPrimary scale={1.1} invert />
              </LogoCard>
              <LogoCard label="Monocromático" sub="Impresión a una tinta" bg="var(--paper)" big>
                <LogoPrimary scale={1.1} mono />
              </LogoCard>
              <LogoCard label="Contorno" sub="Marca de agua · grabado" bg="var(--paper-2)" big>
                <LogoPrimary scale={1.1} outline />
              </LogoCard>
              <LogoCard label="Sobre patrón" sub="Empaques · papelería" bg="repeating-linear-gradient(45deg, color-mix(in oklab, var(--accent) 6%, var(--paper-2)) 0 12px, var(--paper-2) 12px 24px)" big>
                <LogoPrimary scale={1.1} />
              </LogoCard>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <span className="eyebrow">Íconos de aplicación</span>
            <h2 className="sec-title" style={{ marginBottom: 22, fontSize: 26 }}>Squircles para iOS · adaptable para Android</h2>
            <div className="row" style={{ gap: 22, padding: 26, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", flexWrap: "wrap" }}>
              {[
                { label: "1024 · iOS", size: 120, variant: "oxblood" },
                { label: "Vísperas", size: 120, variant: "visperas" },
                { label: "Capilla", size: 120, variant: "capilla" },
                { label: "Adaptive", size: 120, variant: "round" },
                { label: "Mono", size: 120, variant: "mono" },
                { label: "60", size: 60, variant: "oxblood" },
                { label: "40", size: 40, variant: "oxblood" },
                { label: "16", size: 16, variant: "oxblood" },
              ].map((t, i) => (
                <div key={i} className="col" style={{ alignItems: "center", gap: 6 }}>
                  <AppIcon size={t.size} variant={t.variant} />
                  <span className="ui muted" style={{ fontSize: 10.5, fontFamily: "var(--font-mono)" }}>{t.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <span className="eyebrow">Tipografía del logotipo</span>
            <h2 className="sec-title" style={{ marginBottom: 22, fontSize: 26 }}>Newsreader · italic 500</h2>
            <div style={{
              padding: "40px 48px",
              background: "var(--paper-2)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
            }}>
              <p style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic", fontWeight: 500,
                fontSize: 120, lineHeight: 0.9, letterSpacing: "-.025em",
                color: "var(--ink)", margin: 0,
              }}>
                i<span style={{ color: "var(--accent)" }}>preach</span>
              </p>
              <div className="row" style={{ marginTop: 22, gap: 24, flexWrap: "wrap" }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9 }}>Wordmark</span>
                  <div className="serif" style={{ fontSize: 13 }}>Newsreader · italic 500</div>
                </div>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9 }}>Tag</span>
                  <div className="ui" style={{ fontSize: 13 }}>Geist · 600 · tracking .18em</div>
                </div>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9 }}>Color base</span>
                  <div className="mono" style={{ fontSize: 13 }}>tinta #1A1410</div>
                </div>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9 }}>Acento</span>
                  <div className="mono" style={{ fontSize: 13 }}>óxido #7A1F1E</div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <span className="eyebrow">Firma con tagline</span>
            <h2 className="sec-title" style={{ marginBottom: 22, fontSize: 26 }}>Acompañamientos opcionales</h2>
            <div className="marca-grid-2">
              <LogoCard label="Firma con tagline" sub="Editorial · papel membretado" bg="var(--paper)">
                <div style={{ textAlign: "center" }}>
                  <LogoPrimary scale={1} />
                  <div className="rule-fancy" style={{ margin: "16px auto 8px", maxWidth: 240 }}>
                    <span className="eyebrow" style={{ fontSize: 9 }}>Predicación · estudio</span>
                  </div>
                  <p className="serif" style={{ fontSize: 13, fontStyle: "italic", color: "var(--ink-3)" }}>
                    Sermones a nivel profesional con IA
                  </p>
                </div>
              </LogoCard>
              <LogoCard label="Sello con motto" sub="Sermones impresos · invitaciones" bg="var(--paper)">
                <div style={{ textAlign: "center" }}>
                  <LogoRoundel size={120} withMotto />
                </div>
              </LogoCard>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <span className="eyebrow">Buenas prácticas</span>
            <h2 className="sec-title" style={{ marginBottom: 22, fontSize: 26 }}>Sí · no</h2>
            <div className="marca-grid-4">
              <DoCard ok label="Espacio mínimo">
                <LogoPrimary scale={0.8} />
                <div style={{ position: "absolute", inset: 0, border: "1px dashed color-mix(in oklab, var(--accent) 40%, transparent)", margin: 22, borderRadius: 8, pointerEvents: "none" }} />
              </DoCard>
              <DoCard ok label="Bloqueo vertical">
                <LogoStack scale={0.85} />
              </DoCard>
              <DoCard label="No comprimir">
                <div style={{ transform: "scaleX(.7)" }}><LogoPrimary scale={1} /></div>
              </DoCard>
              <DoCard label="No usar gradientes">
                <LogoPrimary scale={0.8} bad />
              </DoCard>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

/* ===================== Logo primitives ===================== */

function LogoMark({
  size = 56, color = "var(--accent)", flame = "var(--gilt)", dark = false, mono = false, outline = false,
}: { size?: number; color?: string; flame?: string; dark?: boolean; mono?: boolean; outline?: boolean }) {
  const ink = dark ? "#F8F3E5" : "var(--ink)";
  const accent = mono ? ink : (dark ? flame : color);
  const flameC = mono ? ink : flame;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {outline ? (
        <>
          <path d="M6 18 L32 12 L58 18 L58 54 L32 50 L6 54 Z" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 12 L32 50" stroke={ink} strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M6 18 L32 12 L58 18 L58 54 L32 50 L6 54 Z" fill={mono ? ink : "var(--paper-2)"} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 12 L32 50" stroke={ink} strokeWidth="1.5" />
          <path d="M12 24 L26 21 M12 30 L26 27 M12 36 L26 33 M38 21 L52 24 M38 27 L52 30 M38 33 L52 36" stroke={mono ? "var(--paper)" : ink} strokeWidth=".75" opacity={mono ? 0.4 : 0.35} />
        </>
      )}

      <path d="M30 8 L34 8 L34 18 L40 18 L40 22 L34 22 L34 34 L30 34 L30 22 L24 22 L24 18 L30 18 Z"
        fill={accent} stroke={outline ? accent : "none"} strokeWidth={outline ? 2 : 0} strokeLinejoin="round" />

      <path d="M32 1.5 C 30 4, 28 5.5, 28 8 C 28 10, 30 11.5, 32 11 C 34 11.5, 36 10, 36 8 C 36 5.5, 34 4, 32 1.5 Z"
        fill={flameC} stroke={outline ? flameC : "none"} strokeWidth={outline ? 2 : 0} />
    </svg>
  );
}

function LogoWordmark({ scale = 1, color = "var(--ink)", accent = "var(--accent)" }: { scale?: number; color?: string; accent?: string }) {
  return (
    <span style={{
      fontFamily: "var(--font-display)",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: 44 * scale,
      letterSpacing: "-.018em",
      color: color,
      lineHeight: 1,
      display: "inline-flex", alignItems: "baseline",
    }}>
      i<span style={{ color: accent }}>preach</span>
    </span>
  );
}

function LogoPrimary({
  scale = 1, dark = false, mono = false, outline = false, invert = false, bad = false,
}: { scale?: number; dark?: boolean; mono?: boolean; outline?: boolean; invert?: boolean; bad?: boolean }) {
  const color = dark ? "#F8F3E5" : (invert ? "#fff" : "var(--ink)");
  const accent = mono ? color : (invert ? "var(--gilt)" : "var(--accent)");
  const flame = mono ? color : "var(--gilt)";
  return (
    <div className="row" style={{ gap: 14 * scale, alignItems: "center" }}>
      <LogoMark size={56 * scale} color={accent} flame={flame} dark={dark} mono={mono} outline={outline} />
      <div className="col" style={{ lineHeight: 1 }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic", fontWeight: 500,
          fontSize: 38 * scale, letterSpacing: "-.018em",
          color: color,
          background: bad ? "linear-gradient(135deg, var(--accent), var(--gilt))" : "none",
          WebkitBackgroundClip: bad ? "text" : "border-box",
          WebkitTextFillColor: bad ? "transparent" : "currentColor",
        }}>
          i<span style={{ color: accent, WebkitTextFillColor: bad ? "transparent" : "currentColor" }}>preach</span>
        </span>
        <span style={{
          fontFamily: "var(--font-ui)",
          fontSize: 9 * scale, letterSpacing: ".22em",
          textTransform: "uppercase", fontWeight: 600,
          color: dark ? "rgba(248,243,229,.55)" : (invert ? "rgba(255,255,255,.7)" : "var(--ink-3)"),
          marginTop: 3 * scale,
        }}>
          predicación · estudio
        </span>
      </div>
    </div>
  );
}

function LogoStack({ scale = 1 }: { scale?: number }) {
  return (
    <div className="col" style={{ alignItems: "center", gap: 14 * scale }}>
      <LogoMark size={68 * scale} />
      <LogoWordmark scale={scale * 0.9} />
      <span style={{
        fontFamily: "var(--font-ui)", fontSize: 9 * scale,
        letterSpacing: ".22em", textTransform: "uppercase",
        fontWeight: 600, color: "var(--ink-3)",
      }}>
        predicación · estudio
      </span>
    </div>
  );
}

function LogoMonogram({ size = 84 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      background: "var(--ink)",
      color: "var(--paper)",
      borderRadius: 14,
      display: "grid", placeItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      <span style={{
        position: "absolute", top: 6, left: 8,
        fontFamily: "var(--font-ui)", fontSize: 8,
        letterSpacing: ".2em", color: "var(--gilt)",
        fontWeight: 700,
      }}>·i·</span>
      <span style={{
        fontFamily: "var(--font-display)",
        fontStyle: "italic", fontWeight: 500,
        fontSize: size * 0.58, lineHeight: 1,
        color: "var(--paper)",
        letterSpacing: "-.04em",
      }}>i<span style={{ color: "var(--gilt)" }}>p</span></span>
    </div>
  );
}

function LogoRoundel({ size = 120, withMotto = false }: { size?: number; withMotto?: boolean }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <path id="roundtxt" d={`M ${r} ${r} m -${r - 10} 0 a ${r - 10} ${r - 10} 0 1 1 ${2 * (r - 10)} 0 a ${r - 10} ${r - 10} 0 1 1 -${2 * (r - 10)} 0`} />
      </defs>
      <circle cx={r} cy={r} r={r - 2} fill="var(--ink)" stroke="var(--gilt)" strokeWidth="1" />
      <circle cx={r} cy={r} r={r - 10} fill="none" stroke="var(--gilt)" strokeWidth=".5" opacity=".6" />

      <text fill="var(--gilt)" fontSize={size * 0.065} fontFamily="Geist, sans-serif"
        fontWeight="600" letterSpacing=".22em">
        <textPath href="#roundtxt" startOffset="0%">
          {withMotto
            ? "✦ PRAEDICA VERBUM ✦ PREDICA LA PALABRA "
            : "✦ IPREACH ✦ ESTABLECIDO 2026 ✦ PREDICACION  "}
        </textPath>
      </text>

      <g transform={`translate(${r - size * 0.22}, ${r - size * 0.25})`}>
        <g transform={`scale(${size * 0.45 / 64})`}>
          <path d="M6 18 L32 12 L58 18 L58 54 L32 50 L6 54 Z" fill="var(--paper)" opacity=".08" stroke="var(--gilt)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M32 12 L32 50" stroke="var(--gilt)" strokeWidth="1" />
          <path d="M30 8 L34 8 L34 18 L40 18 L40 22 L34 22 L34 34 L30 34 L30 22 L24 22 L24 18 L30 18 Z" fill="var(--paper)" />
          <path d="M32 1.5 C 30 4, 28 5.5, 28 8 C 28 10, 30 11.5, 32 11 C 34 11.5, 36 10, 36 8 C 36 5.5, 34 4, 32 1.5 Z" fill="var(--gilt)" />
        </g>
      </g>
    </svg>
  );
}

function LogoConstruction({ step }: { step: string }) {
  const showBook = step !== "none";
  const showCross = step === "cross" || step === "flame" || step === "final";
  const showFlame = step === "flame" || step === "final";
  const isFinal = step === "final";

  return (
    <svg width="100" height="100" viewBox="0 0 64 64" fill="none">
      {!isFinal && (
        <g opacity=".18">
          <line x1="32" y1="0" x2="32" y2="64" stroke="var(--accent)" strokeWidth=".4" />
          <line x1="0" y1="32" x2="64" y2="32" stroke="var(--accent)" strokeWidth=".4" />
          <circle cx="32" cy="32" r="28" stroke="var(--accent)" strokeWidth=".4" strokeDasharray="2 2" />
        </g>
      )}

      {showBook && (
        <>
          <path d="M6 18 L32 12 L58 18 L58 54 L32 50 L6 54 Z"
            fill={isFinal ? "var(--paper-2)" : "transparent"}
            stroke="var(--ink)" strokeWidth={isFinal ? 2 : 1.5} strokeLinejoin="round"
            opacity={step === "book" ? 1 : 0.85} />
          <path d="M32 12 L32 50" stroke="var(--ink)" strokeWidth="1.5" />
        </>
      )}

      {showCross && (
        <path d="M30 8 L34 8 L34 18 L40 18 L40 22 L34 22 L34 34 L30 34 L30 22 L24 22 L24 18 L30 18 Z"
          fill={isFinal ? "var(--accent)" : "transparent"}
          stroke="var(--accent)" strokeWidth={isFinal ? 0 : 1.5} strokeLinejoin="round" />
      )}

      {showFlame && (
        <path d="M32 1.5 C 30 4, 28 5.5, 28 8 C 28 10, 30 11.5, 32 11 C 34 11.5, 36 10, 36 8 C 36 5.5, 34 4, 32 1.5 Z"
          fill={isFinal ? "var(--gilt)" : "transparent"}
          stroke="var(--gilt)" strokeWidth={isFinal ? 0 : 1.5} />
      )}
    </svg>
  );
}

function AppIcon({ size = 120, variant = "oxblood" }: { size?: number; variant?: string }) {
  let bg = "linear-gradient(135deg, var(--gilt) 0%, #8a6a20 100%)";
  if (variant === "oxblood") bg = "linear-gradient(150deg, #8a2120 0%, #5a1413 100%)";
  if (variant === "visperas") bg = "linear-gradient(150deg, #1a2a3a 0%, #0a1018 100%)";
  if (variant === "capilla") bg = "linear-gradient(150deg, #8e9e5a 0%, #5a6a32 100%)";
  if (variant === "mono") bg = "linear-gradient(150deg, #1a1410 0%, #000 100%)";
  const round = variant === "round";

  return (
    <div style={{
      width: size, height: size,
      borderRadius: round ? "50%" : size * 0.22,
      background: bg,
      display: "grid", placeItems: "center",
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 24px color-mix(in oklab, var(--ink) 20%, transparent)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(80% 60% at 30% 20%, rgba(255,255,255,.15) 0%, transparent 60%)",
      }} />
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 64 64" fill="none" style={{ position: "relative" }}>
        <path d="M6 18 L32 12 L58 18 L58 54 L32 50 L6 54 Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.85)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M32 12 L32 50" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" />
        <path d="M30 8 L34 8 L34 18 L40 18 L40 22 L34 22 L34 34 L30 34 L30 22 L24 22 L24 18 L30 18 Z" fill="#fff" />
        <path d="M32 1.5 C 30 4, 28 5.5, 28 8 C 28 10, 30 11.5, 32 11 C 34 11.5, 36 10, 36 8 C 36 5.5, 34 4, 32 1.5 Z" fill="#f4c870" />
      </svg>
    </div>
  );
}

function LogoCard({
  label, sub, bg, children, big = false, dark = false, invert = false,
}: { label: string; sub: string; bg: string; children: React.ReactNode; big?: boolean; dark?: boolean; invert?: boolean }) {
  return (
    <div style={{
      padding: big ? "44px 24px 18px" : "30px 18px 14px",
      background: bg, border: "1px solid var(--line)", borderRadius: "var(--r-lg)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      minHeight: big ? 220 : 160,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "grid", placeItems: "center", flex: 1, width: "100%" }}>{children}</div>
      <div style={{
        borderTop: "1px solid " + (dark ? "rgba(255,255,255,.1)" : (invert ? "rgba(255,255,255,.2)" : "var(--line-soft)")),
        paddingTop: 10, width: "100%", textAlign: "center",
      }}>
        <div className="ui" style={{
          fontSize: 12, fontWeight: 600,
          color: dark ? "rgba(248,243,229,.95)" : (invert ? "#fff" : "var(--ink-2)"),
        }}>{label}</div>
        <div className="ui" style={{
          fontSize: 10.5, marginTop: 2,
          color: dark ? "rgba(248,243,229,.55)" : (invert ? "rgba(255,255,255,.7)" : "var(--ink-4)"),
        }}>{sub}</div>
      </div>
    </div>
  );
}

function DoCard({ ok = false, label, children }: { ok?: boolean; label: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: 18, background: "var(--paper-2)",
      border: "1px solid var(--line)", borderRadius: "var(--r-lg)",
      position: "relative", overflow: "hidden", minHeight: 160,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
    }}>
      <div style={{
        position: "absolute", top: 10, right: 10,
        width: 24, height: 24, borderRadius: 999,
        background: ok ? "var(--accent)" : "#a83232",
        color: "#fff",
        display: "grid", placeItems: "center",
      }}>
        {ok ? <IcCheck size={14} /> : <IcClose size={14} />}
      </div>
      <div style={{ flex: 1, display: "grid", placeItems: "center", position: "relative" }}>{children}</div>
      <div className="ui" style={{ fontSize: 11.5, color: "var(--ink-2)", textAlign: "center" }}>{label}</div>
    </div>
  );
}
