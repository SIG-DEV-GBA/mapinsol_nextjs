'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '/flags/es.svg' },
  { code: 'en', label: 'English', flag: '/flags/gb.svg' },
  { code: 'gl', label: 'Galego', flag: '/flags/es-ga.svg' },
  { code: 'ca', label: 'Català', flag: '/flags/es-ct.svg' },
  { code: 'eu', label: 'Euskara', flag: '/flags/es-pv.svg' },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('es');
  const [visible, setVisible] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/es\/(\w+)/);
    if (match && match[1]) {
      setCurrent(match[1]);
    }
  }, []);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 80) {
        setVisible(false);
        setOpen(false);
      } else {
        setVisible(true);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const switchLanguage = (code: string) => {
    setCurrent(code);
    setOpen(false);

    if (code === 'es') {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'googtrans=; path=/; domain=.' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      window.location.reload();
    } else {
      document.cookie = `googtrans=/es/${code}; path=/`;
      document.cookie = `googtrans=/es/${code}; path=/; domain=.${window.location.hostname}`;
      window.location.reload();
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed top-[108px] right-5 z-[9999] transition-all duration-700 ease-in-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
      )}
    >
      {/* Trigger — pill style like the reference image */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-full shadow-lg border bg-white/95 backdrop-blur-sm px-3 py-2 transition-all duration-300 hover:shadow-xl',
          open ? 'border-[#A10D5E]/30' : 'border-gray-200 hover:border-[#A10D5E]/20'
        )}
        aria-label="Cambiar idioma"
      >
        <img
          src={currentLang.flag}
          alt={currentLang.label}
          className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
        />
        <span className="text-sm font-semibold text-gray-700">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn(
          'h-3.5 w-3.5 text-gray-400 transition-transform duration-300',
          open && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          'absolute top-full right-0 mt-2 origin-top-right transition-all duration-300',
          open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        )}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-52">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-[#A10D5E]" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Idioma</span>
          </div>

          {/* Languages */}
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isActive = current === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200',
                    isActive
                      ? 'bg-[#A10D5E]/5'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <img
                    src={lang.flag}
                    alt={lang.label}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                  />
                  <span className={cn(
                    'text-sm font-medium flex-grow',
                    isActive ? 'text-[#A10D5E] font-semibold' : 'text-gray-700'
                  )}>
                    {lang.label}
                  </span>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-[#A10D5E] flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[10px] text-gray-400 text-center">Traducción automática</p>
          </div>
        </div>
      </div>

      {/* Hidden GTranslate wrapper */}
      <div className="gtranslate_wrapper hidden" />
    </div>
  );
}
