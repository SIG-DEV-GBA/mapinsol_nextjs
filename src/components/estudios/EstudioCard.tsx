/**
 * =============================================================================
 * COMPONENTE: TARJETA DE ESTUDIO
 * =============================================================================
 *
 * Tarjeta para mostrar un estudio en el listado/grid.
 * Diseño limpio y profesional siguiendo la línea de PracticaCard.
 *
 * @module components/estudios/EstudioCard
 */

import Link from 'next/link';
import { Calendar, Building2, ArrowRight, FileText, Globe, BookOpen } from 'lucide-react';
import type { Estudio } from '@/types';
import { cn } from '@/lib/utils';

/** Props del componente EstudioCard */
interface EstudioCardProps {
  estudio: Estudio;
}

/** Mapeo de tipos de promotor a etiquetas legibles */
const TIPO_PROMOTOR_LABELS: Record<string, string> = {
  administracion_central: 'Administración Central',
  administracion_autonomica: 'Administración Autonómica',
  administracion_local: 'Administración Local',
  universidad: 'Universidad',
  fundacion: 'Fundación',
  ong: 'ONG',
  organismo_europeo: 'Organismo Europeo',
  organismo_internacional: 'Organismo Internacional',
  empresa: 'Empresa',
  otro: 'Otro',
};

/** Mapeo de ámbito geográfico a etiquetas */
const AMBITO_LABELS: Record<string, string> = {
  local: 'Local',
  regional: 'Regional',
  estatal: 'Estatal',
  europeo: 'Europeo',
  internacional: 'Internacional',
};

/**
 * Tarjeta de estudio para el grid de listado
 */
export function EstudioCard({ estudio }: EstudioCardProps) {
  const imagenUrl = estudio.featuredMediaUrl || null;
  const esDestacado = estudio.estudioDestacado === true;
  const tieneDocumentos = estudio.documentosDescarga?.length > 0;

  // Construir el rango de años si existe
  const rangoAnios = estudio.anioInicio && estudio.anioFin
    ? `${estudio.anioInicio}-${estudio.anioFin}`
    : estudio.anioPublicacion || '';

  return (
    <article
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 h-full flex flex-col shadow-sm hover:shadow-xl border-2',
        esDestacado
          ? 'border-emerald-400 ring-2 ring-emerald-200'
          : 'border-gray-100 hover:border-[#A10D5E]/20'
      )}
    >
      {/* Badge Destacado */}
      {esDestacado && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-lg">
            Destacado
          </div>
        </div>
      )}

      {/* Imagen */}
      <Link
        href={`/estudio/${estudio.slug}/`}
        className="block relative h-56 overflow-hidden bg-white flex-shrink-0"
      >
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={estudio.title}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#A10D5E]/5 to-[#F29429]/5">
            <BookOpen className="h-16 w-16 text-[#A10D5E]/20" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Ámbito badge */}
        {estudio.ambitoGeografico && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
            <Globe className="h-3 w-3 text-[#A10D5E]" />
            {AMBITO_LABELS[estudio.ambitoGeografico] || estudio.ambitoGeografico}
          </span>
        )}

        {/* Documentos badge */}
        {tieneDocumentos && (
          <span className={cn(
            'absolute right-3 inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg',
            esDestacado ? 'top-10' : 'top-3'
          )}>
            <FileText className="h-3 w-3" />
            PDF
          </span>
        )}
      </Link>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Tipo de promotor */}
        {estudio.tipoPromotor && (
          <span className="inline-flex self-start items-center gap-1 bg-[#A10D5E]/10 text-[#A10D5E] text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
            {TIPO_PROMOTOR_LABELS[estudio.tipoPromotor] || estudio.tipoPromotor}
          </span>
        )}

        {/* Título */}
        <Link href={`/estudio/${estudio.slug}/`} className="block mb-3">
          <h3 className="text-lg font-bold text-[#A10D5E] line-clamp-2 group-hover:text-[#F29429] transition-colors duration-300 leading-tight">
            {estudio.title}
          </h3>
        </Link>

        {/* Meta Info */}
        <div className="space-y-2 text-sm mb-4">
          {estudio.promotor && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-4 w-4 text-[#A10D5E] flex-shrink-0" />
              <span className="line-clamp-1">{estudio.promotor}</span>
            </div>
          )}
          {rangoAnios && (
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{rangoAnios}</span>
            </div>
          )}
        </div>

        {/* Descripción breve */}
        {estudio.descripcion && (
          <p
            className="text-sm text-gray-600 line-clamp-2 mb-4"
            dangerouslySetInnerHTML={{
              __html: estudio.descripcion.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
            }}
          />
        )}

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Categorías */}
        {estudio.categoriesDetails && estudio.categoriesDetails.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-1.5">
              {estudio.categoriesDetails.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1 bg-orange-50 text-[#F29429] text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200"
                >
                  {cat.name}
                </span>
              ))}
              {estudio.categoriesDetails.length > 2 && (
                <span className="text-xs text-orange-400 font-medium">
                  +{estudio.categoriesDetails.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/estudio/${estudio.slug}/`}
          className="inline-flex items-center gap-2 text-[#A10D5E] font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
        >
          Ver estudio
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
