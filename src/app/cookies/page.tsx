import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, Shield, BarChart3, Settings, Globe, RefreshCw, Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de Mapinsol - Fundación Padrinos de la Vejez',
};

export default function CookiesPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero + Wave */}
      <div className="bg-gradient-to-b from-[#F29429] to-[#E0841F] text-white">
        <div className="container mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <Cookie className="h-7 w-7 md:h-8 md:w-8 text-white flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins">
              Política de Cookies
            </h1>
          </div>
          <p className="text-white/80 text-center mt-3 max-w-lg mx-auto text-sm md:text-base">
            Última actualización: Marzo 2026
          </p>
        </div>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-[250px] right-[5%] w-[300px] h-[300px] rounded-full bg-[#F29429]/12 blur-[75px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[400px] left-[3%] w-[250px] h-[250px] rounded-full bg-[#A10D5E]/12 blur-[65px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[700px] right-[10%] w-[220px] h-[220px] rounded-full bg-[#A10D5E]/10 blur-[60px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[900px] left-[8%] w-[280px] h-[280px] rounded-full bg-[#F29429]/10 blur-[70px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[1200px] right-[15%] w-[240px] h-[240px] rounded-full bg-[#F29429]/12 blur-[65px] pointer-events-none" style={{zIndex: 0}} />

      {/* Content */}
      <section className="relative container mx-auto px-4 py-8 md:py-12" style={{zIndex: 1}}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F29429] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* ¿Qué son? */}
          <Section number="1" title="¿Qué son las cookies?">
            <p className="text-gray-600">
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo
              cuando los visitas. Sirven para recordar tus preferencias, mejorar tu experiencia de navegación
              y recopilar información analítica.
            </p>
          </Section>

          {/* Tipos */}
          <Section number="2" title="¿Qué tipos de cookies utilizamos?">
            <div className="space-y-6">
              {/* Esenciales */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-[#A10D5E]" />
                  <h3 className="font-bold text-gray-900 font-poppins">2.1. Cookies esenciales</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Son necesarias para el funcionamiento básico del sitio web. Sin ellas, el sitio no funcionaría correctamente.
                </p>
                <CookieTable
                  cookies={[
                    { name: 'cookie-consent', purpose: 'Almacena tu preferencia de cookies', duration: '1 año' },
                  ]}
                  accent="purple"
                />
              </div>

              {/* Analíticas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-[#F29429]" />
                  <h3 className="font-bold text-gray-900 font-poppins">2.2. Cookies analíticas</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Nos permiten analizar el uso del sitio web para mejorarlo. Utilizamos Google Analytics.
                </p>
                <CookieTable
                  cookies={[
                    { name: '_ga', purpose: 'Distinguir usuarios únicos', duration: '2 años' },
                    { name: '_ga_*', purpose: 'Mantener el estado de la sesión', duration: '2 años' },
                  ]}
                  accent="orange"
                />
              </div>
            </div>
          </Section>

          {/* Gestión */}
          <Section number="3" title="¿Cómo gestionar las cookies?">
            <p className="text-gray-600 mb-4">Puedes gestionar tus preferencias de cookies de varias formas:</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Settings className="w-5 h-5 text-[#A10D5E] mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">
                  <strong className="text-gray-900">Desde nuestro sitio:</strong> Al acceder por primera vez, te mostramos un banner
                  donde puedes aceptar todas, solo las esenciales o configurar tus preferencias.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Globe className="w-5 h-5 text-[#F29429] mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">
                  <strong className="text-gray-900">Desde tu navegador:</strong> Puedes configurar tu navegador para bloquear o eliminar cookies.
                  Consulta la ayuda de tu navegador para más información.
                </p>
              </div>
            </div>

            <p className="text-gray-700 font-semibold text-sm mb-3">Configuración en navegadores:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <BrowserLink name="Chrome" href="https://support.google.com/chrome/answer/95647" />
              <BrowserLink name="Firefox" href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" />
              <BrowserLink name="Safari" href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" />
              <BrowserLink name="Edge" href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" />
            </div>
          </Section>

          {/* Terceros */}
          <Section number="4" title="Cookies de terceros">
            <p className="text-gray-600 mb-4">Utilizamos servicios de terceros que pueden instalar cookies en tu dispositivo:</p>
            <div className="flex items-start gap-3 p-4 bg-[#F29429]/5 border border-[#F29429]/15 rounded-xl">
              <BarChart3 className="w-5 h-5 text-[#F29429] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600 text-sm">
                  <strong className="text-gray-900">Google Analytics:</strong> Para análisis estadístico del tráfico web.
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#F29429] text-sm font-medium hover:underline mt-1"
                >
                  Política de privacidad de Google
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Section>

          {/* Actualizaciones */}
          <Section number="5" title="Actualizaciones de esta política">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-[#A10D5E] mt-0.5 flex-shrink-0" />
              <p className="text-gray-600">
                Podemos actualizar esta política de cookies. Te recomendamos revisarla periódicamente.
                La fecha de última actualización aparece al inicio del documento.
              </p>
            </div>
          </Section>

          {/* Contacto */}
          <Section number="6" title="Contacto">
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#F29429]/5 to-[#A10D5E]/5 rounded-xl border border-[#F29429]/10">
              <div className="w-12 h-12 rounded-xl bg-[#F29429] flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Si tienes dudas sobre nuestra política de cookies:</p>
                <a href="mailto:mapinsol@fundacionpadrinosdelavejez.es" className="text-[#F29429] font-bold hover:underline">mapinsol@fundacionpadrinosdelavejez.es</a>
              </div>
            </div>
          </Section>
        </div>
      </section>
    </main>
  );
}

/* ---------- Sub-components ---------- */

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F29429] text-white text-sm font-bold flex-shrink-0">
          {number}
        </span>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 font-poppins">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function CookieTable({ cookies, accent }: { cookies: { name: string; purpose: string; duration: string }[]; accent: 'purple' | 'orange' }) {
  const headerBg = accent === 'purple' ? 'bg-[#A10D5E]' : 'bg-[#F29429]';
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className={`${headerBg} text-white`}>
            <th className="px-4 py-3 text-left font-semibold">Cookie</th>
            <th className="px-4 py-3 text-left font-semibold">Finalidad</th>
            <th className="px-4 py-3 text-left font-semibold">Duración</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie, i) => (
            <tr key={cookie.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 font-mono text-xs text-gray-800">{cookie.name}</td>
              <td className="px-4 py-3 text-gray-600">{cookie.purpose}</td>
              <td className="px-4 py-3 text-gray-500">{cookie.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BrowserLink({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#F29429]/30 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-[#F29429]"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      {name}
    </a>
  );
}
