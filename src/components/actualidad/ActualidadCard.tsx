import Link from 'next/link';
import { Newspaper, FileText, CalendarDays, BookOpenCheck, Video, ImageIcon, ArrowRight, MapPin, type LucideIcon } from 'lucide-react';
import type { Actualidad, TipoContenido } from '@/types';
import { cn } from '@/lib/utils';

const TIPO_CONFIG: Record<TipoContenido, { label: string; icon: LucideIcon; color: string; bg: string; accent: string }> = {
  boletin: { label: 'Boletín', icon: Newspaper, color: 'text-[#A10D5E]', bg: 'bg-[#A10D5E]/10', accent: 'border-[#A10D5E]/30' },
  nota_prensa: { label: 'Nota de prensa', icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50', accent: 'border-blue-200' },
  evento: { label: 'Evento', icon: CalendarDays, color: 'text-emerald-700', bg: 'bg-emerald-50', accent: 'border-emerald-200' },
  taller: { label: 'Estudios y políticas', icon: BookOpenCheck, color: 'text-amber-700', bg: 'bg-amber-50', accent: 'border-amber-200' },
  video: { label: 'Video', icon: Video, color: 'text-red-700', bg: 'bg-red-50', accent: 'border-red-200' },
  infografia: { label: 'Infografía', icon: ImageIcon, color: 'text-purple-700', bg: 'bg-purple-50', accent: 'border-purple-200' },
};

const PLACEHOLDER_IMG = '/logos/Color.webp';

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

export function ActualidadCard({ item }: { item: Actualidad }) {
  const config = TIPO_CONFIG[item.tipoContenido] || TIPO_CONFIG.boletin;
  const Icon = config.icon;
  const imgSrc = item.featuredMediaUrl || PLACEHOLDER_IMG;
  const hasImage = !!item.featuredMediaUrl;

  const dateStr = item.fechaEvento || item.fechaPublicacion || item.datePublished.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 h-full flex flex-col shadow-sm hover:shadow-xl border-2',
        item.destacado
          ? 'border-[#F29429] ring-2 ring-[#F29429]/20'
          : 'border-gray-100 hover:border-[#A10D5E]/20'
      )}
    >
      {/* Destacado badge */}
      {item.destacado && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-[#F29429] text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-md">
            Destacado
          </div>
        </div>
      )}

      {/* Image */}
      <Link
        href={`/actualidad/${item.slug}/`}
        className="block relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0"
      >
        {hasImage ? (
          <img
            src={imgSrc}
            alt={decodeHtmlEntities(item.title)}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#A10D5E]/5 to-[#F29429]/5">
            <Icon className="h-16 w-16 text-[#A10D5E]/15" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Badge tipo */}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.color} ${config.bg} backdrop-blur-sm border ${config.accent}`}>
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </div>

        {/* Date on image */}
        <div className="absolute bottom-3 left-3 text-white/90 text-xs font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          {dateStr}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/actualidad/${item.slug}/`} className="block mb-3">
          <h3 className="text-lg font-bold text-[#A10D5E] line-clamp-2 group-hover:text-[#F29429] transition-colors duration-300 leading-tight font-poppins">
            {decodeHtmlEntities(item.title)}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
          {(item.descripcionCorta || item.excerpt || '').replace(/<[^>]+>/g, '').substring(0, 150)}
        </p>

        {/* Event location */}
        {item.tipoContenido === 'evento' && item.lugarEvento && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin className="h-3.5 w-3.5 text-[#A10D5E]" />
            <span className="truncate">{item.lugarEvento}</span>
          </div>
        )}

        {/* CTA */}
        <div className="pt-3 border-t border-gray-100">
          <Link
            href={`/actualidad/${item.slug}/`}
            className="inline-flex items-center gap-2 text-[#A10D5E] font-semibold text-sm group-hover:gap-3 transition-all duration-300 hover:text-[#F29429]"
          >
            Leer más
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
