/**
 * =============================================================================
 * COMPONENTE: HERO DE LA HOME
 * =============================================================================
 *
 * Sección hero principal de la página de inicio.
 * Muestra título, subtítulo, CTA y las categorías principales con iconos.
 *
 * CARACTERÍSTICAS:
 * - Server Component: obtiene categorías desde WordPress
 * - Diseño responsive con grid
 * - Animaciones de entrada (slide-up)
 * - Iconos honeycomb para cada categoría
 * - Imagen de fondo con overlay gradient
 *
 * @module components/Hero
 */

import Link from 'next/link';
import {
  ArrowRight,
  House,
  Users,
  Heart,
  HandHeart,
  Shield,
  Brain,
  type LucideIcon,
} from 'lucide-react';
import { getCategorias } from '@/lib/wordpress';
import { expandAcronyms } from '@/lib/utils';

/**
 * Mapeo de slugs/nombres de categorías a iconos de Lucide
 *
 * Se busca primero por slug, luego por nombre en minúsculas.
 * Si no hay match, se usa Heart como fallback.
 */
const iconMap: Record<string, LucideIcon> = {
  'autonomia-y-avd': House,
  'autonomía y avd': House,
  'coordinacion-del-cuidado': Users,
  'coordinación del cuidado': Users,
  'etica-y-buen-trato': Heart,
  'ética y buen trato': Heart,
  'inclusion-y-diversidad': HandHeart,
  'inclusión y diversidad': HandHeart,
  'salud-preventiva-y-aal': Shield,
  'salud preventiva y aal': Shield,
  'soledad-y-conectividad': Brain,
  'soledad y conectividad': Brain,
};

/**
 * Sección Hero de la página principal
 *
 * Este es un Server Component asíncrono que carga las categorías
 * directamente desde WordPress para mostrarlas como iconos clicables.
 *
 * @returns Elemento section con el hero completo
 */
export async function Hero() {
  // Obtener categorías del servidor (Server Component)
  const categorias = await getCategorias();

  // Procesar categorías con iconos
  const categoriasConIconos = categorias
    .filter(cat => cat.count > 0)
    .slice(0, 6)
    .map(cat => {
      const slugLower = cat.slug.toLowerCase();
      const nameLower = cat.name.toLowerCase();
      const IconComponent = iconMap[slugLower] || iconMap[nameLower] || Heart;

      return {
        ...cat,
        name: expandAcronyms(cat.name),
        IconComponent,
        href: `/practicas/?categoria=${encodeURIComponent(cat.name)}`,
      };
    });

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/logos/hero/prueba_hero.webp"
          alt="Fundación Padrinos de la Vejez"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          {/* Left - Text Content */}
          <div className="max-w-xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl animate-slide-up">
              Buenas Prácticas que
              <span className="block text-white mt-1 drop-shadow-lg">Transforman Vidas</span>
            </h1>

            <p className="mb-8 text-base text-white/90 sm:text-lg animate-slide-up-delay">
              Iniciativas innovadoras para mejorar la calidad de vida de las personas mayores
            </p>

            <div className="animate-slide-up-delay-2">
              <Link
                href="/practicas/"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#700D39] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:text-[#FF6900]"
              >
                Explorar Prácticas
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right - Category Icons Honeycomb */}
          <div className="animate-slide-up-delay">
            {/* Primera fila - 3 iconos */}
            <div className="flex gap-5 mb-3 justify-end">
              {categoriasConIconos.slice(0, 3).map((cat) => {
                const IconComponent = cat.IconComponent;
                return (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                      <IconComponent className="h-9 w-9 text-[#700D39] transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF6900]" />
                    </div>
                    <span className="text-xs font-semibold text-white text-center max-w-[80px]">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Segunda fila - 3 iconos desplazados */}
            <div className="flex gap-5 pr-12">
              {categoriasConIconos.slice(3, 6).map((cat) => {
                const IconComponent = cat.IconComponent;
                return (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                      <IconComponent className="h-9 w-9 text-[#700D39] transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF6900]" />
                    </div>
                    <span className="text-xs font-semibold text-white text-center max-w-[80px]">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
