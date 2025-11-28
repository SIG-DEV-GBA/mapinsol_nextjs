/**
 * =============================================================================
 * COMPONENTE: FILTROS DE PRÁCTICAS
 * =============================================================================
 *
 * Panel de filtros avanzados para la página de listado de prácticas.
 * Permite filtrar por múltiples criterios con sincronización de URL.
 *
 * FILTROS DISPONIBLES:
 * - Búsqueda de texto (título, entidad, lugar)
 * - Categoría (temática principal)
 * - Etiquetas (palabras clave)
 * - Población destinataria
 * - Agentes implicados
 * - CCAA (Comunidad Autónoma)
 * - Internacional (toggle)
 * - Año de inicio
 * - Estado (En curso, Finalizado, etc.)
 *
 * CARACTERÍSTICAS:
 * - Client Component (maneja estado local)
 * - Sincronización bidireccional con URL (compartir filtros)
 * - Filtrado local en memoria (sin requests adicionales)
 * - Layout responsive con grupos separados
 *
 * @module components/practicas/PracticasFilters
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, Building2, Calendar, Filter, Tag, Users, UserCheck, MapPin, Globe } from 'lucide-react';
import type { BuenaPractica, Categoria, Etiqueta } from '@/types';
import { FilterDropdown } from './FilterDropdown';
import { expandAcronyms, formatLabel } from '@/lib/labelMappings';

/** Props del componente de filtros */
interface PracticasFiltersProps {
  /** Lista completa de prácticas (sin filtrar) */
  practicas: BuenaPractica[];
  /** Categorías disponibles para filtrar */
  categorias: Categoria[];
  /** Etiquetas disponibles para filtrar */
  etiquetas: Etiqueta[];
  /** Callback que recibe las prácticas filtradas */
  onFilteredPracticas: (practicas: BuenaPractica[]) => void;
}

/**
 * Esquema de colores para cada tipo de filtro
 *
 * Cada filtro tiene colores consistentes para:
 * - Fondo, borde y texto en estado normal
 * - Colores de hover
 * - Color del badge de contador
 */
const filterColors = {
  /** Categorías - Azul */
  categories: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    icon: 'text-blue-500',
    hover: 'hover:bg-blue-100 hover:border-blue-300',
    badge: 'bg-blue-600',
    hoverBg: 'hover:bg-blue-50',
  },
  year: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    icon: 'text-emerald-500',
    hover: 'hover:bg-emerald-100 hover:border-emerald-300',
    badge: 'bg-emerald-600',
    hoverBg: 'hover:bg-emerald-50',
  },
  status: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    icon: 'text-amber-500',
    hover: 'hover:bg-amber-100 hover:border-amber-300',
    badge: 'bg-amber-600',
    hoverBg: 'hover:bg-amber-50',
  },
  tags: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    icon: 'text-purple-500',
    hover: 'hover:bg-purple-100 hover:border-purple-300',
    badge: 'bg-purple-600',
    hoverBg: 'hover:bg-purple-50',
  },
  poblacion: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-600',
    icon: 'text-rose-500',
    hover: 'hover:bg-rose-100 hover:border-rose-300',
    badge: 'bg-rose-600',
    hoverBg: 'hover:bg-rose-50',
  },
  agentes: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-600',
    icon: 'text-cyan-500',
    hover: 'hover:bg-cyan-100 hover:border-cyan-300',
    badge: 'bg-cyan-600',
    hoverBg: 'hover:bg-cyan-50',
  },
  ubicacion: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-600',
    icon: 'text-teal-500',
    hover: 'hover:bg-teal-100 hover:border-teal-300',
    badge: 'bg-teal-600',
    hoverBg: 'hover:bg-teal-50',
  },
};

/**
 * Extrae las claves seleccionadas de un checkbox group de JetEngine
 *
 * @param group - Objeto { opcion: "true"/"false" }
 * @returns Array de claves donde el valor es "true"
 */
function getCheckboxKeys(group: Record<string, string> | undefined): string[] {
  if (!group || typeof group !== 'object') return [];
  return Object.entries(group)
    .filter(([, v]) => v === 'true')
    .map(([k]) => k);
}

/**
 * Componente de filtros para el listado de prácticas
 *
 * Gestiona el estado de todos los filtros, sincroniza con la URL
 * y filtra las prácticas en memoria.
 */
export function PracticasFilters({
  practicas,
  categorias,
  etiquetas,
  onFilteredPracticas,
}: PracticasFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<(string | number)[]>([]);
  const [selectedYears, setSelectedYears] = useState<(string | number)[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<(string | number)[]>([]);
  const [selectedTags, setSelectedTags] = useState<(string | number)[]>([]);
  const [selectedPoblacion, setSelectedPoblacion] = useState<(string | number)[]>([]);
  const [selectedAgentes, setSelectedAgentes] = useState<(string | number)[]>([]);
  const [selectedCCAA, setSelectedCCAA] = useState<(string | number)[]>([]);
  const [soloInternacional, setSoloInternacional] = useState(false);
  const [searchLocalidad, setSearchLocalidad] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Leer query params de la URL al cargar
  useEffect(() => {
    if (initialized) return;

    const categoriaParam = searchParams.get('categoria');
    if (categoriaParam && categorias.length > 0) {
      // Buscar la categoría por nombre (el Hero envía el nombre)
      const matchedCategory = categorias.find(
        (c) => c.name.toLowerCase() === categoriaParam.toLowerCase() ||
               expandAcronyms(c.name).toLowerCase() === categoriaParam.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategories([matchedCategory.id]);
      }
    }

    const searchParam = searchParams.get('buscar');
    if (searchParam) {
      setSearch(searchParam);
    }

    // Leer estado
    const estadoParam = searchParams.get('estado');
    if (estadoParam) {
      setSelectedStatus([estadoParam]);
    }

    // Leer población
    const poblacionParam = searchParams.get('poblacion');
    if (poblacionParam) {
      setSelectedPoblacion([poblacionParam]);
    }

    // Leer agentes
    const agentesParam = searchParams.get('agentes');
    if (agentesParam) {
      setSelectedAgentes([agentesParam]);
    }

    // Leer etiqueta
    const etiquetaParam = searchParams.get('etiqueta');
    if (etiquetaParam && etiquetas.length > 0) {
      const matchedTag = etiquetas.find(
        (t) => t.name.toLowerCase() === etiquetaParam.toLowerCase()
      );
      if (matchedTag) {
        setSelectedTags([matchedTag.id]);
      }
    }

    // Leer CCAA
    const ccaaParam = searchParams.get('ccaa');
    if (ccaaParam) {
      setSelectedCCAA([ccaaParam]);
    }

    // Leer internacional
    const internacionalParam = searchParams.get('internacional');
    if (internacionalParam === 'true') {
      setSoloInternacional(true);
    }

    // Leer localidad
    const localidadParam = searchParams.get('localidad');
    if (localidadParam) {
      setSearchLocalidad(localidadParam);
    }

    setInitialized(true);
  }, [searchParams, categorias, etiquetas, initialized]);

  // Actualizar URL cuando cambian los filtros (opcional, para compartir enlaces)
  useEffect(() => {
    if (!initialized) return;

    const params = new URLSearchParams();

    if (selectedCategories.length === 1) {
      const cat = categorias.find(c => c.id === selectedCategories[0]);
      if (cat) params.set('categoria', cat.name);
    }

    if (search) {
      params.set('buscar', search);
    }

    if (selectedStatus.length === 1) {
      params.set('estado', String(selectedStatus[0]));
    }

    if (selectedPoblacion.length === 1) {
      params.set('poblacion', String(selectedPoblacion[0]));
    }

    if (selectedAgentes.length === 1) {
      params.set('agentes', String(selectedAgentes[0]));
    }

    if (selectedTags.length === 1) {
      const tag = etiquetas.find(t => t.id === selectedTags[0]);
      if (tag) params.set('etiqueta', tag.name);
    }

    if (selectedCCAA.length === 1) {
      params.set('ccaa', String(selectedCCAA[0]));
    }

    if (soloInternacional) {
      params.set('internacional', 'true');
    }

    if (searchLocalidad) {
      params.set('localidad', searchLocalidad);
    }

    const newUrl = params.toString() ? `/practicas/?${params.toString()}` : '/practicas/';

    // Solo actualizar si es diferente a la URL actual
    const currentParams = searchParams.toString();
    if (params.toString() !== currentParams) {
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedCategories, search, selectedStatus, selectedPoblacion, selectedAgentes, selectedTags, selectedCCAA, soloInternacional, searchLocalidad, categorias, etiquetas, router, searchParams, initialized]);

  // Extract unique filter values from practicas
  const filterOptions = useMemo(() => {
    const years = [...new Set(practicas.map((p) => p.anioInicio).filter(Boolean))].sort(
      (a, b) => Number(b) - Number(a)
    );
    const estados = [...new Set(practicas.map((p) => p.estadoActual).filter(Boolean))];
    const ccaas = [...new Set(practicas.map((p) => p.ccaa).filter(Boolean))].sort();

    const allPoblacion = new Set<string>();
    const allAgentes = new Set<string>();

    practicas.forEach((p) => {
      getCheckboxKeys(p.poblacionDestinataria).forEach((k) => allPoblacion.add(k));
      getCheckboxKeys(p.agentesImplicados).forEach((k) => allAgentes.add(k));
    });

    return {
      years,
      estados,
      ccaas,
      poblaciones: [...allPoblacion].sort(),
      agentes: [...allAgentes].sort(),
    };
  }, [practicas]);

  // Filter practicas based on selections
  const filteredPracticas = useMemo(() => {
    return practicas.filter((p) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(searchLower) ||
          (p.entidadResponsable?.toLowerCase().includes(searchLower) ?? false) ||
          (p.ccaa?.toLowerCase().includes(searchLower) ?? false) ||
          (p.provincia?.toLowerCase().includes(searchLower) ?? false) ||
          (p.municipio?.toLowerCase().includes(searchLower) ?? false);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const hasCategory = p.categories.some((c) => selectedCategories.includes(c));
        if (!hasCategory) return false;
      }

      // Year filter
      if (selectedYears.length > 0) {
        if (!selectedYears.includes(p.anioInicio ?? '')) return false;
      }

      // Status filter
      if (selectedStatus.length > 0) {
        if (!selectedStatus.includes(p.estadoActual ?? '')) return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasTag = p.tags.some((t) => selectedTags.includes(t));
        if (!hasTag) return false;
      }

      // Poblacion filter
      if (selectedPoblacion.length > 0) {
        const keys = getCheckboxKeys(p.poblacionDestinataria);
        const hasPoblacion = selectedPoblacion.some((sp) => keys.includes(String(sp)));
        if (!hasPoblacion) return false;
      }

      // Agentes filter
      if (selectedAgentes.length > 0) {
        const keys = getCheckboxKeys(p.agentesImplicados);
        const hasAgente = selectedAgentes.some((sa) => keys.includes(String(sa)));
        if (!hasAgente) return false;
      }

      // CCAA filter
      if (selectedCCAA.length > 0) {
        if (!selectedCCAA.includes(p.ccaa ?? '')) return false;
      }

      // Internacional filter
      if (soloInternacional) {
        if (!p.internacionalBoolean) return false;
      }

      // Localidad search filter
      if (searchLocalidad) {
        const localidadLower = searchLocalidad.toLowerCase();
        const matchesLocalidad =
          (p.municipio?.toLowerCase().includes(localidadLower) ?? false) ||
          (p.provincia?.toLowerCase().includes(localidadLower) ?? false) ||
          (p.country?.toLowerCase().includes(localidadLower) ?? false);
        if (!matchesLocalidad) return false;
      }

      return true;
    });
  }, [
    practicas,
    search,
    selectedCategories,
    selectedYears,
    selectedStatus,
    selectedTags,
    selectedPoblacion,
    selectedAgentes,
    selectedCCAA,
    soloInternacional,
    searchLocalidad,
  ]);

  // Notify parent of filtered results
  useEffect(() => {
    onFilteredPracticas(filteredPracticas);
  }, [filteredPracticas, onFilteredPracticas]);

  const clearAllFilters = useCallback(() => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedStatus([]);
    setSelectedTags([]);
    setSelectedPoblacion([]);
    setSelectedAgentes([]);
    setSelectedCCAA([]);
    setSoloInternacional(false);
    setSearchLocalidad('');
    // Limpiar URL
    router.replace('/practicas/', { scroll: false });
  }, [router]);

  const hasActiveFilters =
    search ||
    selectedCategories.length > 0 ||
    selectedYears.length > 0 ||
    selectedStatus.length > 0 ||
    selectedTags.length > 0 ||
    selectedPoblacion.length > 0 ||
    selectedAgentes.length > 0 ||
    selectedCCAA.length > 0 ||
    soloInternacional ||
    searchLocalidad;

  return (
    <section className="sticky top-24 z-40 bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Fila 1: Búsqueda + Contador + Limpiar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, entidad o lugar..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-[#FF6900] focus:ring-2 focus:ring-orange-100 transition-all text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-sm">
              <span className="text-gray-500">Resultados:</span>
              <span className="font-bold text-[#700D39]">{filteredPracticas.length}</span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Filtros en una sola fila con separadores */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Grupo: Temática */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Temática</span>
            <FilterDropdown
              icon={Building2}
              label="Categoría"
              description="Área temática"
              options={categorias.map((c) => ({
                value: c.id,
                label: expandAcronyms(c.name),
                count: c.count,
              }))}
              selectedValues={selectedCategories}
              onSelectionChange={setSelectedCategories}
              colorScheme={filterColors.categories}
            />
            <FilterDropdown
              icon={Tag}
              label="Etiquetas"
              description="Palabras clave"
              options={etiquetas.map((t) => ({
                value: t.id,
                label: t.name,
                count: t.count,
              }))}
              selectedValues={selectedTags}
              onSelectionChange={setSelectedTags}
              colorScheme={filterColors.tags}
            />
          </div>

          <div className="w-px h-8 bg-gray-200 hidden md:block" />

          {/* Grupo: Destinatarios */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:inline">Destinatarios</span>
            <FilterDropdown
              icon={Users}
              label="Población"
              description="A quién va dirigida"
              options={filterOptions.poblaciones.map((p) => ({
                value: p,
                label: formatLabel(p),
              }))}
              selectedValues={selectedPoblacion}
              onSelectionChange={setSelectedPoblacion}
              colorScheme={filterColors.poblacion}
            />
            <FilterDropdown
              icon={UserCheck}
              label="Agentes"
              description="Quién participa"
              options={filterOptions.agentes.map((a) => ({
                value: a,
                label: formatLabel(a),
              }))}
              selectedValues={selectedAgentes}
              onSelectionChange={setSelectedAgentes}
              colorScheme={filterColors.agentes}
            />
          </div>

          <div className="w-px h-8 bg-gray-200 hidden md:block" />

          {/* Grupo: Ubicación */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:inline">Ubicación</span>
            <FilterDropdown
              icon={MapPin}
              label="CCAA"
              description="Comunidad Autónoma"
              options={filterOptions.ccaas.map((c) => ({
                value: c,
                label: c,
              }))}
              selectedValues={selectedCCAA}
              onSelectionChange={setSelectedCCAA}
              colorScheme={filterColors.ubicacion}
            />
            <button
              onClick={() => setSoloInternacional(!soloInternacional)}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200 ${
                soloInternacional
                  ? 'bg-violet-100 border-violet-300 text-violet-700 hover:bg-violet-200 hover:border-violet-400'
                  : 'bg-violet-50 border-violet-200 text-violet-600 hover:bg-violet-100 hover:border-violet-300'
              }`}
            >
              <Globe className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-semibold">Internacional</span>
              {soloInternacional && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-violet-600 text-white text-xs font-bold">
                  ✓
                </span>
              )}
            </button>
          </div>

          <div className="w-px h-8 bg-gray-200 hidden md:block" />

          {/* Grupo: Tiempo */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:inline">Tiempo</span>
            <FilterDropdown
              icon={Calendar}
              label="Año"
              description="Año de inicio"
              options={filterOptions.years.map((y) => ({ value: y, label: String(y) }))}
              selectedValues={selectedYears}
              onSelectionChange={setSelectedYears}
              colorScheme={filterColors.year}
            />
            <FilterDropdown
              icon={Filter}
              label="Estado"
              description="Situación actual"
              options={filterOptions.estados.map((e) => ({ value: e, label: e }))}
              selectedValues={selectedStatus}
              onSelectionChange={setSelectedStatus}
              colorScheme={filterColors.status}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
