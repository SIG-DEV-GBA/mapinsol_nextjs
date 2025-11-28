/**
 * =============================================================================
 * PÁGINA DE LISTADO DE PRÁCTICAS
 * =============================================================================
 *
 * Página que muestra el catálogo completo de buenas prácticas con:
 * - Hero con buscador y estadísticas
 * - Panel de filtros avanzados (sticky)
 * - Grid de tarjetas de prácticas
 * - Paginación
 *
 * ARQUITECTURA:
 * - Server Component para la carga inicial de datos
 * - PracticasClient (Client Component) para interactividad
 * - ISR con revalidación cada 60 segundos
 *
 * @route /practicas
 * @module app/practicas/page
 */

import { Suspense } from 'react';
import { getBuenasPracticas, getCategories, getTags } from '@/lib/wordpress';
import { HeroSearch, PracticasClient } from '@/components/practicas';

/**
 * ISR: Revalidar cada 60 segundos
 * Las prácticas se actualizan en background sin afectar la experiencia del usuario.
 */
export const revalidate = 60;

/** Metadatos para SEO de la página de listado */
export const metadata = {
  title: 'Explorar Buenas Prácticas - Mapinsol',
  description: 'Descubre iniciativas innovadoras en atención y cuidado de personas mayores. Explora el catálogo de buenas prácticas.',
};

/**
 * Componente de loading para los filtros
 * Se muestra mientras se cargan los componentes del cliente
 */
function FiltersLoading() {
  return (
    <div className="sticky top-24 z-40 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="h-12 bg-gray-200 rounded-2xl animate-pulse flex-1 max-w-md" />
          <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Página de listado de prácticas
 *
 * Server Component asíncrono que:
 * 1. Carga datos en paralelo (prácticas, categorías, etiquetas)
 * 2. Calcula estadísticas (entidades únicas)
 * 3. Renderiza hero y pasa datos al client component
 */
export default async function PracticasPage() {
  // Fetch all data in parallel para mejor rendimiento
  const [{ data: practicas, total }, categorias, etiquetas] = await Promise.all([
    getBuenasPracticas({ per_page: 100 }),
    getCategories(),
    getTags(),
  ]);

  // Calcular número de entidades únicas para mostrar en estadísticas
  const entidadesUnicas = new Set(
    practicas.map((p) => p.entidadResponsable).filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSearch total={total} entidades={entidadesUnicas} />
      <Suspense fallback={<FiltersLoading />}>
        <PracticasClient
          initialPracticas={practicas}
          categorias={categorias}
          etiquetas={etiquetas}
        />
      </Suspense>
    </main>
  );
}
