"use client";
import React from "react";
import { SectionHead } from "./shared";
import { IcArrowRight, IcDownload } from "./icons";

export function PrintScreen({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 70,
      background: "color-mix(in oklab, var(--ink) 60%, transparent)",
      backdropFilter: "blur(4px)",
      overflow: "auto",
      padding: "30px 20px 60px",
    }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 1,
        margin: "-30px -20px 20px",
        padding: "12px 20px",
        background: "color-mix(in oklab, var(--ink) 80%, transparent)",
        backdropFilter: "blur(10px)",
        color: "var(--paper)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onClose} style={{ color: "var(--paper)", display: "inline-flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <IcArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Volver al editor
        </button>
        <span className="spacer" />
        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--paper)" }}>
          Vista de impresión · El temor que se rinde a la fe
        </span>
        <span className="spacer" />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>3 páginas · A4</span>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--paper)", borderColor: "rgba(255,255,255,.2)" }}>
          <IcDownload size={14} /> PDF
        </button>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--paper)", borderColor: "rgba(255,255,255,.2)" }}>
          <IcDownload size={14} /> Word
        </button>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 30 }}>
        <PrintPage page={1} of={3}>
          <header style={{ textAlign: "center", marginBottom: 36, paddingBottom: 22, borderBottom: "1px solid var(--line)" }}>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>Sermón dominical · serie Hebreos</div>
            <h1 className="display" style={{ fontSize: 36, fontWeight: 500, margin: "14px 0 8px" }}>
              El temor que se rinde a la fe
            </h1>
            <p className="serif" style={{ fontSize: 17, fontStyle: "italic", color: "var(--ink-2)", maxWidth: 540, margin: "0 auto" }}>
              La fe genuina no espera a que el miedo se vaya; camina con él hasta que aprende a confiar.
            </p>
            <div className="row" style={{ justifyContent: "center", gap: 22, marginTop: 18, fontFamily: "var(--font-ui)", fontSize: 11.5, color: "var(--ink-3)" }}>
              <span><strong style={{ color: "var(--ink)" }}>Texto base</strong> · Hebreos 11:1–6 · RVR1960</span>
              <span>·</span>
              <span><strong style={{ color: "var(--ink)" }}>Predicador</strong> · Pastor Gamaliel Nava</span>
              <span>·</span>
              <span><strong style={{ color: "var(--ink)" }}>Domingo</strong> · 24 May 2026</span>
            </div>
          </header>

          <div className="row" style={{ gap: 22, padding: "14px 22px", background: "var(--paper-2)", borderRadius: "var(--r-md)", marginBottom: 30, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-3)" }}>
            <span className="eyebrow">Índice</span>
            <span className="spacer" />
            <span>I. Certeza, no ausencia de temblor — p. 1</span>
            <span>II. La voz de la promesa — p. 2</span>
            <span>III. La fe probada — p. 3</span>
          </div>

          <SectionHead roman="0." kicker="Introducción" />
          <p className="dropcap" style={{ fontSize: 16 }}>
            Hay un temor que cierra las puertas por dentro y otro que despierta antes del amanecer para orar. Los discípulos conocían ambos. La primera carta que la iglesia leyó en voz alta no comenzaba con un manual, sino con un grito: «sin fe es imposible agradar a Dios».
          </p>

          <blockquote className="scripture" style={{ margin: "20px 0" }}>
            Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve. Sin fe es imposible agradar a Dios.
            <cite>Hebreos 11:1, 6 · RVR1960</cite>
          </blockquote>

          <SectionHead roman="I." kicker="Punto 1" title="La fe es certeza, no ausencia de temblor" />
          <p style={{ fontSize: 15.5 }}>
            Hebreos no define la fe como un sentimiento limpio, sino como la sustancia de lo que se espera. En griego, <em>hypostasis</em>: «aquello que sostiene por debajo». La fe es el suelo invisible que aparece bajo el pie justo cuando das el paso.
          </p>
        </PrintPage>

        <PrintPage page={2} of={3}>
          <SectionHead roman="II." kicker="Punto 2" title="La fe encuentra su voz en la promesa" />
          <p style={{ fontSize: 15.5 }}>
            El temor habla primero; siempre. Pero la fe responde con un texto. Por eso David, en el valle de sombra, no inventa consuelo: cita la promesa. La oración que vence el temor no es la más elaborada, es la que se aferra a una sola línea: «no temeré mal alguno, porque tú estarás conmigo».
          </p>

          <SectionHead kicker="Ilustración" />
          <p style={{
            fontSize: 15.5,
            borderLeft: "2px solid var(--gilt)",
            fontStyle: "italic", color: "var(--ink-2)",
            padding: "10px 20px",
            background: "color-mix(in oklab, var(--gilt) 5%, transparent)",
            borderRadius: "0 6px 6px 0",
          }}>
            Un guía de montaña en los Andes contaba que, en las tormentas, los caminantes nuevos miran hacia la nube; los veteranos miran la cuerda. La cuerda no quita la tormenta —la atraviesa contigo.
          </p>

          <SectionHead kicker="Aplicación" />
          <ol style={{ paddingLeft: 0, listStyle: "none" }}>
            {[
              "Identifica el temor que más te repite esta semana. Escríbelo. Frente a él, escribe una promesa concreta.",
              "Camina un paso con esa promesa antes de pedir certezas. Obediencia tiembla, pero obedece.",
              "Llama a alguien que esté en su propio valle y léele la promesa. La fe se contagia en voz alta.",
            ].map((a, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, padding: "10px 0", borderBottom: "1px dashed var(--line-soft)" }}>
                <span className="ui" style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, paddingTop: 4 }}>0{i + 1}</span>
                <span style={{ fontSize: 15 }}>{a}</span>
              </li>
            ))}
          </ol>
        </PrintPage>

        <PrintPage page={3} of={3}>
          <SectionHead roman="III." kicker="Punto 3" title="La fe es probada en el silencio" />
          <p style={{ fontSize: 15.5 }}>
            «Para que vuestra fe, mucho más preciosa que el oro, sea hallada en alabanza, gloria y honra». La prueba no destruye la fe; la depura. Cuando Dios calla, no se ha ido —está afinando la voz con la que volverá a hablar en nosotros.
          </p>

          <SectionHead roman="✠" kicker="Cierre" />
          <p style={{ fontSize: 16, fontWeight: 500 }}>
            Cristo no nos llama a una fe sin cicatrices. Nos llama a una fe que mira la cicatriz —la suya, en la mano abierta— y dice: si Él pudo amarme a este precio, puedo confiarle el día de mañana.
          </p>

          <div className="rule" style={{ margin: "28px 0" }} />

          <div className="ui" style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.6 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Bibliografía consultada</div>
            <p>· Bryan Chapell — <em>Christ-Centered Preaching</em>.<br />
              · Haddon Robinson — <em>La predicación bíblica</em>.<br />
              · Tim Keller — comentario de Hebreos.<br />
              · Pérez Millos — comentario exegético del texto griego.</p>
          </div>
        </PrintPage>
      </div>
    </div>
  );
}

function PrintPage({ children, page, of }: { children: React.ReactNode; page: number; of: number }) {
  return (
    <div style={{
      background: "var(--paper)",
      border: "1px solid var(--line)",
      borderRadius: 2,
      boxShadow: "0 30px 60px -20px color-mix(in oklab, var(--ink) 30%, transparent)",
      padding: "56px 64px",
      minHeight: 1080,
      fontFamily: "var(--font-display)",
      lineHeight: 1.65,
      position: "relative",
    }}>
      {children}
      <footer style={{
        position: "absolute", bottom: 30, left: 64, right: 64,
        display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-ui)", fontSize: 10.5, color: "var(--ink-4)",
        letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600,
        paddingTop: 12, borderTop: "1px solid var(--line-soft)",
      }}>
        <span>ipreach · El temor que se rinde a la fe</span>
        <span>{page} / {of}</span>
      </footer>
    </div>
  );
}
