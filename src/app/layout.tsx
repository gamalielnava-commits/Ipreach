import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ipreach - Preparacion de sermones",
  description: "Prepara sermones a nivel profesional con IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-brand-700">
              Ipreach
            </Link>
            <Link href="/wizard" className="btn-primary">
              Nuevo sermon
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-stone-400">
          Ipreach - MVP. Los sermones se guardan en este navegador.
        </footer>
      </body>
    </html>
  );
}
