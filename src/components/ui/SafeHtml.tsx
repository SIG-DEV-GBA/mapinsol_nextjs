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

/**
 * Convierte texto plano con bullets (•, -, *) y números a HTML con listas
 */
function formatPlainTextToHtml(text: string): string {
  if (!text) return '';

  // Si ya tiene tags HTML significativos, no procesar
  if (/<(ul|ol|li|p|br|strong|em|h[1-6])\b/i.test(text)) {
    return text;
  }

  let result = text;

  // Convertir saltos de línea a <br> primero
  result = result.replace(/\r\n/g, '\n');

  // Detectar líneas que empiezan con bullets (•, -, *, ◦, ▪)
  const bulletPattern = /^[\s]*[•\-\*◦▪]\s*/gm;
  const hasBullets = bulletPattern.test(result);

  // Detectar líneas numeradas (1., 2., etc.)
  const numberPattern = /^[\s]*\d+[\.\)]\s+/gm;
  const hasNumbers = numberPattern.test(result);

  if (hasBullets || hasNumbers) {
    const lines = result.split('\n');
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    const processedLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Detectar si es un item de lista
      const isBullet = /^[•\-\*◦▪]\s*/.test(trimmedLine);
      const isNumbered = /^\d+[\.\)]\s+/.test(trimmedLine);

      if (isBullet) {
        if (!inList || listType !== 'ul') {
          if (inList) processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
          processedLines.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        const content = trimmedLine.replace(/^[•\-\*◦▪]\s*/, '');
        processedLines.push(`<li>${content}</li>`);
      } else if (isNumbered) {
        if (!inList || listType !== 'ol') {
          if (inList) processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
          processedLines.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        const content = trimmedLine.replace(/^\d+[\.\)]\s+/, '');
        processedLines.push(`<li>${content}</li>`);
      } else {
        if (inList) {
          processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
          inList = false;
          listType = null;
        }
        if (trimmedLine) {
          processedLines.push(`<p>${trimmedLine}</p>`);
        }
      }
    }

    // Cerrar lista si quedó abierta
    if (inList) {
      processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
    }

    result = processedLines.join('');
  } else {
    // Sin listas, solo convertir párrafos
    const paragraphs = result.split(/\n\n+/);
    result = paragraphs
      .map(p => p.trim())
      .filter(p => p)
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  return result;
}

export function SafeHtml({ html, className = '', as: Component = 'div' }: SafeHtmlProps) {
  const [cleanHtml, setCleanHtml] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Primero formatear texto plano a HTML si es necesario
    const formattedHtml = formatPlainTextToHtml(html || '');

    // Importar DOMPurify solo en el cliente
    import('dompurify').then((DOMPurify) => {
      const purify = DOMPurify.default;
      const sanitized = purify.sanitize(formattedHtml, {
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
