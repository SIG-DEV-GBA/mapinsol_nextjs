# CPT Estudios - Especificación JetEngine

> Documentación técnica para la creación del Custom Post Type "Estudios" en WordPress con JetEngine.

## Información del CPT

| Propiedad | Valor |
|-----------|-------|
| **Slug CPT** | `estudios` |
| **Nombre singular** | Estudio |
| **Nombre plural** | Estudios |
| **Icono Dashicons** | `dashicons-media-document` |
| **Soporta** | title, thumbnail, excerpt |
| **API REST** | Habilitado |

---

## Taxonomías Personalizadas

### 1. Categorías de Estudios
| Propiedad | Valor |
|-----------|-------|
| **Slug** | `category-estudios` |
| **Jerárquica** | Sí |
| **Ejemplos** | Soledad, Envejecimiento activo, Políticas públicas, Participación social |

### 2. Etiquetas de Estudios
| Propiedad | Valor |
|-----------|-------|
| **Slug** | `tags-estudios` |
| **Jerárquica** | No |
| **Ejemplos** | Rural, Género, Tercer Sector, Europa |

---

## Metaboxes JetEngine

### Sección 1: Información General

| Campo | Slug JetEngine | Tipo | Opciones/Notas |
|-------|----------------|------|----------------|
| Promotor/Entidad | `promotor` | Text | Nombre de la entidad responsable |
| URL del promotor | `url_promotor` | Text | Sitio web de la entidad |
| Logo promotor | `logo_promotor` | Media (Image) | Logo para mostrar en sidebar |
| Tipo de promotor | `tipo_promotor` | Select | Ver opciones abajo |
| Ámbito geográfico | `ambito_geografico` | Select | Local, Regional, Estatal, Europeo, Internacional |
| País | `pais` | Text | Solo si ámbito es Internacional/Europeo |
| Comunidad Autónoma | `ccaa` | Select | Lista de CCAA españolas |
| Año de publicación | `anio_publicacion` | Text | Formato: 2024 |
| Año inicio (rango) | `anio_inicio` | Text | Para marcos estratégicos: 2026 |
| Año fin (rango) | `anio_fin` | Text | Para marcos estratégicos: 2030 |

**Opciones `tipo_promotor`:**
```
- administracion_central: Administración Central
- administracion_autonomica: Administración Autonómica
- administracion_local: Administración Local
- universidad: Universidad
- fundacion: Fundación
- ong: ONG / Asociación
- organismo_europeo: Organismo Europeo
- organismo_internacional: Organismo Internacional
- empresa: Empresa / Consultoría
- otro: Otro
```

---

### Sección 2: Contenido Principal

| Campo | Slug JetEngine | Tipo | Notas |
|-------|----------------|------|-------|
| Descripción/Resumen | `descripcion` | WYSIWYG | Descripción general del estudio |
| Objetivos | `objetivos` | WYSIWYG | Lista de objetivos (admite HTML) |
| A quién se dirige | `destinatarios` | WYSIWYG | Público objetivo / beneficiarios |
| Metodología | `metodologia` | WYSIWYG | Metodología aplicada |
| Resultados | `resultados` | WYSIWYG | Principales resultados obtenidos |
| Conclusiones | `conclusiones` | WYSIWYG | Conclusiones y recomendaciones |

---

### Sección 3: Documentos Descargables (Repeater)

**Nombre del Repeater:** `documentos_descarga`

| Campo | Slug | Tipo | Notas |
|-------|------|------|-------|
| Archivo | `archivo` | Media (File) | PDF, DOC, etc. |
| Nombre del documento | `nombre_documento` | Text | Ej: "Informe Final" |
| Tipo de documento | `tipo_documento` | Select | Ver opciones abajo |
| Idioma | `idioma` | Select | ESP, EN, FR, etc. |
| Descripción breve | `descripcion_doc` | Textarea | Opcional |

**Opciones `tipo_documento`:**
```
- informe_completo: Informe Completo
- informe_ejecutivo: Informe Ejecutivo / Resumen
- guia: Guía de Buenas Prácticas
- infografia: Infografía
- presentacion: Presentación
- anexo: Anexo
- otro: Otro documento
```

**Opciones `idioma`:**
```
- es: Español
- en: Inglés
- fr: Francés
- pt: Portugués
- ca: Catalán
- eu: Euskera
- gl: Gallego
```

---

### Sección 4: Enlaces Externos (Repeater)

**Nombre del Repeater:** `enlaces_externos`

| Campo | Slug | Tipo | Notas |
|-------|------|------|-------|
| Texto del enlace | `texto_enlace` | Text | Descripción visible |
| URL | `url_enlace` | Text | URL completa |
| Tipo de recurso | `tipo_recurso` | Select | Ver opciones abajo |
| Es descarga directa | `es_descarga` | Switcher | true/false |

**Opciones `tipo_recurso`:**
```
- documento: Documento PDF
- web: Página web
- video: Video
- noticia: Noticia
- boe: BOE / Legislación
- doi: DOI / Publicación científica
```

---

### Sección 5: Estudios Relacionados (Repeater)

**Nombre del Repeater:** `estudios_linea`

| Campo | Slug | Tipo | Notas |
|-------|------|------|-------|
| Año | `anio_estudio` | Text | Ej: "2023" |
| Título | `titulo_estudio` | Text | Nombre del estudio |
| URL | `url_estudio` | Text | Enlace al estudio |
| Es interno | `es_interno` | Switcher | Si es un estudio del mismo CPT |
| ID interno | `id_interno` | Posts (relación) | Seleccionar estudio del CPT |

---

### Sección 6: Multimedia

| Campo | Slug JetEngine | Tipo | Notas |
|-------|----------------|------|-------|
| Galería de imágenes | `galeria` | Gallery | Infografías, gráficos |
| Video principal | `enlace_video` | Text | URL YouTube/Vimeo |
| Imagen destacada alternativa | `imagen_og` | Media (Image) | Para OpenGraph si difiere |

---

### Sección 7: Configuración de Visibilidad

| Campo | Slug JetEngine | Tipo | Notas |
|-------|----------------|------|-------|
| Estudio destacado | `estudio_destacado` | Switcher | Aparece en home/destacados |
| Mostrar en slider | `mostrar_slider` | Switcher | Para carrusel principal |
| Orden de prioridad | `orden` | Number | Para ordenación manual |
| Ocultar descargas | `ocultar_descargas` | Switcher | Si no tiene docs públicos |

---

## Estructura Visual Esperada

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Título + Badges (tipo, ámbito, año)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────┐  ┌──────────────────────┐ │
│  │                             │  │ SIDEBAR              │ │
│  │  CONTENIDO PRINCIPAL        │  │ - Logo promotor      │ │
│  │  - Descripción              │  │ - Datos: promotor,   │ │
│  │  - Objetivos                │  │   tipo, ámbito, año  │ │
│  │  - Destinatarios            │  │ - Enlaces externos   │ │
│  │  - Metodología              │  │                      │ │
│  │  - Resultados               │  ├──────────────────────┤ │
│  │  - Conclusiones             │  │ DESCARGAS            │ │
│  │                             │  │ - Lista de PDFs      │ │
│  │                             │  │   con iconos         │ │
│  └─────────────────────────────┘  └──────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ESTUDIOS RELACIONADOS (misma línea de investigación)       │
├─────────────────────────────────────────────────────────────┤
│ RELACIONADOS POR CATEGORÍA (cards similares a prácticas)   │
└─────────────────────────────────────────────────────────────┘
```

---

## Ejemplo de Respuesta API

```json
{
  "id": 1234,
  "slug": "marco-estrategico-soledades-2026-2030",
  "title": { "rendered": "Marco estratégico estatal de las soledades 2026-2030" },
  "featured_media": 5678,
  "category-estudios": [12, 15],
  "tags-estudios": [8, 9, 10],
  "meta": {
    "promotor": "Ministerio de Derechos Sociales, Consumo y Agenda 2030",
    "url_promotor": "https://www.mdsocialesa2030.gob.es",
    "tipo_promotor": "administracion_central",
    "ambito_geografico": "Estatal",
    "anio_publicacion": "2024",
    "anio_inicio": "2026",
    "anio_fin": "2030",
    "descripcion": "<p>El Marco estratégico estatal...</p>",
    "objetivos": "<ul><li>Objetivo 1...</li></ul>",
    "destinatarios": "<p>Administraciones públicas...</p>",
    "resultados": "<p>Principales resultados...</p>",
    "documentos_descarga": [
      {
        "archivo": 9001,
        "nombre_documento": "Marco estratégico completo",
        "tipo_documento": "informe_completo",
        "idioma": "es"
      },
      {
        "archivo": 9002,
        "nombre_documento": "Resumen ejecutivo",
        "tipo_documento": "informe_ejecutivo",
        "idioma": "es"
      }
    ],
    "enlaces_externos": [
      {
        "texto_enlace": "Barómetro de la soledad no deseada en España 2024",
        "url_enlace": "https://...",
        "tipo_recurso": "documento",
        "es_descarga": "true"
      }
    ],
    "estudio_destacado": "true"
  }
}
```

---

## Notas de Implementación

### Diferencias con CPT Buenas Prácticas

| Aspecto | Buenas Prácticas | Estudios |
|---------|------------------|----------|
| Enfoque | Iniciativas/programas activos | Documentos/investigaciones |
| Descargas | PDF único + anexos | Múltiples docs tipificados |
| Ubicación | Detallada (CCAA, provincia, municipio) | General (ámbito geográfico) |
| Contacto | Personas de contacto | Solo entidad promotora |
| Evaluación | Indicadores, resultados, lecciones | Metodología, conclusiones |

### Campos a Reutilizar de Buenas Prácticas

- Sistema de categorías/etiquetas (estructura similar)
- Componentes UI: badges, cards, sidebar
- SafeHtml para contenido WYSIWYG
- Galería de medios (adaptada)

### Consideraciones SEO

- `generateStaticParams` para pre-renderizar todas las páginas
- Metadatos dinámicos desde título + descripción
- JSON-LD tipo `ScholarlyArticle` o `Report`
- Breadcrumbs: Inicio > Estudios > [Categoría] > [Título]
