'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle, AlertCircle, ArrowLeft, User, MapPin, Phone, Clock, Building2 } from 'lucide-react';
import { CCAA_PROVINCIAS, CCAA_LIST, SEXO_OPTIONS } from '@/lib/geografiaEspana';
import { sendContactEmail, ContactFormData } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContactoPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    nombre: '',
    edad: '',
    sexo: '',
    ccaa: '',
    provincia: '',
    municipio: '',
    email: '',
    mensaje: '',
  });

  const provincias = formData.ccaa ? CCAA_PROVINCIAS[formData.ccaa] || [] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      if (name === 'ccaa') {
        return { ...prev, ccaa: value, provincia: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await sendContactEmail(formData);
      setResult(response);

      if (response.success) {
        setFormData({
          nombre: '',
          edad: '',
          sexo: '',
          ccaa: '',
          provincia: '',
          municipio: '',
          email: '',
          mensaje: '',
        });
      }
    });
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero + Wave */}
      <div className="bg-gradient-to-b from-[#A10D5E] to-[#8B1547] text-white">
        <div className="container mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <Mail className="h-7 w-7 md:h-8 md:w-8 text-white flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins">
              Contacto
            </h1>
          </div>
          <p className="text-white/80 text-center mt-3 max-w-lg mx-auto text-sm md:text-base">
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.
          </p>
        </div>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      {/* Decorative blurred orbs */}
      <div className="absolute top-[200px] right-[5%] w-[320px] h-[320px] rounded-full bg-[#A10D5E]/20 blur-[80px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[220px] left-[2%] w-[280px] h-[280px] rounded-full bg-[#F29429]/18 blur-[70px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[380px] right-[20%] w-[220px] h-[220px] rounded-full bg-[#F29429]/15 blur-[60px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[450px] left-[15%] w-[260px] h-[260px] rounded-full bg-[#A10D5E]/15 blur-[65px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[580px] right-[8%] w-[240px] h-[240px] rounded-full bg-[#F29429]/20 blur-[65px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[650px] left-[5%] w-[300px] h-[300px] rounded-full bg-[#A10D5E]/18 blur-[75px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[780px] right-[25%] w-[200px] h-[200px] rounded-full bg-[#A10D5E]/12 blur-[55px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[850px] left-[30%] w-[250px] h-[250px] rounded-full bg-[#F29429]/15 blur-[60px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[950px] right-[10%] w-[280px] h-[280px] rounded-full bg-[#A10D5E]/15 blur-[70px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[1020px] left-[10%] w-[220px] h-[220px] rounded-full bg-[#F29429]/18 blur-[60px] pointer-events-none" style={{zIndex: 0}} />

      {/* Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F29429] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">
          {/* Sidebar - Info de contacto */}
          <aside className="space-y-5">
            {/* Tarjeta principal */}
            <div className="bg-gradient-to-br from-[#A10D5E] to-[#8B1547] rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold font-poppins mb-4">Información de contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Fundación Padrinos de la Vejez</p>
                    <p className="text-white/70 text-xs mt-0.5">Mapinsol</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">C/ Agustín de Betancourt, 17</p>
                    <p className="text-sm text-white/90">8ª planta · 28003 Madrid</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">91 559 94 50 · 91 431 92 90</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <a href="mailto:mapinsol@fundacionpadrinosdelavejez.es" className="text-sm text-white/90 hover:text-white transition-colors">
                      mapinsol@fundacionpadrinosdelavejez.es
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Lun – Vie: 9:00 – 17:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa embebido */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src="https://www.google.com/maps?q=Calle+Agust%C3%ADn+de+Betancourt+17+Madrid+España&output=embed"
                className="w-full h-48"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Fundación Padrinos de la Vejez"
              />
            </div>

            {/* CTA Boletín */}
            <div className="bg-[#F29429]/10 border border-[#F29429]/20 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-2 font-poppins">Mantente informado</h3>
              <p className="text-xs text-gray-600 mb-3">
                Suscríbete al boletín y recibe las últimas novedades sobre buenas prácticas.
              </p>
              <Link
                href="/boletines/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F29429] hover:text-[#A10D5E] transition-colors"
              >
                Suscribirme al boletín
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </aside>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-1 font-poppins">Envíanos un mensaje</h2>
            <p className="text-sm text-gray-500 mb-6">Rellena el formulario y nos pondremos en contacto contigo.</p>

            {result && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                  result.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <p>{result.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos personales */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <User className="h-4 w-4 text-[#A10D5E]" />
                  <span className="text-sm font-semibold text-gray-700">Datos personales</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">
                      Edad
                    </label>
                    <input
                      type="number"
                      id="edad"
                      name="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                      placeholder="Tu edad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sexo
                    </label>
                    <Select value={formData.sexo} onValueChange={(val) => setFormData(prev => ({ ...prev, sexo: val as string }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SEXO_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <MapPin className="h-4 w-4 text-[#A10D5E]" />
                  <span className="text-sm font-semibold text-gray-700">Ubicación</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comunidad Autónoma
                    </label>
                    <Select value={formData.ccaa} onValueChange={(val) => setFormData(prev => ({ ...prev, ccaa: val as string, provincia: '' }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CCAA_LIST.map(ccaa => (
                          <SelectItem key={ccaa} value={ccaa}>{ccaa}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provincia
                    </label>
                    <Select
                      value={formData.provincia}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, provincia: val as string }))}
                      disabled={!formData.ccaa}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {provincias.map(prov => (
                          <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
                      Municipio / Población
                    </label>
                    <input
                      type="text"
                      id="municipio"
                      name="municipio"
                      value={formData.municipio}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                      placeholder="Tu municipio o población"
                    />
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Mail className="h-4 w-4 text-[#A10D5E]" />
                  <span className="text-sm font-semibold text-gray-700">Mensaje</span>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje o consulta <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#A10D5E] to-[#8B1547] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#8B1547] hover:to-[#A10D5E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isPending ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Enviar mensaje
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios.{' '}
                Consulta nuestra <Link href="/privacidad/" className="text-[#A10D5E] hover:underline">política de privacidad</Link>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
