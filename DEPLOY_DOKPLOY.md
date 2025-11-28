# Despliegue en Dokploy

Guía completa para desplegar la aplicación **Buenas Prácticas Next.js** en un VPS con Dokploy.

---

## ¿Qué es Dokploy?

Dokploy es una plataforma de despliegue self-hosted (alternativa a Vercel/Netlify) que permite:
- Desplegar aplicaciones desde GitHub automáticamente
- Gestionar dominios y certificados SSL
- Configurar variables de entorno
- Escalar aplicaciones con Docker

---

## Requisitos Previos

1. **VPS con Dokploy instalado** 
2. **Repositorio en GitHub:** `https://github.com/SIG-DEV-GBA/mapinsol_nextjs.git`
3. **Dominio configurado** 

---

## Paso 1: Crear Nueva Aplicación en Dokploy

1. Accede al panel de Dokploy en tu VPS
2. Click en **"Create Application"** o **"Nueva Aplicación"**
3. Selecciona **"Application"** (no Docker Compose)

---

## Paso 2: Conectar Repositorio GitHub

1. En **Source**, selecciona **GitHub**
2. Si no está conectado, autoriza Dokploy para acceder a tu cuenta/organización
3. Busca y selecciona el repositorio: `SIG-DEV-GBA/mapinsol_nextjs`
4. **Branch:** `master`

---

## Paso 3: Configuración de Build

### Build Settings

| Campo | Valor |
|-------|-------|
| **Build Path** | `/` (raíz del proyecto) |
| **Build Command** | `npm run build` |
| **Install Command** | `npm install` |
| **Output Directory** | `.next` |

### Runtime Settings

| Campo | Valor |
|-------|-------|
| **Start Command** | `npm run start` |
| **Port** | `3000` |
| **Node Version** | `20` (o superior) |

> **Nota:** Next.js con `output: 'standalone'` genera un servidor Node.js optimizado. Dokploy detectará automáticamente que es una aplicación Next.js.

---

## Paso 4: Variables de Entorno

Esta aplicación **NO requiere variables de entorno obligatorias**.

La URL de WordPress está hardcodeada en el código:
```
https://fundacionpadrinosdelavejez.es/wp-json/wp/v2
```

### Variables Opcionales

Si en el futuro quieres configurar variables:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_BASE_PATH` | Prefijo de rutas (si va en subdirectorio) | `""` (vacío) |
| `NODE_ENV` | Entorno de ejecución | `production` |

---

## Paso 5: Configurar Dominio

### Opción A: Dominio Propio

1. En la sección **"Domains"** de Dokploy
2. Click **"Add Domain"**
3. Introduce tu dominio: `buenaspracticas.tudominio.es`
4. Dokploy generará automáticamente el certificado SSL con Let's Encrypt

### Opción B: Subdominio de Dokploy

Dokploy puede generar un dominio temporal tipo:
```
buenas-practicas-abc123.dokploy.tuservidor.com
```

### Configuración DNS (si usas dominio propio)

En tu proveedor de DNS (Cloudflare, Route53, etc.):

```
Tipo: A
Nombre: buenaspracticas (o @)
Valor: [IP de tu VPS]
TTL: Auto
```

O si usas proxy de Cloudflare:
```
Tipo: CNAME
Nombre: buenaspracticas
Valor: tuservidor.dokploy.com
Proxy: Activado (naranja)
```

---

## Paso 6: Desplegar

1. Click en **"Deploy"** o **"Desplegar"**
2. Dokploy ejecutará:
   - `npm install` - Instalar dependencias
   - `npm run build` - Compilar Next.js
   - Iniciar el servidor en puerto 3000

3. Espera a que el build termine (2-5 minutos primera vez)

---

## Paso 7: Verificar Despliegue

1. Accede a la URL de tu aplicación
2. Verifica que carga la página principal
3. Navega a `/practicas/` para comprobar que los datos de WordPress cargan correctamente

---

## Configuración Avanzada

### Health Checks

Configura un health check para que Dokploy reinicie la app si falla:

```
Path: /
Port: 3000
Interval: 30s
Timeout: 10s
```

### Recursos

Para una aplicación Next.js típica:

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| **RAM** | 512 MB | 1 GB |
| **CPU** | 0.5 cores | 1 core |

### Auto-Deploy

Habilita **"Auto Deploy"** para que cada push a `master` despliegue automáticamente.

---

## Arquitectura del Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     VPS CON DOKPLOY                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     DOKPLOY                           │  │
│  │  ┌─────────────────┐    ┌─────────────────────────┐   │  │
│  │  │  Traefik/Nginx  │───▶│  Container Next.js      │   │  │
│  │  │  (Reverse Proxy)│    │  - Puerto 3000          │   │  │
│  │  │  - SSL/TLS      │    │  - ISR habilitado       │   │  │
│  │  │  - Dominio      │    │  - Standalone output    │   │  │
│  │  └─────────────────┘    └─────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API REST (fetch)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              WORDPRESS (servidor externo)                   │
│         fundacionpadrinosdelavejez.es/wp-json/              │
└─────────────────────────────────────────────────────────────┘
```

---

## ISR (Incremental Static Regeneration)

La aplicación usa ISR para cachear páginas:

- **Páginas se regeneran cada 60 segundos** si hay tráfico
- **Primera visita:** genera la página (puede tardar ~1s)
- **Visitas siguientes:** sirve versión cacheada (instantáneo)
- **Cambios en WordPress:** se reflejan en máximo 60 segundos

### Cómo funciona en Dokploy

```
Usuario visita /practicas/
        │
        ▼
┌───────────────────┐
│ ¿Página en caché? │
└───────────────────┘
        │
   ┌────┴────┐
   │         │
  Sí        No
   │         │
   ▼         ▼
Sirve      Genera página
caché      desde WordPress
   │         │
   │    ┌────┴────┐
   │    │         │
   │   Guarda    Sirve
   │   en caché  al usuario
   │    │         │
   └────┴─────────┘
        │
        ▼
¿Han pasado 60s desde última generación?
        │
   ┌────┴────┐
   │         │
  Sí        No
   │         │
   ▼         │
Regenera    │
en background│
   │         │
   └─────────┘
```

---

## Troubleshooting

### Error: Build failed

```bash
# Verifica los logs en Dokploy
# Sección "Deployments" > Click en el deployment fallido > "Logs"
```

**Causas comunes:**
- Node version incorrecta (necesita 20+)
- Error de TypeScript (ejecuta `npm run build` localmente primero)

### Error: 502 Bad Gateway

La aplicación no está corriendo o el puerto es incorrecto.

1. Verifica que el puerto sea `3000`
2. Revisa los logs de la aplicación
3. Comprueba que el Start Command es `npm run start`

### Error: Datos no cargan

La API de WordPress no responde.

1. Verifica que `https://fundacionpadrinosdelavejez.es/wp-json/wp/v2/buenas_practicas_ast` responde
2. Comprueba que no hay bloqueo de CORS (no debería haberlo, es server-side)

### Error: Imágenes no cargan

1. Verifica que el dominio de WordPress está en `next.config.ts`:
```typescript
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'fundacionpadrinosdelavejez.es',
  }],
}
```

---

## Comandos Útiles

### Forzar Redespliegue

En Dokploy, click en **"Redeploy"** para forzar un nuevo build.

### Ver Logs en Tiempo Real

En la sección **"Logs"** de tu aplicación en Dokploy.

### Reiniciar Aplicación

Click en **"Restart"** si la aplicación se comporta de forma extraña.

---

## Checklist de Despliegue

- [ ] Repositorio conectado a Dokploy
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm run start`
- [ ] Puerto: `3000`
- [ ] Node version: `20`
- [ ] Dominio configurado
- [ ] SSL/HTTPS habilitado
- [ ] Health check configurado
- [ ] Auto-deploy habilitado (opcional)
- [ ] Verificar que la home carga
- [ ] Verificar que `/practicas/` muestra datos
- [ ] Verificar que una práctica individual carga

---

## Soporte

Si tienes problemas:

1. Revisa los logs de Dokploy
2. Ejecuta `npm run build` localmente para verificar que compila
3. Comprueba la API de WordPress manualmente
4. Contacta al equipo de desarrollo
