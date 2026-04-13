/**
 * =============================================================================
 * CLIENTE API DE WORDPRESS
 * =============================================================================
 *
 * Este módulo maneja toda la comunicación con la API REST de WordPress.
 * Proporciona funciones para obtener buenas prácticas, categorías, etiquetas
 * y archivos multimedia.
 *
 * CARACTERÍSTICAS:
 * - Tipado completo con TypeScript
 * - ISR (Incremental Static Regeneration) para caché automático
 * - Parseo de campos JetEngine (repeaters, checkboxes, etc.)
 * - Manejo de datos embebidos (_embed) para reducir requests
 *
 * USO:
 * ```typescript
 * import { getBuenasPracticas, getBuenaPracticaBySlug } from '@/lib/wordpress';
 *
 * // Obtener listado paginado
 * const { data, total } = await getBuenasPracticas({ per_page: 12 });
 *
 * // Obtener una práctica por slug
 * const practica = await getBuenaPracticaBySlug('mi-practica');
 * ```
 *
 * @module lib/wordpress
 */

import type {
  BuenaPractica,
  BuenaPracticaRaw,
  Categoria,
  Etiqueta,
  Contacto,
  EnlaceAnexo,
  WPApiParams,
  PaginatedResponse,
  Estudio,
  EstudioRaw,
  DocumentoEstudio,
  EnlaceEstudio,
  EstudioRelacionado,
} from '@/types';

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

/**
 * URL base de la API REST de WordPress
 * Apunta al servidor de la Fundación Padrinos de la Vejez
 */
const WP_API_URL = 'https://fundacionpadrinosdelavejez.es/wp-json/wp/v2';

// =============================================================================
// HELPERS DE PARSEO
// =============================================================================
// Funciones auxiliares para transformar datos de JetEngine a TypeScript

/**
 * Convierte campos repeater de JetEngine a array tipado
 *
 * JetEngine puede devolver repeaters como:
 * - Array directo: [{ campo: valor }, ...]
 * - Objeto con índices: { "item-0": { campo: valor }, ... }
 *
 * @param value - Valor del campo repeater
 * @returns Array tipado
 */
function parseRepeater<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && value !== null) {
    return Object.values(value) as T[];
  }
  return [];
}

/**
 * Parsea campos checkbox group de JetEngine
 *
 * Los checkbox groups vienen como objeto { opcion: "true"/"false" }
 * Ejemplo: { "Mayores autónomos": "true", "Institucionalizados": "false" }
 *
 * @param value - Valor del checkbox group
 * @returns Objeto con las opciones
 */
function parseCheckboxGroup(value: unknown): Record<string, string> {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, string>;
  }
  return {};
}

/**
 * Transforma respuesta RAW de WordPress a objeto BuenaPractica tipado
 *
 * Esta función es el corazón del parseo. Mapea todos los campos de JetEngine
 * a propiedades TypeScript con nombres legibles y tipos correctos.
 *
 * @param raw - Respuesta cruda de la API de WordPress
 * @returns Objeto BuenaPractica tipado y normalizado
 */
function parseBuenaPractica(raw: BuenaPracticaRaw): BuenaPractica {
  const meta = raw.meta || {};

  const practica: BuenaPractica = {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    status: raw.status as BuenaPractica['status'],
    link: raw.link,

    datePublished: new Date(raw.date),
    dateModified: new Date(raw.modified),

    featuredMediaId: raw.featured_media || 0,
    pdfBuenaPractica: meta.pdf_buena_practica ? parseInt(meta.pdf_buena_practica, 10) : 0,
    anexos: Array.isArray(meta.anexos) ? meta.anexos.map((id: string) => parseInt(id, 10)) : [],

    entidadResponsable: meta.entidad_responsable || '',
    urlEntidad: meta.url_entidad || '',
    personasContacto: parseRepeater<Contacto>(meta.personas_de_contacto),
    ambitoTerritorial: meta.ambito_territorial || '',
    internacionalBoolean: meta.internacional_boolean === 'true' || meta.internacional_boolean === '1' || meta.internacional_boolean === true,
    country: meta.country || '',
    ccaa: meta.ccaa || '',
    provincia: meta.provincia || '',
    municipio: meta.municipio || '',
    anioInicio: meta.a_o_de_inicio || '',
    estadoActual: meta.estado_actual || '',
    tipoEntorno: meta.tipo_de_entorno || '',

    descripcionGrupo: meta.descripci_n_del_grupo || '',
    objetivoPrincipal: meta.objetivo_principal || '',
    actividadesDesarrolladas: meta.actividades_desarrolladas || '',
    metodologiaAplicada: meta.metodolog_a_aplicada || '',
    poblacionDestinataria: parseCheckboxGroup(meta.poblacion_destinataria),
    agentesImplicados: parseCheckboxGroup(meta.agentes_implicados),
    nombreEntidad: meta.nombre_o_entidad || '',
    rolFuncion: meta.rol_o_funci_n || '',

    indicadoresEvaluacion: meta.indicadores_de_evaluaci_n || '',
    resultadosObtenidos: meta.resultados_obtenidos || '',
    leccionesAprendidas: meta.lecciones_aprendidas || '',

    nivelTransferibilidad: meta.nivel_de_transferibilidad || '',
    requisitosImplementacion: meta.requisitos_de_implementaci_n || '',
    sostenibilidad: meta.sostenibilidad || '',

    respetoDignidadAutonomia: meta.respeto_a_la_dignidad_y_autonom_a || '',
    prevencionMaltrato: meta.prevenci_n_del_maltrato || '',
    participacionPersonas: meta.participaci_n_de_las_personas || '',

    elementoInnovador: meta.elemento_innovador || '',
    usoTecnologia: meta.uso_de_tecnolog_a || '',

    publicacionExterna: meta.publicaci_n_externa || '',
    enlaceVideo: meta.enlace_video || '',
    enlacesAnexos: parseRepeater<EnlaceAnexo>(meta.enlaces_anexos),

    practicaDestacada: meta.practica_destacada === 'true' || meta.practica_destacada === '1' || meta.practica_destacada === true,
    mostrarContacto: meta.mostrar_contacto === 'true' || meta.mostrar_contacto === '1' || meta.mostrar_contacto === true,

    categories: raw['category-practices'] || [],
    tags: raw['tags-practices'] || [],
  };

  // Extraer datos embebidos si existen
  if (raw._embedded) {
    // Featured image
    const featuredMedia = raw._embedded['wp:featuredmedia']?.[0];
    if (featuredMedia) {
      practica.featuredMediaUrl = featuredMedia.source_url ||
        featuredMedia.media_details?.sizes?.large?.source_url ||
        featuredMedia.media_details?.sizes?.medium_large?.source_url;
    }

    // Categorías
    const embeddedCats = raw._embedded['wp:term']?.find((terms) =>
      terms?.[0]?.taxonomy === 'category-practices'
    );
    if (embeddedCats) {
      practica.categoriesDetails = embeddedCats.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        link: cat.link,
        count: cat.count,
      }));
    }

    // Tags
    const embeddedTags = raw._embedded['wp:term']?.find((terms) =>
      terms?.[0]?.taxonomy === 'tags-practices'
    );
    if (embeddedTags) {
      practica.tagsDetails = embeddedTags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description || '',
        link: tag.link,
        count: tag.count,
      }));
    }
  }

  return practica;
}

// =============================================================================
// FUNCIONES DE API
// =============================================================================
// Funciones públicas para obtener datos de WordPress

/**
 * Fetch genérico con manejo de errores
 * @internal No exportada, uso interno
 */
async function wpFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${WP_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene listado de buenas prácticas con paginación y filtros
 *
 * Soporta filtrado por categorías, etiquetas y búsqueda de texto.
 * Incluye datos embebidos (imagen, categorías, etiquetas) para evitar
 * requests adicionales.
 *
 * @param params - Parámetros de filtrado y paginación
 * @returns Respuesta paginada con prácticas y totales
 *
 * @example
 * ```typescript
 * // Obtener las primeras 12 prácticas
 * const { data, total } = await getBuenasPracticas({ per_page: 12 });
 *
 * // Filtrar por categoría
 * const filtered = await getBuenasPracticas({ categories: [29] });
 * ```
 */
export async function getBuenasPracticas(
  params: WPApiParams = {}
): Promise<PaginatedResponse<BuenaPractica>> {
  const searchParams = new URLSearchParams();

  searchParams.set('per_page', String(params.per_page || 12));
  searchParams.set('page', String(params.page || 1));
  searchParams.set('status', params.status || 'publish');
  searchParams.set('orderby', params.orderby || 'date');
  searchParams.set('order', params.order || 'desc');
  searchParams.set('_embed', '1');

  if (params.categories?.length) {
    searchParams.set('category-practices', params.categories.join(','));
  }
  if (params.tags?.length) {
    searchParams.set('tags-practices', params.tags.join(','));
  }
  if (params.search) {
    searchParams.set('search', params.search);
  }

  const url = `/buenas_practicas_ast?${searchParams.toString()}`;

  const response = await fetch(`${WP_API_URL}${url}`, {
    next: { revalidate: 60 }, // ISR: revalidar cada 60 segundos
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }

  const total = parseInt(response.headers.get('x-wp-total') || '0', 10);
  const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '0', 10);
  const rawData: BuenaPracticaRaw[] = await response.json();

  return {
    data: rawData.map(parseBuenaPractica),
    total,
    totalPages,
  };
}

/**
 * Obtiene una buena práctica por su slug (URL amigable)
 *
 * Usado en las páginas de detalle (/practica/[slug]).
 * Incluye todos los datos embebidos necesarios.
 *
 * @param slug - Slug de la práctica (ej: "programa-teleasistencia")
 * @returns Práctica completa o null si no existe
 */
export async function getBuenaPracticaBySlug(slug: string): Promise<BuenaPractica | null> {
  const searchParams = new URLSearchParams({
    slug,
    per_page: '1',
    _embed: '1',
  });

  const response = await fetch(`${WP_API_URL}/buenas_practicas_ast?${searchParams.toString()}`, {
    next: { revalidate: 60 }, // ISR: revalidar cada 60 segundos
  });

  if (!response.ok) {
    return null;
  }

  const rawData: BuenaPracticaRaw[] = await response.json();

  if (rawData.length === 0) {
    return null;
  }

  return parseBuenaPractica(rawData[0]);
}

/**
 * Obtiene todos los slugs de prácticas publicadas
 *
 * Usado por Next.js en generateStaticParams() para pre-renderizar
 * todas las páginas de detalle en build time.
 *
 * @returns Array de slugs
 */
export async function getAllPracticaSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const searchParams = new URLSearchParams({
      per_page: '100',
      page: String(page),
      status: 'publish',
      _fields: 'slug',
    });

    const response = await fetch(`${WP_API_URL}/buenas_practicas_ast?${searchParams.toString()}`, {
      next: { revalidate: 3600 }, // Revalidar cada hora para los slugs
    });

    if (!response.ok) {
      break;
    }

    const data: Array<{ slug: string }> = await response.json();
    slugs.push(...data.map(item => item.slug));

    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '0', 10);
    hasMore = page < totalPages;
    page++;
  }

  return slugs;
}

/**
 * Obtiene todas las categorías de buenas prácticas
 *
 * Las categorías son la taxonomía principal para clasificar prácticas.
 * Se cachean 5 minutos ya que cambian poco frecuentemente.
 *
 * @returns Array de categorías ordenadas por nombre
 */
export async function getCategorias(): Promise<Categoria[]> {
  const searchParams = new URLSearchParams({
    per_page: '100',
    orderby: 'name',
    order: 'asc',
    _fields: 'id,name,slug,count,description,link',
  });

  const response = await fetch(`${WP_API_URL}/category-practices?${searchParams.toString()}`, {
    next: { revalidate: 300 }, // Revalidar cada 5 minutos
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

/**
 * Obtiene todas las etiquetas de buenas prácticas
 *
 * Las etiquetas son una taxonomía secundaria para etiquetar prácticas
 * con términos más específicos que las categorías.
 * Se cachean 5 minutos ya que cambian poco frecuentemente.
 *
 * @returns Array de etiquetas ordenadas por nombre
 *
 * @example
 * ```typescript
 * const etiquetas = await getEtiquetas();
 * // [{ id: 1, name: "Soledad", slug: "soledad", count: 5 }, ...]
 * ```
 */
export async function getEtiquetas(): Promise<Etiqueta[]> {
  const searchParams = new URLSearchParams({
    per_page: '100',
    orderby: 'name',
    order: 'asc',
    _fields: 'id,name,slug,count,description,link',
  });

  const response = await fetch(`${WP_API_URL}/tags-practices?${searchParams.toString()}`, {
    next: { revalidate: 300 }, // Revalidar cada 5 minutos
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

/**
 * Obtiene información de un archivo multimedia por su ID
 *
 * Usado para obtener URLs de PDFs, imágenes y otros archivos
 * adjuntos a las prácticas. Incluye metadatos como dimensiones
 * y texto alternativo.
 *
 * @param id - ID del media en WordPress
 * @returns Objeto con datos del media o null si no existe
 *
 * @example
 * ```typescript
 * const pdf = await getMediaById(12345);
 * if (pdf) {
 *   console.log(pdf.source_url); // URL del archivo
 * }
 * ```
 */
export async function getMediaById(id: number) {
  const searchParams = new URLSearchParams({
    _fields: 'id,source_url,alt_text,mime_type,media_details',
  });

  const response = await fetch(`${WP_API_URL}/media/${id}?${searchParams.toString()}`, {
    next: { revalidate: 3600 }, // Revalidar cada hora
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/**
 * Obtiene múltiples archivos multimedia por sus IDs en una sola petición
 *
 * Optimización para cargar varios archivos (galería de imágenes, anexos)
 * en una única request en lugar de hacer N peticiones individuales.
 *
 * @param ids - Array de IDs de media en WordPress
 * @returns Array de objetos media (puede estar vacío)
 *
 * @example
 * ```typescript
 * const imagenes = await getMediaByIds([100, 101, 102]);
 * imagenes.forEach(img => {
 *   console.log(img.source_url, img.alt_text);
 * });
 * ```
 */
export async function getMediaByIds(ids: number[]) {
  if (ids.length === 0) return [];

  const searchParams = new URLSearchParams({
    include: ids.join(','),
    per_page: String(ids.length),
    _fields: 'id,source_url,alt_text,mime_type,media_details',
  });

  const response = await fetch(`${WP_API_URL}/media?${searchParams.toString()}`, {
    next: { revalidate: 3600 }, // Revalidar cada hora
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

/**
 * Obtiene prácticas relacionadas por categoría
 *
 * Busca prácticas de la misma categoría que la actual,
 * excluyendo la práctica actual del resultado.
 * Usado en la página de detalle para mostrar contenido relacionado.
 *
 * @param currentId - ID de la práctica actual (para excluirla)
 * @param categoryIds - IDs de las categorías a buscar
 * @param limit - Número máximo de resultados (default: 3)
 * @returns Array de prácticas relacionadas
 *
 * @example
 * ```typescript
 * const relacionadas = await getPracticasRelacionadas(
 *   practica.id,
 *   practica.categories,
 *   4
 * );
 * ```
 */
export async function getPracticasRelacionadas(
  currentId: number,
  categoryIds: number[],
  limit: number = 3
): Promise<BuenaPractica[]> {
  if (categoryIds.length === 0) return [];

  const searchParams = new URLSearchParams({
    per_page: String(limit + 1), // +1 para excluir la actual
    'category-practices': categoryIds[0].toString(),
    exclude: String(currentId),
    _embed: '1',
    status: 'publish',
  });

  const response = await fetch(`${WP_API_URL}/buenas_practicas_ast?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return [];
  }

  const rawData: BuenaPracticaRaw[] = await response.json();
  return rawData.slice(0, limit).map(parseBuenaPractica);
}

/**
 * Obtiene estadísticas generales para mostrar en el Hero
 *
 * Calcula contadores agregados:
 * - Total de prácticas publicadas
 * - Total de categorías con al menos una práctica
 * - Estimación de entidades únicas (70% del total de prácticas)
 *
 * Se cachea 5 minutos para reducir carga en la API.
 *
 * @returns Objeto con estadísticas { totalPracticas, totalCategorias, entidadesUnicas }
 *
 * @example
 * ```typescript
 * const stats = await getEstadisticas();
 * // { totalPracticas: 45, totalCategorias: 8, entidadesUnicas: 32 }
 * ```
 */
export async function getEstadisticas() {
  const [practicasResponse, categoriasResponse] = await Promise.all([
    fetch(`${WP_API_URL}/buenas_practicas_ast?per_page=1&status=publish`, {
      next: { revalidate: 300 },
    }),
    fetch(`${WP_API_URL}/category-practices?per_page=100`, {
      next: { revalidate: 300 },
    }),
  ]);

  const totalPracticas = parseInt(practicasResponse.headers.get('x-wp-total') || '0', 10);
  const categorias: Categoria[] = await categoriasResponse.json();
  const totalCategorias = categorias.filter(c => c.count > 0).length;

  // Calcular entidades únicas (aproximación)
  const entidadesUnicas = Math.ceil(totalPracticas * 0.7);

  return {
    totalPracticas,
    totalCategorias,
    entidadesUnicas,
  };
}

// =============================================================================
// ALIAS PARA COMPATIBILIDAD
// =============================================================================
// Exportaciones alternativas en inglés para consistencia con otras partes del código

/** Alias en inglés de getCategorias */
export const getCategories = getCategorias;

/** Alias en inglés de getEtiquetas */
export const getTags = getEtiquetas;

// =============================================================================
// FUNCIONES DE ENRIQUECIMIENTO
// =============================================================================
// Funciones para agregar datos adicionales a prácticas ya cargadas

/**
 * Enriquece una práctica con los detalles de sus anexos (galería de imágenes)
 *
 * Carga la información completa de los archivos multimedia referenciados
 * en el campo `anexos` (IDs) y los añade como `anexosDetails`.
 *
 * @param practica - Práctica a enriquecer
 * @returns Práctica con anexosDetails poblado
 *
 * @example
 * ```typescript
 * const practicaConAnexos = await enrichPracticaWithAnexos(practica);
 * practicaConAnexos.anexosDetails?.forEach(img => {
 *   console.log(img.source_url);
 * });
 * ```
 */
export async function enrichPracticaWithAnexos(practica: BuenaPractica): Promise<BuenaPractica> {
  if (!practica.anexos || practica.anexos.length === 0) {
    return practica;
  }

  const anexosDetails = await getMediaByIds(practica.anexos);

  return {
    ...practica,
    anexosDetails,
  };
}

/**
 * Enriquece una práctica con la URL del PDF descargable
 *
 * Carga la información del archivo PDF referenciado por ID
 * y añade la URL directa como `pdfBuenaPracticaUrl`.
 *
 * @param practica - Práctica a enriquecer
 * @returns Práctica con pdfBuenaPracticaUrl poblado
 *
 * @example
 * ```typescript
 * const practicaConPdf = await enrichPracticaWithMediaUrls(practica);
 * if (practicaConPdf.pdfBuenaPracticaUrl) {
 *   // Mostrar botón de descarga
 * }
 * ```
 */
export async function enrichPracticaWithMediaUrls(practica: BuenaPractica): Promise<BuenaPractica> {
  if (!practica.pdfBuenaPractica || practica.pdfBuenaPractica <= 0) {
    return practica;
  }

  const pdfMedia = await getMediaById(practica.pdfBuenaPractica);

  return {
    ...practica,
    pdfBuenaPracticaUrl: pdfMedia?.source_url || undefined,
  };
}

// =============================================================================
// FUNCIONES PARA ESTUDIOS
// =============================================================================

/**
 * Parsea repeaters de estudios
 */
function parseEstudioRepeater<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && value !== null) {
    return Object.values(value) as T[];
  }
  return [];
}

/**
 * Transforma respuesta RAW de WordPress a objeto Estudio tipado
 */
function parseEstudio(raw: EstudioRaw): Estudio {
  const meta = raw.meta || {};

  const estudio: Estudio = {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    status: raw.status as Estudio['status'],
    link: raw.link,
    datePublished: new Date(raw.date),
    dateModified: new Date(raw.modified),

    featuredMediaId: raw.featured_media || 0,

    promotor: meta.promotor || '',
    urlPromotor: meta.url_promotor || '',
    logoPromotor: meta.logo_promotor ? parseInt(meta.logo_promotor, 10) : 0,
    tipoPromotor: meta.tipo_promotor || '',
    ambitoGeografico: meta.ambito_geografico || '',
    pais: meta.pais || '',
    ccaa: meta.ccaa || '',
    anioPublicacion: meta.anio_publicacion || '',
    anioInicio: meta.anio_inicio || '',
    anioFin: meta.anio_fin || '',

    descripcion: meta.descripcion || '',
    objetivos: meta.objetivos || '',
    destinatarios: meta.destinatarios || '',
    metodologia: meta.metodologia || '',
    resultados: meta.resultados || '',
    conclusiones: meta.conclusiones || '',

    documentosDescarga: parseEstudioRepeater<DocumentoEstudio>(meta.documentos_descarga),
    enlacesExternos: parseEstudioRepeater<EnlaceEstudio>(meta.enlaces_externos),
    estudiosLinea: parseEstudioRepeater<EstudioRelacionado>(meta.estudios_linea),

    galeria: Array.isArray(meta.galeria) ? meta.galeria.map((id: string | number) =>
      typeof id === 'string' ? parseInt(id, 10) : id
    ) : [],
    enlaceVideo: meta.enlace_video || '',
    pdfEstudio: meta.pdf_estudio ? (typeof meta.pdf_estudio === 'string' ? parseInt(meta.pdf_estudio, 10) : meta.pdf_estudio) : 0,

    estudioDestacado: meta.estudio_destacado === 'true' || meta.estudio_destacado === true,
    mostrarSlider: meta.mostrar_slider === 'true' || meta.mostrar_slider === true,
    orden: meta.orden ? parseInt(meta.orden, 10) : 0,

    categories: raw['category-estudios'] || [],
    tags: raw['tags-estudios'] || [],
  };

  // Extraer datos embebidos
  if (raw._embedded) {
    const featuredMedia = raw._embedded['wp:featuredmedia']?.[0];
    if (featuredMedia) {
      estudio.featuredMediaUrl = featuredMedia.source_url ||
        featuredMedia.media_details?.sizes?.large?.source_url ||
        featuredMedia.media_details?.sizes?.medium_large?.source_url;
    }

    const embeddedCats = raw._embedded['wp:term']?.find((terms) =>
      terms?.[0]?.taxonomy === 'category-estudios'
    );
    if (embeddedCats) {
      estudio.categoriesDetails = embeddedCats.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        link: cat.link,
        count: cat.count,
      }));
    }

    const embeddedTags = raw._embedded['wp:term']?.find((terms) =>
      terms?.[0]?.taxonomy === 'tags-estudios'
    );
    if (embeddedTags) {
      estudio.tagsDetails = embeddedTags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description || '',
        link: tag.link,
        count: tag.count,
      }));
    }
  }

  return estudio;
}

/**
 * Obtiene listado de estudios con paginación y filtros
 */
export async function getEstudios(
  params: WPApiParams = {}
): Promise<PaginatedResponse<Estudio>> {
  const searchParams = new URLSearchParams();

  searchParams.set('per_page', String(params.per_page || 12));
  searchParams.set('page', String(params.page || 1));
  searchParams.set('status', params.status || 'publish');
  searchParams.set('orderby', params.orderby || 'date');
  searchParams.set('order', params.order || 'desc');
  searchParams.set('_embed', '1');

  if (params.categories?.length) {
    searchParams.set('category-estudios', params.categories.join(','));
  }
  if (params.tags?.length) {
    searchParams.set('tags-estudios', params.tags.join(','));
  }
  if (params.search) {
    searchParams.set('search', params.search);
  }

  const url = `/estudios-mapinsol?${searchParams.toString()}`;

  const response = await fetch(`${WP_API_URL}${url}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }

  const total = parseInt(response.headers.get('x-wp-total') || '0', 10);
  const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '0', 10);
  const rawData: EstudioRaw[] = await response.json();

  const estudios = rawData.map(parseEstudio);

  // Si no tienen featuredMediaUrl pero tienen galería, usar primera imagen de galería
  const estudiosNeedingImage = estudios.filter(e => !e.featuredMediaUrl && e.galeria?.length > 0);
  if (estudiosNeedingImage.length > 0) {
    const imageIds = estudiosNeedingImage.map(e => e.galeria[0]);
    const uniqueIds = [...new Set(imageIds)];

    // Obtener todas las imágenes en una sola llamada
    const mediaResponse = await fetch(
      `${WP_API_URL}/media?include=${uniqueIds.join(',')}&per_page=${uniqueIds.length}`,
      { next: { revalidate: 3600 } }
    );

    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      const mediaMap = new Map<number, any>(mediaData.map((m: any) => [m.id, m]));

      for (const estudio of estudiosNeedingImage) {
        const media = mediaMap.get(estudio.galeria[0]);
        if (media) {
          estudio.featuredMediaUrl = media.media_details?.sizes?.large?.source_url ||
            media.media_details?.sizes?.medium_large?.source_url ||
            media.source_url;
        }
      }
    }
  }

  return {
    data: estudios,
    total,
    totalPages,
  };
}

/**
 * Obtiene un estudio por su slug
 */
export async function getEstudioBySlug(slug: string): Promise<Estudio | null> {
  const searchParams = new URLSearchParams({
    slug,
    per_page: '1',
    _embed: '1',
  });

  const response = await fetch(`${WP_API_URL}/estudios-mapinsol?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  const rawData: EstudioRaw[] = await response.json();

  if (rawData.length === 0) {
    return null;
  }

  const estudio = parseEstudio(rawData[0]);

  // Si no tiene featuredMediaUrl pero tiene galería, usar primera imagen
  if (!estudio.featuredMediaUrl && estudio.galeria?.length > 0) {
    const media = await getMediaById(estudio.galeria[0]);
    if (media) {
      estudio.featuredMediaUrl = media.media_details?.sizes?.large?.source_url ||
        media.media_details?.sizes?.medium_large?.source_url ||
        media.source_url;
    }
  }

  return estudio;
}

/**
 * Obtiene categorías de estudios
 */
export async function getCategoriasEstudios(): Promise<Categoria[]> {
  const searchParams = new URLSearchParams({
    per_page: '100',
    orderby: 'name',
    order: 'asc',
    _fields: 'id,name,slug,count,description,link',
  });

  const response = await fetch(`${WP_API_URL}/category-estudios?${searchParams.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

/**
 * Enriquece un estudio con las URLs de los documentos
 */
export async function enrichEstudioWithDocumentos(estudio: Estudio): Promise<Estudio> {
  if (!estudio.documentosDescarga || estudio.documentosDescarga.length === 0) {
    return estudio;
  }

  const docIds = estudio.documentosDescarga
    .map(d => d.archivo)
    .filter(id => id > 0);

  if (docIds.length === 0) return estudio;

  const mediaDetails = await getMediaByIds(docIds);

  const documentosConUrl = estudio.documentosDescarga.map(doc => {
    const media = mediaDetails.find((m: { id: number }) => m.id === doc.archivo);
    return {
      ...doc,
      archivoUrl: media?.source_url || '',
    };
  });

  return {
    ...estudio,
    documentosDescarga: documentosConUrl,
  };
}

/**
 * Enriquece un estudio con la galería de imágenes
 */
export async function enrichEstudioWithGaleria(estudio: Estudio): Promise<Estudio> {
  if (!estudio.galeria || estudio.galeria.length === 0) {
    return estudio;
  }

  const galeriaDetails = await getMediaByIds(estudio.galeria);

  return {
    ...estudio,
    galeriaDetails,
  };
}

/**
 * Enriquece un estudio con la URL del PDF
 */
export async function enrichEstudioWithPdf(estudio: Estudio): Promise<Estudio> {
  if (!estudio.pdfEstudio || estudio.pdfEstudio <= 0) {
    return estudio;
  }

  const media = await getMediaById(estudio.pdfEstudio);
  return {
    ...estudio,
    pdfEstudioUrl: media?.source_url,
  };
}

// =============================================================================
// ACTUALIDAD Y COMUNICACIÓN
// =============================================================================

import type {
  Actualidad,
  ActualidadRaw,
  TipoContenido,
  SeccionBoletin,
  PdfRelacionadoEstudio,
} from '@/types';

async function resolveMediaFieldUrl(value: string | number | null | undefined): Promise<string> {
  if (!value) return '';

  if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
    return value;
  }

  const mediaId = Number(value);
  if (!mediaId) return '';

  const media = await getMediaById(mediaId);
  return media?.source_url || '';
}

function parseGaleriaField(value: any): number[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(Number).filter(Boolean);
  if (typeof value === 'string' && value.includes(',')) {
    return value.split(',').map(Number).filter(Boolean);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const num = Number(value);
    return num ? [num] : [];
  }
  return [];
}

function parseActualidad(raw: ActualidadRaw): Actualidad {
  const meta = raw.meta || {};
  const embedded = raw._embedded?.['wp:featuredmedia']?.[0];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered || '',
    content: raw.content?.rendered || '',
    excerpt: raw.excerpt?.rendered || '',
    status: raw.status as Actualidad['status'],
    link: raw.link,
    datePublished: new Date(raw.date),
    dateModified: new Date(raw.modified),

    featuredMediaId: raw.featured_media || 0,
    featuredMediaUrl: embedded?.media_details?.sizes?.large?.source_url ||
      embedded?.media_details?.sizes?.medium_large?.source_url ||
      embedded?.source_url || '',

    tipoContenido: (meta.tipo_contenido || '') as TipoContenido,
    descripcionCorta: meta.descripcion || meta.descripcion_corta || '',
    destacado: meta.destacado === 'true' || meta.destacado === true,
    galeria: parseGaleriaField(meta.galeria),

    pdfBoletin: meta.pdf_boletin || '',
    fechaPublicacion: meta.fecha_publicacion || '',
    enlaceInteresBoletin: meta.enlace_interes_boletin || '',
    seccionesBoletin: parseRepeater<SeccionBoletin>(meta.secciones_boletin),

    fuenteNota: meta.fuente_nota || '',
    enlaceNota: meta.enlace_nota || '',

    fechaEvento: meta.fecha_evento || '',
    horaInicio: meta.hora_inicio || '',
    lugarEvento: meta.lugar_evento || '',
    horaFin: meta.hora_fin || '',
    enlaceInscripcion: meta.enlace_inscripcion || '',

    fechaPublicacionEstudio: meta.fecha_publicacion_estudio || '',
    pdfDelEstudio: meta.pdf_del_estudio || '',
    enlaceDelEstudio: meta.enlace_del_estudio || '',
    descripcionDelEstudio: meta.descripcion_del_estudio || '',
    pdfsRelacionadosEstudio: parseRepeater<PdfRelacionadoEstudio>(meta.pdfs_relacionados_estudio),

    urlVideo: meta.url_video || '',

    infografiaImagen: meta.infografia_imagen || '',
    pdfInfografia: meta.pdf_infografia || '',
  };
}

export async function getActualidad(params?: {
  per_page?: number;
  page?: number;
  tipo?: TipoContenido;
}): Promise<PaginatedResponse<Actualidad>> {
  const searchParams = new URLSearchParams({
    per_page: String(params?.per_page || 12),
    page: String(params?.page || 1),
    status: 'publish',
    _embed: '1',
    orderby: 'date',
    order: 'desc',
  });

  if (params?.tipo) {
    searchParams.set('tipo_contenido', params.tipo);
  }

  const response = await fetch(`${WP_API_URL}/actualidad-mapinsol?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return { data: [], total: 0, totalPages: 0 };
  }

  const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
  const rawData: ActualidadRaw[] = await response.json();

  let items = rawData.map(parseActualidad);

  if (params?.tipo) {
    items = items.filter((item) => item.tipoContenido === params.tipo);
  }

  // Resolver primera imagen de galería como featuredMediaUrl fallback
  const needingImage = items.filter(i => !i.featuredMediaUrl && i.galeria?.length > 0);
  if (needingImage.length > 0) {
    const imageIds = needingImage.map(i => i.galeria[0]);
    const uniqueIds = [...new Set(imageIds)];
    try {
      const mediaResponse = await fetch(
        `${WP_API_URL}/media?include=${uniqueIds.join(',')}&per_page=${uniqueIds.length}`,
        { next: { revalidate: 3600 } }
      );
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        const mediaMap = new Map<number, any>(mediaData.map((m: any) => [m.id, m]));
        for (const item of needingImage) {
          const media = mediaMap.get(item.galeria[0]);
          if (media) {
            item.featuredMediaUrl = media.media_details?.sizes?.large?.source_url ||
              media.media_details?.sizes?.medium_large?.source_url ||
              media.source_url || '';
          }
        }
      }
    } catch { /* skip */ }
  }

  // Resolver infografia_imagen como featuredMediaUrl fallback para tipo infografia
  const needingInfografia = items.filter(i => !i.featuredMediaUrl && i.infografiaImagen);
  if (needingInfografia.length > 0) {
    const imgIds = needingInfografia.map(i => Number(i.infografiaImagen)).filter(Boolean);
    const uniqueIds = [...new Set(imgIds)];
    try {
      const mediaResponse = await fetch(
        `${WP_API_URL}/media?include=${uniqueIds.join(',')}&per_page=${uniqueIds.length}`,
        { next: { revalidate: 3600 } }
      );
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        const mediaMap = new Map<number, any>(mediaData.map((m: any) => [m.id, m]));
        for (const item of needingInfografia) {
          const media = mediaMap.get(Number(item.infografiaImagen));
          if (media) {
            item.featuredMediaUrl = media.media_details?.sizes?.large?.source_url ||
              media.media_details?.sizes?.medium_large?.source_url ||
              media.source_url || '';
          }
        }
      }
    } catch { /* skip */ }
  }

  // Resolver thumbnail de YouTube como featuredMediaUrl fallback para tipo video
  for (const item of items) {
    if (!item.featuredMediaUrl && item.urlVideo) {
      const ytMatch = item.urlVideo.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) {
        item.featuredMediaUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
    }
  }

  return { data: items, total, totalPages };
}

export async function getActualidadBySlug(slug: string): Promise<Actualidad | null> {
  const searchParams = new URLSearchParams({
    slug,
    per_page: '1',
    _embed: '1',
  });

  const response = await fetch(`${WP_API_URL}/actualidad-mapinsol?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) return null;

  const rawData: ActualidadRaw[] = await response.json();
  if (rawData.length === 0) return null;

  const item = parseActualidad(rawData[0]);

  // Resolver galería de imágenes
  if (item.galeria && item.galeria.length > 0) {
    const galeriaDetails = await getMediaByIds(item.galeria);
    item.galeriaDetails = galeriaDetails;

    // Usar primera imagen como featuredMediaUrl si no tiene
    if (!item.featuredMediaUrl && galeriaDetails.length > 0) {
      const first = galeriaDetails[0];
      item.featuredMediaUrl = first.media_details?.sizes?.large?.source_url ||
        first.media_details?.sizes?.medium_large?.source_url ||
        first.source_url || '';
    }
  }

  // Resolver pdf_boletin (ID/URL -> URL)
  if (item.pdfBoletin) {
    const pdfBoletinUrl = await resolveMediaFieldUrl(item.pdfBoletin);
    if (pdfBoletinUrl) {
      item.pdfBoletin = pdfBoletinUrl;
    }
  }

  // Resolver imágenes de secciones de boletín (IDs → URLs)
  if (item.seccionesBoletin && item.seccionesBoletin.length > 0) {
    for (const seccion of item.seccionesBoletin) {
      if (seccion.imagen_seccion) {
        const imgId = Number(seccion.imagen_seccion);
        if (imgId) {
          const media = await getMediaById(imgId);
          if (media) {
            seccion.imagenSeccionUrl = media.media_details?.sizes?.large?.source_url ||
              media.media_details?.sizes?.medium_large?.source_url ||
              media.source_url || '';
          }
        }
      }
    }
  }

  // Resolver infografia_imagen (ID → URL)
  if (item.infografiaImagen) {
    const imgId = Number(item.infografiaImagen);
    if (imgId) {
      const media = await getMediaById(imgId);
      if (media) {
        item.infografiaImagenUrl = media.media_details?.sizes?.large?.source_url ||
          media.source_url || '';
      }
    }
  }

  // Resolver pdf_infografia (ID/URL -> URL)
  if (item.pdfInfografia) {
    const pdfInfografiaUrl = await resolveMediaFieldUrl(item.pdfInfografia);
    if (pdfInfografiaUrl) {
      item.pdfInfografiaUrl = pdfInfografiaUrl;
    }
  }

  // Resolver pdf_del_estudio (ID/URL -> URL)
  if (item.pdfDelEstudio) {
    const pdfEstudioUrl = await resolveMediaFieldUrl(item.pdfDelEstudio);
    if (pdfEstudioUrl) {
      item.pdfDelEstudioUrl = pdfEstudioUrl;
    }
  }

  // Resolver PDFs relacionados de estudios (ID/URL -> URL)
  if (item.pdfsRelacionadosEstudio && item.pdfsRelacionadosEstudio.length > 0) {
    for (const pdfRelacionado of item.pdfsRelacionadosEstudio) {
      const relatedPdfUrl = await resolveMediaFieldUrl(pdfRelacionado.documento_pdf_relacionado_estudio);
      if (relatedPdfUrl) {
        pdfRelacionado.documentoPdfRelacionadoUrl = relatedPdfUrl;
      }
    }
  }

  return item;
}

export async function getActualidadSlugs(): Promise<string[]> {
  const response = await fetch(
    `${WP_API_URL}/actualidad-mapinsol?per_page=100&status=publish&_fields=slug`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) return [];

  const data: { slug: string }[] = await response.json();
  return data.map(item => item.slug);
}
