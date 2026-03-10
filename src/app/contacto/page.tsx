'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle, AlertCircle, ArrowLeft, User, Calendar, MapPin } from 'lucide-react';
import { CCAA_PROVINCIAS, CCAA_LIST, SEXO_OPTIONS } from '@/lib/geografiaEspana';
import { sendContactEmail, ContactFormData } from './actions';

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
      // Si cambia CCAA, resetear provincia
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#A10D5E] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#A10D5E] to-[#8B1547] rounded-2xl mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-poppins">
            Contacto
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            ¿Tienes alguna pregunta o sugerencia? Rellena el formulario y nos pondremos en contacto contigo.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
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
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <User className="h-4 w-4 text-[#A10D5E]" />
                <span>Datos personales</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Edad */}
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                    placeholder="Tu edad"
                  />
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    {SEXO_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <MapPin className="h-4 w-4 text-[#A10D5E]" />
                <span>Ubicación</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CCAA */}
                <div>
                  <label htmlFor="ccaa" className="block text-sm font-medium text-gray-700 mb-1">
                    Comunidad Autónoma
                  </label>
                  <select
                    id="ccaa"
                    name="ccaa"
                    value={formData.ccaa}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    {CCAA_LIST.map(ccaa => (
                      <option key={ccaa} value={ccaa}>{ccaa}</option>
                    ))}
                  </select>
                </div>

                {/* Provincia */}
                <div>
                  <label htmlFor="provincia" className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia
                  </label>
                  <select
                    id="provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    disabled={!formData.ccaa}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccionar...</option>
                    {provincias.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                {/* Municipio */}
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                    placeholder="Tu municipio o población"
                  />
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <Mail className="h-4 w-4 text-[#A10D5E]" />
                <span>Mensaje</span>
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Mensaje */}
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E] transition-colors resize-none"
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
              Los campos marcados con <span className="text-red-500">*</span> son obligatorios
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
