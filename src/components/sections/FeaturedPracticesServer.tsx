import { getBuenasPracticas } from '@/lib/wordpress';
import { FeaturedPracticesCarousel } from './FeaturedPractices';

export async function FeaturedPractices() {
  // Obtener prácticas
  const { data: practicas } = await getBuenasPracticas({ per_page: 20 });

  // Filtrar solo las destacadas y limitar a las últimas 5
  const practicasDestacadas = practicas
    .filter((p) => p.practicaDestacada === true)
    .slice(0, 5);

  // Si no hay destacadas, no renderizar nada
  if (practicasDestacadas.length === 0) {
    return null;
  }

  return <FeaturedPracticesCarousel practicas={practicasDestacadas} />;
}
