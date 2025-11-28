/**
 * =============================================================================
 * COMPONENTE: TARJETA DE PRÁCTICA
 * =============================================================================
 *
 * Tarjeta responsive para mostrar una buena práctica en el listado/grid.
 * Muestra imagen, título, metadatos, categorías, tags y estado.
 *
 * CARACTERÍSTICAS:
 * - Imagen destacada con fallback a galería o placeholder
 * - Badges de estado, PDF disponible y práctica destacada
 * - Hover effects con animaciones suaves
 * - Límite de categorías/tags visibles con contador de extras
 * - Link al detalle de la práctica
 *
 * @module components/PracticaCard
 */

import Link from 'next/link';
import { Calendar, Building2, MapPin, ArrowRight } from 'lucide-react';
import type { BuenaPractica } from '@/types';
import { StatusBadge, PdfBadge, HighlightBadge } from '@/components/ui';
import { expandAcronyms } from '@/lib/utils';
import { cn } from '@/lib/utils';

/** Props del componente PracticaCard */
interface PracticaCardProps {
  /** Datos de la buena práctica a mostrar */
  practica: BuenaPractica;
}

/**
 * Tarjeta de práctica para el grid de listado
 *
 * @param props - Props del componente
 * @returns Elemento article con la tarjeta de práctica
 */
export function PracticaCard({ practica }: PracticaCardProps) {
  const imagenUrl = practica.featuredMediaUrl
    || practica.anexosDetails?.[0]?.media_details?.sizes?.medium?.source_url
    || practica.anexosDetails?.[0]?.source_url
    || null;

  const categoriasVisibles = practica.categoriesDetails?.slice(0, 2) || [];
  const categoriasRestantes = (practica.categoriesDetails?.length || 0) - 2;
  const tagsVisibles = practica.tagsDetails?.slice(0, 2) || [];
  const tagsRestantes = (practica.tagsDetails?.length || 0) - 2;
  const tienePdf = (practica.pdfBuenaPractica || 0) > 0;
  const esDestacada = practica.practicaDestacada === true;

  return (
    <article
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 h-full flex flex-col shadow-sm hover:shadow-xl border-2',
        esDestacada
          ? 'border-amber-400 ring-2 ring-amber-200'
          : 'border-gray-100 hover:border-[#FF6900]/20'
      )}
    >
      {/* Badge Destacada */}
      {esDestacada && (
        <div className="absolute top-0 right-0 z-20">
          <HighlightBadge />
        </div>
      )}

      {/* Imagen */}
      <Link
        href={`/practica/${practica.slug}/`}
        className="block relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0"
      >
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={practica.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FF6900]/5 to-[#700D39]/5">
            <Building2 className="h-16 w-16 text-[#FF6900]/20" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Estado badge */}
        {practica.estadoActual && (
          <StatusBadge status={practica.estadoActual} className="absolute top-3 left-3" />
        )}

        {/* PDF badge */}
        {tienePdf && (
          <PdfBadge className={cn('absolute right-3', esDestacada ? 'top-10' : 'top-3')} />
        )}
      </Link>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Título */}
        <Link href={`/practica/${practica.slug}/`} className="block mb-3">
          <h3 className="text-lg font-bold text-[#700D39] line-clamp-2 group-hover:text-[#FF6900] transition-colors duration-300 leading-tight">
            {practica.title}
          </h3>
        </Link>

        {/* Meta Info */}
        <div className="space-y-2 text-sm mb-4">
          {(practica.municipio || practica.provincia || practica.ccaa) && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4 text-[#FF6900] flex-shrink-0" />
              <span className="line-clamp-1">
                {[practica.municipio, practica.provincia, practica.ccaa].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          {practica.entidadResponsable && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-4 w-4 text-[#700D39] flex-shrink-0" />
              <span className="line-clamp-1">{practica.entidadResponsable}</span>
            </div>
          )}
          {practica.anioInicio && (
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>Desde {practica.anioInicio}</span>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Categorías y Tags */}
        {(categoriasVisibles.length > 0 || tagsVisibles.length > 0) && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {/* Categorías */}
            {categoriasVisibles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {categoriasVisibles.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200"
                  >
                    {expandAcronyms(cat.name)}
                  </span>
                ))}
                {categoriasRestantes > 0 && (
                  <span className="text-xs text-blue-400 font-medium">+{categoriasRestantes}</span>
                )}
              </div>
            )}

            {/* Tags */}
            {tagsVisibles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {tagsVisibles.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-md border border-purple-200"
                  >
                    #{tag.name}
                  </span>
                ))}
                {tagsRestantes > 0 && (
                  <span className="text-xs text-purple-400 font-medium">+{tagsRestantes}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/practica/${practica.slug}/`}
          className="inline-flex items-center gap-2 text-[#FF6900] font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
        >
          Ver detalles
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
