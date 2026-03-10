'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle, AlertCircle, ArrowLeft, Newspaper, Bell, UserMinus, Heart, BookOpen } from 'lucide-react';
import { subscribeToNewsletter, unsubscribeFromNewsletter, SubscribeFormData } from './actions';
import { SEXO_OPTIONS } from '@/lib/geografiaEspana';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BoletinesPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [formData, setFormData] = useState<SubscribeFormData>({
    email: '',
    nombre: '',
    apellidos: '',
    sexo: '',
  });

  const [unsubEmail, setUnsubEmail] = useState('');
  const [unsubResult, setUnsubResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isUnsubPending, startUnsubTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await subscribeToNewsletter(formData);
      setResult(response);

      if (response.success) {
        setFormData({ email: '', nombre: '', apellidos: '', sexo: '' });
      }
    });
  };

  const handleUnsubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setUnsubResult(null);

    startUnsubTransition(async () => {
      const response = await unsubscribeFromNewsletter(unsubEmail);
      setUnsubResult(response);

      if (response.success) {
        setUnsubEmail('');
      }
    });
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero + Wave */}
      <div className="bg-gradient-to-b from-[#A10D5E] to-[#8B1547] text-white">
        <div className="container mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <Newspaper className="h-7 w-7 md:h-8 md:w-8 text-white flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins">
              Boletín Mapinsol
            </h1>
          </div>
          <p className="text-white/80 text-center mt-3 max-w-lg mx-auto text-sm md:text-base">
            Recibe las últimas noticias, estudios y buenas prácticas sobre atención a personas mayores.
          </p>
        </div>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      {/* Decorative blurred orbs */}
      <div className="absolute top-[220px] right-[5%] w-[300px] h-[300px] rounded-full bg-[#A10D5E]/15 blur-[75px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[280px] left-[3%] w-[250px] h-[250px] rounded-full bg-[#F29429]/15 blur-[65px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[500px] right-[15%] w-[220px] h-[220px] rounded-full bg-[#F29429]/12 blur-[60px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[550px] left-[8%] w-[280px] h-[280px] rounded-full bg-[#A10D5E]/12 blur-[70px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[750px] right-[10%] w-[240px] h-[240px] rounded-full bg-[#A10D5E]/15 blur-[65px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-[800px] left-[20%] w-[200px] h-[200px] rounded-full bg-[#F29429]/15 blur-[55px] pointer-events-none" style={{zIndex: 0}} />

      {/* Content */}
      <section className="relative container mx-auto px-4 py-8 md:py-12" style={{zIndex: 1}}>
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F29429] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#A10D5E]/10 rounded-2xl mb-4">
                <BookOpen className="h-7 w-7 text-[#A10D5E]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 font-poppins">Novedades</h3>
              <p className="text-sm text-gray-600">Nuevas buenas prácticas y estudios publicados</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F29429]/10 rounded-2xl mb-4">
                <Bell className="h-7 w-7 text-[#F29429]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 font-poppins">Eventos</h3>
              <p className="text-sm text-gray-600">Información sobre jornadas y actividades</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#A10D5E]/10 rounded-2xl mb-4">
                <Heart className="h-7 w-7 text-[#A10D5E]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 font-poppins">Exclusivo</h3>
              <p className="text-sm text-gray-600">Contenido solo para suscriptores</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-1 font-poppins">Suscríbete al boletín</h2>
              <p className="text-sm text-gray-500 mb-6">Completa el formulario para recibir nuestro boletín periódico.</p>

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

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                      placeholder="Tus apellidos"
                    />
                  </div>
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

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#A10D5E] to-[#8B1547] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#8B1547] hover:to-[#A10D5E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isPending ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                      Suscribiendo...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Suscribirme
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Consulta nuestra{' '}
                  <Link href="/privacidad/" className="text-[#A10D5E] hover:underline">política de privacidad</Link>.
                </p>
              </form>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* ¿Qué recibirás? */}
              <div className="bg-gradient-to-br from-[#A10D5E] to-[#8B1547] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold font-poppins mb-4">¿Qué recibirás?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/90">Resúmenes de nuevas buenas prácticas publicadas</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/90">Avisos de eventos, talleres y jornadas</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Newspaper className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/90">Noticias y notas de prensa relevantes</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/90">Informes y estudios exclusivos</p>
                  </li>
                </ul>
              </div>

              {/* Desuscripción */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                    <UserMinus className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">¿Quieres darte de baja?</h3>
                    <p className="text-xs text-gray-500">Cancela tu suscripción aquí</p>
                  </div>
                </div>

                {unsubResult && (
                  <div
                    className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
                      unsubResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {unsubResult.success ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    )}
                    <p>{unsubResult.message}</p>
                  </div>
                )}

                <form onSubmit={handleUnsubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={unsubEmail}
                    onChange={(e) => setUnsubEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors text-sm"
                    placeholder="tu@email.com"
                  />
                  <button
                    type="submit"
                    disabled={isUnsubPending}
                    className="w-full px-5 py-2.5 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isUnsubPending ? 'Procesando...' : 'Darme de baja'}
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
