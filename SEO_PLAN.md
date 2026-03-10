# Plan SEO - Mapinsol.es

## Contexto del proyecto

- **Tipo de sitio:** Portal de buenas practicas en atencion a personas mayores (headless WordPress + Next.js 15)
- **Dominio:** mapinsol.es
- **Framework:** Next.js 15.5.9 (App Router, Server Components, ISR 60s)
- **CMS:** WordPress con JetEngine (custom post types)
- **Deploy:** Dokploy en VPS (standalone output)
- **Idioma:** Espanol (es)
- **Organizacion:** Fundacion Padrinos de la Vejez

## Paginas del sitio

| Ruta | Tipo | Descripcion |
|---|---|---|
| `/` | Home (estatica + ISR) | Hero + ultimas practicas + destacadas |
| `/practicas/` | Listado (estatica + ISR) | Catalogo filtrable de buenas practicas |
| `/practica/[slug]/` | Detalle (SSG + ISR) | Pagina individual de cada practica |

---

## PRIORIDAD 1 - CRITICO (Crawlability e Indexacion)

### 1.1 Crear robots.txt

**Archivo:** `src/app/robots.ts`

Crear usando la API de Next.js:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://mapinsol.es/sitemap.xml',
  };
}
```

### 1.2 Crear sitemap.xml dinamico

**Archivo:** `src/app/sitemap.ts`

Generar sitemap que incluya todas las rutas estaticas y todas las practicas dinamicas:

```ts
import type { MetadataRoute } from 'next';
import { getBuenasPracticas } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: practicas } = await getBuenasPracticas({ per_page: 100 });

  const practicaUrls = practicas.map((p) => ({
    url: `https://mapinsol.es/practica/${p.slug}/`,
    lastModified: p.modified || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://mapinsol.es/',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://mapinsol.es/practicas/',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...practicaUrls,
  ];
}
```

> **Nota:** Verificar que `getBuenasPracticas` devuelve el campo `modified`. Si no, anadirlo al `_fields` de la peticion en `wordpress.ts`.

### 1.3 Configurar metadataBase y canonical URLs

**Archivo:** `src/app/layout.tsx`

Anadir `metadataBase` al metadata global. Esto permite que Next.js resuelva URLs absolutas para OG, canonicals, etc:

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://mapinsol.es'),
  title: {
    template: '%s | Mapinsol',
    default: 'Buenas Practicas que Transforman Vidas | Mapinsol',
  },
  description: 'Catalogo de buenas practicas innovadoras en atencion y cuidado de personas mayores. Proyecto de la Fundacion Padrinos de la Vejez.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

**Archivo:** `src/app/practicas/page.tsx`

```ts
export const metadata: Metadata = {
  title: 'Explorar Buenas Practicas',
  description: 'Descubre iniciativas innovadoras en atencion y cuidado de personas mayores. Explora el catalogo completo de buenas practicas.',
  alternates: {
    canonical: '/practicas/',
  },
};
```

**Archivo:** `src/app/practica/[slug]/page.tsx`

En `generateMetadata`, anadir canonical dinamico:

```ts
alternates: {
  canonical: `/practica/${slug}/`,
},
```

---

## PRIORIDAD 2 - ALTO (Open Graph, Twitter Cards, Structured Data)

### 2.1 Open Graph y Twitter Cards globales

**Archivo:** `src/app/layout.tsx`

Anadir al metadata global:

```ts
openGraph: {
  type: 'website',
  locale: 'es_ES',
  siteName: 'Mapinsol - Buenas Practicas',
  images: [
    {
      url: '/logos/og-default.png',  // Crear imagen OG por defecto (1200x630)
      width: 1200,
      height: 630,
      alt: 'Mapinsol - Buenas Practicas en Atencion a Personas Mayores',
    },
  ],
},
twitter: {
  card: 'summary_large_image',
},
```

> **Tarea:** Crear imagen OG por defecto en `public/logos/og-default.png` (1200x630px) con el logo de Mapinsol/FPV y texto del proyecto.

### 2.2 Open Graph dinamico en paginas de detalle

**Archivo:** `src/app/practica/[slug]/page.tsx`

En `generateMetadata`, anadir OG con la imagen de la practica:

```ts
openGraph: {
  title: practica.title,
  description: descripcionLimpia,
  type: 'article',
  images: practica.imagenDestacada
    ? [{ url: practica.imagenDestacada, width: 1200, height: 630 }]
    : undefined,
},
twitter: {
  card: 'summary_large_image',
  title: practica.title,
  description: descripcionLimpia,
  images: practica.imagenDestacada ? [practica.imagenDestacada] : undefined,
},
```

> **Nota:** Verificar que `practica.imagenDestacada` o el primer anexo del array de imagenes esta disponible. Si no existe el campo, anadirlo al tipo `BuenaPractica` y al fetch en `wordpress.ts`.

### 2.3 JSON-LD / Structured Data

Crear componente reutilizable de JSON-LD:

**Archivo nuevo:** `src/components/seo/JsonLd.tsx`

```tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

#### 2.3.1 Schema Organization (layout global o home)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fundacion Padrinos de la Vejez",
  "url": "https://fundacionpadrinosdelavejez.es",
  "logo": "https://mapinsol.es/logos/logo%20FPV.png",
  "sameAs": []
}
```

#### 2.3.2 Schema BreadcrumbList (pagina de detalle)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://mapinsol.es/" },
    { "@type": "ListItem", "position": 2, "name": "Buenas Practicas", "item": "https://mapinsol.es/practicas/" },
    { "@type": "ListItem", "position": 3, "name": "{titulo practica}" }
  ]
}
```

#### 2.3.3 Schema Article (pagina de detalle)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{titulo}",
  "description": "{objetivo principal}",
  "author": {
    "@type": "Organization",
    "name": "{entidad responsable}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Fundacion Padrinos de la Vejez",
    "logo": { "@type": "ImageObject", "url": "https://mapinsol.es/logos/logo%20FPV.png" }
  },
  "image": "{imagen destacada}",
  "datePublished": "{fecha publicacion}",
  "dateModified": "{fecha modificacion}",
  "mainEntityOfPage": "https://mapinsol.es/practica/{slug}/"
}
```

#### 2.3.4 Schema CollectionPage (pagina de listado)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Catalogo de Buenas Practicas",
  "description": "Iniciativas innovadoras en atencion a personas mayores",
  "url": "https://mapinsol.es/practicas/",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Mapinsol",
    "url": "https://mapinsol.es/"
  }
}
```

---

## PRIORIDAD 3 - MEDIO (Performance y UX tecnico)

### 3.1 Crear pagina 404 personalizada

**Archivo nuevo:** `src/app/not-found.tsx`

Crear pagina 404 con branding, Navbar, Footer, y enlaces internos a contenido existente. Esto mejora la experiencia del usuario y mantiene el link equity dentro del sitio.

### 3.2 Optimizacion de imagenes

**Archivo:** `next.config.ts`

Considerar cambiar `images.unoptimized: true` a `false` y configurar los formatos:

```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'fundacionpadrinosdelavejez.es',
    },
  ],
  formats: ['image/avif', 'image/webp'],
},
```

> **Advertencia:** Esto requiere que el servidor de deploy (Dokploy/VPS) tenga `sharp` instalado. Verificar compatibilidad antes de activar. Si no es viable, mantener `unoptimized: true` pero asegurar que las imagenes de WordPress estan optimizadas en origen.

### 3.3 fetchpriority en imagenes LCP

**Archivo:** `src/components/Hero.tsx`

Anadir `fetchPriority="high"` a la imagen del hero (es el LCP de la home):

```tsx
<img
  src="/logos/hero/prueba_hero.webp"
  alt=""
  className="h-full w-full object-cover"
  fetchPriority="high"
/>
```

> Cambiar alt a `""` (vacio) ya que es una imagen decorativa de fondo.

### 3.4 Viewport y themeColor

**Archivo:** `src/app/layout.tsx`

Anadir export de viewport:

```ts
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#700D39',
};
```

---

## PRIORIDAD 4 - MEJORAS ADICIONALES

### 4.1 Trailing slash consistente en footer

**Archivo:** `src/components/Footer.tsx`

Cambiar `href: '/practicas'` a `href: '/practicas/'` para evitar redirect innecesario (el proyecto tiene `trailingSlash: true`).

### 4.2 Links de navegacion a paginas en construccion

Actualmente 4 de 6 items del navbar apuntan a la misma URL externa de "en construccion". Esto diluye el link equity y da mala senal a crawlers.

**Opciones:**
- Crear paginas internas minimas (ej: `/estudio/`, `/contacto/`) con contenido basico y mensaje de "proximamente" - mantiene el link equity interno
- O al menos usar `rel="nofollow"` en los enlaces externos de construccion para no transferir autoridad

### 4.3 Mejorar alt texts

| Archivo | Linea | Actual | Recomendado |
|---|---|---|---|
| `Hero.tsx` | ~72 | `"Fundacion Padrinos de la Vejez"` | `""` (decorativa) |
| `MediaGallery.tsx` | ~385 | `"Miniatura {n}"` | `"{titulo practica} - Imagen {n}"` |

### 4.4 Headers de seguridad y cache

**Archivo:** `next.config.ts`

Anadir headers personalizados:

```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ];
},
```

### 4.5 Paginacion del fetch de practicas

**Archivo:** `src/lib/wordpress.ts` y `src/app/practicas/page.tsx`

Actualmente se piden maximo 100 practicas (`per_page: 100`, page 1). Si el catalogo crece por encima de 100, se perderan practicas. Implementar paginacion que recorra todas las paginas hasta obtener el total (cabecera `X-WP-TotalPages`).

---

## Checklist de implementacion

- [ ] `robots.ts` - Crear archivo
- [ ] `sitemap.ts` - Crear archivo dinamico
- [ ] `layout.tsx` - metadataBase, title template, OG global, twitter, viewport, robots
- [ ] `practicas/page.tsx` - canonical, typing Metadata
- [ ] `practica/[slug]/page.tsx` - canonical, OG dinamico, twitter
- [ ] `JsonLd.tsx` - Crear componente
- [ ] JSON-LD Organization en layout/home
- [ ] JSON-LD BreadcrumbList en detalle
- [ ] JSON-LD Article en detalle
- [ ] JSON-LD CollectionPage en listado
- [ ] Imagen OG por defecto (1200x630) - Crear asset
- [ ] `not-found.tsx` - Crear pagina 404
- [ ] Hero img - fetchPriority + alt vacio
- [ ] Footer - trailing slash consistente
- [ ] Evaluar `images.unoptimized` vs sharp en Dokploy
- [ ] Headers de seguridad en next.config.ts
- [ ] Paginacion completa de practicas (futuro)
- [ ] Links navbar: paginas internas vs nofollow (decision pendiente)

---

## Post-implementacion

1. **Verificar en Google Search Console:**
   - Enviar sitemap
   - Solicitar indexacion de paginas clave
   - Revisar informe de cobertura

2. **Validar structured data:**
   - https://search.google.com/test/rich-results para cada tipo de pagina

3. **Medir Core Web Vitals:**
   - https://pagespeed.web.dev/ para home, listado y detalle

4. **Monitorizar:**
   - Indexacion progresiva en Search Console
   - Posiciones para keywords objetivo
   - CTR en resultados de busqueda
