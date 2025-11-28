import { Sparkles, Heart, Users } from 'lucide-react';

interface HeroSearchProps {
  total: number;
  entidades: number;
}

export function HeroSearch({ total, entidades }: HeroSearchProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#FF6900] via-[#FF6900] to-amber-500 pt-8 pb-12 overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-300 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Banco de Buenas Prácticas</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Explora Buenas Prácticas
          </h1>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Descubre iniciativas innovadoras en atención y cuidado de personas mayores
          </p>

          {/* Stats rápidas */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <StatCard icon={Heart} value={total} label="Prácticas disponibles" />
            <StatCard icon={Users} value={entidades} label="Entidades participantes" />
          </div>
        </div>
      </div>

      {/* Wave decorativo */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto block">
          <path
            d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}

function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-sm">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-left">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-white/80">{label}</p>
      </div>
    </div>
  );
}
