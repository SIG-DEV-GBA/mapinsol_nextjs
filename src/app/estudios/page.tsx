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
import { BookOpen, ArrowRight } from 'lucide-react';
import { getEstudios } from '@/lib/wordpress';
import { EstudioCard } from '@/components/estudios';
import { JsonLd } from '@/components/seo/JsonLd';

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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#700D39] via-[#8B1547] to-[#700D39] text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-poppins">
              Estudios e Investigaciones
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Investigaciones, informes y publicaciones sobre la soledad no deseada
              en personas mayores: causas, impacto y estrategias de intervención.
            </p>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Grid de Estudios */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {estudios.length > 0 ? (
          <>
            {/* Header del grid */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 font-nunito">
                Todos los estudios
              </h2>
              <span className="text-sm font-medium text-gray-600">
                {total} {total === 1 ? 'estudio' : 'estudios'} disponibles
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {estudios.map((estudio) => (
                <EstudioCard key={estudio.id} estudio={estudio} />
              ))}
            </div>
          </>
        ) : (
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
              className="inline-flex items-center gap-2 bg-[#700D39] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#8B1547] transition-colors"
            >
              Explorar buenas prácticas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {estudios.length > 0 && (
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-nunito">
              ¿Conoces alguna investigación relevante?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Si conoces estudios o publicaciones que puedan enriquecer este catálogo,
              nos encantaría saberlo.
            </p>
            <a
              href="mailto:info@fundacionpadrinosdelavejez.es"
              className="inline-flex items-center gap-2 bg-[#FF6900] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#E55A00] transition-colors"
            >
              Contactar
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
