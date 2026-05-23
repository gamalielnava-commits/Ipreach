import type { Metadata, Viewport } from "next";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import "./ipreach.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ipreach - Preparacion de sermones",
  description: "Prepara sermones a nivel profesional con IA.",
  manifest: "/manifest.webmanifest",
  applicationName: "Ipreach",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ipreach",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#6d28d9",
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
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Geist:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="flex min-h-[100dvh] flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                I
              </span>
              <span className="text-base font-bold text-brand-700">Ipreach</span>
            </Link>
            <UserMenu />
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
