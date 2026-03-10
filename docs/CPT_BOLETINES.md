# CPT Boletines - Especificación

## Configuración del CPT en WordPress

### Datos básicos
- **Nombre**: Boletines
- **Slug**: `boletines-mapinsol`
- **Icono**: dashicons-media-document
- **Público**: Sí
- **Mostrar en REST API**: Sí
- **Soporte**: title, editor, thumbnail, excerpt

### Campos nativos de WordPress
| Campo | Uso |
|-------|-----|
| `title` | Título del boletín |
| `content` | Contenido completo (opcional, si no es solo PDF) |
| `excerpt` | Extracto automático |
| `featured_media` | Imagen de portada |
| `date` | Fecha de publicación |
| `slug` | URL amigable |

### Meta campos JetEngine
| Campo interno | Nombre visible | Tipo | Descripción |
|---------------|----------------|------|-------------|
| `descripcion_corta` | Descripción corta | textarea | Resumen breve (máx. 200 chars) |
| `pdf_boletin` | PDF del Boletín | media (PDF) | Archivo PDF descargable |
| `numero_edicion` | Número de edición | number | Ej: 1, 2, 3... |
| `fecha_publicacion` | Fecha de publicación | date | Fecha del boletín |

## Endpoints REST API

```
GET /wp-json/wp/v2/boletines-mapinsol
GET /wp-json/wp/v2/boletines-mapinsol?slug={slug}
GET /wp-json/wp/v2/boletines-mapinsol/{id}
```

## Importar metabox en JetEngine

1. Ir a JetEngine → Meta Boxes
2. Importar el archivo `jetengine-boletines-metabox.json`
3. Verificar que el metabox aparece en el CPT boletines-mapinsol

## Estructura Frontend

- **Listado**: `/boletines/` - Grid de boletines + formularios de suscripción
- **Detalle**: `/boletin/[slug]/` - Página individual del boletín
