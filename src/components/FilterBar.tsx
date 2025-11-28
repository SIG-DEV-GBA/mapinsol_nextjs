'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import type { Categoria, Etiqueta } from '@/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  categorias: Categoria[];
  etiquetas: Etiqueta[];
}

export function FilterBar({ categorias, etiquetas }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('buscar') || '');
  const [selectedCategoria, setSelectedCategoria] = useState(searchParams.get('categoria') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('etiqueta') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Aplicar filtros
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('buscar', search);
    if (selectedCategoria) params.set('categoria', selectedCategoria);
    if (selectedTag) params.set('etiqueta', selectedTag);

    router.push(`/practicas/?${params.toString()}`);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearch('');
    setSelectedCategoria('');
    setSelectedTag('');
    router.push('/practicas/');
  };

  // Aplicar en cambio de filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategoria, selectedTag]);

  const hasActiveFilters = search || selectedCategoria || selectedTag;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
      <div className="flex flex-col gap-4">
        {/* Barra de búsqueda */}
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar prácticas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6900] focus:ring-2 focus:ring-[#FF6900]/20 outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all',
              showFilters || hasActiveFilters
                ? 'bg-[#FF6900] text-white border-[#FF6900]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#FF6900]'
            )}
          >
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && (
              <span className="bg-white text-[#FF6900] text-xs font-bold px-1.5 py-0.5 rounded-full">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="relative">
                <select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#FF6900] focus:ring-2 focus:ring-[#FF6900]/20 outline-none transition-all pr-10"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Etiqueta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiqueta
              </label>
              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#FF6900] focus:ring-2 focus:ring-[#FF6900]/20 outline-none transition-all pr-10"
                >
                  <option value="">Todas las etiquetas</option>
                  {etiquetas.map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name} ({tag.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-sm text-gray-500">Filtros activos:</span>

            {selectedCategoria && (
              <button
                onClick={() => setSelectedCategoria('')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
              >
                {selectedCategoria}
                <X className="h-3 w-3" />
              </button>
            )}

            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full hover:bg-purple-100 transition-colors"
              >
                {selectedTag}
                <X className="h-3 w-3" />
              </button>
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-[#FF6900] hover:underline ml-2"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
