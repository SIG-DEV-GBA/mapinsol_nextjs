import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Building2, MapPin } from 'lucide-react';
import type { BuenaPractica } from '@/types';

interface RelatedPracticasProps {
  practicas: BuenaPractica[];
}

export function RelatedPracticas({ practicas }: RelatedPracticasProps) {
  if (practicas.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-[#700D39] mb-6 flex items-center gap-3">
        <span className="w-1 h-6 bg-gradient-to-b from-[#700D39] to-[#FF6900] rounded" />
        Prácticas Relacionadas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {practicas.map((practica) => (
          <RelatedCard key={practica.id} practica={practica} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ practica }: { practica: BuenaPractica }) {
  return (
    <Link
      href={`/practica/${practica.slug}/`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#FF6900] hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      {/* Imagen */}
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {practica.featuredMediaUrl ? (
          <Image
            src={practica.featuredMediaUrl}
            alt={practica.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-300" />
          </div>
        )}

        {practica.practicaDestacada && (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-semibold rounded-md">
            <Star className="w-3 h-3 fill-current" />
            Destacada
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-[15px] font-semibold text-[#700D39] leading-snug line-clamp-2 group-hover:text-[#FF6900] transition-colors">
          {practica.title}
        </h3>

        {practica.entidadResponsable && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{practica.entidadResponsable}</span>
          </p>
        )}

        {(practica.municipio || practica.provincia || practica.ccaa) && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{[practica.municipio, practica.provincia, practica.ccaa].filter(Boolean).join(', ')}</span>
          </p>
        )}

        <span className="mt-auto pt-3 flex items-center gap-1.5 text-sm font-semibold text-[#FF6900]">
          Ver práctica
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
