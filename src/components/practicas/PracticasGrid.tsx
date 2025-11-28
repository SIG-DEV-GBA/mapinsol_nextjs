'use client';

import { Search, X } from 'lucide-react';
import type { BuenaPractica } from '@/types';
import { PracticaCard } from '@/components/PracticaCard';
import { Pagination } from './Pagination';

interface PracticasGridProps {
  practicas: BuenaPractica[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function PracticasGrid({
  practicas,
  currentPage,
  itemsPerPage,
  onPageChange,
  onClearFilters,
}: PracticasGridProps) {
  const totalPages = Math.ceil(practicas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPracticas = practicas.slice(startIndex, startIndex + itemsPerPage);

  if (practicas.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron resultados</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Intenta ajustar los filtros o buscar con otros términos
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[--brand-orange] text-white font-medium hover:bg-[--brand-orange]/90 transition-all"
        >
          <X className="w-4 h-4" />
          Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {paginatedPracticas.map((practica) => (
          <PracticaCard key={practica.id} practica={practica} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
