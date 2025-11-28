import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getBuenasPracticas } from '@/lib/wordpress';
import { PracticaCard } from '@/components/PracticaCard';

export async function LatestPractices() {
  const { data: practicas } = await getBuenasPracticas({ per_page: 6 });

  if (practicas.length === 0) {
    return null;
  }

  return (
    <section className="relative pt-20 pb-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#700D39] lg:text-4xl mb-3">
              Últimas Buenas Prácticas
            </h2>
            <p className="text-lg text-gray-600">
              Las iniciativas más recientes añadidas a nuestra base de datos
            </p>
          </div>

          <Link
            href="/practicas/"
            className="hidden items-center gap-2 text-[#FF6900] font-semibold hover:gap-3 transition-all lg:inline-flex"
          >
            Ver todas
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Grid de Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {practicas.map((practica) => (
            <PracticaCard key={practica.id} practica={practica} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center lg:hidden">
          <Link
            href="/practicas/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FF6900] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Ver todas las prácticas
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
