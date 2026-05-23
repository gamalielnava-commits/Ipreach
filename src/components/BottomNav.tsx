"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IcBook, IcCalendar, IcChat, IcLibrary, IcSlide } from "@/components/icons";

const NAV_ITEMS = [
  { label: "Estudio", icon: IcChat, href: "/", prefix: "/" },
  { label: "Biblio.", icon: IcLibrary, href: "/sermones", prefix: "/sermones" },
  { label: "Serm.", icon: IcBook, href: "/sermones", prefix: "/sermon/" },
  { label: "Series", icon: IcSlide, href: "/", prefix: "/series" },
  { label: "Plan", icon: IcCalendar, href: "/", prefix: "/plan" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        background:
          "color-mix(in oklab, var(--paper, #FBF6E6) 90%, transparent)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop:
          "1px solid color-mix(in oklab, var(--line, #DBCFA5) 70%, transparent)",
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
        {NAV_ITEMS.map(({ label, icon: Icon, href, prefix }) => {
          const active =
            prefix === "/" ? pathname === "/" : pathname.startsWith(prefix);
          return (
            <Link
              key={prefix}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                opacity: active ? 1 : 0.5,
                textDecoration: "none",
                minWidth: 52,
                padding: "2px 0",
              }}
            >
              <Icon
                size={20}
                style={{
                  color: active
                    ? "var(--accent, #7E8E4A)"
                    : "var(--ink-3, #847A58)",
                }}
              />
              <span
                style={{
                  fontFamily:
                    "var(--font-ui, ui-sans-serif, system-ui, sans-serif)",
                  fontSize: 9,
                  fontWeight: 600,
                  color: active
                    ? "var(--accent, #7E8E4A)"
                    : "var(--ink-3, #847A58)",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
