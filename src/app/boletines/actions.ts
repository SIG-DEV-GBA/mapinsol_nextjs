'use server';

import mailchimp from '@mailchimp/mailchimp_marketing';

export interface SubscribeFormData {
  email: string;
  nombre?: string;
  apellidos?: string;
  comunidadAutonoma?: string;
  fechaNacimiento?: string;
  sexo?: string;
}

/**
 * Convierte una fecha en formato aaaa-mm-dd (la que devuelve <input type="date">)
 * al formato MM/DD/YYYY que espera el campo de fecha de Mailchimp (FNACIM).
 * Devuelve null si el formato no es válido.
 */
function convertFechaToMailchimp(fecha?: string): string | null {
  if (!fecha || !fecha.trim()) {
    return '';
  }

  const match = fecha.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, yyyy, mm, dd] = match;
  const day = Number(dd);
  const month = Number(mm);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  return `${mm}/${dd}/${yyyy}`;
}

export interface SubscribeResult {
  success: boolean;
  message: string;
}

// Configurar Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || '',
  server: process.env.MAILCHIMP_SERVER || 'us20',
});

export async function subscribeToNewsletter(data: SubscribeFormData): Promise<SubscribeResult> {
  // Validación básica
  if (!data.email) {
    return {
      success: false,
      message: 'Por favor, introduce tu correo electrónico.',
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

  // Validar campos obligatorios
  if (!data.nombre) {
    return {
      success: false,
      message: 'Por favor, introduce tu nombre.',
    };
  }

  if (!data.apellidos) {
    return {
      success: false,
      message: 'Por favor, introduce tus apellidos.',
    };
  }

  if (!data.comunidadAutonoma) {
    return {
      success: false,
      message: 'Por favor, selecciona tu comunidad autónoma.',
    };
  }

  if (!data.sexo) {
    return {
      success: false,
      message: 'Por favor, selecciona tu sexo.',
    };
  }

  if (!data.fechaNacimiento) {
    return {
      success: false,
      message: 'Por favor, introduce tu fecha de nacimiento.',
    };
  }

  // Validar y convertir fecha de nacimiento (aaaa-mm-dd -> MM/DD/YYYY para Mailchimp)
  const fechaNacimiento = convertFechaToMailchimp(data.fechaNacimiento);
  if (fechaNacimiento === null) {
    return {
      success: false,
      message: 'La fecha de nacimiento no es válida.',
    };
  }

  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!audienceId) {
    console.error('MAILCHIMP_AUDIENCE_ID no configurado');
    return {
      success: false,
      message: 'Error de configuración. Por favor, contacta con el administrador.',
    };
  }

  try {
    console.log('Suscribiendo con datos:', JSON.stringify(data, null, 2));

    await mailchimp.lists.addListMember(audienceId, {
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: data.nombre || '',
        LNAME: data.apellidos || '',
        MMERGE7: data.sexo || '',
        MMERGE10: data.comunidadAutonoma || '',
        FNACIM: fechaNacimiento,
      },
    });

    return {
      success: true,
      message: '¡Te has suscrito correctamente! Revisa tu correo para confirmar.',
    };
  } catch (error: any) {
    console.error('Error Mailchimp:', error?.response?.body || error);

    // Si el miembro ya existe, intentar reactivar la suscripción
    if (error?.response?.body?.title === 'Member Exists') {
      try {
        console.log('Re-suscribiendo con datos:', JSON.stringify({
          nombre: data.nombre,
          apellidos: data.apellidos,
          sexo: data.sexo,
          email: data.email
        }, null, 2));

        const crypto = await import('crypto');
        const subscriberHash = crypto.createHash('md5').update(data.email.toLowerCase()).digest('hex');

        await mailchimp.lists.updateListMember(audienceId, subscriberHash, {
          status: 'subscribed',
          merge_fields: {
            FNAME: data.nombre || '',
            LNAME: data.apellidos || '',
            MMERGE7: data.sexo || '',
            MMERGE10: data.comunidadAutonoma || '',
            FNACIM: fechaNacimiento,
          },
        });

        return {
          success: true,
          message: '¡Te has vuelto a suscribir correctamente!',
        };
      } catch (resubError: any) {
        console.error('Error resubscribing:', resubError?.response?.body || resubError);

        // Si ya está suscrito activamente
        if (resubError?.response?.body?.detail?.includes('is already a list member')) {
          return {
            success: false,
            message: 'Este correo ya está suscrito a nuestro boletín.',
          };
        }

        return {
          success: false,
          message: 'No se pudo completar la suscripción. Inténtalo de nuevo.',
        };
      }
    }

    if (error?.response?.body?.title === 'Invalid Resource') {
      return {
        success: false,
        message: 'El correo electrónico no es válido.',
      };
    }

    return {
      success: false,
      message: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
    };
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<SubscribeResult> {
  if (!email) {
    return {
      success: false,
      message: 'Por favor, introduce tu correo electrónico.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Por favor, introduce un email válido.',
    };
  }

  try {
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!audienceId) {
      return {
        success: false,
        message: 'Error de configuración.',
      };
    }

    // Mailchimp usa el hash MD5 del email en minúsculas para identificar suscriptores
    const crypto = await import('crypto');
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    await mailchimp.lists.updateListMember(audienceId, subscriberHash, {
      status: 'unsubscribed',
    });

    return {
      success: true,
      message: 'Te has dado de baja correctamente del boletín.',
    };
  } catch (error: any) {
    console.error('Error Mailchimp unsubscribe:', error?.response?.body || error);

    if (error?.response?.body?.status === 404) {
      return {
        success: false,
        message: 'Este correo no está suscrito a nuestro boletín.',
      };
    }

    return {
      success: false,
      message: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
    };
  }
}
