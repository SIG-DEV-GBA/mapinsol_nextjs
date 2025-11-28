/**
 * =============================================================================
 * PÁGINA DE DETALLE DE PRÁCTICA
 * =============================================================================
 *
 * Página dinámica que muestra el detalle completo de una buena práctica.
 * Usa rutas dinámicas de Next.js con el parámetro [slug].
 *
 * CONTENIDO:
 * - Galería de medios (imágenes + video YouTube)
 * - Header con título, categorías y badges
 * - Contenido en acordeones (descripción, metodología, resultados, etc.)
 * - Sidebar con metadatos (entidad, ubicación, contacto)
 * - Prácticas relacionadas
 *
 * CARACTERÍSTICAS:
 * - ISR con revalidación cada 60 segundos
 * - generateStaticParams para pre-renderizar todas las prácticas
 * - generateMetadata para SEO dinámico
 * - Enriquecimiento de datos (anexos, PDF)
 *
 * @route /practica/[slug]
 * @module app/practica/[slug]/page
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBuenasPracticas, getBuenaPracticaBySlug, enrichPracticaWithAnexos, enrichPracticaWithMediaUrls } from '@/lib/wordpress';
import {
  MediaGallery,
  PracticaContent,
  PracticaSidebar,
  RelatedPracticas,
  PracticaHeader,
} from '@/components/practica';
import { BackLink, PdfLink } from '@/components/practica/PracticaHeader';
import type { BuenaPractica } from '@/types';

/**
 * ISR: Revalidar cada 60 segundos
 * Permite que las páginas de detalle se actualicen sin rebuild completo.
 */
export const revalidate = 60;

/**
 * Genera las rutas estáticas para todas las prácticas en build time
 * Next.js pre-renderizará cada página de detalle.
 */
export async function generateStaticParams() {
  const { data: practicas } = await getBuenasPracticas({ per_page: 100 });
  return practicas.map((p) => ({ slug: p.slug }));
}

/**
 * Genera metadatos SEO dinámicos para cada práctica
 * Usa el título y objetivo principal para title y description.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const practica = await getBuenaPracticaBySlug(slug);

  if (!practica) {
    return { title: 'Práctica no encontrada' };
  }

  return {
    title: `${practica.title} - Buenas Prácticas`,
    description: practica.objetivoPrincipal
      ? practica.objetivoPrincipal.replace(/<[^>]*>/g, '').slice(0, 160)
      : `Buena práctica: ${practica.title}`,
  };
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Extrae valores seleccionados de un checkbox group de JetEngine
 * Reemplaza underscores por espacios en los labels
 *
 * @param group - Objeto checkbox group { opcion: "true"/"false" }
 * @returns Array de opciones seleccionadas (formateadas)
 */
function getCheckboxValues(group: Record<string, string> | undefined): string[] {
  if (!group || typeof group !== 'object') return [];
  return Object.entries(group)
    .filter(([, v]) => v === 'true')
    .map(([k]) => k.replace(/_/g, ' '));
}

/**
 * Extrae el ID de video de una URL de YouTube
 * Soporta múltiples formatos: youtube.com/watch, youtu.be, embed, etc.
 *
 * @param url - URL de YouTube
 * @returns ID del video (11 caracteres) o null si no es válida
 */
function getYoutubeId(url: string | undefined): string | null {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Calcula prácticas relacionadas basándose en categorías y tags comunes
 *
 * Sistema de puntuación:
 * - Categoría común: +3 puntos
 * - Tag común: +2 puntos
 * - Práctica destacada: +5 puntos bonus
 *
 * @param current - Práctica actual
 * @param all - Todas las prácticas disponibles
 * @returns Top 3 prácticas más relacionadas
 */
function getRelatedPracticas(
  current: BuenaPractica,
  all: BuenaPractica[]
): BuenaPractica[] {
  const currentCategoryIds = current.categories || [];
  const currentTagIds = current.tags || [];

  return all
    .filter((p) => p.id !== current.id)
    .map((p) => {
      const catMatches = (p.categories || []).filter((c) =>
        currentCategoryIds.includes(c)
      ).length;
      const tagMatches = (p.tags || []).filter((t) =>
        currentTagIds.includes(t)
      ).length;
      const score = catMatches * 3 + tagMatches * 2 + (p.practicaDestacada ? 5 : 0);
      return { ...p, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// =============================================================================
// COMPONENTE DE PÁGINA
// =============================================================================

/**
 * Página de detalle de una buena práctica
 *
 * Server Component asíncrono que:
 * 1. Obtiene la práctica por slug
 * 2. Enriquece con datos de anexos y PDF
 * 3. Calcula prácticas relacionadas
 * 4. Renderiza todos los componentes del detalle
 *
 * @param params - Parámetros de ruta (slug)
 */
export default async function PracticaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch practica por slug
  let practica = await getBuenaPracticaBySlug(slug);

  if (!practica) {
    notFound();
  }

  // Enrich with anexos and media URLs
  if (practica.anexos && practica.anexos.length > 0) {
    practica = await enrichPracticaWithAnexos(practica);
  }
  if (practica.pdfBuenaPractica && practica.pdfBuenaPractica > 0) {
    practica = await enrichPracticaWithMediaUrls(practica);
  }

  // Extract data
  const poblacion = getCheckboxValues(practica.poblacionDestinataria);
  const agentes = getCheckboxValues(practica.agentesImplicados);
  const youtubeId = getYoutubeId(practica.enlaceVideo);
  const imagenes =
    practica.anexosDetails?.filter((a) => a.mime_type?.includes('image')) || [];
  const hasPdf = !!practica.pdfBuenaPracticaUrl;
  const hasMedia = imagenes.length > 0 || !!youtubeId;

  // Fetch related practicas
  const { data: todasPracticas } = await getBuenasPracticas({ per_page: 100 });
  const relacionadas = getRelatedPracticas(practica, todasPracticas);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <BackLink />

        {/* Media Gallery */}
        {hasMedia && (
          <MediaGallery
            imagenes={imagenes}
            youtubeId={youtubeId}
            practicaDestacada={practica.practicaDestacada}
            estadoActual={practica.estadoActual}
            title={practica.title}
          />
        )}

        {/* PDF Link */}
        {hasPdf && practica.pdfBuenaPracticaUrl && (
          <PdfLink url={practica.pdfBuenaPracticaUrl} />
        )}

        {/* Header */}
        <PracticaHeader practica={practica} showBadges={!hasMedia} />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <PracticaContent practica={practica} />
          <PracticaSidebar practica={practica} poblacion={poblacion} agentes={agentes} />
        </div>

        {/* Related Practicas */}
        <RelatedPracticas practicas={relacionadas} />
      </div>
    </main>
  );
}
