import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Newspaper, FileText, CalendarDays, BookOpenCheck,
  Video, ImageIcon, Download, ExternalLink, MapPin, Clock,
  Share2, ChevronRight, type LucideIcon,
} from 'lucide-react';
import { getActualidadBySlug, getActualidadSlugs, getActualidad } from '@/lib/wordpress';
import { SafeHtml } from '@/components/ui';
import { InfografiaViewer } from '@/components/actualidad';
import { MediaGallery } from '@/components/ui';
import { formatStudyPublicationDate } from '@/lib/utils';
import type { TipoContenido, Actualidad, SeccionBoletin } from '@/types';

const TIPO_CONFIG: Record<TipoContenido, { label: string; icon: LucideIcon; color: string; bg: string; border: string; heroAccent: string }> = {
  boletin: { label: 'Boletín', icon: Newspaper, color: 'text-[#A10D5E]', bg: 'bg-[#A10D5E]/10', border: 'border-[#A10D5E]/20', heroAccent: 'from-[#A10D5E] via-[#8B1547] to-[#A10D5E]' },
  nota_prensa: { label: 'Nota de prensa', icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', heroAccent: 'from-[#A10D5E] via-[#8B1547] to-[#A10D5E]' },
  evento: { label: 'Evento', icon: CalendarDays, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', heroAccent: 'from-[#A10D5E] via-[#8B1547] to-[#A10D5E]' },
  estudiosypoliticas: { label: 'Estudios y políticas', icon: BookOpenCheck, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', heroAccent: 'from-[#A10D5E] via-[#8B1547] to-[#A10D5E]' },
  video: { label: 'Video', icon: Video, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', heroAccent: 'from-[#A10D5E] via-[#8B1547] to-[#A10D5E]' },
  infografia: { label: 'Infografía', icon: ImageIcon, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', heroAccent: 'from-[#A10D5E] via-[#8B1547] to-[#A10D5E]' },
};

/** Checks if an HTML string has real visible content (not just empty tags/nbsp) */
function hasContent(html: string | undefined | null): boolean {
  if (!html) return false;
  const stripped = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
  return stripped.length > 0;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function getHttpUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  const raw = value.trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^www\./i.test(raw)) return `https://${raw}`;
  return '';
}

function hasText(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

export async function generateStaticParams() {
  const slugs = await getActualidadSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getActualidadBySlug(slug);
  if (!item) return { title: 'No encontrado | Mapinsol' };

  return {
    title: `${decodeHtmlEntities(item.title)} | Actualidad | Mapinsol`,
    description: item.descripcionCorta ? item.descripcionCorta.replace(/<[^>]+>/g, '').slice(0, 160) : decodeHtmlEntities(item.title),
  };
}

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

function RelatedCard({ item }: { item: Actualidad }) {
  const config = TIPO_CONFIG[item.tipoContenido] || TIPO_CONFIG.boletin;
  const Icon = config.icon;
  return (
    <Link
      href={`/actualidad/${item.slug}/`}
      className="group flex gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-[#A10D5E]/20 hover:shadow-md transition-all duration-300"
    >
      {item.featuredMediaUrl ? (
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <img src={item.featuredMediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center ${config.bg}`}>
          <Icon className={`h-8 w-8 ${config.color} opacity-50`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className={`inline-flex items-center gap-1 text-xs font-semibold ${config.color} mb-1`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </div>
        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#A10D5E] transition-colors">
          {decodeHtmlEntities(item.title)}
        </h4>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#A10D5E] transition-colors flex-shrink-0 self-center" />
    </Link>
  );
}

export default async function ActualidadDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getActualidadBySlug(slug);

  if (!item) notFound();

  const tipo = item.tipoContenido;
  const config = TIPO_CONFIG[tipo] || TIPO_CONFIG.boletin;
  const Icon = config.icon;
  const isEventType = tipo === 'evento';
  const isStudiesType = tipo === 'estudiosypoliticas';
  const embedUrl = tipo === 'video' ? getVideoEmbedUrl(item.urlVideo) : null;
  const pdfDelEstudioHref = item.pdfDelEstudioUrl || getHttpUrl(item.pdfDelEstudio);
  const enlaceDelEstudioHref = getHttpUrl(item.enlaceDelEstudio);
  const fechaPublicacionEstudioRaw = item.fechaPublicacionEstudio?.trim() || '';
  const fechaPublicacionEstudio = formatStudyPublicationDate(fechaPublicacionEstudioRaw);
  const hasFechaPublicacionEstudio = hasText(fechaPublicacionEstudioRaw);
  const hasDescripcionDelEstudio = hasContent(item.descripcionDelEstudio);
  const relatedStudyPdfs = item.pdfsRelacionadosEstudio
    .map((pdf) => {
      const href = pdf.documentoPdfRelacionadoUrl || getHttpUrl(pdf.documento_pdf_relacionado_estudio);
      const titulo = pdf.titulo_pdf_relacionado_estudio?.trim() || '';
      return {
        ...pdf,
        href,
        titulo,
      };
    })
    .filter((pdf) => Boolean(pdf.href) && Boolean(pdf.titulo));
  const interestStudyLinks = item.enlacesInteresEstudio
    .map((enlace) => {
      const titulo = enlace.titulo_enlace_estudios?.trim() || '';
      const href = getHttpUrl(enlace.enlace_enlace_estudios);
      return {
        ...enlace,
        titulo,
        href,
      };
    })
    .filter((enlace) => Boolean(enlace.titulo) && Boolean(enlace.href));
  const hasStudiesSpecificContent =
    hasFechaPublicacionEstudio ||
    Boolean(enlaceDelEstudioHref) ||
    hasDescripcionDelEstudio ||
    Boolean(pdfDelEstudioHref) ||
    relatedStudyPdfs.length > 0 ||
    interestStudyLinks.length > 0;

  const dateStr = item.datePublished.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Fetch related items
  const { data: allItems } = await getActualidad({ per_page: 50 });
  const related = allItems
    .filter(i => i.id !== item.id)
    .sort((a, b) => {
      const sameType = (a.tipoContenido === item.tipoContenido ? 1 : 0) - (b.tipoContenido === item.tipoContenido ? 1 : 0);
      if (sameType !== 0) return -sameType;
      return b.datePublished.getTime() - a.datePublished.getTime();
    })
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Hero Header */}
      <section className={`relative bg-gradient-to-br ${config.heroAccent} overflow-hidden mb-8`}>
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10 hidden sm:block">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#F29429] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pt-6 sm:pb-8 md:pt-8 md:pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-white/60 text-xs sm:text-sm mb-4 md:mb-6 overflow-x-auto">
            <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">Inicio</Link>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            <Link href="/actualidad/" className="hover:text-white transition-colors whitespace-nowrap">Actualidad</Link>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            <span className="text-white/80 truncate max-w-[150px] sm:max-w-[200px]">{config.label}</span>
          </nav>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-poppins mb-3 md:mb-5 leading-tight">
            {decodeHtmlEntities(item.title)}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/70 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">
              <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {dateStr}
            </span>
            {isStudiesType && hasFechaPublicacionEstudio && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Publicación: {fechaPublicacionEstudio}
              </span>
            )}
            {isEventType && item.lugarEvento && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {item.lugarEvento}
              </span>
            )}
            {isEventType && item.horaInicio && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {item.horaInicio}
              </span>
            )}
            {isEventType && item.horaFin && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {item.horaFin}
              </span>
            )}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto block">
            <path
              d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 -mt-4">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Featured Image / Gallery */}
            {item.galeriaDetails && item.galeriaDetails.length > 0 ? (
              <MediaGallery
                imagenes={item.galeriaDetails}
                title={decodeHtmlEntities(item.title)}
                layout="stacked"
              />
            ) : item.featuredMediaUrl ? (
              <MediaGallery
                imagenes={[{ source_url: item.featuredMediaUrl, alt_text: decodeHtmlEntities(item.title) }]}
                title={decodeHtmlEntities(item.title)}
                layout="stacked"
              />
            ) : null}

            {/* Infografía - PROTAGONISTA, va primero */}
            {tipo === 'infografia' && item.infografiaImagenUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 font-poppins">Infografía</h2>
                  </div>
                  <span className="text-xs text-gray-400 hidden sm:block">Pulsa la imagen para ampliar</span>
                </div>
                <InfografiaViewer
                  src={item.infografiaImagenUrl}
                  alt={decodeHtmlEntities(item.title)}
                />
                {item.pdfInfografiaUrl && (
                  <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                    <a
                      href={item.pdfInfografiaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#A10D5E] text-white rounded-xl hover:bg-[#8B1547] transition-colors font-semibold text-sm shadow-md"
                    >
                      <Download className="h-4 w-4" />
                      Descargar infografía en PDF
                    </a>
                    <span className="text-xs text-gray-400">Formato PDF de alta resolución</span>
                  </div>
                )}
              </div>
            )}

            {/* Video Embed - PROTAGONISTA, va primero */}
            {tipo === 'video' && embedUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-hidden">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={decodeHtmlEntities(item.title)}
                  />
                </div>
              </div>
            )}

            {/* Descripción / Contenido - después del contenido protagonista */}
            {(hasContent(item.descripcionCorta) || hasContent(item.content)) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <div className="prose prose-lg max-w-none prose-headings:font-poppins prose-headings:text-[#A10D5E] prose-a:text-[#A10D5E] hover:prose-a:text-[#F29429] prose-img:rounded-xl">
                  <SafeHtml html={hasContent(item.descripcionCorta) ? item.descripcionCorta : item.content} />
                </div>
              </div>
            )}

            {/* Estudios y Políticas - campos específicos */}
            {isStudiesType && hasStudiesSpecificContent && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <BookOpenCheck className="h-4 w-4 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 font-poppins">Estudios y políticas</h2>
                </div>

                {(hasFechaPublicacionEstudio || enlaceDelEstudioHref) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {hasFechaPublicacionEstudio && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 rounded-lg bg-[#A10D5E]/10 flex items-center justify-center flex-shrink-0">
                          <CalendarDays className="h-5 w-5 text-[#A10D5E]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Fecha de publicación</p>
                          <p className="font-semibold text-gray-900">{fechaPublicacionEstudio}</p>
                        </div>
                      </div>
                    )}

                    {enlaceDelEstudioHref && (
                      <a
                        href={enlaceDelEstudioHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#A10D5E]/20 hover:bg-[#A10D5E]/5 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#A10D5E]/10 flex items-center justify-center flex-shrink-0">
                          <ExternalLink className="h-5 w-5 text-[#A10D5E]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Enlace</p>
                          <p className="font-semibold text-gray-900">Ver recurso externo</p>
                        </div>
                      </a>
                    )}
                  </div>
                )}

                {hasDescripcionDelEstudio && (
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3 font-poppins">Descripción del estudio</h3>
                    <div className="prose prose-base max-w-none prose-headings:font-poppins prose-a:text-[#A10D5E] hover:prose-a:text-[#F29429]">
                      <SafeHtml html={item.descripcionDelEstudio} />
                    </div>
                  </div>
                )}

                {pdfDelEstudioHref && (
                  <div className="mb-6">
                    <a
                      href={pdfDelEstudioHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#A10D5E] text-white rounded-xl hover:bg-[#8B1547] transition-colors font-semibold text-sm shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      Descargar PDF
                    </a>
                  </div>
                )}

                {relatedStudyPdfs.length > 0 && (
                  <div className="pt-5 border-t border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-3 font-poppins">PDF relacionados</h3>
                    <div className="space-y-2">
                      {relatedStudyPdfs.map((pdf, idx) => (
                        <a
                          key={`${pdf.titulo_pdf_relacionado_estudio}-${idx}`}
                          href={pdf.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-[#A10D5E]/5 hover:border-[#A10D5E]/20 transition-colors"
                        >
                          <Download className="h-4 w-4 text-[#A10D5E] flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800">{pdf.titulo}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {interestStudyLinks.length > 0 && (
                  <div className="pt-5 border-t border-gray-100 mt-5">
                    <h3 className="text-base font-bold text-gray-900 mb-3 font-poppins">Enlaces de interés</h3>
                    <div className="space-y-2">
                      {interestStudyLinks.map((enlace, idx) => (
                        <a
                          key={`${enlace.titulo_enlace_estudios}-${idx}`}
                          href={enlace.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-[#A10D5E]/5 hover:border-[#A10D5E]/20 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-[#A10D5E] flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800">{enlace.titulo}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Secciones del boletín - repeater */}
            {tipo === 'boletin' && item.seccionesBoletin && item.seccionesBoletin.length > 0 && (
              <div className="space-y-6">
                {item.seccionesBoletin.map((seccion: SeccionBoletin, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {seccion.imagenSeccionUrl && (
                      <div className="aspect-[21/9] overflow-hidden">
                        <img
                          src={seccion.imagenSeccionUrl}
                          alt={seccion.titulo_seccion || ''}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 md:p-8">
                      {seccion.titulo_seccion && (
                        <h3 className="text-xl font-bold text-gray-900 font-poppins mb-3">
                          {seccion.titulo_seccion}
                        </h3>
                      )}
                      {seccion.texto_seccion && (
                        <div className="prose prose-base max-w-none text-gray-600 mb-5">
                          <SafeHtml html={seccion.texto_seccion} />
                        </div>
                      )}
                      {seccion.enlace_boton && (
                        <a
                          href={seccion.enlace_boton}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A10D5E] text-white rounded-xl hover:bg-[#8B1547] transition-colors font-semibold text-sm shadow-sm"
                        >
                          {seccion.texto_boton || 'Saber más'}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Evento details */}
            {isEventType && item.fechaEvento && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 font-poppins">
                    Detalles del evento
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.fechaEvento && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-[#A10D5E]/10 flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="h-5 w-5 text-[#A10D5E]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Fecha</p>
                        <p className="font-semibold text-gray-900">{item.fechaEvento}</p>
                      </div>
                    </div>
                  )}
                  {item.horaInicio && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-[#A10D5E]/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-[#A10D5E]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Hora de inicio</p>
                        <p className="font-semibold text-gray-900">{item.horaInicio}</p>
                      </div>
                    </div>
                  )}
                  {item.lugarEvento && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-[#A10D5E]/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-[#A10D5E]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Lugar</p>
                        <p className="font-semibold text-gray-900">{item.lugarEvento}</p>
                      </div>
                    </div>
                  )}
                  {item.horaFin && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-[#A10D5E]/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-[#A10D5E]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Hora de fin</p>
                        <p className="font-semibold text-gray-900">{item.horaFin}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Maps */}
                {item.lugarEvento && (() => {
                  const mapsQuery = item.lugarEvento.toLowerCase().includes('españa') || item.lugarEvento.toLowerCase().includes('spain')
                    ? item.lugarEvento
                    : `${item.lugarEvento}, España`;
                  return (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-[#A10D5E]" />
                        <h3 className="text-sm font-semibold text-gray-700">Ubicación</h3>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <iframe
                          src={`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed&hl=es&z=15`}
                          className="w-full h-[250px] sm:h-[300px] border-none"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Mapa: ${item.lugarEvento}`}
                          allowFullScreen
                        />
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#A10D5E] hover:text-[#F29429] font-medium transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Abrir en Google Maps
                      </a>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Actions Card */}
            {!isStudiesType && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              {/* PDF Download - solo boletín */}
              {tipo === 'boletin' && item.pdfBoletin && (
                <a
                  href={item.pdfBoletin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#A10D5E]/5 hover:bg-[#A10D5E]/10 transition-colors border border-[#A10D5E]/10"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-[#A10D5E] rounded-xl flex-shrink-0">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Descargar PDF</p>
                    <p className="text-xs text-gray-500">Boletín completo</p>
                  </div>
                </a>
              )}

              {/* Enlace de interés - solo boletín */}
              {tipo === 'boletin' && item.enlaceInteresBoletin && (
                <a
                  href={item.enlaceInteresBoletin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#A10D5E]/5 hover:bg-[#A10D5E]/10 transition-colors border border-[#A10D5E]/10"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-[#F29429] rounded-xl flex-shrink-0">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Enlace de interés</p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">{item.enlaceInteresBoletin}</p>
                  </div>
                </a>
              )}

              {/* Nota de prensa link - solo nota_prensa */}
              {tipo === 'nota_prensa' && item.enlaceNota && (
                <a
                  href={item.enlaceNota}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl flex-shrink-0">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Ver nota original
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                      {item.fuenteNota || item.enlaceNota}
                    </p>
                  </div>
                </a>
              )}

              {/* Enlace inscripción - solo evento */}
              {isEventType && item.enlaceInscripcion && (
                <a
                  href={item.enlaceInscripcion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-xl flex-shrink-0">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Inscripción</p>
                    <p className="text-xs text-gray-500">Apúntate al evento</p>
                  </div>
                </a>
              )}

              {/* Back to listing */}
              <Link
                href="/actualidad/"
                className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#A10D5E] hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Actualidad
              </Link>
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">Más publicaciones</h3>
                <div className="space-y-3">
                  {related.map(r => (
                    <RelatedCard key={r.id} item={r} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
