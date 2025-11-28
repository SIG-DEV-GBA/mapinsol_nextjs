/**
 * Mapeo de acrónimos y claves a términos completos
 */

export const poblacionLabels: Record<string, string> = {
  'avd': 'Actividades de la Vida Diaria',
  'adv': 'Actividades de la Vida Diaria',
  'abvd': 'Actividades Básicas de la Vida Diaria',
  'aivd': 'Actividades Instrumentales de la Vida Diaria',
  'personas_mayores': 'Personas Mayores',
  'personas_mayores_autonomas': 'Personas Mayores Autónomas',
  'personas_mayores_dependientes': 'Personas Mayores Dependientes',
  'personas_con_demencia': 'Personas con Demencia',
  'personas_con_alzheimer': 'Personas con Alzheimer',
  'personas_en_soledad': 'Personas en Situación de Soledad',
  'cuidadores': 'Cuidadores',
  'cuidadores_familiares': 'Cuidadores Familiares',
  'cuidadores_profesionales': 'Cuidadores Profesionales',
  'familiares': 'Familiares',
  'profesionales': 'Profesionales del Sector',
  'voluntarios': 'Voluntarios',
  'comunidad': 'Comunidad en General',
  'residentes': 'Residentes',
  'usuarios_centros_dia': 'Usuarios de Centros de Día',
  'usuarios_sad': 'Usuarios de Servicio de Ayuda a Domicilio',
};

export const agentesLabels: Record<string, string> = {
  'administracion_publica': 'Administración Pública',
  'administracion_local': 'Administración Local',
  'administracion_autonomica': 'Administración Autonómica',
  'administracion_estatal': 'Administración Estatal',
  'ong': 'ONG',
  'fundaciones': 'Fundaciones',
  'asociaciones': 'Asociaciones',
  'entidades_sociales': 'Entidades Sociales',
  'empresas': 'Empresas',
  'cooperativas': 'Cooperativas',
  'residencias': 'Residencias',
  'centros_dia': 'Centros de Día',
  'centros_salud': 'Centros de Salud',
  'hospitales': 'Hospitales',
  'centros_sociales': 'Centros Sociales',
  'trabajadores_sociales': 'Trabajadores Sociales',
  'profesionales_sanitarios': 'Profesionales Sanitarios',
  'terapeutas': 'Terapeutas',
  'psicologos': 'Psicólogos',
  'fisioterapeutas': 'Fisioterapeutas',
  'auxiliares': 'Auxiliares de Enfermería',
  'gerocultores': 'Gerocultores',
  'voluntariado': 'Voluntariado',
  'familias': 'Familias',
  'universidades': 'Universidades',
  'centros_investigacion': 'Centros de Investigación',
};

export const categoryShortNames: Record<string, string> = {
  'Autonomía y AVD': 'Autonomía y Vida Diaria',
  'Coordinación del cuidado': 'Coordinación del Cuidado',
  'Ética y buen trato': 'Ética y Buen Trato',
  'Inclusión y diversidad': 'Inclusión y Diversidad',
  'Salud preventiva y AAL': 'Salud Preventiva',
  'Soledad y Conectividad': 'Soledad y Conectividad',
};

export function expandAcronyms(text: string): string {
  return categoryShortNames[text] ?? text;
}

export function formatLabel(key: string): string {
  const keyLower = key.toLowerCase();

  if (poblacionLabels[keyLower]) return poblacionLabels[keyLower];
  if (agentesLabels[keyLower]) return agentesLabels[keyLower];

  return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
