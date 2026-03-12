'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, ChevronLeft, ChevronRight, BookOpen, icons, type LucideIcon } from 'lucide-react';

interface CategoryData {
  id: number;
  name: string;
  iconName?: string;
  href: string;
}

interface HeroCarouselProps {
  categorias: CategoryData[];
}

function resolveIcon(iconName: string | undefined): LucideIcon {
  if (!iconName || !iconName.trim()) return Heart;
  const pascalCase = iconName.trim().split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  return (icons as Record<string, LucideIcon>)[pascalCase] || Heart;
}

export function HeroCarousel({ categorias }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % 2), []);
  const prev = useCallback(() => setCurrent(c => (c + 1) % 2), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section
      className="relative h-[600px] lg:h-[650px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ===== SLIDE 1 — Buenas Prácticas ===== */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{ opacity: current === 0 ? 1 : 0 }}
      >
        <img
          src="/logos/hero/prueba_hero.webp"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>

      {/* ===== SLIDE 2 — Estudio ===== */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{ opacity: current === 1 ? 1 : 0 }}
      >
        <img
          src="/portada_estudio.webp"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F29429]/60 via-[#F29429]/40 to-[#E0841F]/50" />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">

        {/* Content Slide 1 */}
        <div
          className="transition-all duration-[1500ms] ease-in-out absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8"
          style={{
            opacity: current === 0 ? 1 : 0,
            transform: current === 0 ? 'translateY(0)' : 'translateY(-20px)',
            pointerEvents: current === 0 ? 'auto' : 'none',
          }}
        >
          <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            <div className="max-w-xl">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Buenas Prácticas exitosas que
                <span className="block text-white mt-1 drop-shadow-lg font-bold">Transforman Vidas</span>
              </h1>
              <p className="mb-8 text-base text-white/90 sm:text-lg">
                Iniciativas innovadoras para mejorar la calidad de vida de las personas mayores
              </p>
              <Link
                href="/practicas/"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#A10D5E] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:text-[#F29429]"
              >
                Explorar Prácticas
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Category Icons */}
            <div className="hidden lg:block">
              <div className="flex gap-5 mb-3 justify-end">
                {categorias.slice(0, 4).map((cat) => {
                  const Icon = resolveIcon(cat.iconName);
                  return (
                    <Link key={cat.id} href={cat.href} className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                        <Icon className="h-9 w-9 text-[#A10D5E] transition-all duration-300 group-hover:scale-110 group-hover:text-[#F29429]" />
                      </div>
                      <span className="text-xs font-semibold text-white text-center max-w-[80px]">{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="flex gap-5 pl-12">
                {categorias.slice(4, 7).map((cat) => {
                  const Icon = resolveIcon(cat.iconName);
                  return (
                    <Link key={cat.id} href={cat.href} className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                        <Icon className="h-9 w-9 text-[#A10D5E] transition-all duration-300 group-hover:scale-110 group-hover:text-[#F29429]" />
                      </div>
                      <span className="text-xs font-semibold text-white text-center max-w-[80px]">{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Slide 2 */}
        <div
          className="transition-all duration-[1500ms] ease-in-out absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8"
          style={{
            opacity: current === 1 ? 1 : 0,
            transform: current === 1 ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: current === 1 ? 'auto' : 'none',
          }}
        >
          <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            <div className="max-w-2xl">
              <h2 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Cuando hay comunidad,
                <span className="block text-white mt-1 drop-shadow-lg font-bold">la soledad no aparece</span>
              </h2>
              <p className="mb-4 text-base text-white/95 sm:text-lg font-semibold">
                MAPINSOL identifica qué factores hacen posible que muchas personas mayores no sufran soledad en el medio rural.
              </p>
              <p className="mb-8 text-sm text-white/85 sm:text-base leading-relaxed">
                El estudio analiza los vínculos vecinales, las redes de apoyo y las dinámicas comunitarias que mantienen viva la convivencia en territorios envejecidos y dispersos, e identifica modelos replicables de participación y apoyo mutuo para fortalecer el tejido social y prevenir la soledad.
              </p>
              <Link
                href="/estudios/"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#F29429] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:text-[#A10D5E]"
              >
                Ver Estudio
                <BookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
            </div>

            <Link href="/estudios/" className="hidden lg:flex flex-col items-center gap-4 group">
              <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                <BookOpen className="h-16 w-16 text-[#F29429] transition-all duration-300 group-hover:scale-110 group-hover:text-[#A10D5E]" />
              </div>
              <span className="text-white/80 font-semibold text-sm text-center max-w-[160px] group-hover:text-white transition-colors">
                Estudio MAPINSOL
              </span>
            </Link>
          </div>
        </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-200"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-200"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              current === i ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
