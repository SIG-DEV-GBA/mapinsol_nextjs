# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mapinsol Buenas Prácticas** - A headless Next.js frontend consuming WordPress REST API. Displays a catalog of "buenas prácticas" (best practices) for elderly care from Fundación Padrinos de la Vejez.

- **Production URL**: https://mapinsol.es
- **WordPress API**: https://fundacionpadrinosdelavejez.es/wp-json/wp/v2
- **Deployment**: VPS with Dokploy (standalone output)

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (includes standalone copy)
npm run start    # Run production server (node .next/standalone/server.js)
npm run lint     # Run ESLint
```

## Architecture

### Headless CMS Pattern
```
WordPress (JetEngine CPT) → REST API → Next.js (App Router) → Static/ISR Pages
```

- **Data source**: WordPress CPT `buenas_practicas_ast` with JetEngine meta fields
- **Custom taxonomies**: `category-practices`, `tags-practices`
- **Caching**: ISR with 60s revalidation for practices, 5min for taxonomies

### Key Files

| Path | Purpose |
|------|---------|
| `src/lib/wordpress.ts` | WordPress API client with type-safe parsing |
| `src/types/index.ts` | TypeScript interfaces for BuenaPractica, Estudio, taxonomies |
| `src/app/practicas/page.tsx` | Catalog page prácticas (Server Component + Client filtering) |
| `src/app/practica/[slug]/page.tsx` | Detail page prácticas with `generateStaticParams` |
| `src/app/estudios/page.tsx` | Catalog page estudios con hero y grid |
| `src/app/estudio/[slug]/page.tsx` | Detail page estudio con sidebar y secciones colapsables |
| `src/app/actualidad/page.tsx` | Listing page actualidad con filtros por tipo |
| `src/app/actualidad/[slug]/page.tsx` | Detail page actualidad con secciones dinámicas |
| `next.config.ts` | Standalone output, security headers, image domains |

### Component Organization

```
src/components/
├── practicas/       # Catalog page prácticas (grid, filters, pagination)
├── practica/        # Detail page prácticas (gallery, sidebar, content)
├── actualidad/      # ActualidadCard para sección Actualidad
├── estudios/        # Estudios cards y componentes (EstudioCard)
├── sections/        # Homepage sections (hero, featured)
├── ui/              # Reusable UI (badges, icons, SafeHtml, MediaGallery)
└── seo/             # JsonLd structured data
```

### JetEngine Field Parsing

WordPress meta fields use JetEngine naming (Spanish with special chars). The `parseBuenaPractica()` function in `wordpress.ts` transforms them:

```typescript
// Example: meta.descripci_n_del_grupo → descripcionGrupo
// Repeaters can be arrays or indexed objects { "item-0": {...} }
// Checkbox groups are { option: "true"/"false" }
```

## Conventions

- **Path alias**: `@/*` maps to `src/*`
- **Fonts**: Poppins (headings), Nunito (subheadings), Lato (body) via CSS variables
- **Styling**: Tailwind CSS v4 with PostCSS
- **HTML sanitization**: DOMPurify via `SafeHtml` component for WordPress content

## ISR Strategy

| Content | Revalidation |
|---------|-------------|
| Practices list/detail | 60 seconds |
| Categories/Tags | 5 minutes |
| Media/PDFs | 1 hour |
| Slugs (for SSG) | 1 hour |

## Historial de Decisiones

- SEO implementation completed (sitemap, robots, JSON-LD, meta tags)
- Google Analytics (G-Z222Z7CJWF) added with afterInteractive strategy
- Google Search Console verification file added
- Navigation links updated (Boletines → construction page)
- GA scripts moved from head to body for proper loading
- CPT Estudios implementado:
  - Especificación en `docs/CPT_ESTUDIOS.md`
  - Metabox JSON para JetEngine en `docs/jetengine-estudios-metabox.json`
  - CPT slug: `estudios-mapinsol`
  - Frontend completo: tipos, API, componentes, páginas listado y detalle
- Navbar reorganizado:
  - Eliminados "Inicio" y "Sugerencias"
  - Orden: Estudio → Iniciativas eficaces → Actualidad y comunicación ▾ (dropdown) → Contacto
  - Estudio apunta a `/estudios/` (ya no a página de construcción)
  - Logo FPV + Mapinsol a la izquierda con separador fino
  - Dropdown "Actualidad" con 7 items: Todo, Boletines, Notas de prensa, Eventos, Talleres, Videos, Infografías
  - Mobile: accordion colapsable para Actualidad
- Color de hover cambiado de #FF6900 a #F29429
- Hero actualizado: "Buenas Prácticas exitosas que Transforman Vidas"
- Página de contacto (`/contacto/`) con formulario SMTP (nodemailer)
- Página de boletines (`/boletines/`) con integración Mailchimp:
  - API Key y Audience ID en .env
  - MMERGE7 para campo sexo (no MERGE7)
  - Funcionalidad de suscripción, baja y re-suscripción
- GDPR/Cookies implementado:
  - CookieBanner.tsx con consentimiento y configuración
  - `/privacidad/` página de política de privacidad
  - `/cookies/` página de política de cookies
  - Enlaces actualizados en Footer
- CPT Actualidad implementado:
  - CPT slug: `actualidad-mapinsol`
  - Metabox JSON con tabs: `docs/jetengine-actualidad-metabox.json`
  - Un solo CPT con campo `tipo_contenido` (boletin, nota_prensa, evento, taller, video, infografia)
  - Campos condicionales por tipo organizados en tabs
  - Frontend completo: tipos, API, ActualidadCard, listado con filtros, detalle con secciones dinámicas
  - `/actualidad/` listado con filtros por tipo via searchParams
  - `/actualidad/[slug]/` detalle con video embed, PDF, evento, infografía, etc.
- Hero actualizado con descripción MAPINSOL debajo de iconos de categorías
- MediaGallery unificado como componente reutilizable:
  - `src/components/ui/MediaGallery.tsx` — galería con grid, swap, lightbox, YouTube, badges opcionales
  - Reemplaza 3 implementaciones separadas (practica/MediaGallery, estudios/EstudioGallery, actualidad/ImageGallery)
  - Props: `imagenes`, `youtubeId?`, `title`, `practicaDestacada?`, `estadoActual?`, `compact?`, `layout?`
  - `compact` mode: tamaños menores, wrapper card con header "Galería" (usado en estudio)
  - `layout="stacked"`: imagen principal full-width arriba, miniaturas en fila debajo (usado en actualidad)
  - `layout="grid"` (default): grid 2x4 con main 2x2 + thumbnails (usado en practica)
  - Lightbox estilo infografía: fondo transparente oscuro, backdrop-blur, fade-in, scale-in, hint "Pulsa en cualquier lugar para cerrar"
  - Thumbnails dinámicos: al cambiar la imagen principal, las miniaturas se recalculan (excluyen la principal actual)
  - Featured image se incluye en galería automáticamente (practica y actualidad)
  - Exporta `MediaItem` type para uso en otros componentes
- Campos evento/taller renombrados:
  - `hora_evento` → `hora_inicio` (horaInicio) / `duracion_evento` → `hora_fin` (horaFin)
  - Labels: "Hora de inicio" / "Hora de fin"
- Google Maps embed en eventos/talleres:
  - Iframe gratuito sin API key: `google.com/maps?q=ADDRESS&output=embed`
  - Añade ", España" automáticamente si no lo incluye
  - Link "Abrir en Google Maps" debajo del mapa
- Boletín: añadido campo `enlace_interes_boletin` (enlaceInteresBoletin) — link externo en sidebar
- Fallback de imagen en cards de actualidad:
  - Cadena: featured_media → galeria[0] → infografia_imagen → YouTube thumbnail
  - YouTube thumbnail: `https://img.youtube.com/vi/{ID}/hqdefault.jpg`

- Hero carousel con 2 slides (Buenas Prácticas + Estudio) con crossfade transitions
- Navbar mobile: transiciones suaves (800ms), touch targets grandes (56px/48px)
- `/actualidad/` responsive mejorado con wave SVG y filtros touch-friendly
- GTranslate i18n: ES, EN, GL, CA, EU con LanguageSwitcher flotante custom
  - circle-flags para banderas SVG en `/public/flags/`
  - Oculta widget default de GTranslate con CSS
  - Fade-out al scroll >80px
- Developer signature: `firma()` en consola (public/df.js, base64, SHA-256)
- Email unificado: `mapinsol@fundacionpadrinosdelavejez.es` en footer, contacto, privacidad, cookies
- AccessibilityWidget extraído como paquete npm `fpvsi-a11y-widget`:
  - Repo: `https://github.com/SIG-DEV-GBA/accesibility_widged.git`
  - Ruta local: `C:\Users\Usuario\Desktop\accesibility_widged`
  - Import en layout.tsx: `from "fpvsi-a11y-widget"` (ya no desde `@/components/AccessibilityWidget`)
  - CSS puro (BEM + CSS vars), sin dependencia de Tailwind
  - Props configurables: `colors`, `position`, `features`, `languages`, `ttsLang`, `labels`, `storageKey`, `zIndex`
  - CSS inyectado en runtime via `<style id="fpvsi-a11y-styles">`
  - 7 CSS custom properties derivadas de 2 colores (primary + accent)
  - Build: tsup → ESM + CJS + .d.ts con `'use client'` banner
  - Peer deps: react, react-dom, lucide-react
  - El componente local `src/components/AccessibilityWidget.tsx` se mantiene como referencia pero ya no se importa
  - CSS de globals.css (`.a11y-*` classes) ahora se inyecta desde el paquete; se puede eliminar del globals.css

## Contexto de la Sesión

- Build compila correctamente
- Dev server funciona en todas las rutas
- Formularios funcionando: contacto (SMTP) y boletines (Mailchimp)
- Datos geográficos en `src/lib/geografiaEspana.ts`
- Type declaration para Mailchimp en `src/types/mailchimp.d.ts`
- `/estudios/` tiene layout adaptativo: 1 estudio → hero featured grande; 2+ → grid de cards
- Pendiente: evento/taller no tienen galería en JetEngine → sin imagen en cards si no ponen featured_media en WP
- Pendiente: refinar detalle de tipo video (similar a infografía)
- Pendiente: publicar `fpvsi-a11y-widget` en npm (requiere `npm login`)
