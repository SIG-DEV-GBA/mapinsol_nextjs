/**
 * =============================================================================
 * PÁGINA DE INICIO (HOME)
 * =============================================================================
 *
 * Página principal de la aplicación. Muestra:
 * - Hero con categorías y CTA
 * - Últimas prácticas publicadas
 * - Prácticas destacadas
 *
 * Esta página usa ISR con revalidación cada 60 segundos.
 *
 * @route /
 * @module app/page
 */

import { Hero, LatestPractices, FeaturedPractices } from "@/components";

/**
 * ISR: Revalidar cada 60 segundos
 * Esto significa que la página se regenerará en background
 * cuando pase más de 1 minuto desde la última generación.
 */
export const revalidate = 60;

/**
 * Componente de la página de inicio
 *
 * Server Component que renderiza las tres secciones principales:
 * Hero, últimas prácticas y destacadas.
 */
export default function HomePage() {
  return (
    <main className="flex-grow">
      <Hero />
      <LatestPractices />
      <FeaturedPractices />
    </main>
  );
}
