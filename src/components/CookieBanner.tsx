'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, Settings } from 'lucide-react';

type CookieConsent = 'all' | 'essential' | null;

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Pequeño delay para que no aparezca instantáneamente
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    localStorage.setItem('analytics-enabled', 'true');
    setShowBanner(false);
    // Recargar para activar analytics
    window.location.reload();
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    localStorage.setItem('analytics-enabled', 'false');
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', analyticsEnabled ? 'all' : 'essential');
    localStorage.setItem('analytics-enabled', analyticsEnabled.toString());
    setShowBanner(false);
    if (analyticsEnabled) {
      window.location.reload();
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#700D39] to-[#8B1547] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <Cookie className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Configuración de cookies</h2>
              <p className="text-sm text-white/80">Tu privacidad es importante para nosotros</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {!showSettings ? (
            <>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación,
                analizar el tráfico del sitio y personalizar el contenido. Puedes aceptar todas las cookies,
                solo las esenciales o configurar tus preferencias.
              </p>
              <p className="text-gray-500 text-xs mb-5">
                Para más información, consulta nuestra{' '}
                <Link href="/privacidad/" className="text-[#700D39] hover:underline font-medium">
                  Política de Privacidad
                </Link>{' '}
                y{' '}
                <Link href="/cookies/" className="text-[#700D39] hover:underline font-medium">
                  Política de Cookies
                </Link>.
              </p>
            </>
          ) : (
            <div className="space-y-4 mb-5">
              {/* Cookies esenciales */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Cookies esenciales</h3>
                  <p className="text-sm text-gray-500">Necesarias para el funcionamiento del sitio</p>
                </div>
                <div className="w-12 h-6 bg-[#700D39] rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              {/* Cookies analíticas */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Cookies analíticas</h3>
                  <p className="text-sm text-gray-500">Nos ayudan a mejorar el sitio web</p>
                </div>
                <button
                  onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                    analyticsEnabled ? 'bg-[#700D39] justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!showSettings ? (
              <>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Configurar
                </button>
                <button
                  onClick={acceptEssential}
                  className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Solo esenciales
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-5 py-2.5 bg-gradient-to-r from-[#700D39] to-[#8B1547] text-white font-semibold rounded-xl hover:from-[#8B1547] hover:to-[#700D39] transition-all shadow-lg"
                >
                  Aceptar todas
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-1 px-5 py-2.5 bg-gradient-to-r from-[#700D39] to-[#8B1547] text-white font-semibold rounded-xl hover:from-[#8B1547] hover:to-[#700D39] transition-all shadow-lg"
                >
                  Guardar preferencias
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
