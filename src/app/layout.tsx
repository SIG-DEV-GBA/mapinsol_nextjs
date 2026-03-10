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
import { Poppins, Nunito, Lato, Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Navbar, Footer, ScrollToTop } from "@/components";
import { JsonLd } from "@/components/seo/JsonLd";
import { CookieBanner } from "@/components/CookieBanner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="es" className={cn(poppins.variable, nunito.variable, lato.variable, "font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col font-lato antialiased relative overflow-x-hidden" suppressHydrationWarning>
        <Script id="df" strategy="afterInteractive">{`(function(){var _=Object.defineProperty,a=atob,b=[a("8J+agCBQcm95ZWN0byBEZXNhcnJvbGxhZG8gcG9yIEdlb3JnaSBCb3Jpc292IEFsZWtzYW5kcm92"),a("8J+TjSBVYmljYWNpw7NuOiBaYW1vcmEsIEVzcGHDsWEK8J+SuyBUZWNoIFN0YWNrOiBGdWxsc3RhY2sgKE5leHQuanMsIFJlYWN0LCBOb2RlLmpzLCBUeXBlU2NyaXB0KQrwn5SXIEdpdEh1YjogZ2l0aHViLmNvbS9nZW9yZ2lmMHgK8J+TpyBNYWlsOiBnZTByZ2lkM3ZAZ21haWwuY29tCgrCoUdyYWNpYXMgcG9yIGluc3BlY2Npb25hclwhIFNpIGJ1c2NhcyB1biBkZXYsIGhhYmxlbW9zLg==")];_(window,a("ZmlybWE="),{value:function(){console.clear();console.log("%c"+b[0],"background:linear-gradient(90deg,#4b6cb7 0%,#182848 100%);color:#fff;padding:15px;font-size:1.5rem;border-radius:8px 8px 0 0;font-family:sans-serif;font-weight:bold;text-align:center");console.log("%c"+b[1],"background:#f4f4f4;color:#333;padding:15px;font-size:1rem;border-radius:0 0 8px 8px;font-family:monospace;line-height:1.5");return{status:"Available for hire",github:"https://github.com/georgif0x",mail:"ge0rgid3v@gmail.com"}},writable:false,configurable:false})})();`}</Script>
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
        <Script id="gtranslate-settings" strategy="afterInteractive">
          {`window.gtranslateSettings = {"default_language":"es","languages":["es","en","gl","ca","eu"],"detect_browser_language":false,"wrapper_selector":".gtranslate_wrapper","flag_style":"3d","flag_size":24,"horizontal_position":"inline","native_language_names":true};`}
        </Script>
        <Script src="https://cdn.gtranslate.net/widgets/latest/dropdown.js" strategy="afterInteractive" />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <LanguageSwitcher />
        <CookieBanner />
      </body>
    </html>
  );
}
