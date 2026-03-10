'use server';

import mailchimp from '@mailchimp/mailchimp_marketing';

export interface SubscribeFormData {
  email: string;
  nombre?: string;
  apellidos?: string;
  sexo?: string;
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
