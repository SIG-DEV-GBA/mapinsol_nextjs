'use client';

import DOMPurify from 'isomorphic-dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: 'div' | 'span' | 'p';
}

// Configuración de DOMPurify - solo permitir tags seguros de formato
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code',
  'a', 'span', 'sub', 'sup',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr'
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class'];

export function SafeHtml({ html, className = '', as: Component = 'div' }: SafeHtmlProps) {
  if (!html) return null;

  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Añadir rel="noopener noreferrer" a enlaces externos
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
  });

  // Si después de sanitizar no hay contenido visible, no renderizar
  const textContent = cleanHtml.replace(/<[^>]*>/g, '').trim();
  if (!textContent) return null;

  return (
    <Component
      className={`wp-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
