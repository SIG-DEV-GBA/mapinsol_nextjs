const https = require('https');

const AUTH = Buffer.from('g.borisov:LyCQ wY2P ZABi 9yXV TBNE Pzp7').toString('base64');
const API = 'https://fundacionpadrinosdelavejez.es/wp-json/wp/v2/actualidad-mapinsol';

const posts = [
  {
    title: 'Boletin Febrero 2026 - Avances en el programa',
    content: '<p>En este numero repasamos los principales avances del programa de acompanamiento a personas mayores durante febrero. Se han incorporado 15 nuevos voluntarios y se ha ampliado la cobertura a 3 nuevos municipios rurales.</p><p>Compartimos testimonios de beneficiarios que destacan el impacto positivo de las visitas semanales en su bienestar emocional y social.</p>',
    status: 'publish',
    featured_media: 28294,
    meta: {
      tipo_contenido: 'boletin',
      descripcion_corta: 'Avances del programa de acompanamiento y nuevos voluntarios en febrero 2026.',
      destacado: 'true',
      fecha_publicacion: '2026-02-15'
    }
  },
  {
    title: 'Nota de prensa - Mapinsol presenta resultados preliminares',
    content: '<p>La Fundacion Padrinos de la Vejez ha presentado los resultados preliminares del estudio MAPINSOL sobre soledad no deseada en el medio rural.</p><p>Los datos muestran que los vinculos vecinales y las redes de apoyo comunitario son factores clave para prevenir el aislamiento social en personas mayores.</p>',
    status: 'publish',
    featured_media: 28226,
    meta: {
      tipo_contenido: 'nota_prensa',
      descripcion_corta: 'Presentacion de resultados preliminares del estudio MAPINSOL sobre soledad rural.',
      fuente_nota: 'Europa Press',
      enlace_nota: 'https://fundacionpadrinosdelavejez.es'
    }
  },
  {
    title: 'Evento - Jornada de presentacion MAPINSOL en Madrid',
    content: '<p>Jornada abierta al publico donde se presentaran los hallazgos del proyecto MAPINSOL. Contaremos con la participacion de investigadores, voluntarios y representantes institucionales.</p><p>Se realizaran mesas redondas sobre buenas practicas en acompanamiento a personas mayores y prevencion de la soledad no deseada.</p>',
    status: 'publish',
    featured_media: 28227,
    meta: {
      tipo_contenido: 'evento',
      descripcion_corta: 'Jornada de presentacion de resultados MAPINSOL con mesas redondas.',
      destacado: 'true',
      fecha_evento: '2026-04-15',
      hora_evento: '10:00 - 14:00',
      lugar_evento: 'Centro Cultural Conde Duque, Madrid'
    }
  },
  {
    title: 'Taller - Formacion para voluntarios de acompanamiento',
    content: '<p>Taller practico dirigido a voluntarios que participan en programas de acompanamiento a personas mayores. Se trabajaran habilidades de comunicacion, escucha activa y deteccion de situaciones de vulnerabilidad.</p><p>El taller incluye dinamicas grupales y role-playing para mejorar la calidad del acompanamiento.</p>',
    status: 'publish',
    featured_media: 28225,
    meta: {
      tipo_contenido: 'taller',
      descripcion_corta: 'Formacion practica en habilidades de acompanamiento para voluntarios.',
      fecha_evento: '2026-03-20',
      hora_evento: '16:00 - 19:00',
      lugar_evento: 'Sede Fundacion Padrinos de la Vejez, Salamanca',
      duracion_evento: '3 horas'
    }
  },
  {
    title: 'Video - Testimonios de personas mayores acompanadas',
    content: '<p>Documental breve con testimonios de personas mayores que participan en el programa de acompanamiento de la Fundacion. Comparten sus experiencias y como ha mejorado su dia a dia gracias al apoyo de los voluntarios.</p>',
    status: 'publish',
    featured_media: 28294,
    meta: {
      tipo_contenido: 'video',
      descripcion_corta: 'Testimonios reales de personas mayores del programa de acompanamiento.',
      url_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  },
  {
    title: 'Infografia - Datos clave sobre soledad en el medio rural',
    content: '<p>Infografia con los principales datos del estudio MAPINSOL sobre la situacion de la soledad no deseada en municipios rurales de Espana.</p>',
    status: 'publish',
    featured_media: 28226,
    meta: {
      tipo_contenido: 'infografia',
      descripcion_corta: 'Principales datos y cifras del estudio MAPINSOL sobre soledad rural.'
    }
  }
];

async function createPost(post) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(post);
    const url = new URL(API);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch(e) {
          reject(body);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const post of posts) {
    try {
      const result = await createPost(post);
      if (result.id) {
        console.log(`OK: ID=${result.id} Slug=${result.slug} Tipo=${post.meta.tipo_contenido}`);
      } else {
        console.log(`ERROR: ${result.code} - ${result.message}`);
      }
    } catch(e) {
      console.log('ERROR:', e);
    }
  }
})();
