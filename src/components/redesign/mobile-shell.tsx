"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import { IOSEstudio, IOSSermon, IOSSerie } from "./screen-movil";
import {
  IcBook,
  IcCalendar,
  IcChat,
  IcLibrary,
  IcSlide,
  IcSettings,
} from "./icons";
import type { Screen } from "./shell";

type NavItemSpec = {
  label: string;
  icon: (p: { size?: number; style?: React.CSSProperties }) => React.JSX.Element;
  kind: "screen" | "link";
  screen?: Screen;
  href?: string;
};

const NAV_ITEMS: NavItemSpec[] = [
  { label: "Estudio", icon: IcChat, kind: "screen", screen: "estudio" },
  { label: "Bibli.", icon: IcLibrary, kind: "link", href: "/sermones" },
  { label: "Serm.", icon: IcBook, kind: "screen", screen: "sermon" },
  { label: "Series", icon: IcSlide, kind: "screen", screen: "series" },
  { label: "Plan", icon: IcCalendar, kind: "screen", screen: "planificador" },
];

export function MobileShell({
  screen,
  setScreen,
  onOpenFilters,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  onOpenFilters: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--paper)",
        color: "var(--ink)",
        position: "relative",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 64px)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ position: "relative", minHeight: "calc(100dvh - 64px)" }}>
        {screen === "estudio" && <IOSEstudio fullscreen />}
        {screen === "sermon" && <IOSSermon fullscreen />}
        {screen === "series" && <IOSSerie fullscreen />}
        {(screen === "biblioteca" || screen === "planificador" || screen === "movil" || screen === "marca") && (
          <MobilePlaceholder
            title={
              screen === "biblioteca" ? "Biblioteca"
                : screen === "planificador" ? "Planificador"
                  : screen === "movil" ? "Móvil"
                    : "Marca"
            }
            subtitle="Disponible próximamente en la versión móvil"
          />
        )}
      </div>

      <div
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 14px)",
          right: 16,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-ui, ui-sans-serif, system-ui, sans-serif)",
            fontSize: 12,
            color: "var(--ink-2)",
            background: "color-mix(in oklab, var(--paper) 80%, transparent)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "0.5px solid color-mix(in oklab, var(--ink) 14%, transparent)",
            borderRadius: 999,
            padding: "6px 12px",
            boxShadow: "0 4px 14px color-mix(in oklab, var(--ink) 12%, transparent)",
          }}
        >
          <UserMenu />
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label="Filtros"
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            background: "color-mix(in oklab, var(--paper) 80%, transparent)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "0.5px solid color-mix(in oklab, var(--ink) 14%, transparent)",
            display: "grid",
            placeItems: "center",
            color: "var(--ink-2)",
            boxShadow: "0 4px 14px color-mix(in oklab, var(--ink) 12%, transparent)",
            cursor: "pointer",
          }}
        >
          <IcSettings size={16} />
        </button>
      </div>

      <nav
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          background: "color-mix(in oklab, var(--paper) 85%, transparent)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderTop: "1px solid color-mix(in oklab, var(--line) 70%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "8px 4px 6px",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active =
              item.kind === "screen"
                ? screen === item.screen && pathname === "/"
                : item.href
                  ? pathname.startsWith(item.href)
                  : false;
            const Icon = item.icon;
            const onTap = () => {
              if (item.kind === "screen" && item.screen) {
                if (pathname !== "/") router.push("/");
                setScreen(item.screen);
              } else if (item.kind === "link" && item.href) {
                router.push(item.href);
              }
            };
            return (
              <button
                type="button"
                key={item.label}
                onClick={onTap}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  opacity: active ? 1 : 0.55,
                  minWidth: 52,
                  padding: "2px 0",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: active ? "var(--accent)" : "var(--ink-3)",
                  }}
                />
                <span
                  className="ui"
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: ".04em",
                    color: active ? "var(--accent)" : "var(--ink-3)",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function MobilePlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
      }}
    >
      <h1
        className="display"
        style={{ fontSize: 28, fontWeight: 500, color: "var(--accent)", fontStyle: "italic" }}
      >
        {title}
      </h1>
      <p className="serif muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
        {subtitle}
      </p>
    </div>
  );
}
