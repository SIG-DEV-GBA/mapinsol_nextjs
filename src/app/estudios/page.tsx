/**
 * =============================================================================
 * PÁGINA DE LISTADO DE ESTUDIOS
 * =============================================================================
 *
 * Página que muestra el catálogo de estudios e investigaciones.
 * Diseño limpio con hero y grid de cards.
 *
 * @route /estudios
 * @module app/estudios/page
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Building2, Calendar, Globe, FileText } from 'lucide-react';
import { getEstudios } from '@/lib/wordpress';
import { EstudioCard } from '@/components/estudios';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Estudio } from '@/types';

/**
 * ISR: Revalidar cada 60 segundos
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Estudios e Investigaciones',
  description: 'Investigaciones, informes y publicaciones sobre la soledad no deseada en personas mayores: causas, impacto y estrategias de intervención.',
  alternates: {
    canonical: '/estudios/',
  },
};

/**
 * Página de listado de estudios
 */
export default async function EstudiosPage() {
  const { data: estudios, total } = await getEstudios({ per_page: 50 });

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Estudios e Investigaciones',
        description: 'Colección de estudios sobre atención a personas mayores',
        url: 'https://mapinsol.es/estudios/',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Mapinsol',
          url: 'https://mapinsol.es/',
        },
      }} />

      {/* Hero Section + Wave en un solo bloque */}
      <div className="bg-gradient-to-b from-[#A10D5E] to-[#8B1547] text-white">
        <div className="container mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <BookOpen className="h-7 w-7 md:h-8 md:w-8 text-white flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins">
              Estudios e Investigaciones
            </h1>
          </div>
        </div>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      {/* Contenido */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {estudios.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-nunito">
              Próximamente
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Estamos preparando una colección de estudios e investigaciones
              sobre atención a personas mayores.
            </p>
            <Link
              href="/practicas/"
              className="inline-flex items-center gap-2 bg-[#A10D5E] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#8B1547] transition-colors"
            >
              Explorar buenas prácticas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : estudios.length === 1 ? (
          /* Layout destacado para un solo estudio */
          <EstudioFeatured estudio={estudios[0]} />
        ) : (
          <>
            {/* Header del grid */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 font-nunito">
                Todos los estudios
              </h2>
              <span className="text-sm font-medium text-gray-600">
                {total} estudios disponibles
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {estudios.map((estudio) => (
                <EstudioCard key={estudio.id} estudio={estudio} />
              ))}
            </div>
          </>
        )}
      </section>

    </main>
  );
}

// =============================================================================
// LAYOUT DESTACADO PARA UN SOLO ESTUDIO
// =============================================================================

const AMBITO_LABELS: Record<string, string> = {
  local: 'Local',
  regional: 'Regional',
  estatal: 'Estatal',
  europeo: 'Europeo',
  internacional: 'Internacional',
};

function EstudioFeatured({ estudio }: { estudio: Estudio }) {
  const imagenUrl = estudio.featuredMediaUrl;
  const tieneDocumentos = estudio.documentosDescarga?.length > 0;
  const rangoAnios = estudio.anioInicio && estudio.anioFin
    ? `${estudio.anioInicio}–${estudio.anioFin}`
    : estudio.anioPublicacion || '';

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href={`/estudio/${estudio.slug}/`}
        className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#A10D5E]/20"
      >
        <div className="flex flex-col md:flex-row">
          {/* Imagen */}
          <div className="relative md:w-1/2 flex-shrink-0">
            <div className="relative h-64 sm:h-80 md:h-full md:min-h-[26rem] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 md:p-8">
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt={estudio.title}
                  className="max-h-full max-w-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <BookOpen className="h-24 w-24 text-[#A10D5E]/15" />
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {estudio.ambitoGeografico && (
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  <Globe className="h-3.5 w-3.5 text-[#A10D5E]" />
                  {AMBITO_LABELS[estudio.ambitoGeografico] || estudio.ambitoGeografico}
                </span>
              )}
              {tieneDocumentos && (
                <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </span>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 md:p-10 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#A10D5E] group-hover:text-[#F29429] transition-colors duration-300 font-poppins mb-5 leading-tight">
              {estudio.title}
            </h2>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
              {estudio.promotor && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4 text-[#A10D5E] flex-shrink-0" />
                  <span className="font-medium">{estudio.promotor}</span>
                </div>
              )}
              {rangoAnios && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{rangoAnios}</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            {estudio.descripcion && (
              <p
                className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-4"
                dangerouslySetInnerHTML={{
                  __html: estudio.descripcion.replace(/<[^>]*>/g, '').slice(0, 300) + '...'
                }}
              />
            )}

            {/* Categorías */}
            {estudio.categoriesDetails && estudio.categoriesDetails.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {estudio.categoriesDetails.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1 bg-orange-50 text-[#F29429] text-sm font-semibold px-3 py-1.5 rounded-full border border-orange-200"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div>
              <span className="inline-flex items-center gap-3 bg-[#A10D5E] text-white font-semibold px-8 py-4 rounded-full group-hover:bg-[#8B1547] transition-all duration-300 text-base">
                Ver estudio completo
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
