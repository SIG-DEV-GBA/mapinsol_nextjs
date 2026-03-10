/**
 * =============================================================================
 * ROOT LAYOUT - APLICACIÓN NEXT.JS
 * =============================================================================
 *
 * Layout raíz que envuelve toda la aplicación. Define:
 * - Fuentes tipográficas (Poppins, Nunito, Lato)
 * - Metadatos globales (título, descripción, favicon)
 * - Estructura base (navbar + contenido + footer)
 * - Fondo decorativo con gradiente radial
 * - Botón scroll-to-top global
 *
 * TIPOGRAFÍA:
 * - Poppins: Títulos principales (h1, h2)
 * - Nunito: Subtítulos (h3, h4)
 * - Lato: Cuerpo/párrafos (default)
 *
 * @module app/layout
 */

import type { Metadata, Viewport } from "next";
import { Poppins, Nunito, Lato } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Navbar, Footer, ScrollToTop } from "@/components";
import { JsonLd } from "@/components/seo/JsonLd";
import { CookieBanner } from "@/components/CookieBanner";

/** Poppins - Fuente para títulos principales (h1, h2) */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/** Nunito - Fuente para subtítulos (h3, h4) */
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

/** Lato - Fuente para cuerpo de texto y párrafos */
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#A10D5E',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mapinsol.es'),
  title: {
    template: '%s | Mapinsol',
    default: 'Buenas Prácticas que Transforman Vidas | Mapinsol',
  },
  description: 'Catálogo de buenas prácticas innovadoras en atención y cuidado de personas mayores. Proyecto de la Fundación Padrinos de la Vejez.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Mapinsol - Buenas Prácticas',
    images: [
      {
        url: '/logos/og-default.webp',
        width: 1200,
        height: 630,
        alt: 'Mapinsol - Buenas Prácticas en Atención a Personas Mayores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: "/logos/favicon.webp",
  },
};

/**
 * Root Layout - Estructura principal de la aplicación
 *
 * Envuelve todas las páginas con:
 * - Variables CSS de tipografía
 * - Navbar sticky
 * - Footer
 * - Botón scroll-to-top
 * - Fondo decorativo
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${nunito.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col font-lato antialiased relative overflow-x-hidden" suppressHydrationWarning>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-Z222Z7CJWF" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Z222Z7CJWF');`}
        </Script>
        {/* Fondo con gradiente radial */}
        <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]" />

        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Fundación Padrinos de la Vejez',
          url: 'https://fundacionpadrinosdelavejez.es',
          logo: 'https://mapinsol.es/logos/logo%20FPV.png',
          sameAs: [],
        }} />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
