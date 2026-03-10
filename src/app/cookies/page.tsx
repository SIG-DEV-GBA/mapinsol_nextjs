import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de Mapinsol - Fundación Padrinos de la Vejez',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#700D39] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#700D39] to-[#8B1547] rounded-xl">
              <Cookie className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
                Política de Cookies
              </h1>
              <p className="text-gray-500 text-sm">Última actualización: Marzo 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo
              cuando los visitas. Sirven para recordar tus preferencias, mejorar tu experiencia de navegación
              y recopilar información analítica.
            </p>

            <h2>2. ¿Qué tipos de cookies utilizamos?</h2>

            <h3>2.1. Cookies esenciales</h3>
            <p>
              Son necesarias para el funcionamiento básico del sitio web. Sin ellas, el sitio no funcionaría correctamente.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Cookie</th>
                  <th className="border p-2 text-left">Finalidad</th>
                  <th className="border p-2 text-left">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">cookie-consent</td>
                  <td className="border p-2">Almacena tu preferencia de cookies</td>
                  <td className="border p-2">1 año</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2. Cookies analíticas</h3>
            <p>
              Nos permiten analizar el uso del sitio web para mejorarlo. Utilizamos Google Analytics.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Cookie</th>
                  <th className="border p-2 text-left">Finalidad</th>
                  <th className="border p-2 text-left">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">_ga</td>
                  <td className="border p-2">Distinguir usuarios únicos</td>
                  <td className="border p-2">2 años</td>
                </tr>
                <tr>
                  <td className="border p-2">_ga_*</td>
                  <td className="border p-2">Mantener el estado de la sesión</td>
                  <td className="border p-2">2 años</td>
                </tr>
              </tbody>
            </table>

            <h2>3. ¿Cómo gestionar las cookies?</h2>
            <p>
              Puedes gestionar tus preferencias de cookies de varias formas:
            </p>
            <ul>
              <li>
                <strong>Desde nuestro sitio:</strong> Al acceder por primera vez, te mostramos un banner
                donde puedes aceptar todas, solo las esenciales o configurar tus preferencias.
              </li>
              <li>
                <strong>Desde tu navegador:</strong> Puedes configurar tu navegador para bloquear o eliminar cookies.
                Consulta la ayuda de tu navegador para más información.
              </li>
            </ul>

            <h3>Configuración en navegadores</h3>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2>4. Cookies de terceros</h2>
            <p>
              Utilizamos servicios de terceros que pueden instalar cookies en tu dispositivo:
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> Para análisis estadístico.{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Política de privacidad de Google
                </a>
              </li>
            </ul>

            <h2>5. Actualizaciones de esta política</h2>
            <p>
              Podemos actualizar esta política de cookies. Te recomendamos revisarla periódicamente.
              La fecha de última actualización aparece al inicio del documento.
            </p>

            <h2>6. Contacto</h2>
            <p>
              Si tienes dudas sobre nuestra política de cookies, puedes contactarnos en:{' '}
              <a href="mailto:info@fundacionpadrinosdelavejez.es">info@fundacionpadrinosdelavejez.es</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
