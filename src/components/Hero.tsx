import { getCategorias } from '@/lib/wordpress';
import { expandAcronyms } from '@/lib/labelMappings';
import { HeroCarousel } from './HeroCarousel';

export async function Hero() {
  const categorias = await getCategorias();

  const categoriasData = categorias
    .filter(cat => cat.count > 0)
    .slice(0, 7)
    .map(cat => ({
      id: cat.id,
      name: expandAcronyms(cat.name),
      iconName: cat.description || undefined,
      href: `/practicas/?categoria=${encodeURIComponent(cat.name)}`,
    }));

  return <HeroCarousel categorias={categoriasData} />;
}
