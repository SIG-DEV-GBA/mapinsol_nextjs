import Link from 'next/link';
import { ArrowLeft, Building2, MapPin, Calendar, Download } from 'lucide-react';
import type { BuenaPractica } from '@/types';
import { HighlightBadge, StatusBadge } from '@/components/ui';

interface PracticaHeaderProps {
  practica: BuenaPractica;
  showBadges?: boolean;
}

export function PracticaHeader({ practica, showBadges = false }: PracticaHeaderProps) {
  return (
    <header className="mb-10">
      {/* Badges (only shown if no media gallery) */}
      {showBadges && (practica.practicaDestacada || practica.estadoActual) && (
        <div className="flex gap-2 mb-4">
          {practica.practicaDestacada && <HighlightBadge />}
          {practica.estadoActual && <StatusBadge status={practica.estadoActual} />}
        </div>
      )}

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#700D39] leading-tight mb-5">
        {practica.title}
      </h1>

      <div className="flex flex-wrap gap-6">
        {practica.entidadResponsable && (
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-5 h-5 text-[#FF6900]" />
            <span className="font-semibold text-gray-500">Entidad Responsable:</span>
            {practica.urlEntidad ? (
              <a
                href={practica.urlEntidad}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 font-medium hover:text-[#FF6900] hover:underline transition-colors"
              >
                {practica.entidadResponsable}
              </a>
            ) : (
              <span>{practica.entidadResponsable}</span>
            )}
          </div>
        )}

        {(practica.municipio || practica.provincia || practica.ccaa) && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-[#FF6900]" />
            <span className="flex items-center gap-1 flex-wrap">
              {practica.municipio && (
                <>
                  <Link
                    href={`/practicas/?localidad=${encodeURIComponent(practica.municipio)}`}
                    className="hover:text-[#FF6900] hover:underline transition-colors"
                  >
                    {practica.municipio}
                  </Link>
                  {(practica.provincia || practica.ccaa) && <span>,</span>}
                </>
              )}
              {practica.provincia && (
                <>
                  <Link
                    href={`/practicas/?localidad=${encodeURIComponent(practica.provincia)}`}
                    className="hover:text-[#FF6900] hover:underline transition-colors"
                  >
                    {practica.provincia}
                  </Link>
                  {practica.ccaa && <span>,</span>}
                </>
              )}
              {practica.ccaa && (
                <Link
                  href={`/practicas/?ccaa=${encodeURIComponent(practica.ccaa)}`}
                  className="hover:text-[#FF6900] hover:underline transition-colors"
                >
                  {practica.ccaa}
                </Link>
              )}
            </span>
          </div>
        )}

        {practica.anioInicio && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5 text-[#FF6900]" />
            <span>Desde {practica.anioInicio}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export function BackLink() {
  return (
    <div className="py-5 mb-6">
      <Link
        href="/practicas/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#FF6900] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al listado</span>
      </Link>
    </div>
  );
}

interface PdfLinkProps {
  url: string;
}

export function PdfLink({ url }: PdfLinkProps) {
  return (
    <div className="mb-8">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-red-200 text-red-600 font-medium hover:border-red-500 hover:bg-red-50 hover:-translate-y-0.5 transition-all"
      >
        <PdfIcon />
        <span>Descargar Buena Práctica</span>
        <Download className="w-4 h-4 opacity-70" />
      </a>
    </div>
  );
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
      <path d="M6 2h14l8 8v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill="#dc2626" />
      <path d="M20 2v8h8" fill="#fca5a5" />
      <text x="6" y="23" fontSize="9" fontWeight="bold" fill="white" fontFamily="Arial">
        PDF
      </text>
    </svg>
  );
}
