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

import type { Metadata } from "next";
import { Poppins, Nunito, Lato } from "next/font/google";
import "./globals.css";
import { Navbar, Footer, ScrollToTop } from "@/components";

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

/** Metadatos globales de la aplicación para SEO */
export const metadata: Metadata = {
  title: "Buenas Prácticas - Mapinsol",
  description: "Base de datos de buenas prácticas para el cuidado de personas mayores. Proyecto Mapinsol de la Fundación Padrinos de la Vejez.",
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
        {/* Fondo con gradiente radial */}
        <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]" />

        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
