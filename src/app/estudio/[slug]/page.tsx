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
  enrichEstudioWithPdf,
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
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#A10D5E]/10 to-[#F29429]/10 rounded-lg">
          <Icon className="h-5 w-5 text-[#A10D5E]" />
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

  // Enriquecer con documentos, galería y PDF
  if (estudio.documentosDescarga?.length > 0) {
    estudio = await enrichEstudioWithDocumentos(estudio);
  }
  if (estudio.galeria?.length > 0) {
    estudio = await enrichEstudioWithGaleria(estudio);
  }
  if (estudio.pdfEstudio && estudio.pdfEstudio > 0) {
    estudio = await enrichEstudioWithPdf(estudio);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="py-5 mb-6">
          <Link
            href="/estudios/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#F29429] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a estudios</span>
          </Link>
        </div>

        {/* Galería */}
        {estudio.galeriaDetails && estudio.galeriaDetails.length > 0 && (
          <MediaGallery
            imagenes={estudio.galeriaDetails}
            youtubeId={youtubeId}
            title={estudio.title}
          />
        )}

        {/* Header */}
        <header className="mb-10">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {estudio.tipoPromotor && (
              <span className="inline-flex items-center gap-1.5 bg-[#A10D5E]/10 text-[#A10D5E] text-sm font-semibold px-3 py-1.5 rounded-full">
                {TIPO_PROMOTOR_LABELS[estudio.tipoPromotor] || estudio.tipoPromotor}
              </span>
            )}
            {estudio.ambitoGeografico && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                <Globe className="h-3.5 w-3.5 text-[#A10D5E]" />
                {AMBITO_LABELS[estudio.ambitoGeografico] || estudio.ambitoGeografico}
              </span>
            )}
            {estudio.estudioDestacado && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                Destacado
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#A10D5E] leading-tight mb-5">
            {estudio.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-6 mb-6">
            {estudio.promotor && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-5 h-5 text-[#F29429]" />
                <span className="font-semibold text-gray-500">Promotor:</span>
                {estudio.urlPromotor ? (
                  <a
                    href={estudio.urlPromotor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 font-medium hover:text-[#F29429] hover:underline transition-colors"
                  >
                    {estudio.promotor}
                  </a>
                ) : (
                  <span>{estudio.promotor}</span>
                )}
              </div>
            )}
            {estudio.ccaa && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-5 h-5 text-[#F29429]" />
                <span>{estudio.ccaa}</span>
              </div>
            )}
            {rangoAnios && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-[#F29429]" />
                <span>{rangoAnios}</span>
              </div>
            )}
          </div>

          {/* PDF Link */}
          {estudio.pdfEstudioUrl && (
            <a
              href={estudio.pdfEstudioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-white rounded-xl border-2 border-red-200 text-red-600 font-semibold text-base hover:border-red-500 hover:bg-red-50 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <PdfIcon />
              <span>Descargar Estudio en PDF</span>
              <Download className="w-5 h-5 opacity-70" />
            </a>
          )}
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
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
                            className="text-[#A10D5E] hover:text-[#F29429] font-medium transition-colors"
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
                    <LinkIcon className="h-5 w-5 text-[#A10D5E]" />
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
                      <span className="text-sm text-[#A10D5E] hover:text-[#F29429] font-medium">
                        {enlace.texto_enlace}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Info del promotor */}
            {(estudio.promotor || estudio.urlPromotor) && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#A10D5E]" />
                    <h3 className="font-bold text-gray-900">Promotor</h3>
                  </div>
                </div>
                <div className="p-5 flex flex-col items-center">
                  {logoPromotorUrl && (
                    <div className="mb-4">
                      <img
                        src={logoPromotorUrl}
                        alt={estudio.promotor}
                        className="max-h-24 w-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                  {estudio.promotor && (
                    <p className="text-xl font-extrabold italic text-[#A10D5E] text-center font-poppins leading-snug">{estudio.promotor}</p>
                  )}
                  {estudio.urlPromotor && (
                    <a
                      href={estudio.urlPromotor}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-sm font-semibold text-[#A10D5E] hover:text-[#F29429] transition-colors mt-3"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visitar web del promotor
                    </a>
                  )}
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>
    </main>
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
