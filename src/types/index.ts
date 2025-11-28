/**
 * =============================================================================
 * DEFINICIONES DE TIPOS - BUENAS PRÁCTICAS
 * =============================================================================
 *
 * Este módulo contiene todas las interfaces TypeScript que definen la
 * estructura de datos de la aplicación. Los tipos reflejan:
 *
 * 1. Campos del CPT "buenas_practicas_ast" de WordPress/JetEngine
 * 2. Taxonomías personalizadas (category-practices, tags-practices)
 * 3. Estructuras de la API REST de WordPress
 *
 * ORGANIZACIÓN:
 * - Tipos auxiliares (Contacto, EnlaceAnexo, CheckboxGroup)
 * - Taxonomías (Categoria, Etiqueta)
 * - Media (MediaAttachment)
 * - Entidad principal (BuenaPractica)
 * - API (BuenaPracticaRaw, WPApiParams, PaginatedResponse)
 *
 * @module types
 */

// =============================================================================
// TIPOS AUXILIARES
// =============================================================================

/**
 * Datos de contacto de una persona asociada a la práctica
 *
 * Proviene del repeater "personas_de_contacto" de JetEngine.
 * Solo se muestra si `mostrarContacto` es true.
 */
export interface Contacto {
  /** Nombre completo de la persona */
  nombre_contacto: string;
  /** Cargo o posición en la entidad */
  cargo: string;
  /** Nombre de la entidad donde trabaja */
  entidad_contacto: string;
  /** Teléfono de contacto */
  tlf_contacto: string;
  /** Correo electrónico */
  mail_contacto: string;
}

/**
 * Enlace o anexo externo asociado a la práctica
 *
 * Proviene del repeater "enlaces_anexos" de JetEngine.
 * Usado para documentación adicional, estudios, etc.
 */
export interface EnlaceAnexo {
  /** Texto descriptivo del enlace */
  texto_enlace: string;
  /** URL del recurso externo */
  url_enlace: string;
}

/**
 * Tipo para checkbox groups de JetEngine
 *
 * Los checkbox groups almacenan opciones seleccionadas como objeto
 * donde la clave es el nombre de la opción y el valor es "true"/"false".
 *
 * @example
 * ```typescript
 * const poblacion: CheckboxGroup = {
 *   "Mayores autónomos": "true",
 *   "Mayores dependientes": "true",
 *   "Institucionalizados": "false"
 * };
 * ```
 */
export type CheckboxGroup = Record<string, string>;

// =============================================================================
// TAXONOMÍAS
// =============================================================================

/**
 * Categoría de clasificación de buenas prácticas
 *
 * Taxonomía principal del CPT. Ejemplos:
 * - Envejecimiento activo
 * - Salud preventiva
 * - Participación social
 * - Soledad no deseada
 */
export interface Categoria {
  /** ID único en WordPress */
  id: number;
  /** Nombre visible de la categoría */
  name: string;
  /** Slug para URLs (ej: "envejecimiento-activo") */
  slug: string;
  /** Descripción opcional */
  description: string;
  /** URL del archivo de la categoría en WordPress */
  link: string;
  /** Número de prácticas en esta categoría */
  count: number;
}

/**
 * Etiqueta (tag) para clasificación secundaria
 *
 * Permite etiquetado más granular que las categorías.
 * Estructura idéntica a Categoria pero taxonomía diferente.
 */
export interface Etiqueta {
  /** ID único en WordPress */
  id: number;
  /** Nombre visible de la etiqueta */
  name: string;
  /** Slug para URLs */
  slug: string;
  /** Descripción opcional */
  description: string;
  /** URL del archivo de la etiqueta en WordPress */
  link: string;
  /** Número de prácticas con esta etiqueta */
  count: number;
}

// =============================================================================
// MEDIA
// =============================================================================

/**
 * Archivo multimedia de WordPress (imagen, PDF, etc.)
 *
 * Representa un attachment de la biblioteca de medios.
 * Usado para imágenes destacadas, galerías y documentos PDF.
 */
export interface MediaAttachment {
  /** ID único del media */
  id: number;
  /** Título del archivo */
  title: string;
  /** Texto alternativo (accesibilidad) */
  alt_text: string;
  /** Leyenda/caption */
  caption: string;
  /** Descripción larga */
  description: string;
  /** Tipo de media: "image", "file", etc. */
  media_type: string;
  /** MIME type: "image/jpeg", "application/pdf", etc. */
  mime_type: string;
  /** URL directa del archivo original */
  source_url: string;
  /** Detalles técnicos (solo para imágenes) */
  media_details?: {
    /** Ancho en píxeles */
    width?: number;
    /** Alto en píxeles */
    height?: number;
    /** Ruta relativa del archivo */
    file?: string;
    /** Tamaños generados por WordPress */
    sizes?: {
      thumbnail?: { source_url: string; width: number; height: number };
      medium?: { source_url: string; width: number; height: number };
      large?: { source_url: string; width: number; height: number };
      full?: { source_url: string; width: number; height: number };
    };
  };
}

// =============================================================================
// ENTIDAD PRINCIPAL
// =============================================================================

/**
 * Buena Práctica - Entidad principal de la aplicación
 *
 * Representa una práctica completa con todos sus campos parseados
 * desde la respuesta de WordPress. Esta interfaz es la que se usa
 * en todos los componentes de React.
 *
 * Los campos están organizados siguiendo la estructura del formulario
 * de JetEngine en WordPress.
 */
export interface BuenaPractica {
  // ─────────────────────────────────────────────────────────────────────────
  // DATOS BÁSICOS DE WORDPRESS
  // ─────────────────────────────────────────────────────────────────────────

  /** ID único del post */
  id: number;
  /** Slug para URL amigable (ej: "programa-teleasistencia") */
  slug: string;
  /** Título de la práctica (ya renderizado, sin HTML) */
  title: string;
  /** Estado de publicación */
  status: 'publish' | 'draft' | 'pending' | 'private';
  /** URL completa en WordPress (para referencia) */
  link: string;

  // ─────────────────────────────────────────────────────────────────────────
  // FECHAS
  // ─────────────────────────────────────────────────────────────────────────

  /** Fecha de publicación */
  datePublished: Date;
  /** Fecha de última modificación */
  dateModified: Date;

  // ─────────────────────────────────────────────────────────────────────────
  // ARCHIVOS MULTIMEDIA
  // ─────────────────────────────────────────────────────────────────────────

  /** ID de la imagen destacada */
  featuredMediaId: number;
  /** URL de la imagen destacada (cargada desde _embed) */
  featuredMediaUrl?: string;
  /** ID del PDF de la práctica */
  pdfBuenaPractica: number;
  /** URL directa del PDF (requiere enrichPracticaWithMediaUrls) */
  pdfBuenaPracticaUrl?: string;
  /** IDs de imágenes de la galería */
  anexos: number[];

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 1: INFORMACIÓN GENERAL
  // ─────────────────────────────────────────────────────────────────────────

  /** Nombre de la entidad responsable */
  entidadResponsable: string;
  /** URL del sitio web de la entidad */
  urlEntidad: string;
  /** Lista de personas de contacto */
  personasContacto: Contacto[];
  /** Ámbito territorial: Local, Regional, Nacional, Internacional */
  ambitoTerritorial: string;
  /** Si es una práctica internacional */
  internacionalBoolean: boolean;
  /** País (solo si es internacional) */
  country: string;
  /** Comunidad Autónoma */
  ccaa: string;
  /** Provincia */
  provincia: string;
  /** Municipio */
  municipio: string;
  /** Año de inicio de la práctica */
  anioInicio: string;
  /** Estado: En curso, Finalizado, En pausa */
  estadoActual: string;
  /** Tipo de entorno: Domicilio, Centro, Residencia, etc. */
  tipoEntorno: string;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 2: DESCRIPCIÓN DE LA PRÁCTICA
  // ─────────────────────────────────────────────────────────────────────────

  /** Descripción general del grupo/contexto */
  descripcionGrupo: string;
  /** Objetivo principal de la práctica */
  objetivoPrincipal: string;
  /** Actividades desarrolladas (puede contener HTML) */
  actividadesDesarrolladas: string;
  /** Metodología aplicada (puede contener HTML) */
  metodologiaAplicada: string;
  /** Población destinataria (checkbox group) */
  poblacionDestinataria: CheckboxGroup;
  /** Agentes implicados (checkbox group) */
  agentesImplicados: CheckboxGroup;
  /** Nombre de la entidad colaboradora */
  nombreEntidad: string;
  /** Rol o función de la entidad colaboradora */
  rolFuncion: string;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 3: EVALUACIÓN Y RESULTADOS
  // ─────────────────────────────────────────────────────────────────────────

  /** Indicadores de evaluación usados */
  indicadoresEvaluacion: string;
  /** Resultados obtenidos (puede contener HTML) */
  resultadosObtenidos: string;
  /** Lecciones aprendidas (puede contener HTML) */
  leccionesAprendidas: string;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 4: TRANSFERIBILIDAD Y SOSTENIBILIDAD
  // ─────────────────────────────────────────────────────────────────────────

  /** Nivel de transferibilidad: Alta, Media, Baja */
  nivelTransferibilidad: string;
  /** Requisitos para implementar la práctica */
  requisitosImplementacion: string;
  /** Aspectos de sostenibilidad */
  sostenibilidad: string;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 5: ÉTICA Y BUENAS PRÁCTICAS
  // ─────────────────────────────────────────────────────────────────────────

  /** Cómo se respeta la dignidad y autonomía */
  respetoDignidadAutonomia: string;
  /** Medidas de prevención del maltrato */
  prevencionMaltrato: string;
  /** Cómo participan las personas mayores */
  participacionPersonas: string;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 6: INNOVACIÓN
  // ─────────────────────────────────────────────────────────────────────────

  /** Elementos innovadores de la práctica */
  elementoInnovador: string;
  /** Uso de tecnología */
  usoTecnologia: string;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 7: PUBLICACIONES Y ENLACES
  // ─────────────────────────────────────────────────────────────────────────

  /** Referencia a publicación externa */
  publicacionExterna: string;
  /** URL de video (YouTube) */
  enlaceVideo: string;
  /** Enlaces a documentos adicionales */
  enlacesAnexos: EnlaceAnexo[];

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 8: CONFIGURACIÓN DE VISIBILIDAD
  // ─────────────────────────────────────────────────────────────────────────

  /** Si la práctica es destacada (aparece en home) */
  practicaDestacada: boolean;
  /** Si se muestran los datos de contacto públicamente */
  mostrarContacto: boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // TAXONOMÍAS (IDs)
  // ─────────────────────────────────────────────────────────────────────────

  /** IDs de categorías asignadas */
  categories: number[];
  /** IDs de etiquetas asignadas */
  tags: number[];

  // ─────────────────────────────────────────────────────────────────────────
  // DATOS ENRIQUECIDOS (OPCIONALES)
  // ─────────────────────────────────────────────────────────────────────────
  // Estos campos se pueblan desde _embed o funciones enrich*

  /** Detalles de categorías (desde _embed) */
  categoriesDetails?: Categoria[];
  /** Detalles de etiquetas (desde _embed) */
  tagsDetails?: Etiqueta[];
  /** Detalles de imágenes de galería (desde enrichPracticaWithAnexos) */
  anexosDetails?: MediaAttachment[];
}

// =============================================================================
// TIPOS DE API
// =============================================================================

/**
 * Respuesta RAW de la API REST de WordPress
 *
 * Esta interfaz representa la estructura exacta que devuelve WordPress
 * antes de ser parseada a BuenaPractica. Se usa internamente en
 * lib/wordpress.ts.
 *
 * @internal
 */
export interface BuenaPracticaRaw {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: { rendered: string };
  featured_media: number;
  'category-practices': number[];
  'tags-practices': number[];
  /** Campos meta de JetEngine (estructura variable) */
  meta: Record<string, any>;
  /** Datos embebidos (cuando se usa ?_embed=1) */
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url: string };
          large?: { source_url: string };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
      count: number;
      description: string;
      link: string;
    }>>;
  };
}

/**
 * Parámetros para consultas a la API de WordPress
 *
 * Se usan en getBuenasPracticas() para filtrar y paginar resultados.
 */
export interface WPApiParams {
  /** Número de resultados por página (default: 12) */
  per_page?: number;
  /** Número de página (default: 1) */
  page?: number;
  /** Estado de publicación (default: 'publish') */
  status?: 'publish' | 'draft' | 'pending' | 'private';
  /** Filtrar por IDs de categorías */
  categories?: number[];
  /** Filtrar por IDs de etiquetas */
  tags?: number[];
  /** Término de búsqueda */
  search?: string;
  /** Campo para ordenar */
  orderby?: 'date' | 'modified' | 'title' | 'id';
  /** Dirección del orden */
  order?: 'asc' | 'desc';
}

/**
 * Respuesta paginada genérica
 *
 * Envuelve arrays de resultados con metadatos de paginación.
 * Usado por getBuenasPracticas().
 *
 * @template T - Tipo de los elementos en el array
 */
export interface PaginatedResponse<T> {
  /** Array de resultados */
  data: T[];
  /** Total de items (en todas las páginas) */
  total: number;
  /** Total de páginas disponibles */
  totalPages: number;
}
