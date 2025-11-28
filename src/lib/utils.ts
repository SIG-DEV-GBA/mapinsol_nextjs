import { type ClassValue, clsx } from 'clsx';

/**
 * Combina clases CSS de forma inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Expande acrónimos comunes en nombres de categorías
 */
export function expandAcronyms(text: string): string {
  const acronyms: Record<string, string> = {
    'AVD': 'Vida Diaria',
    'TIC': 'Tecnologías de la Información',
    'AAVD': 'Actividades de la Vida Diaria',
  };

  let result = text;

  // Caso especial: "Salud preventiva y AAL" -> "Salud preventiva"
  result = result.replace(/\s*y\s+AAL\b/gi, '');

  for (const [acronym, expansion] of Object.entries(acronyms)) {
    // Solo expandir si el acrónimo aparece como palabra completa
    const regex = new RegExp(`\\b${acronym}\\b`, 'gi');
    if (regex.test(result)) {
      // Si aparece "y AVD", expandir de forma legible
      result = result.replace(new RegExp(`\\by\\s+${acronym}\\b`, 'gi'), `y ${expansion}`);
      result = result.replace(new RegExp(`\\b${acronym}\\b`, 'gi'), expansion);
    }
  }

  return result;
}

/**
 * Formatea fecha en español
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Formatea fecha corta
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

/**
 * Trunca texto a un número de caracteres
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Obtiene el porcentaje de transferibilidad basado en el nivel
 */
export function getTransferibilidadPercentage(nivel: string): number {
  const nivelLower = nivel.toLowerCase();

  if (nivelLower.includes('alto') || nivelLower.includes('alta')) {
    return 100;
  }
  if (nivelLower.includes('medio') || nivelLower.includes('media')) {
    return 66;
  }
  if (nivelLower.includes('bajo') || nivelLower.includes('baja')) {
    return 33;
  }

  return 50; // Por defecto
}

/**
 * Extrae el ID de video de YouTube
 */
export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extrae el ID de video de Vimeo
 */
export function getVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Genera URL de embed de video
 */
export function getVideoEmbedUrl(url: string): string | null {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  return null;
}

/**
 * Decodifica entidades HTML
 */
export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&nbsp;': ' ',
    '&#8211;': '\u2013',
    '&#8212;': '\u2014',
    '&#8216;': '\u2018',
    '&#8217;': '\u2019',
    '&#8220;': '\u201C',
    '&#8221;': '\u201D',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replaceAll(entity, char);
  }

  return result;
}

/**
 * Limpia HTML y devuelve texto plano
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Verifica si es dispositivo táctil (para server-side, devuelve false)
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
