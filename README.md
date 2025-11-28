# Catálogo de Buenas Prácticas

**Fundación Padrinos de la Vejez**

Aplicación web para explorar y visualizar buenas prácticas en atención a personas mayores. Desarrollada con **Next.js 16** y conectada a **WordPress** como CMS headless.

---

## Arquitectura

```
┌─────────────────────┐         ┌─────────────────────┐
│                     │         │                     │
│   WordPress + WP    │  REST   │   Next.js App       │
│   JetEngine CPT     │ ◄─────► │   (ISR enabled)     │
│                     │  API    │                     │
│   - Buenas Prácticas│         │   - SSR/ISR Pages   │
│   - Categorías      │         │   - React Components│
│   - Etiquetas       │         │   - Tailwind CSS    │
│                     │         │                     │
└─────────────────────┘         └─────────────────────┘
     (CMS Backend)                  (Frontend VPS)
```

### Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.0.5 | Framework React con App Router |
| React | 19.2.0 | Librería UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos utility-first |
| Lucide React | 0.555 | Iconos |
| Swiper | 12.x | Carruseles y galerías |

---

## Estructura del Proyecto

```
src/
├── app/                          # App Router (páginas)
│   ├── layout.tsx                # Layout principal con Navbar/Footer
│   ├── page.tsx                  # Página de inicio (/)
│   ├── practicas/
│   │   └── page.tsx              # Listado con filtros (/practicas)
│   └── practica/
│       └── [slug]/
│           └── page.tsx          # Detalle de práctica (/practica/[slug])
│
├── components/                   # Componentes React
│   ├── Navbar.tsx                # Navegación principal
│   ├── Footer.tsx                # Pie de página con redes sociales
│   ├── Hero.tsx                  # Hero de la home con categorías
│   ├── PracticaCard.tsx          # Tarjeta de práctica (listado)
│   ├── ScrollToTop.tsx           # Botón flotante volver arriba
│   │
│   ├── practicas/                # Componentes del listado
│   │   ├── HeroSearch.tsx        # Hero de /practicas
│   │   ├── PracticasFilters.tsx  # Barra de filtros avanzados
│   │   ├── FilterDropdown.tsx    # Dropdown individual de filtro
│   │   ├── PracticasGrid.tsx     # Grid responsive de tarjetas
│   │   ├── PracticasClient.tsx   # Wrapper con estado de filtros
│   │   └── Pagination.tsx        # Paginación
│   │
│   ├── practica/                 # Componentes del detalle
│   │   ├── PracticaHeader.tsx    # Cabecera con imagen y título
│   │   ├── PracticaContent.tsx   # Contenido en acordeones
│   │   ├── PracticaSidebar.tsx   # Sidebar con metadata
│   │   ├── MediaGallery.tsx      # Galería de imágenes y video
│   │   └── RelatedPracticas.tsx  # Prácticas relacionadas
│   │
│   ├── sections/                 # Secciones de la home
│   │   ├── LatestPractices.tsx   # Últimas prácticas
│   │   └── FeaturedPracticesServer.tsx  # Prácticas destacadas
│   │
│   └── ui/                       # Componentes UI reutilizables
│       ├── StatusBadge.tsx       # Badge de estado
│       ├── PdfBadge.tsx          # Indicador PDF disponible
│       ├── HighlightBadge.tsx    # Badge de destacada
│       └── CategoryIcon.tsx      # Icono por categoría
│
├── lib/                          # Utilidades y servicios
│   ├── wordpress.ts              # Cliente API WordPress REST
│   ├── utils.ts                  # Funciones helper generales
│   └── labelMappings.ts          # Mapeo de labels y acrónimos
│
└── types/                        # Definiciones TypeScript
    └── index.ts                  # Interfaces (BuenaPractica, etc.)
```

---

## Instalación

### Requisitos

- Node.js 20.x o superior
- npm

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (hot reload)
npm run dev

# Abrir http://localhost:3000
```

### Build de Producción

```bash
# Generar build optimizado
npm run build

# Ejecutar servidor de producción
npm run start
```

---

## Despliegue en Dokploy (VPS)

### Configuración en Dokploy

1. **Conectar repositorio GitHub**

2. **Build settings:**
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Puerto: `3000`

3. **Variables de entorno:** No se requieren

4. **Dominio:** Configurar DNS apuntando al VPS

### ISR (Incremental Static Regeneration)

Las páginas usan ISR con revalidación cada 60 segundos:

```typescript
// En cada página con ISR
export const revalidate = 60;
```

**Funcionamiento:**
1. Primera visita → genera página estática
2. Visitas siguientes → sirve versión cacheada
3. Cada 60s → regenera en background si hay tráfico

---

## API de WordPress

### Endpoints

| Endpoint | Descripción |
|----------|-------------|
| `/wp-json/wp/v2/buenas_practicas_ast` | Buenas prácticas |
| `/wp-json/wp/v2/category-practices` | Categorías |
| `/wp-json/wp/v2/tags-practices` | Etiquetas |
| `/wp-json/wp/v2/media/{id}` | Imágenes/archivos |

### Campos JetEngine

El CPT `buenas_practicas_ast` incluye estos meta fields:

**Información básica:**
- `entidad_responsable` - Nombre de la entidad
- `url_entidad` - Web de la entidad
- `a_o_de_inicio` - Año de inicio
- `estado_actual` - En curso / Finalizado / En pausa
- `tipo_de_entorno` - Domicilio / Centro / Residencia

**Ubicación:**
- `ambito_territorial` - Local / Regional / Nacional / Internacional
- `internacional_boolean` - Si es internacional
- `country` - País (si internacional)
- `ccaa` - Comunidad Autónoma
- `provincia` - Provincia
- `municipio` - Municipio

**Contenido:**
- `objetivo_principal` - Objetivo de la práctica
- `actividades_desarrolladas` - Actividades (HTML)
- `metodolog_a_aplicada` - Metodología (HTML)
- `resultados_obtenidos` - Resultados (HTML)
- `lecciones_aprendidas` - Lecciones (HTML)
- `nivel_de_transferibilidad` - Alta / Media / Baja

**Destinatarios:**
- `poblacion_destinataria` - Checkbox group
- `agentes_implicados` - Checkbox group

**Media:**
- `enlace_video` - URL de YouTube
- `pdf_buena_practica` - ID del PDF
- `anexos` - IDs de imágenes (galería)

**Otros:**
- `personas_de_contacto` - Repeater con datos de contacto
- `mostrar_contacto` - Si mostrar contacto públicamente
- `practica_destacada` - Si es destacada

---

## Filtros Disponibles

La página `/practicas` incluye filtros por:

| Grupo | Filtros |
|-------|---------|
| **Temática** | Categoría, Etiquetas |
| **Destinatarios** | Población, Agentes |
| **Ubicación** | CCAA, Internacional |
| **Tiempo** | Año de inicio, Estado |

Los filtros se sincronizan con la URL para compartir enlaces filtrados.

---

## Personalización

### Colores Corporativos

```css
/* Morado corporativo */
#700D39  /* Principal */
#6B1E3D  /* Footer */
#8B1048  /* Hover */

/* Naranja corporativo */
#FF6900  /* Acentos y CTAs */
```

### Añadir Nueva Categoría

1. Crear en WordPress (Taxonomía `category-practices`)
2. Añadir icono en `src/components/Hero.tsx`
3. Opcional: añadir color en `src/lib/labelMappings.ts`

### Cambiar Tiempo de ISR

Modificar `revalidate` en las páginas:

```typescript
// src/app/practicas/page.tsx
export const revalidate = 120; // 2 minutos
```

---

## Scripts

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

---

## Licencia

Proyecto privado - Fundación Padrinos de la Vejez
