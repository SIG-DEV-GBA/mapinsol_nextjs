import Link from 'next/link';
import { Users, Tag, User, Mail, Phone, Link2, ExternalLink, Hash, MapPin } from 'lucide-react';
import type { BuenaPractica } from '@/types';
import { expandAcronyms, formatLabel } from '@/lib/labelMappings';
import { cn } from '@/lib/utils';

interface PracticaSidebarProps {
  practica: BuenaPractica;
  poblacion: string[];
  agentes: string[];
}

export function PracticaSidebar({ practica, poblacion, agentes }: PracticaSidebarProps) {
  // Preparar datos para TagList con enlaces
  const poblacionTags = poblacion.map((p) => ({
    label: formatLabel(p),
    filterParam: 'poblacion',
    filterValue: p,
  }));

  const agentesTags = agentes.map((a) => ({
    label: formatLabel(a),
    filterParam: 'agentes',
    filterValue: a,
  }));

  const categoriasTags = (practica.categoriesDetails || []).map((c) => ({
    label: expandAcronyms(c.name),
    filterParam: 'categoria',
    filterValue: c.name,
  }));

  const etiquetasTags = (practica.tagsDetails || []).map((t) => ({
    label: t.name,
    filterParam: 'etiqueta',
    filterValue: t.name,
  }));

  // Construir ubicación estructurada
  const hasUbicacion = practica.country || practica.ccaa || practica.provincia || practica.municipio || practica.internacionalBoolean;
  const ubicacionParts: string[] = [];
  if (practica.municipio) ubicacionParts.push(practica.municipio);
  if (practica.provincia) ubicacionParts.push(practica.provincia);
  const ubicacionDisplay = ubicacionParts.join(', ');

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
      {/* Info General */}
      <SidebarCard title="Información">
        <dl className="grid gap-3.5">
          {practica.ambitoTerritorial && (
            <InfoItem label="Ámbito" value={practica.ambitoTerritorial} />
          )}
          {practica.tipoEntorno && <InfoItem label="Entorno" value={practica.tipoEntorno} />}
          {practica.anioInicio && <InfoItem label="Año inicio" value={String(practica.anioInicio)} />}
          {practica.estadoActual && (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Estado
              </dt>
              <dd className="mt-0.5">
                <StatusPill status={practica.estadoActual} linkable />
              </dd>
            </div>
          )}
        </dl>
      </SidebarCard>

      {/* Ubicación */}
      {hasUbicacion && (
        <SidebarCard title="Ubicación" icon={MapPin}>
          <div className="flex flex-col gap-2">
            {practica.internacionalBoolean && (
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-lg text-sm font-medium text-violet-700">
                Internacional
              </span>
            )}
            {practica.country && (
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg text-sm font-medium text-indigo-700">
                {practica.country}
              </span>
            )}
            {practica.ccaa && (
              <Link
                href={`/practicas/?ccaa=${encodeURIComponent(practica.ccaa)}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg text-sm font-medium text-teal-700 hover:bg-teal-100 transition-all duration-200 hover:scale-[1.02]"
              >
                <MapPin className="w-4 h-4 text-teal-500" />
                {practica.ccaa}
              </Link>
            )}
            {ubicacionDisplay && (
              <span className="text-sm text-gray-600 pl-1">{ubicacionDisplay}</span>
            )}
          </div>
        </SidebarCard>
      )}

      {/* Población */}
      {poblacionTags.length > 0 && (
        <SidebarCard title="Población" icon={Users}>
          <TagList tags={poblacionTags} color="purple" />
        </SidebarCard>
      )}

      {/* Agentes */}
      {agentesTags.length > 0 && (
        <SidebarCard title="Agentes" icon={Users}>
          <TagList tags={agentesTags} color="teal" />
        </SidebarCard>
      )}

      {/* Categorías */}
      {categoriasTags.length > 0 && (
        <SidebarCard title="Categorías" icon={Tag}>
          <TagList tags={categoriasTags} color="orange" />
        </SidebarCard>
      )}

      {/* Etiquetas */}
      {etiquetasTags.length > 0 && (
        <SidebarCard title="Etiquetas" icon={Hash}>
          <TagList tags={etiquetasTags} color="blue" />
        </SidebarCard>
      )}

      {/* Contacto */}
      {practica.mostrarContacto &&
        practica.personasContacto &&
        practica.personasContacto.length > 0 && (
          <SidebarCard
            title="Contacto"
            icon={User}
            className="bg-gradient-to-br from-orange-50 to-white border-orange-200"
          >
            {practica.personasContacto.map((contact, idx) => (
              <ContactBlock key={idx} contact={contact} isLast={idx === practica.personasContacto!.length - 1} />
            ))}
          </SidebarCard>
        )}

      {/* Enlaces */}
      {practica.enlacesAnexos && practica.enlacesAnexos.length > 0 && (
        <SidebarCard title="Enlaces" icon={Link2}>
          <div className="flex flex-col gap-2">
            {practica.enlacesAnexos.map(
              (enlace, idx) =>
                enlace.url_enlace && (
                  <a
                    key={idx}
                    href={enlace.url_enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-[#FF6900] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{enlace.texto_enlace || 'Ver enlace'}</span>
                  </a>
                )
            )}
          </div>
        </SidebarCard>
      )}
    </aside>
  );
}

interface SidebarCardProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}

function SidebarCard({ title, icon: Icon, className, children }: SidebarCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-5 shadow-sm border border-gray-100',
        className
      )}
    >
      <h4 className="flex items-center gap-2 text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-4">
        {Icon && <Icon className="w-4 h-4" />}
        {title}
      </h4>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm font-medium text-gray-800 mt-0.5">{value}</dd>
    </div>
  );
}

function StatusPill({ status, linkable = false }: { status: string; linkable?: boolean }) {
  const statusLower = status.toLowerCase();
  let colorClass = 'bg-gray-200 text-gray-600';
  let hoverClass = '';

  if (statusLower.includes('curso')) {
    colorClass = 'bg-emerald-100 text-emerald-700';
    hoverClass = 'hover:bg-emerald-200';
  } else if (statusLower.includes('final')) {
    colorClass = 'bg-fuchsia-100 text-fuchsia-700';
    hoverClass = 'hover:bg-fuchsia-200';
  } else if (statusLower.includes('pausa')) {
    colorClass = 'bg-amber-100 text-amber-700';
    hoverClass = 'hover:bg-amber-200';
  } else {
    hoverClass = 'hover:bg-gray-300';
  }

  const baseClasses = cn(
    'inline-block px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200',
    colorClass,
    linkable && hoverClass,
    linkable && 'hover:scale-105'
  );

  if (linkable) {
    return (
      <Link href={`/practicas/?estado=${encodeURIComponent(status)}`} className={baseClasses}>
        {status}
      </Link>
    );
  }

  return <span className={baseClasses}>{status}</span>;
}

interface TagListProps {
  tags: { label: string; filterParam: string; filterValue: string }[];
  color: 'purple' | 'teal' | 'orange' | 'blue';
}

function TagList({ tags, color }: TagListProps) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    teal: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
    orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, idx) => (
        <Link
          key={idx}
          href={`/practicas/?${tag.filterParam}=${encodeURIComponent(tag.filterValue)}`}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105',
            colorClasses[color]
          )}
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}

interface ContactBlockProps {
  contact: {
    nombre_contacto?: string;
    cargo?: string;
    mail_contacto?: string;
    tlf_contacto?: string;
  };
  isLast: boolean;
}

function ContactBlock({ contact, isLast }: ContactBlockProps) {
  return (
    <div className={cn('pb-4 mb-4', !isLast && 'border-b border-gray-100')}>
      {contact.nombre_contacto && (
        <strong className="block text-[15px] text-gray-800">{contact.nombre_contacto}</strong>
      )}
      {contact.cargo && (
        <span className="block text-xs text-gray-500 mb-2.5">{contact.cargo}</span>
      )}
      <div className="flex flex-col gap-1.5">
        {contact.mail_contacto && (
          <a
            href={`mailto:${contact.mail_contacto}`}
            className="inline-flex items-center gap-2 text-sm text-[#FF6900] hover:underline"
          >
            <Mail className="w-4 h-4" />
            <span>{contact.mail_contacto}</span>
          </a>
        )}
        {contact.tlf_contacto && (
          <a
            href={`tel:${contact.tlf_contacto}`}
            className="inline-flex items-center gap-2 text-sm text-[#FF6900] hover:underline"
          >
            <Phone className="w-4 h-4" />
            <span>{contact.tlf_contacto}</span>
          </a>
        )}
      </div>
    </div>
  );
}
