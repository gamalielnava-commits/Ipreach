import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ipreach.css";

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
      <body>{children}</body>
    </html>
  );
}
