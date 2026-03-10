'use server';

import nodemailer from 'nodemailer';

export interface ContactFormData {
  nombre: string;
  edad: string;
  sexo: string;
  ccaa: string;
  provincia: string;
  municipio: string;
  email: string;
  mensaje: string;
}

export interface ContactFormResult {
  success: boolean;
  message: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<ContactFormResult> {
  // Validación básica
  if (!data.nombre || !data.email || !data.mensaje) {
    return {
      success: false,
      message: 'Por favor, completa los campos obligatorios.',
    };
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      message: 'Por favor, introduce un email válido.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const sexoLabels: Record<string, string> = {
      mujer: 'Mujer',
      hombre: 'Hombre',
      otro: 'Otro',
      prefiero_no_decir: 'Prefiero no decirlo',
    };

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #700D39; border-bottom: 2px solid #FF6900; padding-bottom: 10px;">
          Nueva consulta MapinSol
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Nombre:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.nombre}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Edad:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.edad || 'No especificada'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Sexo:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${sexoLabels[data.sexo] || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Comunidad Autónoma:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.ccaa || 'No especificada'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Provincia:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.provincia || 'No especificada'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Municipio:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.municipio || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <a href="mailto:${data.email}" style="color: #700D39;">${data.email}</a>
            </td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
          <h3 style="color: #700D39; margin-top: 0;">Mensaje:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.mensaje}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
          Este mensaje fue enviado desde el formulario de contacto de Mapinsol
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Mapinsol Contacto" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Se envía al mismo correo
      replyTo: data.email,
      subject: `Nueva consulta MapinSol - ${data.nombre}`,
      html: htmlContent,
    });

    return {
      success: true,
      message: '¡Mensaje enviado correctamente! Te responderemos lo antes posible.',
    };
  } catch (error) {
    console.error('Error enviando email:', error);
    return {
      success: false,
      message: 'Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
    };
  }
}
