/**
 * =============================================================================
 * PÁGINA DE DETALLE DE ESTUDIO
 * =============================================================================
 *
 * Página dinámica que muestra el detalle completo de un estudio.
 *
 * @route /estudio/[slug]
 * @module app/estudio/[slug]/page
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Globe,
  FileText,
  Download,
  ExternalLink,
  Play,
  BookOpen,
  Target,
  Users,
  ClipboardList,
  BarChart3,
  Lightbulb,
  Link as LinkIcon,
} from 'lucide-react';
import {
  getEstudios,
  getEstudioBySlug,
  enrichEstudioWithDocumentos,
  enrichEstudioWithGaleria,
  getMediaById,
} from '@/lib/wordpress';
import { SafeHtml } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { MediaGallery } from '@/components/ui';
import type { Estudio, DocumentoEstudio } from '@/types';

export const revalidate = 60;

/**
 * Genera las rutas estáticas para todos los estudios
 */
export async function generateStaticParams() {
  const { data: estudios } = await getEstudios({ per_page: 100 });
  return estudios.map((e) => ({ slug: e.slug }));
}

/**
 * Genera metadatos SEO dinámicos
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const estudio = await getEstudioBySlug(slug);

  if (!estudio) {
    return { title: 'Estudio no encontrado' };
  }

  const descripcionLimpia = estudio.descripcion
    ? estudio.descripcion.replace(/<[^>]*>/g, '').slice(0, 160)
    : `Estudio: ${estudio.title}`;

  return {
    title: estudio.title,
    description: descripcionLimpia,
    alternates: {
      canonical: `/estudio/${slug}/`,
    },
    openGraph: {
      title: estudio.title,
      description: descripcionLimpia,
      type: 'article',
      images: estudio.featuredMediaUrl
        ? [{ url: estudio.featuredMediaUrl, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

/** Mapeos de labels */
const TIPO_PROMOTOR_LABELS: Record<string, string> = {
  administracion_central: 'Administración Central',
  administracion_autonomica: 'Administración Autonómica',
  administracion_local: 'Administración Local',
  universidad: 'Universidad',
  fundacion: 'Fundación',
  ong: 'ONG / Asociación',
  organismo_europeo: 'Organismo Europeo',
  organismo_internacional: 'Organismo Internacional',
  empresa: 'Empresa / Consultoría',
  otro: 'Otro',
};

const AMBITO_LABELS: Record<string, string> = {
  local: 'Local',
  regional: 'Regional / Autonómico',
  estatal: 'Estatal',
  europeo: 'Europeo',
  internacional: 'Internacional',
};

const TIPO_DOC_LABELS: Record<string, string> = {
  informe_completo: 'Informe Completo',
  informe_ejecutivo: 'Resumen Ejecutivo',
  guia: 'Guía',
  infografia: 'Infografía',
  presentacion: 'Presentación',
  anexo: 'Anexo',
  otro: 'Documento',
};

const IDIOMA_LABELS: Record<string, string> = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
  pt: 'PT',
  ca: 'CA',
  eu: 'EU',
  gl: 'GL',
};

/**
 * Extrae el ID de video de una URL de YouTube
 */
function getYoutubeId(url: string | undefined): string | null {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Componente de sección colapsable de contenido
 */
function ContentSection({
  icon: Icon,
  title,
  content,
  defaultOpen = false,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  defaultOpen?: boolean;
}) {
  if (!content) return null;

  return (
    <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden" open={defaultOpen}>
      <summary className="flex items-center gap-3 p-5 cursor-pointer hover:bg-gray-50 transition-colors list-none">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#700D39]/10 to-[#FF6900]/10 rounded-lg">
          <Icon className="h-5 w-5 text-[#700D39]" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 flex-grow font-nunito">{title}</h3>
        <span className="text-gray-400 group-open:rotate-180 transition-transform">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="px-5 pb-5 pt-2">
        <div className="wp-content">
          <SafeHtml html={content} />
        </div>
      </div>
    </details>
  );
}

/**
 * Página de detalle de estudio
 */
export default async function EstudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let estudio = await getEstudioBySlug(slug);

  if (!estudio) {
    notFound();
  }

  // Enriquecer con documentos y galería
  if (estudio.documentosDescarga?.length > 0) {
    estudio = await enrichEstudioWithDocumentos(estudio);
  }
  if (estudio.galeria?.length > 0) {
    estudio = await enrichEstudioWithGaleria(estudio);
  }

  // Obtener URL del logo del promotor
  let logoPromotorUrl: string | undefined;
  if (estudio.logoPromotor && estudio.logoPromotor > 0) {
    const logoMedia = await getMediaById(estudio.logoPromotor);
    logoPromotorUrl = logoMedia?.source_url;
  }

  const youtubeId = getYoutubeId(estudio.enlaceVideo);
  const rangoAnios = estudio.anioInicio && estudio.anioFin
    ? `${estudio.anioInicio} - ${estudio.anioFin}`
    : estudio.anioPublicacion || '';

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline: estudio.title,
        description: estudio.descripcion?.replace(/<[^>]*>/g, '').slice(0, 160),
        author: {
          '@type': 'Organization',
          name: estudio.promotor || 'Fundación Padrinos de la Vejez',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Fundación Padrinos de la Vejez',
        },
        datePublished: estudio.datePublished?.toISOString(),
        mainEntityOfPage: `https://mapinsol.es/estudio/${estudio.slug}/`,
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Back Link */}
        <Link
          href="/estudios/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#700D39] font-medium text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a estudios
        </Link>

        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Imagen destacada */}
          {estudio.featuredMediaUrl && (
            <div className="relative h-80 md:h-[450px] lg:h-[500px] overflow-hidden">
              <img
                src={estudio.featuredMediaUrl}
                alt={estudio.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Badges sobre imagen */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {estudio.ambitoGeografico && (
                  <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                    <Globe className="h-4 w-4 text-[#700D39]" />
                    {AMBITO_LABELS[estudio.ambitoGeografico] || estudio.ambitoGeografico}
                  </span>
                )}
                {estudio.estudioDestacado && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                    Destacado
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Tipo de promotor badge */}
            {estudio.tipoPromotor && (
              <span className="inline-flex items-center gap-1.5 bg-[#700D39]/10 text-[#700D39] text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                {TIPO_PROMOTOR_LABELS[estudio.tipoPromotor] || estudio.tipoPromotor}
              </span>
            )}

            {/* Título */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-poppins leading-tight">
              {estudio.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600">
              {estudio.promotor && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#700D39]" />
                  <span>{estudio.promotor}</span>
                </div>
              )}
              {rangoAnios && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#700D39]" />
                  <span>{rangoAnios}</span>
                </div>
              )}
              {estudio.ccaa && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#700D39]" />
                  <span>{estudio.ccaa}</span>
                </div>
              )}
            </div>

            {/* Categorías */}
            {estudio.categoriesDetails && estudio.categoriesDetails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {estudio.categoriesDetails.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center bg-teal-50 text-teal-700 text-sm font-medium px-3 py-1 rounded-full border border-teal-200"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Contenido Principal */}
          <div className="space-y-4">
            <ContentSection
              icon={BookOpen}
              title="Descripción"
              content={estudio.descripcion}
              defaultOpen={true}
            />
            <ContentSection
              icon={Target}
              title="Objetivos"
              content={estudio.objetivos}
              defaultOpen={true}
            />
            <ContentSection
              icon={Users}
              title="A quién se dirige"
              content={estudio.destinatarios}
            />
            <ContentSection
              icon={ClipboardList}
              title="Metodología"
              content={estudio.metodologia}
            />
            <ContentSection
              icon={BarChart3}
              title="Resultados"
              content={estudio.resultados}
            />
            <ContentSection
              icon={Lightbulb}
              title="Conclusiones"
              content={estudio.conclusiones}
            />

            {/* Video YouTube - solo si NO hay galería (si hay galería, el video va en la galería) */}
            {youtubeId && (!estudio.galeriaDetails || estudio.galeriaDetails.length === 0) && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                      <Play className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-nunito">Video</h3>
                  </div>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={estudio.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Estudios de la misma línea */}
            {estudio.estudiosLinea && estudio.estudiosLinea.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-nunito">
                      Otros estudios de esta línea
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {estudio.estudiosLinea.map((est, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-12 h-6 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                          {est.anio_estudio}
                        </span>
                        {est.url_estudio ? (
                          <a
                            href={est.url_estudio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#700D39] hover:text-[#F29429] font-medium transition-colors"
                          >
                            {est.titulo_estudio}
                          </a>
                        ) : (
                          <span className="text-gray-700">{est.titulo_estudio}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Logo del promotor */}
            {logoPromotorUrl && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
                <img
                  src={logoPromotorUrl}
                  alt={estudio.promotor}
                  className="max-h-24 w-auto object-contain"
                />
              </div>
            )}

            {/* Documentos descargables */}
            {estudio.documentosDescarga && estudio.documentosDescarga.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-gray-900">Documentos</h3>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {estudio.documentosDescarga.map((doc: DocumentoEstudio & { archivoUrl?: string }, idx) => (
                    <a
                      key={idx}
                      href={doc.archivoUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                        <Download className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {doc.nombre_documento}
                        </p>
                        <p className="text-xs text-gray-500">
                          {TIPO_DOC_LABELS[doc.tipo_documento] || doc.tipo_documento}
                          {doc.idioma && ` · ${IDIOMA_LABELS[doc.idioma] || doc.idioma}`}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Enlaces externos */}
            {estudio.enlacesExternos && estudio.enlacesExternos.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-[#700D39]" />
                    <h3 className="font-bold text-gray-900">Enlaces</h3>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {estudio.enlacesExternos.map((enlace, idx) => (
                    <a
                      key={idx}
                      href={enlace.url_enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-[#700D39] hover:text-[#F29429] font-medium">
                        {enlace.texto_enlace}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Info del promotor */}
            {(estudio.promotor || estudio.urlPromotor) && (
              <div className="bg-gradient-to-br from-[#700D39] to-[#8B1547] rounded-xl p-6 text-white">
                <h3 className="font-bold mb-3">Promotor</h3>
                {estudio.promotor && (
                  <p className="text-white/90 mb-3">{estudio.promotor}</p>
                )}
                {estudio.urlPromotor && (
                  <a
                    href={estudio.urlPromotor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Visitar web
                  </a>
                )}
              </div>
            )}

            {/* Galería de imágenes */}
            {estudio.galeriaDetails && estudio.galeriaDetails.length > 0 && (
              <MediaGallery
                imagenes={estudio.galeriaDetails}
                youtubeId={youtubeId}
                title={estudio.title}
                compact
              />
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
