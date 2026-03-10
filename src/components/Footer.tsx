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

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/FundacionPadrinosVejez', icon: Facebook },
  { name: 'X', href: 'https://x.com/PadrinoslaVejez', icon: XIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@FundacionPadrinosVejez', icon: Youtube },
  { name: 'Instagram', href: 'https://www.instagram.com/fundacionpadrinosvejez/', icon: Instagram },
];

const quickLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Iniciativas eficaces', href: '/practicas/' },
  { name: 'Estudio', href: '/estudios/' },
  { name: 'Actualidad', href: '/actualidad/' },
  { name: 'Contacto', href: '/contacto/' },
];

export function Footer() {
  return (
    <footer className="bg-[#6B1E3D] text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1: Logo + descripción + redes */}
          <div>
            <a href="https://fundacionpadrinosdelavejez.es/" target="_blank" rel="noopener noreferrer" className="inline-block mb-4">
              <div className="bg-white rounded-xl p-4 inline-block shadow-md">
                <Image
                  src="/logos/logo FPV.png"
                  alt="Fundación Padrinos de la Vejez"
                  width={200}
                  height={70}
                  className="h-20 w-auto object-contain"
                />
              </div>
            </a>
            <p className="text-white/80 text-sm leading-relaxed mb-5">
              Recurso social especializado en la protección de personas mayores, con discapacidad o dependencia.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-[#F29429] hover:scale-110 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Enlaces */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5 text-white border-b border-white/20 pb-2.5">
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
                      className="text-white/70 hover:text-[#F29429] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-[#F29429] transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5 text-white border-b border-white/20 pb-2.5">
              Contacto
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="https://maps.google.com/?q=Calle+Agustín+de+Betancourt+17+Madrid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F29429]" />
                  <span>
                    C/ Agustín de Betancourt, 17<br />
                    8ª planta · 28003 Madrid
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F29429]" />
                  <div className="text-white/70">
                    <a href="tel:918028853" className="hover:text-white transition-colors">918 028 853</a>
                    {' · '}
                    <a href="tel:676870594" className="hover:text-white transition-colors">676 870 594</a>
                  </div>
                </div>
              </li>
              <li>
                <a
                  href="mailto:consultas@fundacionpadrinosdelavejez.es"
                  className="flex items-start gap-2.5 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F29429]" />
                  <span className="break-all">consultas@fundacion<wbr/>padrinosdelavejez.es</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Financia + Colaboradores */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5 text-white border-b border-white/20 pb-2.5">
              Financia
            </h4>
            <div className="bg-white rounded-lg p-3 inline-block mb-6 shadow-sm">
              <img
                src="/logos/footer/Logo-IMSERSO-2024.webp"
                alt="IMSERSO"
                className="h-14 w-auto object-contain"
              />
            </div>

            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white border-b border-white/20 pb-2.5">
              Colaboradores
            </h4>
            <div className="flex items-center gap-2.5 flex-wrap">
              <a href="https://solidaridadintergeneracional.es/wp/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-2 inline-block hover:scale-105 transition-transform shadow-sm">
                <img
                  src="/logos/footer/logo-solidaridad.png"
                  alt="Solidaridad Intergeneracional"
                  className="h-9 w-auto object-contain"
                />
              </a>
              <div className="bg-white rounded-lg p-2 inline-block shadow-sm">
                <img
                  src="/logos/footer/ANAGRAMA-COAG-.png"
                  alt="COAG"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Fundación Padrinos de la Vejez. Todos los derechos reservados.
            </p>
            <nav className="flex items-center gap-4 text-xs">
              <Link href="/privacidad/" className="text-white/50 hover:text-white transition-colors">
                Privacidad
              </Link>
              <span className="text-white/30">|</span>
              <Link href="/cookies/" className="text-white/50 hover:text-white transition-colors">
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
