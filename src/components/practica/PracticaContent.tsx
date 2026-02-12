import { Target, BookOpen, TrendingUp, Lightbulb, Heart, Globe, CheckCircle2 } from 'lucide-react';
import type { BuenaPractica } from '@/types';
import { cn } from '@/lib/utils';
import { SafeHtml } from '@/components/ui/SafeHtml';

interface PracticaContentProps {
  practica: BuenaPractica;
}

export function PracticaContent({ practica }: PracticaContentProps) {
  const hasDescripcion =
    practica.descripcionGrupo || practica.actividadesDesarrolladas || practica.metodologiaAplicada;
  const hasResultados =
    practica.resultadosObtenidos || practica.indicadoresEvaluacion || practica.leccionesAprendidas;
  const hasInnovacion = practica.elementoInnovador || practica.usoTecnologia;
  const hasEtica =
    practica.respetoDignidadAutonomia ||
    practica.prevencionMaltrato ||
    practica.participacionPersonas;
  const hasTransfer =
    practica.nivelTransferibilidad ||
    practica.requisitosImplementacion ||
    practica.sostenibilidad;

  return (
    <div className="space-y-6">
      {/* Objetivo Principal */}
      {practica.objetivoPrincipal && (
        <ObjetivoCard objetivo={practica.objetivoPrincipal} />
      )}

      {/* Descripción */}
      {hasDescripcion && (
        <ContentCard title="Descripción" icon={BookOpen}>
          {practica.descripcionGrupo && (
            <HtmlField label="Descripción General" html={practica.descripcionGrupo} />
          )}
          {practica.actividadesDesarrolladas && (
            <HtmlField
              label="Actividades Desarrolladas"
              html={practica.actividadesDesarrolladas}
            />
          )}
          {practica.metodologiaAplicada && (
            <HtmlField label="Metodología" html={practica.metodologiaAplicada} />
          )}
        </ContentCard>
      )}

      {/* Resultados */}
      {hasResultados && (
        <ContentCard title="Resultados y Evaluación" icon={TrendingUp} titleColor="text-green-600">
          {practica.resultadosObtenidos && (
            <HtmlHighlight color="green" label="Resultados Obtenidos" html={practica.resultadosObtenidos} />
          )}
          {practica.indicadoresEvaluacion && (
            <HtmlField
              label="Indicadores de Evaluación"
              html={practica.indicadoresEvaluacion}
            />
          )}
          {practica.leccionesAprendidas && (
            <HtmlHighlight color="yellow" label="Lecciones Aprendidas" icon={Lightbulb} html={practica.leccionesAprendidas} />
          )}
        </ContentCard>
      )}

      {/* Innovación */}
      {hasInnovacion && (
        <ContentCard title="Innovación y Tecnología" icon={Lightbulb} titleColor="text-purple-600">
          {practica.elementoInnovador && (
            <HtmlField label="Elemento Innovador" html={practica.elementoInnovador} />
          )}
          {practica.usoTecnologia && (
            <HtmlField label="Uso de Tecnología" html={practica.usoTecnologia} />
          )}
        </ContentCard>
      )}

      {/* Ética */}
      {hasEtica && (
        <ContentCard title="Aspectos Éticos" icon={Heart} titleColor="text-rose-600">
          <div className="space-y-3">
            {practica.respetoDignidadAutonomia && (
              <EthicsItem
                title="Dignidad y Autonomía"
                html={practica.respetoDignidadAutonomia}
              />
            )}
            {practica.prevencionMaltrato && (
              <EthicsItem
                title="Prevención del Maltrato"
                html={practica.prevencionMaltrato}
              />
            )}
            {practica.participacionPersonas && (
              <EthicsItem
                title="Participación"
                html={practica.participacionPersonas}
              />
            )}
          </div>
        </ContentCard>
      )}

      {/* Transferibilidad */}
      {hasTransfer && (
        <ContentCard title="Transferibilidad" icon={Globe} titleColor="text-sky-600">
          <div className="space-y-4">
            {practica.nivelTransferibilidad && (
              <TransferLevel nivel={practica.nivelTransferibilidad} />
            )}
            {practica.requisitosImplementacion && (
              <TransferItem
                label="Requisitos"
                html={practica.requisitosImplementacion}
              />
            )}
            {practica.sostenibilidad && (
              <TransferItem label="Sostenibilidad" html={practica.sostenibilidad} />
            )}
          </div>
        </ContentCard>
      )}
    </div>
  );
}

function ObjetivoCard({ objetivo }: { objetivo: string }) {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6900]" />
      <div className="flex gap-5 p-6 pl-8">
        <div className="w-12 h-12 bg-[#FF6900] rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-2">
            Objetivo Principal
          </h2>
          <SafeHtml html={objetivo} className="text-gray-800 leading-relaxed" />
        </div>
      </div>
    </section>
  );
}

interface ContentCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  titleColor?: string;
  children: React.ReactNode;
}

function ContentCard({ title, icon: Icon, titleColor, children }: ContentCardProps) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3
        className={cn(
          'flex items-center gap-2.5 text-base font-bold mb-5 pb-4 border-b-2 border-gray-100',
          titleColor || 'text-gray-800'
        )}
      >
        <Icon className="w-5 h-5" />
        {title}
      </h3>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function HtmlField({ label, html }: { label: string; html: string }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </label>
      <SafeHtml html={html} className="text-gray-600 leading-relaxed" />
    </div>
  );
}

interface HtmlHighlightProps {
  color: 'green' | 'yellow';
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  html: string;
}

function HtmlHighlight({ color, label, icon: Icon, html }: HtmlHighlightProps) {
  const colorClasses = {
    green: 'bg-green-50 border-l-green-500 [&_strong]:text-green-800',
    yellow: 'bg-yellow-50 border-l-yellow-500 [&_strong]:text-yellow-800',
  };

  return (
    <div className={cn('p-5 rounded-xl border-l-[3px]', colorClasses[color])}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        <strong className="text-sm font-semibold">{label}</strong>
      </div>
      <SafeHtml html={html} className="text-gray-600 text-[15px] leading-relaxed" />
    </div>
  );
}

function EthicsItem({ title, html }: { title: string; html: string }) {
  return (
    <div className="flex gap-3.5 p-4 bg-rose-50 rounded-xl">
      <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
      <div>
        <strong className="block text-sm text-rose-700 mb-1">{title}</strong>
        <SafeHtml html={html} className="text-sm text-gray-600 leading-relaxed" />
      </div>
    </div>
  );
}

function TransferLevel({ nivel }: { nivel: string }) {
  const nivelLower = nivel.toLowerCase();
  let percentage = 50;
  let color = '#6b7280';
  let label = nivel;

  if (nivelLower.includes('alta') || nivelLower.includes('alto')) {
    percentage = 100;
    color = '#10b981';
    label = 'Alta';
  } else if (nivelLower.includes('media') || nivelLower.includes('medio')) {
    percentage = 66;
    color = '#f59e0b';
    label = 'Media';
  } else if (nivelLower.includes('baja') || nivelLower.includes('bajo')) {
    percentage = 33;
    color = '#ef4444';
    label = 'Baja';
  }

  return (
    <div className="p-4 bg-sky-50 rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
          Nivel de Transferibilidad
        </span>
        <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">{label}</span>
      </div>
      <div className="h-6 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
        <div
          className="h-full rounded-xl transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TransferItem({ label, html }: { label: string; html: string }) {
  return (
    <div className="p-4 bg-sky-50 rounded-lg">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-600 mb-1.5">
        {label}
      </span>
      <SafeHtml html={html} className="text-sm text-gray-600 leading-relaxed" />
    </div>
  );
}
