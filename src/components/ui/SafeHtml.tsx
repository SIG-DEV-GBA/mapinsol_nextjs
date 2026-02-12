'use client';

import { useEffect, useState } from 'react';

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: 'div' | 'span' | 'p';
}

// Tags seguros permitidos
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
  const [cleanHtml, setCleanHtml] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Importar DOMPurify solo en el cliente
    import('dompurify').then((DOMPurify) => {
      const purify = DOMPurify.default;
      const sanitized = purify.sanitize(html || '', {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
        FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
      });
      setCleanHtml(sanitized);
    });
  }, [html]);

  if (!html) return null;

  // Durante SSR o mientras carga, mostrar texto sin formato
  if (!isClient || !cleanHtml) {
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    return <Component className={className}>{textContent}</Component>;
  }

  return (
    <Component
      className={`wp-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
