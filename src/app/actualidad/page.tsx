import { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, FileText, CalendarDays, GraduationCap, Video, ImageIcon, Megaphone, ArrowRight } from 'lucide-react';
import { getActualidad } from '@/lib/wordpress';
import { ActualidadCard } from '@/components/actualidad';
import type { TipoContenido } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Actualidad y Comunicación | Mapinsol',
  description: 'Boletines, notas de prensa, eventos, talleres, videos e infografías del proyecto Mapinsol.',
};

const TIPO_FILTERS: { key: TipoContenido | 'todos'; label: string; icon: any }[] = [
  { key: 'todos', label: 'Todos', icon: null },
  { key: 'boletin', label: 'Boletines', icon: Newspaper },
  { key: 'nota_prensa', label: 'Notas de prensa', icon: FileText },
  { key: 'evento', label: 'Eventos', icon: CalendarDays },
  { key: 'taller', label: 'Talleres', icon: GraduationCap },
  { key: 'video', label: 'Videos', icon: Video },
  { key: 'infografia', label: 'Infografías', icon: ImageIcon },
];

export default async function ActualidadPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const tipoFilter = params.tipo as TipoContenido | undefined;

  const { data: items, total } = await getActualidad({ per_page: 50, tipo: tipoFilter });

  const activeFilter = TIPO_FILTERS.find(f => f.key === (tipoFilter || 'todos'));

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero + Wave */}
      <div className="bg-gradient-to-b from-[#A10D5E] to-[#8B1547] text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-[#F29429] rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 pt-8 pb-4 sm:pt-10 sm:pb-6 md:pt-14 md:pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              <Megaphone className="w-4 h-4" />
              <span>Noticias y Recursos</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-poppins">
              Actualidad y Comunicación
            </h1>
            <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
              Mantente informado sobre las últimas novedades, eventos y recursos del proyecto Mapinsol
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-3 sm:mt-6">
              <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/15 backdrop-blur-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl sm:text-2xl font-bold text-white">{total}</p>
                  <p className="text-[10px] sm:text-xs text-white/80">Publicaciones</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/15 backdrop-blur-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl sm:text-2xl font-bold text-white">6</p>
                  <p className="text-[10px] sm:text-xs text-white/80">Tipos de contenido</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
        </svg>
      </div>

      {/* Filters - floating card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4 relative z-10">
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl shadow-lg p-3 sm:p-4 border border-gray-100">
          {TIPO_FILTERS.map(({ key, label, icon: Icon }) => {
            const isActiveFilter = key === 'todos' ? !tipoFilter : tipoFilter === key;
            const href = key === 'todos' ? '/actualidad/' : `/actualidad/?tipo=${key}`;
            return (
              <Link
                key={key}
                href={href}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 min-h-[44px] ${
                  isActiveFilter
                    ? 'bg-[#A10D5E] text-white shadow-md shadow-[#A10D5E]/20 scale-105'
                    : 'text-gray-600 hover:bg-[#A10D5E]/5 hover:text-[#A10D5E]'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Results count */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <p className="text-sm text-gray-500">
          {items.length > 0 ? (
            <>Mostrando <span className="font-semibold text-gray-700">{items.length}</span> {items.length === 1 ? 'publicación' : 'publicaciones'}{activeFilter && activeFilter.key !== 'todos' ? ` de tipo "${activeFilter.label}"` : ''}</>
          ) : null}
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <ActualidadCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#A10D5E]/5 flex items-center justify-center">
              <Newspaper className="h-10 w-10 text-[#A10D5E]/30" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">No hay contenido disponible</h3>
            <p className="text-gray-500 mb-6">No se encontraron publicaciones en esta categoría.</p>
            <Link
              href="/actualidad/"
              className="inline-flex items-center gap-2 text-[#A10D5E] font-semibold hover:text-[#F29429] transition-colors"
            >
              Ver todas las publicaciones
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#A10D5E] to-[#8B1547] rounded-2xl p-8 md:p-12 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F29429] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-poppins">
              Suscríbete al boletín
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Recibe las últimas noticias y novedades del proyecto Mapinsol directamente en tu correo.
            </p>
            <Link
              href="/boletines/"
              className="inline-flex items-center gap-2 bg-white text-[#A10D5E] font-semibold px-8 py-3.5 rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg"
            >
              <Newspaper className="h-5 w-5" />
              Ir a suscripción
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
