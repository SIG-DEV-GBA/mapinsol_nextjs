/**
 * =============================================================================
 * CONFIGURACIÓN DE NEXT.JS
 * =============================================================================
 *
 * Este archivo configura el comportamiento del framework para:
 * - Despliegue en VPS con Dokploy (output standalone)
 * - Conexión con WordPress como CMS headless
 * - ISR (Incremental Static Regeneration) para páginas estáticas
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * OUTPUT STANDALONE
   * -----------------
   * Genera un build optimizado para servidores Node.js independientes.
   * Incluye solo los archivos necesarios para producción.
   * Requerido para despliegue en VPS con Dokploy.
   *
   * El build genera: .next/standalone/
   */
  output: 'standalone',

  /**
   * BASE PATH
   * ---------
   * Prefijo para todas las rutas de la aplicación.
   * - Vacío = dominio raíz (https://tudominio.com/)
   * - '/subdir' = subdirectorio (https://tudominio.com/subdir/)
   *
   * Configurable via variable de entorno NEXT_PUBLIC_BASE_PATH
   */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  /**
   * TRAILING SLASH
   * --------------
   * Añade "/" al final de las URLs para consistencia.
   * Ejemplo: /practicas/ en lugar de /practicas
   *
   * Beneficios:
   * - Mejor SEO (evita redirecciones)
   * - URLs consistentes
   */
  trailingSlash: true,

  /**
   * IMÁGENES REMOTAS
   * ----------------
   * Configuración para cargar imágenes desde WordPress.
   * Solo permite imágenes del dominio de la fundación.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fundacionpadrinosdelavejez.es',
        pathname: '/wp-content/uploads/**', // Solo carpeta de uploads
      },
    ],
    /**
     * OPTIMIZACIÓN DESACTIVADA
     * Usa las imágenes de WordPress directamente sin procesar.
     * Razones:
     * - Evita problemas de caché entre servidores
     * - Reduce carga del servidor Next.js
     * - Las imágenes ya están optimizadas en WordPress
     */
    unoptimized: true,
  },

  /**
   * CONFIGURACIÓN EXPERIMENTAL
   * --------------------------
   * Funcionalidades en fase experimental de Next.js.
   */
  experimental: {
    // Server Actions: permite formularios y mutaciones del servidor
    serverActions: {
      bodySizeLimit: '2mb', // Límite para uploads
    },
  },
};

export default nextConfig;
