const https = require('https');

const AUTH = 'Basic ' + Buffer.from('g.borisov:LyCQ wY2P ZABi 9yXV TBNE Pzp7').toString('base64');
const BASE_URL = 'fundacionpadrinosdelavejez.es';

// Categorías disponibles
const CATEGORIAS = [29, 30, 31, 32, 33, 28];
// Etiquetas disponibles
const TAGS = [51, 62, 39, 40, 43, 35, 63, 58, 49, 50];
// Imágenes disponibles
const IMAGES = [27852, 27851, 27850, 27849, 27848, 27847, 27845, 27737, 27730, 27729, 27724, 27721, 27720, 27719, 27675, 27674, 27673, 27672, 27671, 27670];
// PDF de ejemplo
const PDF_ID = 27469;

// Videos de YouTube sobre personas mayores
const YOUTUBE_VIDEOS = [
  'https://www.youtube.com/watch?v=5pDvYtBljjM',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
  '',  // Sin video
  '',
];

const CCAAS = ['Madrid', 'Cataluña', 'Andalucía', 'Valencia', 'País Vasco', 'Galicia', 'Castilla y León', 'Castilla-La Mancha', 'Aragón', 'Murcia', 'Navarra', 'Extremadura', 'Asturias', 'Cantabria', 'La Rioja', 'Canarias', 'Baleares', 'Melilla', 'Ceuta'];

const PROVINCIAS = {
  'Madrid': ['Madrid'],
  'Cataluña': ['Barcelona', 'Tarragona', 'Girona', 'Lleida'],
  'Andalucía': ['Sevilla', 'Málaga', 'Granada', 'Córdoba'],
  'Valencia': ['Valencia', 'Alicante', 'Castellón'],
  'País Vasco': ['Vizcaya', 'Guipúzcoa', 'Álava'],
  'Galicia': ['A Coruña', 'Pontevedra', 'Lugo', 'Ourense'],
  'Castilla y León': ['Valladolid', 'León', 'Salamanca', 'Burgos'],
};

const ENTIDADES = [
  'Fundación Padrinos de la Vejez',
  'Cruz Roja Española',
  'Cáritas Diocesana',
  'Fundación La Caixa',
  'Ayuntamiento de Madrid',
  'Diputación de Barcelona',
  'Fundación ONCE',
  'Asociación Edad Dorada',
  'Centro de Día Sol Naciente',
  'Residencia San José',
  'Fundación Pilares',
  'CEOMA',
  'UDP - Unión Democrática de Pensionistas',
  'IMSERSO',
  'Fundación Matía',
];

const ESTADOS = ['En curso', 'Finalizado', 'En pausa'];
const ENTORNOS = ['Domicilio', 'Centro de día', 'Residencia', 'Comunitario', 'Mixto'];
const AMBITOS = ['Local', 'Regional', 'Nacional', 'Internacional'];
const TRANSFERIBILIDAD = ['Alta', 'Media', 'Baja'];

// Títulos de prácticas realistas
const TITULOS = [
  'Programa de Teleasistencia Avanzada para Mayores',
  'Huertos Urbanos Intergeneracionales',
  'Acompañamiento Digital para Personas Mayores',
  'Prevención de Caídas en el Hogar',
  'Estimulación Cognitiva mediante Música',
  'Red de Voluntariado Senior',
  'Terapia Asistida con Animales',
  'Programa de Nutrición Saludable',
  'Actividades de Reminiscencia',
  'Gimnasia Adaptada en el Domicilio',
  'Talleres de Memoria y Atención',
  'Servicio de Comidas a Domicilio',
  'Programa de Respiro Familiar',
  'Alfabetización Digital para Mayores',
  'Grupos de Apoyo para Cuidadores',
  'Fisioterapia Preventiva Domiciliaria',
  'Programa de Envejecimiento Activo',
  'Servicio de Podología a Domicilio',
  'Terapia Ocupacional en Casa',
  'Programa de Socialización Comunitaria',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr, min = 1, max = 3) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateLoremIpsum(paragraphs = 1) {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  return Array(paragraphs).fill(`<p>${lorem}</p>`).join('\n');
}

function generatePractica(index) {
  const ccaa = randomFrom(CCAAS);
  const provinciaOptions = PROVINCIAS[ccaa] || [ccaa];
  const isInternacional = Math.random() > 0.85;
  const hasVideo = Math.random() > 0.4;
  const hasPdf = Math.random() > 0.3;
  const hasContacto = Math.random() > 0.5;
  const destacada = Math.random() > 0.7;

  const poblacion = {
    'Mayores autónomos': Math.random() > 0.5 ? 'true' : 'false',
    'Mayores con dependencia ': Math.random() > 0.5 ? 'true' : 'false',
    'Institucionalizados': Math.random() > 0.6 ? 'true' : 'false',
  };

  const agentes = {
    'Profesional': Math.random() > 0.4 ? 'true' : 'false',
    'Voluntario': Math.random() > 0.5 ? 'true' : 'false',
    'Familiar': Math.random() > 0.5 ? 'true' : 'false',
    'Entidad Colaboradora': Math.random() > 0.6 ? 'true' : 'false',
  };

  const contacto = hasContacto ? {
    'item-0': {
      nombre_contacto: ['María García', 'Juan López', 'Ana Martínez', 'Carlos Ruiz', 'Laura Sánchez'][index % 5],
      cargo: ['Coordinador/a', 'Director/a', 'Responsable', 'Técnico/a'][index % 4],
      entidad_contacto: randomFrom(ENTIDADES),
      tlf_contacto: `6${Math.floor(10000000 + Math.random() * 90000000)}`,
      mail_contacto: `contacto${index}@ejemplo.es`,
    }
  } : {};

  const enlaces = Math.random() > 0.5 ? {
    'item-0': {
      texto_enlace: 'Más información',
      url_enlace: 'https://fundacionpadrinosdelavejez.es/',
    }
  } : {};

  return {
    title: TITULOS[index],
    status: 'publish',
    featured_media: IMAGES[index % IMAGES.length],
    'category-practices': randomSubset(CATEGORIAS, 1, 3),
    'tags-practices': randomSubset(TAGS, 1, 4),
    meta: {
      entidad_responsable: randomFrom(ENTIDADES),
      url_entidad: 'https://fundacionpadrinosdelavejez.es/',
      a_o_de_inicio: String(2018 + Math.floor(Math.random() * 7)),
      estado_actual: randomFrom(ESTADOS),
      tipo_de_entorno: randomFrom(ENTORNOS),
      ambito_territorial: randomFrom(AMBITOS),
      internacional_boolean: isInternacional ? 'true' : '',
      country: isInternacional ? randomFrom(['Portugal', 'Francia', 'Italia', 'Alemania']) : '',
      ccaa: isInternacional ? '' : ccaa,
      provincia: isInternacional ? '' : randomFrom(provinciaOptions),
      municipio: isInternacional ? '' : ['Centro', 'Norte', 'Sur', 'Este'][index % 4],
      objetivo_principal: `El objetivo principal de esta práctica es mejorar la calidad de vida de las personas mayores a través de ${TITULOS[index].toLowerCase()}. Se busca promover la autonomía, prevenir situaciones de vulnerabilidad y fomentar la participación activa en la comunidad.`,
      actividades_desarrolladas: generateLoremIpsum(2),
      metodolog_a_aplicada: generateLoremIpsum(2),
      poblacion_destinataria: poblacion,
      agentes_implicados: agentes,
      indicadores_de_evaluaci_n: generateLoremIpsum(1),
      resultados_obtenidos: generateLoremIpsum(2),
      lecciones_aprendidas: generateLoremIpsum(1),
      nivel_de_transferibilidad: randomFrom(TRANSFERIBILIDAD),
      requisitos_de_implementaci_n: generateLoremIpsum(1),
      sostenibilidad: `${randomFrom(TRANSFERIBILIDAD)} sostenibilidad. ${generateLoremIpsum(1).replace(/<\/?p>/g, '')}`,
      respeto_a_la_dignidad_y_autonom_a: generateLoremIpsum(1),
      prevenci_n_del_maltrato: generateLoremIpsum(1).replace(/<\/?p>/g, ''),
      participaci_n_de_las_personas: generateLoremIpsum(1),
      elemento_innovador: `Esta práctica innova en ${['el uso de tecnología', 'la metodología participativa', 'el enfoque comunitario', 'la coordinación interinstitucional'][index % 4]}. ${generateLoremIpsum(1).replace(/<\/?p>/g, '')}`,
      uso_de_tecnolog_a: Math.random() > 0.5 ? `Se utilizan herramientas tecnológicas como ${['tablets', 'smartphones', 'sensores', 'videollamadas'][index % 4]} para facilitar la implementación.` : '',
      enlace_video: hasVideo ? YOUTUBE_VIDEOS[index % YOUTUBE_VIDEOS.length] : '',
      pdf_buena_practica: hasPdf ? String(PDF_ID) : '',
      personas_de_contacto: contacto,
      mostrar_contacto: hasContacto ? 'true' : 'false',
      enlaces_anexos: enlaces,
      practica_destacada: destacada ? 'true' : 'false',
    }
  };
}

function createPractica(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: '/wp-json/wp/v2/buenas_practicas_ast',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          const result = JSON.parse(body);
          resolve({ id: result.id, title: result.title.rendered });
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('Creando 20 buenas prácticas de prueba...\n');

  for (let i = 0; i < 20; i++) {
    const practica = generatePractica(i);
    try {
      const result = await createPractica(practica);
      console.log(`✓ [${i + 1}/20] Creada: "${result.title}" (ID: ${result.id})`);
    } catch (error) {
      console.error(`✗ [${i + 1}/20] Error en "${practica.title}": ${error.message}`);
    }
    // Pequeña pausa entre requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n¡Completado!');
}

main();
