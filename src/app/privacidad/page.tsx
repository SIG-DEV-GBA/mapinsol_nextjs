import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Trash2, FileEdit, Download, Ban, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de Mapinsol - Fundación Padrinos de la Vejez',
};

export default function PrivacidadPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero + Wave */}
      <div className="bg-gradient-to-b from-[#A10D5E] to-[#8B1547] text-white">
        <div className="container mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <Shield className="h-7 w-7 md:h-8 md:w-8 text-white flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-white/80 text-center mt-3 max-w-lg mx-auto text-sm md:text-base">
            Última actualización: Marzo 2026
          </p>
        </div>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-[250px] right-[5%] w-[300px] h-[300px] rounded-full bg-[#A10D5E]/12 blur-[75px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[400px] left-[3%] w-[250px] h-[250px] rounded-full bg-[#F29429]/12 blur-[65px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[700px] right-[10%] w-[220px] h-[220px] rounded-full bg-[#F29429]/10 blur-[60px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[900px] left-[8%] w-[280px] h-[280px] rounded-full bg-[#A10D5E]/10 blur-[70px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[1200px] right-[15%] w-[240px] h-[240px] rounded-full bg-[#A10D5E]/12 blur-[65px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[1500px] left-[20%] w-[200px] h-[200px] rounded-full bg-[#F29429]/12 blur-[55px] pointer-events-none" style={{zIndex: 0}} />

      {/* Content */}
      <section className="relative container mx-auto px-4 py-8 md:py-12" style={{zIndex: 1}}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F29429] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Responsable */}
          <Section number="1" title="Responsable del tratamiento">
            <div className="bg-gradient-to-br from-[#A10D5E] to-[#8B1547] rounded-2xl p-6 text-white">
              <p className="font-bold text-lg font-poppins mb-3">Fundación Padrinos de la Vejez</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/60">CIF:</span>
                  <span>G86847746</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Email:</span>
                  <a href="mailto:mapinsol@fundacionpadrinosdelavejez.es" className="hover:underline">mapinsol@fundacionpadrinosdelavejez.es</a>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="text-white/60">Dirección:</span>
                  <span>C/ Agustín de Betancourt, 17 · 8ª planta · 28003 Madrid</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Web:</span>
                  <a href="https://fundacionpadrinosdelavejez.es" target="_blank" rel="noopener noreferrer" className="hover:underline">fundacionpadrinosdelavejez.es</a>
                </div>
              </div>
            </div>
          </Section>

          {/* Finalidad */}
          <Section number="2" title="Finalidad del tratamiento de datos">
            <p className="text-gray-600 mb-4">
              Los datos personales que nos facilites serán tratados con las siguientes finalidades:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PurposeCard
                icon={Mail}
                title="Formulario de contacto"
                description="Gestionar y responder a las consultas recibidas."
              />
              <PurposeCard
                icon={FileEdit}
                title="Suscripción al boletín"
                description="Enviar comunicaciones periódicas sobre novedades, estudios y buenas prácticas."
              />
              <PurposeCard
                icon={Eye}
                title="Análisis y mejora"
                description="Analizar el uso del sitio web para mejorar nuestros servicios (con tu consentimiento)."
              />
            </div>
          </Section>

          {/* Legitimación */}
          <Section number="3" title="Legitimación del tratamiento">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#A10D5E] mt-2 flex-shrink-0" />
                <p className="text-gray-600"><strong className="text-gray-900">Consentimiento:</strong> Al enviar un formulario o suscribirte al boletín, nos das tu consentimiento expreso para tratar tus datos.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#F29429] mt-2 flex-shrink-0" />
                <p className="text-gray-600"><strong className="text-gray-900">Interés legítimo:</strong> Para el análisis estadístico y mejora del sitio web.</p>
              </li>
            </ul>
          </Section>

          {/* Datos que recopilamos */}
          <Section number="4" title="Datos que recopilamos">
            <p className="text-gray-600 mb-4">Recopilamos únicamente los datos que nos proporcionas voluntariamente:</p>
            <div className="flex flex-wrap gap-2">
              {['Nombre y apellidos', 'Correo electrónico', 'Edad y sexo (opcional)', 'Ubicación geográfica (opcional)', 'Contenido de mensajes'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 bg-[#A10D5E]/5 text-[#A10D5E] text-sm font-medium px-3 py-1.5 rounded-full border border-[#A10D5E]/15">
                  {item}
                </span>
              ))}
            </div>
          </Section>

          {/* Destinatarios */}
          <Section number="5" title="Destinatarios de los datos">
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-[#A10D5E] mt-2 flex-shrink-0" />
                <p className="text-gray-600"><strong className="text-gray-900">Mailchimp (The Rocket Science Group LLC):</strong> Para la gestión del boletín de noticias. Mailchimp cumple con el RGPD y tiene certificación Privacy Shield.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-[#F29429] mt-2 flex-shrink-0" />
                <p className="text-gray-600"><strong className="text-gray-900">Google Analytics:</strong> Para el análisis del tráfico web (datos anonimizados).</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm italic">No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>
          </Section>

          {/* Conservación */}
          <Section number="6" title="Conservación de los datos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F29429]/5 border border-[#F29429]/15 rounded-xl">
                <p className="font-bold text-gray-900 text-sm mb-1">Consultas</p>
                <p className="text-gray-600 text-sm">Mientras sea necesario para gestionar tu consulta y hasta 1 año después de la última comunicación.</p>
              </div>
              <div className="p-4 bg-[#A10D5E]/5 border border-[#A10D5E]/15 rounded-xl">
                <p className="font-bold text-gray-900 text-sm mb-1">Boletín</p>
                <p className="text-gray-600 text-sm">Hasta que solicites la baja de la suscripción.</p>
              </div>
            </div>
          </Section>

          {/* Derechos */}
          <Section number="7" title="Derechos del interesado">
            <p className="text-gray-600 mb-4">Puedes ejercer los siguientes derechos:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              <RightCard icon={Eye} label="Acceso" />
              <RightCard icon={FileEdit} label="Rectificación" />
              <RightCard icon={Trash2} label="Supresión" />
              <RightCard icon={Ban} label="Oposición" />
              <RightCard icon={Download} label="Portabilidad" />
              <RightCard icon={Lock} label="Limitación" />
            </div>
            <p className="text-gray-600 text-sm">
              Para ejercer estos derechos, envía un email a{' '}
              <a href="mailto:mapinsol@fundacionpadrinosdelavejez.es" className="text-[#A10D5E] hover:underline font-medium">mapinsol@fundacionpadrinosdelavejez.es</a>{' '}
              indicando tu nombre y el derecho que deseas ejercer.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              También tienes derecho a presentar una reclamación ante la{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#A10D5E] hover:underline font-medium">Agencia Española de Protección de Datos (AEPD)</a>.
            </p>
          </Section>

          {/* Seguridad */}
          <Section number="8" title="Seguridad de los datos">
            <p className="text-gray-600 mb-4">Implementamos medidas técnicas y organizativas para proteger tus datos personales:</p>
            <ul className="space-y-2">
              {['Conexiones cifradas mediante HTTPS/SSL', 'Acceso restringido a los datos', 'Servidores seguros'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-600">
                  <Lock className="w-4 h-4 text-[#A10D5E] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Cambios */}
          <Section number="9" title="Cambios en la política">
            <p className="text-gray-600">
              Nos reservamos el derecho de modificar esta política de privacidad. Te recomendamos revisarla periódicamente.
              La fecha de última actualización aparece al inicio del documento.
            </p>
          </Section>

          {/* Contacto */}
          <Section number="10" title="Contacto">
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#A10D5E]/5 to-[#F29429]/5 rounded-xl border border-[#A10D5E]/10">
              <div className="w-12 h-12 rounded-xl bg-[#A10D5E] flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Si tienes dudas sobre esta política, contáctanos:</p>
                <a href="mailto:mapinsol@fundacionpadrinosdelavejez.es" className="text-[#A10D5E] font-bold hover:underline">mapinsol@fundacionpadrinosdelavejez.es</a>
              </div>
            </div>
          </Section>
        </div>
      </section>
    </main>
  );
}

/* ---------- Sub-components ---------- */

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A10D5E] text-white text-sm font-bold flex-shrink-0">
          {number}
        </span>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 font-poppins">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function PurposeCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="w-10 h-10 rounded-lg bg-[#A10D5E]/10 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-[#A10D5E]" />
      </div>
      <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
      <p className="text-gray-600 text-xs">{description}</p>
    </div>
  );
}

function RightCard({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#A10D5E]/30 transition-colors">
      <Icon className="w-4 h-4 text-[#A10D5E] flex-shrink-0" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}
