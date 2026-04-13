'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PersonStanding, X, Plus, Minus, Type, Contrast, MousePointer, Space, RotateCcw, Eye, Sparkles, Globe, Check, Volume2, Square } from 'lucide-react';

interface A11yState {
  fontSize: number;
  contrast: boolean;
  bigCursor: boolean;
  textSpacing: boolean;
  dyslexiaFont: boolean;
  highlightLinks: boolean;
}

const DEFAULTS: A11yState = {
  fontSize: 0,
  contrast: false,
  bigCursor: false,
  textSpacing: false,
  dyslexiaFont: false,
  highlightLinks: false,
};

const KEY = 'a11y-prefs';

const LANGS = [
  { code: 'es', label: 'Español', flag: '/flags/es.svg' },
  { code: 'en', label: 'English', flag: '/flags/gb.svg' },
  { code: 'gl', label: 'Galego', flag: '/flags/es-ga.svg' },
  { code: 'ca', label: 'Català', flag: '/flags/es-ct.svg' },
  { code: 'eu', label: 'Euskara', flag: '/flags/es-pv.svg' },
];

const TTS_SPEEDS = [
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
];

const TTS_SELECTORS = 'p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, figcaption, label, .wp-content > *';
const TTS_IGNORE = 'nav, footer, header, script, style, [aria-hidden="true"], .fixed';

function apply(s: A11yState) {
  const r = document.documentElement;
  const base = 100 + s.fontSize * 15;
  r.style.fontSize = base === 100 ? '' : `${base}%`;
  r.classList.toggle('a11y-contrast', s.contrast);
  r.classList.toggle('a11y-big-cursor', s.bigCursor);
  r.classList.toggle('a11y-spacing', s.textSpacing);
  r.classList.toggle('a11y-dyslexia', s.dyslexiaFont);
  r.classList.toggle('a11y-highlight-links', s.highlightLinks);
}

function switchLanguage(code: string) {
  if (code === 'es') {
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'googtrans=; path=/; domain=.' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  } else {
    document.cookie = `googtrans=/es/${code}; path=/`;
    document.cookie = `googtrans=/es/${code}; path=/; domain=.${window.location.hostname}`;
  }
  window.location.reload();
}

function isReadable(el: Element): boolean {
  if (el.closest(TTS_IGNORE)) return false;
  const text = el.textContent?.trim();
  return !!text && text.length > 2;
}

function getEsVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang.startsWith('es') && v.localService) || voices.find(v => v.lang.startsWith('es')) || null;
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULTS);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState('es');
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsReading, setTtsReading] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1);
  const [ttsSupported, setTtsSupported] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const readingElRef = useRef<Element | null>(null);
  const hoveredElRef = useRef<Element | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        apply(parsed);
      }
    } catch {}
    const match = document.cookie.match(/googtrans=\/es\/(\w+)/);
    if (match?.[1]) setLang(match[1]);
    setTtsSupported('speechSynthesis' in window);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(KEY, JSON.stringify(state));
    apply(state);
  }, [state, mounted]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const clearReadingHighlight = useCallback(() => {
    if (readingElRef.current) {
      readingElRef.current.classList.remove('a11y-tts-reading');
      readingElRef.current = null;
    }
  }, []);

  const clearHoverHighlight = useCallback(() => {
    if (hoveredElRef.current) {
      hoveredElRef.current.classList.remove('a11y-tts-hover');
      hoveredElRef.current = null;
    }
  }, []);

  const speakElement = useCallback((el: Element) => {
    const synth = window.speechSynthesis;
    const text = el.textContent?.trim();
    if (!text) return;

    synth.cancel();
    clearReadingHighlight();

    el.classList.add('a11y-tts-reading');
    readingElRef.current = el;
    setTtsReading(true);

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.rate = ttsSpeed;
    const voice = getEsVoice();
    if (voice) utter.voice = voice;

    utter.onend = () => {
      el.classList.remove('a11y-tts-reading');
      readingElRef.current = null;
      setTtsReading(false);
    };
    utter.onerror = () => {
      el.classList.remove('a11y-tts-reading');
      readingElRef.current = null;
      setTtsReading(false);
    };

    synth.speak(utter);
  }, [ttsSpeed, clearReadingHighlight]);

  useEffect(() => {
    if (!ttsActive || !ttsSupported) return;

    document.documentElement.classList.add('a11y-tts-mode');

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest?.(TTS_SELECTORS);
      if (!target || !isReadable(target) || target === hoveredElRef.current) return;
      clearHoverHighlight();
      target.classList.add('a11y-tts-hover');
      hoveredElRef.current = target;
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest?.(TTS_SELECTORS);
      if (target && target === hoveredElRef.current) {
        clearHoverHighlight();
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest?.(TTS_SELECTORS);
      if (!target || !isReadable(target)) return;
      if (target.closest('.fixed')) return;
      e.preventDefault();
      e.stopPropagation();
      speakElement(target);
    };

    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('mouseover', onMouseOver, true);
      document.removeEventListener('mouseout', onMouseOut, true);
      document.removeEventListener('click', onClick, true);
      document.documentElement.classList.remove('a11y-tts-mode');
      clearHoverHighlight();
      clearReadingHighlight();
      window.speechSynthesis.cancel();
      setTtsReading(false);
    };
  }, [ttsActive, ttsSupported, speakElement, clearHoverHighlight, clearReadingHighlight]);

  const toggleTts = useCallback(() => {
    if (ttsActive) {
      window.speechSynthesis.cancel();
      setTtsReading(false);
    }
    setTtsActive(p => !p);
  }, [ttsActive]);

  const ttsStop = useCallback(() => {
    window.speechSynthesis.cancel();
    clearReadingHighlight();
    setTtsReading(false);
  }, [clearReadingHighlight]);

  const changeFontSize = useCallback((d: number) => {
    setState(p => ({ ...p, fontSize: Math.max(-2, Math.min(4, p.fontSize + d)) }));
  }, []);

  const toggle = useCallback((k: keyof Omit<A11yState, 'fontSize'>) => {
    setState(p => ({ ...p, [k]: !p[k] }));
  }, []);

  const reset = useCallback(() => setState(DEFAULTS), []);

  const dirty = JSON.stringify(state) !== JSON.stringify(DEFAULTS);
  const activeCount = [state.contrast, state.bigCursor, state.textSpacing, state.dyslexiaFont, state.highlightLinks].filter(Boolean).length + (state.fontSize !== 0 ? 1 : 0);

  const opts: { key: keyof Omit<A11yState, 'fontSize'>; icon: typeof Contrast; label: string }[] = [
    { key: 'contrast', icon: Contrast, label: 'Alto contraste' },
    { key: 'bigCursor', icon: MousePointer, label: 'Cursor grande' },
    { key: 'textSpacing', icon: Space, label: 'Espaciado' },
    { key: 'dyslexiaFont', icon: Sparkles, label: 'Fuente legible' },
    { key: 'highlightLinks', icon: Eye, label: 'Resaltar enlaces' },
  ];

  if (!mounted) return null;

  return (
    <div ref={ref} className="fixed bottom-5 left-5 z-[9998]">
      <div
        className={`
          absolute bottom-16 left-0 origin-bottom-left
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-6 pointer-events-none'}
        `}
      >
        <div className="w-[300px] sm:w-[340px] rounded-[20px] overflow-hidden shadow-[0_25px_60px_-12px_rgba(161,13,94,0.25)] border border-white/20 backdrop-blur-xl bg-white/95">
          <div className="relative px-5 py-4 bg-gradient-to-r from-[#A10D5E] via-[#8B1547] to-[#6D1140] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(242,148,41,0.15),transparent_60%)]" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <PersonStanding className="h-[18px] w-[18px] text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-sm tracking-wide font-poppins">Accesibilidad</span>
                  {activeCount > 0 && (
                    <p className="text-white/50 text-[10px] font-medium mt-0.5">{activeCount} ajuste{activeCount > 1 ? 's' : ''} activo{activeCount > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {dirty && (
                  <button
                    onClick={reset}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group"
                    aria-label="Restablecer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-white/70 group-hover:text-white transition-colors group-hover:rotate-[-180deg] duration-300" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                  aria-label="Cerrar"
                >
                  <X className="h-3.5 w-3.5 text-white/70 hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1.5 max-h-[60vh] overflow-y-auto">
            <div
              className={`
                flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300
                ${state.fontSize !== 0
                  ? 'bg-gradient-to-r from-[#A10D5E]/[0.06] to-[#F29429]/[0.06] ring-1 ring-[#A10D5E]/10'
                  : 'bg-gray-50/80 hover:bg-gray-100/80'}
              `}
              style={{ animation: open ? 'a11ySlideIn 0.4s ease-out 50ms both' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 ${state.fontSize !== 0 ? 'bg-[#A10D5E]/10' : 'bg-gray-200/60'}`}>
                  <Type className={`h-4 w-4 transition-colors duration-300 ${state.fontSize !== 0 ? 'text-[#A10D5E]' : 'text-gray-400'}`} />
                </div>
                <span className={`text-sm font-semibold transition-colors duration-300 ${state.fontSize !== 0 ? 'text-[#A10D5E]' : 'text-gray-600'}`}>Texto</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeFontSize(-1)}
                  disabled={state.fontSize <= -2}
                  className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-500 hover:border-[#A10D5E]/40 hover:text-[#A10D5E] active:scale-90 transition-all duration-200 disabled:opacity-25 disabled:hover:border-gray-200/80 disabled:hover:text-gray-500 shadow-sm"
                  aria-label="Reducir texto"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-xs font-bold w-7 text-center tabular-nums text-gray-500">
                  {state.fontSize > 0 ? `+${state.fontSize}` : state.fontSize}
                </span>
                <button
                  onClick={() => changeFontSize(1)}
                  disabled={state.fontSize >= 4}
                  className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-500 hover:border-[#A10D5E]/40 hover:text-[#A10D5E] active:scale-90 transition-all duration-200 disabled:opacity-25 disabled:hover:border-gray-200/80 disabled:hover:text-gray-500 shadow-sm"
                  aria-label="Aumentar texto"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {opts.map(({ key, icon: Icon, label }, i) => {
              const active = state[key];
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className={`
                    w-full flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 group
                    ${active
                      ? 'bg-gradient-to-r from-[#A10D5E]/[0.06] to-[#F29429]/[0.06] ring-1 ring-[#A10D5E]/10'
                      : 'bg-gray-50/80 hover:bg-gray-100/80'}
                  `}
                  style={{ animation: open ? `a11ySlideIn 0.4s ease-out ${(i + 1) * 50 + 50}ms both` : 'none' }}
                  aria-pressed={active}
                  aria-label={label}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-[#A10D5E]/10' : 'bg-gray-200/60 group-hover:bg-gray-200'}`}>
                      <Icon className={`h-4 w-4 transition-colors duration-300 ${active ? 'text-[#A10D5E]' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-300 ${active ? 'text-[#A10D5E]' : 'text-gray-600 group-hover:text-gray-700'}`}>{label}</span>
                  </div>
                  <div className={`w-10 h-[22px] rounded-full transition-all duration-300 relative flex-shrink-0 ${active ? 'bg-gradient-to-r from-[#A10D5E] to-[#C4166E]' : 'bg-gray-300 group-hover:bg-gray-400'}`}>
                    <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${active ? 'left-[22px]' : 'left-[3px]'}`} />
                  </div>
                </button>
              );
            })}

            {ttsSupported && (
              <div className="pt-1.5" style={{ animation: open ? 'a11ySlideIn 0.4s ease-out 380ms both' : 'none' }}>
                <div className="flex items-center gap-2 px-3 pb-2">
                  <Volume2 className="h-3.5 w-3.5 text-[#A10D5E]" />
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lector de voz</span>
                </div>
                <div className={`
                  rounded-2xl px-4 py-3 transition-all duration-300
                  ${ttsActive
                    ? 'bg-gradient-to-r from-[#A10D5E]/[0.06] to-[#F29429]/[0.06] ring-1 ring-[#A10D5E]/10'
                    : 'bg-gray-50/80'}
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${ttsActive ? 'bg-[#A10D5E]/10' : 'bg-gray-200/60'}`}>
                        <Volume2 className={`h-4 w-4 transition-colors duration-300 ${ttsActive ? 'text-[#A10D5E]' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <span className={`text-sm font-semibold transition-colors duration-300 block ${ttsActive ? 'text-[#A10D5E]' : 'text-gray-600'}`}>
                          {ttsActive ? (ttsReading ? 'Leyendo...' : 'Activo') : 'Desactivado'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {ttsActive ? 'Pulsa en cualquier texto' : 'Haz click para activar'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {ttsReading && (
                        <button
                          onClick={(e) => { e.stopPropagation(); ttsStop(); }}
                          className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 active:scale-90 transition-all duration-200"
                          aria-label="Detener lectura"
                        >
                          <Square className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={toggleTts}
                        className="flex-shrink-0"
                        aria-pressed={ttsActive}
                        aria-label="Lector de voz"
                      >
                        <div className={`w-10 h-[22px] rounded-full transition-all duration-300 relative ${ttsActive ? 'bg-gradient-to-r from-[#A10D5E] to-[#C4166E]' : 'bg-gray-300 hover:bg-gray-400'}`}>
                          <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${ttsActive ? 'left-[22px]' : 'left-[3px]'}`} />
                        </div>
                      </button>
                    </div>
                  </div>
                  {ttsActive && (
                    <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-gray-100/80">
                      <span className="text-[10px] text-gray-400 font-medium mr-1">Velocidad</span>
                      {TTS_SPEEDS.map(s => (
                        <button
                          key={s.value}
                          onClick={() => setTtsSpeed(s.value)}
                          className={`
                            px-2 py-1 rounded-lg text-[10px] font-bold transition-all duration-200
                            ${ttsSpeed === s.value
                              ? 'bg-[#A10D5E] text-white shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-400 hover:border-[#A10D5E]/30 hover:text-gray-600'}
                          `}
                        >
                          {s.label}
                        </button>
                      ))}
                      {ttsReading && (
                        <div className="flex items-center gap-[3px] ml-auto">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-[3px] rounded-full bg-[#A10D5E]" style={{ animation: `a11yBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`, height: '12px' }} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-1.5" style={{ animation: open ? 'a11ySlideIn 0.4s ease-out 450ms both' : 'none' }}>
              <div className="flex items-center gap-2 px-3 pb-2">
                <Globe className="h-3.5 w-3.5 text-[#F29429]" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Idioma</span>
              </div>
              <div className="flex items-center gap-1.5 px-1">
                {LANGS.map((l) => {
                  const active = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => switchLanguage(l.code)}
                      className={`
                        relative flex flex-col items-center gap-1.5 flex-1 py-2.5 rounded-xl transition-all duration-300 group
                        ${active
                          ? 'bg-gradient-to-b from-[#F29429]/10 to-[#F29429]/5 ring-1 ring-[#F29429]/20'
                          : 'hover:bg-gray-100/80'}
                      `}
                      aria-label={l.label}
                      title={l.label}
                    >
                      <div className="relative">
                        <img
                          src={l.flag}
                          alt={l.label}
                          className={`w-7 h-7 rounded-full object-cover transition-all duration-300 ${active ? 'ring-2 ring-[#F29429] ring-offset-1' : 'ring-1 ring-gray-200 group-hover:ring-gray-300'}`}
                        />
                        {active && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#F29429] flex items-center justify-center border border-white">
                            <Check className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors duration-300 ${active ? 'text-[#F29429]' : 'text-gray-400 group-hover:text-gray-500'}`}>
                        {l.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100/80">
            <p className="text-[10px] text-gray-400 text-center font-medium tracking-wide">Preferencias guardadas en tu navegador</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen(o => !o)}
        className={`
          group relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-500
          ${open
            ? 'bg-gradient-to-br from-[#A10D5E] to-[#6D1140] text-white rotate-0 shadow-[0_8px_25px_-5px_rgba(161,13,94,0.4)]'
            : dirty
              ? 'bg-gradient-to-br from-[#A10D5E] to-[#8B1547] text-white shadow-[0_8px_25px_-5px_rgba(161,13,94,0.35)] hover:shadow-[0_12px_30px_-5px_rgba(161,13,94,0.5)] hover:scale-110'
              : 'bg-white/95 text-[#A10D5E] border border-gray-200/80 hover:border-[#A10D5E]/30 hover:shadow-[0_8px_25px_-5px_rgba(161,13,94,0.15)] hover:scale-110 backdrop-blur-sm'}
        `}
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
      >
        <PersonStanding className={`h-5 w-5 transition-transform duration-500 ${open ? 'rotate-[360deg]' : 'group-hover:rotate-12'}`} />
        {dirty && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#F29429] border-2 border-white flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">{activeCount}</span>
          </span>
        )}
        {dirty && !open && (
          <span className="absolute inset-0 rounded-full bg-[#A10D5E]/20 animate-[a11yPulse_2s_ease-in-out_infinite]" />
        )}
      </button>
    </div>
  );
}
