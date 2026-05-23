import type { Metadata, Viewport } from "next";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import "./ipreach.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ipreach — estudio de predicación",
  description: "Prepara sermones a nivel profesional con IA.",
  manifest: "/manifest.webmanifest",
  applicationName: "ipreach",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ipreach",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#7E8E4A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-palette="capilla">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Source+Serif+4:opsz,wght@8..60,400..700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Geist:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="flex min-h-[100dvh] flex-col">
          <header
            className="sticky top-0 z-20 hidden h-14 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur md:flex"
          >
            <Link href="/" className="flex items-center">
              <span
                style={{
                  fontFamily: "var(--font-display, Newsreader, Georgia, serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 22,
                  letterSpacing: "-0.018em",
                  color: "var(--ink, #2A2614)",
                  lineHeight: 1,
                }}
              >
                i<span style={{ color: "var(--accent, #7E8E4A)" }}>preach</span>
              </span>
            </Link>
            <UserMenu />
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
