import { FileText } from 'lucide-react';

// PDF URL
const INFORME_PDF_URL = 'https://fundacionpadrinosdelavejez.es/wp-content/uploads/2026/06/Informe_resultados_Mapinsol_v3.pdf';

export function InformeResultados() {
  return (
    <section className="bg-white pt-4 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Title */}
          <h2 className="text-3xl font-poppins text-[#A10D5E] lg:text-4xl mb-4">
            Informe de{' '}
            <span className="font-bold">resultados</span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-500 mb-8">
            Consulta y descarga{' '}
            <strong className="text-gray-600">el informe disponible:</strong>
          </p>

          {/* Button */}
          <a
            href={INFORME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#F29429] px-10 py-4 text-base font-bold text-white shadow-md transition-all duration-300 hover:bg-[#d97d1a] hover:scale-105 hover:shadow-lg"
          >
            <FileText className="h-5 w-5" />
            Ir al informe
          </a>
        </div>
      </div>
    </section>
  );
}
