/**
 * =============================================================================
 * COMPONENTE: NAVBAR
 * =============================================================================
 *
 * Barra de navegación principal de la aplicación.
 * Muestra logos, menú de navegación y versión móvil con hamburger.
 *
 * CARACTERÍSTICAS:
 * - Client Component (usa useState y usePathname)
 * - Sticky en la parte superior
 * - Backdrop blur para efecto de cristal
 * - Menú responsive: desktop horizontal, mobile colapsable
 * - Indicador de página activa
 * - Soporte para enlaces externos e internos
 *
 * @module components/Navbar
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * Configuración del menú de navegación
 *
 * Los items externos se abren en nueva pestaña.
 * Los internos usan el router de Next.js.
 */
const menuItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Estudio', href: 'https://fundacionpadrinosdelavejez.es/pagina-en-construccion-mapinsol/', external: true },
  { label: 'Buenas Prácticas', href: '/practicas/' },
  { label: 'Sugerencias', href: 'https://fundacionpadrinosdelavejez.es/pagina-en-construccion-mapinsol/', external: true },
  { label: 'Contacto', href: 'https://fundacionpadrinosdelavejez.es/pagina-en-construccion-mapinsol/', external: true },
  { label: 'Boletines', href: 'https://fundacionpadrinosdelavejez.es/mapinsol/boletines/', external: true },
];

/**
 * Componente de navegación principal
 *
 * Renderiza la barra de navegación sticky con:
 * - Logos de la Fundación y Mapinsol
 * - Menú de navegación (horizontal en desktop, colapsable en mobile)
 * - Indicadores visuales de página activa
 *
 * @returns Elemento header con la navegación completa
 */
export function Navbar() {
  /** Estado del menú móvil (abierto/cerrado) */
  const [isOpen, setIsOpen] = useState(false);
  /** Pathname actual para determinar página activa */
  const pathname = usePathname();

  /**
   * Determina si un enlace corresponde a la página actual
   * @param href - URL del enlace a verificar
   * @returns true si es la página activa
   */
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-lg shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logos Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 transition-all duration-300 hover:scale-105">
              <img
                src="/logos/logo_fpv.webp"
                alt="Fundación Padrinos de la Vejez"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <div className="hidden h-16 w-px bg-gray-300 md:block" />
            <Link href="/" className="hidden flex-shrink-0 transition-all duration-300 hover:scale-105 md:block">
              <img
                src="/logos/Color.webp"
                alt="Proyecto Mapinsol"
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex">
            {menuItems.map((item) => (
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative px-5 py-2.5 text-base font-medium transition-all duration-300 rounded-lg hover:scale-110 text-gray-700 hover:text-[#FF6900] hover:bg-gray-50"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative px-5 py-2.5 text-base font-medium transition-all duration-300 rounded-lg hover:scale-110',
                    isActive(item.href)
                      ? 'text-[#700D39]'
                      : 'text-gray-700 hover:text-[#FF6900] hover:bg-gray-50'
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-[#700D39]" />
                  )}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#FF6900] focus:outline-none focus:ring-2 focus:ring-[#FF6900] lg:hidden"
            aria-expanded={isOpen}
            aria-label="Menú de navegación"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-gray-100 pb-4 pt-2 lg:hidden">
            <div className="space-y-1">
              {menuItems.map((item) => (
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-[#FF6900]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                      isActive(item.href)
                        ? 'bg-[#700D39] text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#FF6900]'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
