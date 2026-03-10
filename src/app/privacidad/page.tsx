import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de Mapinsol - Fundación Padrinos de la Vejez',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#700D39] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#700D39] to-[#8B1547] rounded-xl">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
                Política de Privacidad
              </h1>
              <p className="text-gray-500 text-sm">Última actualización: Marzo 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Responsable del tratamiento</h2>
            <p>
              <strong>Fundación Padrinos de la Vejez</strong><br />
              CIF: G-XXXXXXXX<br />
              Dirección: [Dirección de la Fundación]<br />
              Email: info@fundacionpadrinosdelavejez.es<br />
              Web: <a href="https://fundacionpadrinosdelavejez.es" target="_blank" rel="noopener noreferrer">fundacionpadrinosdelavejez.es</a>
            </p>

            <h2>2. Finalidad del tratamiento de datos</h2>
            <p>
              Los datos personales que nos facilites serán tratados con las siguientes finalidades:
            </p>
            <ul>
              <li><strong>Formulario de contacto:</strong> Gestionar y responder a las consultas recibidas.</li>
              <li><strong>Suscripción al boletín:</strong> Enviar comunicaciones periódicas sobre novedades, estudios y buenas prácticas relacionadas con la atención a personas mayores.</li>
              <li><strong>Análisis y mejora:</strong> Analizar el uso del sitio web para mejorar nuestros servicios (mediante cookies analíticas, si has dado tu consentimiento).</li>
            </ul>

            <h2>3. Legitimación del tratamiento</h2>
            <p>
              La base legal para el tratamiento de tus datos es:
            </p>
            <ul>
              <li><strong>Consentimiento:</strong> Al enviar un formulario o suscribirte al boletín, nos das tu consentimiento expreso para tratar tus datos.</li>
              <li><strong>Interés legítimo:</strong> Para el análisis estadístico y mejora del sitio web.</li>
            </ul>

            <h2>4. Datos que recopilamos</h2>
            <p>
              Recopilamos únicamente los datos que nos proporcionas voluntariamente:
            </p>
            <ul>
              <li>Nombre y apellidos</li>
              <li>Correo electrónico</li>
              <li>Edad y sexo (opcional)</li>
              <li>Ubicación geográfica (CCAA, provincia, municipio) - opcional</li>
              <li>Contenido de tus mensajes</li>
            </ul>

            <h2>5. Destinatarios de los datos</h2>
            <p>
              Tus datos podrán ser comunicados a:
            </p>
            <ul>
              <li><strong>Mailchimp (The Rocket Science Group LLC):</strong> Para la gestión del boletín de noticias. Mailchimp cumple con el RGPD y tiene certificación Privacy Shield.</li>
              <li><strong>Google Analytics:</strong> Para el análisis del tráfico web (datos anonimizados).</li>
            </ul>
            <p>
              No vendemos ni cedemos tus datos a terceros con fines comerciales.
            </p>

            <h2>6. Conservación de los datos</h2>
            <p>
              Conservaremos tus datos durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos:
            </p>
            <ul>
              <li><strong>Consultas:</strong> Los datos se conservarán mientras sea necesario para gestionar tu consulta y hasta 1 año después de la última comunicación.</li>
              <li><strong>Boletín:</strong> Hasta que solicites la baja de la suscripción.</li>
            </ul>

            <h2>7. Derechos del interesado</h2>
            <p>
              Puedes ejercer los siguientes derechos:
            </p>
            <ul>
              <li><strong>Acceso:</strong> Conocer qué datos tenemos sobre ti.</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos.</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos.</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos.</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado.</li>
              <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento.</li>
            </ul>
            <p>
              Para ejercer estos derechos, envía un email a{' '}
              <a href="mailto:info@fundacionpadrinosdelavejez.es">info@fundacionpadrinosdelavejez.es</a>{' '}
              indicando tu nombre y el derecho que deseas ejercer.
            </p>
            <p>
              También tienes derecho a presentar una reclamación ante la{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos (AEPD)</a>.
            </p>

            <h2>8. Seguridad de los datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger tus datos personales:
            </p>
            <ul>
              <li>Conexiones cifradas mediante HTTPS/SSL</li>
              <li>Acceso restringido a los datos</li>
              <li>Servidores seguros</li>
            </ul>

            <h2>9. Cambios en la política</h2>
            <p>
              Nos reservamos el derecho de modificar esta política de privacidad. Te recomendamos revisarla periódicamente.
              La fecha de última actualización aparece al inicio del documento.
            </p>

            <h2>10. Contacto</h2>
            <p>
              Si tienes dudas sobre esta política de privacidad, puedes contactarnos en:{' '}
              <a href="mailto:info@fundacionpadrinosdelavejez.es">info@fundacionpadrinosdelavejez.es</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
