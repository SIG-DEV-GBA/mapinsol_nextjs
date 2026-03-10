import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-lg">
        <p className="text-8xl font-bold text-[#700D39] mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#700D39] px-6 py-3 text-base font-semibold text-white shadow transition-all duration-300 hover:bg-[#5a0a2e] hover:shadow-lg"
          >
            Ir al inicio
          </Link>
          <Link
            href="/practicas/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#FF6900] px-6 py-3 text-base font-semibold text-[#FF6900] transition-all duration-300 hover:bg-[#F29429] hover:text-white"
          >
            Ver buenas prácticas
          </Link>
        </div>
      </div>
    </main>
  );
}
