'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle, AlertCircle, ArrowLeft, Newspaper, Bell, UserMinus } from 'lucide-react';
import { subscribeToNewsletter, unsubscribeFromNewsletter, SubscribeFormData } from './actions';
import { SEXO_OPTIONS } from '@/lib/geografiaEspana';

export default function BoletinesPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [formData, setFormData] = useState<SubscribeFormData>({
    email: '',
    nombre: '',
    apellidos: '',
    sexo: '',
  });

  // Estado para desuscripción
  const [unsubEmail, setUnsubEmail] = useState('');
  const [unsubResult, setUnsubResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isUnsubPending, startUnsubTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        setFormData({
          email: '',
          nombre: '',
          apellidos: '',
          sexo: '',
        });
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#700D39] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#700D39] to-[#8B1547] rounded-2xl mb-4">
            <Newspaper className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-poppins">
            Boletín Mapinsol
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Suscríbete para recibir las últimas noticias, estudios y buenas prácticas
            sobre atención a personas mayores y soledad no deseada.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#700D39]/10 rounded-full mb-3">
              <Newspaper className="h-6 w-6 text-[#700D39]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Novedades</h3>
            <p className="text-sm text-gray-600">Nuevas buenas prácticas y estudios publicados</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FF6900]/10 rounded-full mb-3">
              <Bell className="h-6 w-6 text-[#FF6900]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Eventos</h3>
            <p className="text-sm text-gray-600">Información sobre jornadas y actividades</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Exclusivo</h3>
            <p className="text-sm text-gray-600">Contenido solo para suscriptores</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center font-nunito">
            Suscríbete al boletín
          </h2>

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
              {/* Nombre */}
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#700D39]/20 focus:border-[#700D39] transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Apellidos */}
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#700D39]/20 focus:border-[#700D39] transition-colors"
                  placeholder="Tus apellidos"
                />
              </div>
            </div>

            {/* Sexo */}
            <div>
              <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#700D39]/20 focus:border-[#700D39] transition-colors bg-white"
              >
                <option value="">Seleccionar...</option>
                {SEXO_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Email */}
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#700D39]/20 focus:border-[#700D39] transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#700D39] to-[#8B1547] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#8B1547] hover:to-[#700D39] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
              <a href="#" className="text-[#700D39] hover:underline">política de privacidad</a>.
            </p>
          </form>
        </div>

        {/* Sección de desuscripción */}
        <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
              <UserMinus className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">¿Quieres darte de baja?</h3>
              <p className="text-sm text-gray-500">Introduce tu email para cancelar la suscripción</p>
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

          <form onSubmit={handleUnsubscribe} className="flex gap-3">
            <input
              type="email"
              value={unsubEmail}
              onChange={(e) => setUnsubEmail(e.target.value)}
              required
              className="flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors"
              placeholder="tu@email.com"
            />
            <button
              type="submit"
              disabled={isUnsubPending}
              className="px-5 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isUnsubPending ? 'Procesando...' : 'Darme de baja'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
