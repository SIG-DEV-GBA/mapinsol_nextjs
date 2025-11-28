/**
 * =============================================================================
 * COMPONENTE: FOOTER
 * =============================================================================
 *
 * Pie de página de la aplicación con información de la Fundación.
 *
 * CONTENIDO:
 * - Logo y misión de la Fundación
 * - Redes sociales (Facebook, X, YouTube, Instagram)
 * - Enlaces rápidos (navegación interna y externa)
 * - Información de contacto (dirección, teléfonos, email)
 * - Financiadores (IMSERSO) y colaboradores
 * - Barra inferior con copyright y enlaces legales
 *
 * @module components/Footer
 */

import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Icono personalizado de X (Twitter)
 * Lucide no tiene el nuevo logo de X, así que lo creamos manualmente
 */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Configuración de enlaces a redes sociales */
const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/FundacionPadrinosVejez', icon: Facebook },
  { name: 'X', href: 'https://x.com/PadrinoslaVejez', icon: XIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@FundacionPadrinosVejez', icon: Youtube },
  { name: 'Instagram', href: 'https://www.instagram.com/fundacionpadrinosvejez/', icon: Instagram },
];

/** Enlaces rápidos del footer (internos usan Link, externos usan <a>) */
const quickLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Buenas Prácticas', href: '/practicas' },
  { name: 'Quiénes Somos', href: 'https://fundacionpadrinosdelavejez.es/quienes-somos/' },
  { name: 'Contacto', href: 'https://fundacionpadrinosdelavejez.es/contacto/' },
];

/**
 * Componente Footer
 *
 * Renderiza el pie de página completo con toda la información
 * institucional de la Fundación Padrinos de la Vejez.
 *
 * @returns Elemento footer con grid responsive de 4 columnas
 */
export function Footer() {
  return (
    <footer className="bg-[#6B1E3D] text-white">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Logo y descripción - Columna principal */}
          <div className="lg:col-span-4">
            <a href="https://fundacionpadrinosdelavejez.es/" target="_blank" rel="noopener noreferrer" className="inline-block mb-6">
              <div className="bg-white rounded-xl p-4 inline-block">
                <Image
                  src="/logos/logo_fpv.webp"
                  alt="Fundación Padrinos de la Vejez"
                  width={200}
                  height={70}
                  className="h-14 w-auto"
                />
              </div>
            </a>
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
              Recurso social especializado en la protección de personas mayores, con discapacidad
              o dependencia en situación de vulnerabilidad, a través de servicios domiciliarios
              y de proximidad que les permitan seguir viviendo en su hogar.
            </p>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#FF6900] hover:scale-110 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Enlaces */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5 text-white">
              Enlaces
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-[#FF6900] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-[#FF6900] transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5 text-white">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://maps.google.com/?q=Calle+Agustín+de+Betancourt+17+Madrid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#FF6900]" />
                  <span>
                    C/ Agustín de Betancourt, 17<br />
                    6ª planta · 28003 Madrid
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0 text-[#FF6900]" />
                  <div>
                    <a href="tel:918028853" className="text-white/70 hover:text-white transition-colors">
                      918 028 853
                    </a>
                    <span className="text-white/40 mx-1">·</span>
                    <a href="tel:686194022" className="text-white/70 hover:text-white transition-colors">
                      686 194 022
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <a
                  href="mailto:consultas@fundacionpadrinosdelavejez.es"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 flex-shrink-0 text-[#FF6900]" />
                  <span className="whitespace-nowrap">consultas@fundacionpadrinosdelavejez.es</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Financiadores y Colaboradores */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5 text-white">
              Financia
            </h4>
            <div className="bg-white rounded-lg p-3 inline-block mb-6">
              <img
                src="/logos/footer/Logo-IMSERSO-2024.webp"
                alt="IMSERSO"
                className="h-12 w-auto object-contain"
              />
            </div>

            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">
              Colaboradores
            </h4>
            <div className="flex flex-wrap gap-3 items-center">
              <a href="https://solidaridadintergeneracional.es/wp/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-2 hover:scale-105 transition-transform">
                <img
                  src="/logos/footer/logo-solidaridad.png"
                  alt="Solidaridad Intergeneracional"
                  className="h-8 w-auto object-contain"
                />
              </a>
              <div className="bg-white rounded-lg p-2">
                <img
                  src="/logos/footer/logo-CAS.png"
                  alt="Colectivo de Acción Solidaria"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="bg-white rounded-lg p-2">
                <img
                  src="/logos/footer/ANAGRAMA-COAG-.png"
                  alt="COAG"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Fundación Padrinos de la Vejez. Todos los derechos reservados.
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <a
                href="https://fundacionpadrinosdelavejez.es/politica-de-privacidad/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                Privacidad
              </a>
              <span className="text-white/30">|</span>
              <a
                href="https://fundacionpadrinosdelavejez.es/aviso-legal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                Aviso Legal
              </a>
              <span className="text-white/30">|</span>
              <a
                href="https://fundacionpadrinosdelavejez.es/cookies/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                Cookies
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
