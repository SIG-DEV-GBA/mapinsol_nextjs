import type { MetadataRoute } from 'next';
import { getBuenasPracticas } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: practicas } = await getBuenasPracticas({ per_page: 100 });

  const practicaUrls = practicas.map((p) => ({
    url: `https://mapinsol.es/practica/${p.slug}/`,
    lastModified: p.dateModified ? p.dateModified.toISOString() : new Date().toISOString(),
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
