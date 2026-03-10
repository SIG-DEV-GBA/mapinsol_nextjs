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
import { ArrowRight, Heart, icons, type LucideIcon } from 'lucide-react';
import { getCategorias } from '@/lib/wordpress';
import { expandAcronyms } from '@/lib/utils';

/**
 * Resuelve un nombre de icono de Lucide (kebab-case o PascalCase) a su componente.
 * El nombre se lee del campo "description" de la categoría en WordPress.
 * Fallback: Heart
 */
function resolveIcon(iconName: string | undefined): LucideIcon {
  if (!iconName || !iconName.trim()) return Heart;

  const name = iconName.trim();

  // Convertir kebab-case a PascalCase (ej: "heart-handshake" → "HeartHandshake")
  const pascalCase = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return (icons as Record<string, LucideIcon>)[pascalCase] || Heart;
}

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

  // Procesar categorías con iconos (lee el nombre del icono del campo description en WP)
  const categoriasConIconos = categorias
    .filter(cat => cat.count > 0)
    .slice(0, 7)
    .map(cat => ({
      ...cat,
      name: expandAcronyms(cat.name),
      IconComponent: resolveIcon(cat.description),
      href: `/practicas/?categoria=${encodeURIComponent(cat.name)}`,
    }));

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/logos/hero/prueba_hero.webp"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          {/* Left - Text Content */}
          <div className="max-w-xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl animate-slide-up">
              Buenas Prácticas exitosas que
              <span className="block text-white mt-1 drop-shadow-lg font-bold">Transforman Vidas</span>
            </h1>

            <p className="mb-8 text-base text-white/90 sm:text-lg animate-slide-up-delay">
              Iniciativas innovadoras para mejorar la calidad de vida de las personas mayores
            </p>

            <div className="animate-slide-up-delay-2">
              <Link
                href="/practicas/"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#A10D5E] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:text-[#F29429]"
              >
                Explorar Prácticas
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right - Category Icons Honeycomb */}
          <div className="animate-slide-up-delay">
            {/* Primera fila - 4 iconos */}
            <div className="flex gap-5 mb-3 justify-end">
              {categoriasConIconos.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                    <cat.IconComponent className="h-9 w-9 text-[#A10D5E] transition-all duration-300 group-hover:scale-110 group-hover:text-[#F29429]" />
                  </div>
                  <span className="text-xs font-semibold text-white text-center max-w-[80px]">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Segunda fila - 3 iconos desplazados */}
            <div className="flex gap-5 pl-12">
              {categoriasConIconos.slice(4, 7).map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                    <cat.IconComponent className="h-9 w-9 text-[#A10D5E] transition-all duration-300 group-hover:scale-110 group-hover:text-[#F29429]" />
                  </div>
                  <span className="text-xs font-semibold text-white text-center max-w-[80px]">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
