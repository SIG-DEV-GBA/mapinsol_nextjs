'use client';

import { useState, useCallback } from 'react';
import type { BuenaPractica, Categoria, Etiqueta } from '@/types';
import { PracticasFilters } from './PracticasFilters';
import { PracticasGrid } from './PracticasGrid';

interface PracticasClientProps {
  initialPracticas: BuenaPractica[];
  categorias: Categoria[];
  etiquetas: Etiqueta[];
}

const ITEMS_PER_PAGE = 12;

export function PracticasClient({
  initialPracticas,
  categorias,
  etiquetas,
}: PracticasClientProps) {
  const [filteredPracticas, setFilteredPracticas] = useState<BuenaPractica[]>(initialPracticas);
  const [currentPage, setCurrentPage] = useState(1);
  const [clearFiltersCallback, setClearFiltersCallback] = useState<(() => void) | null>(null);

  const handleFilteredPracticas = useCallback((practicas: BuenaPractica[]) => {
    setFilteredPracticas(practicas);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }, []);

  const handleClearFilters = useCallback(() => {
    if (clearFiltersCallback) {
      clearFiltersCallback();
    }
  }, [clearFiltersCallback]);

  return (
    <>
      <PracticasFilters
        practicas={initialPracticas}
        categorias={categorias}
        etiquetas={etiquetas}
        onFilteredPracticas={handleFilteredPracticas}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <PracticasGrid
            practicas={filteredPracticas}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </section>
    </>
  );
}
