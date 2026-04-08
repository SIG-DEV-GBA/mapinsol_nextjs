'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Newspaper, FileText, CalendarDays, BookOpenCheck, Video, ImageIcon, Facebook, Youtube, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Estudio', href: '/estudios/' },
  { label: 'Iniciativas eficaces', href: '/practicas/' },
];

const actualidadItems = [
  { label: 'Todo', href: '/actualidad/', icon: Newspaper },
  { label: 'Boletines', href: '/actualidad/?tipo=boletin', icon: Newspaper },
  { label: 'Notas de prensa', href: '/actualidad/?tipo=nota_prensa', icon: FileText },
  { label: 'Eventos', href: '/actualidad/?tipo=evento', icon: CalendarDays },
  { label: 'Estudios y políticas', href: '/actualidad/?tipo=taller', icon: BookOpenCheck },
  { label: 'Videos', href: '/actualidad/?tipo=video', icon: Video },
  { label: 'Infografías', href: '/actualidad/?tipo=infografia', icon: ImageIcon },
];

const contactItem = { label: 'Contacto', href: '/contacto/' };

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/FundacionPadrinosVejez', icon: Facebook },
  { label: 'X', href: 'https://x.com/PadrinoslaVejez', icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="!h-[16px] !w-[16px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )},
  { label: 'YouTube', href: 'https://www.youtube.com/@FundacionPadrinosVejez', icon: Youtube },
  { label: 'Instagram', href: 'https://www.instagram.com/fundacionpadrinosvejez/', icon: Instagram },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '';
    return pathname.startsWith(href);
  };

  const isActualidadActive = pathname.startsWith('/actualidad');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  const linkClasses = (href: string, active?: boolean) =>
    cn(
      'relative px-3 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg hover:scale-105 xl:px-4 xl:text-base',
      active ?? isActive(href)
        ? 'text-[#A10D5E]'
        : 'text-gray-700 hover:text-[#F29429] hover:bg-gray-50'
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-lg shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logos */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="https://fundacionpadrinosdelavejez.es" target="_blank" rel="noopener noreferrer" className="transition-all duration-300 hover:scale-105">
              <img
                src="/logos/logo_fpv.webp"
                alt="Fundación Padrinos de la Vejez"
                className="h-16 w-auto object-contain"
              />
            </a>
            <div className="h-12 w-px bg-gray-300" />
            <Link href="/" className="transition-all duration-300 hover:scale-105">
              <img
                src="/logos/Color.webp"
                alt="Proyecto Mapinsol"
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={linkClasses(item.href)}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-[#A10D5E]" />
                )}
              </Link>
            ))}

            {/* Dropdown Actualidad */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  linkClasses('', isActualidadActive),
                  'inline-flex items-center gap-1'
                )}
              >
                Actualidad y comunicación
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  dropdownOpen && 'rotate-180'
                )} />
                {isActualidadActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-[#A10D5E]" />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-200/80 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {actualidadItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                          'block px-4 py-2.5 text-sm font-medium transition-colors',
                          isActive(item.href)
                            ? 'text-[#A10D5E] bg-[#A10D5E]/5'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#F29429]'
                        )}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-[#A10D5E] flex-shrink-0" />
                          <span>{item.label}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contacto */}
            <Link
              href={contactItem.href}
              className={linkClasses(contactItem.href)}
            >
              {contactItem.label}
              {isActive(contactItem.href) && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-[#A10D5E]" />
              )}
            </Link>

            {/* Social icons */}
            <div className="h-5 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-1">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 transition-all duration-200 hover:text-[#F29429] hover:bg-gray-50 [&>svg]:h-[18px] [&>svg]:w-[18px]"
                    aria-label={s.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#F29429] focus:outline-none focus:ring-2 focus:ring-[#F29429] lg:hidden"
            aria-expanded={isOpen}
            aria-label="Menú de navegación"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
            isOpen ? 'max-h-[600px] opacity-100 pb-5 pt-3' : 'max-h-0 opacity-0'
          )}
        >
          <div className="border-t border-gray-100 pt-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center rounded-xl px-5 py-4 text-lg font-medium transition-colors duration-200 min-h-[56px]',
                  isActive(item.href)
                    ? 'bg-[#A10D5E] text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#F29429]'
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Actualidad Accordion */}
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-5 py-4 text-lg font-medium transition-colors duration-200 min-h-[56px]',
                isActualidadActive
                  ? 'bg-[#A10D5E] text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#F29429]'
              )}
            >
              Actualidad y comunicación
              <ChevronDown className={cn(
                'h-5 w-5 transition-transform duration-300',
                mobileDropdownOpen && 'rotate-180'
              )} />
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                mobileDropdownOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="ml-4 space-y-1 border-l-2 border-[#A10D5E]/20 pl-3 py-1">
                {actualidadItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => { setIsOpen(false); setMobileDropdownOpen(false); }}
                      className={cn(
                        'flex items-center rounded-xl px-4 py-3.5 text-base font-medium transition-colors min-h-[48px]',
                        isActive(item.href)
                          ? 'text-[#A10D5E] bg-[#A10D5E]/10'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#F29429]'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Contacto */}
            <Link
              href={contactItem.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center rounded-xl px-5 py-4 text-lg font-medium transition-colors duration-200 min-h-[56px]',
                isActive(contactItem.href)
                  ? 'bg-[#A10D5E] text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#F29429]'
              )}
            >
              {contactItem.label}
            </Link>

            {/* Social icons mobile */}
            <div className="flex items-center justify-center gap-3 pt-3 mt-2 border-t border-gray-100">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-400 transition-all duration-200 hover:text-[#F29429] hover:bg-gray-50 [&>svg]:h-[18px] [&>svg]:w-[18px]"
                    aria-label={s.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}
