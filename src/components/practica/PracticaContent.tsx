import { Target, BookOpen, TrendingUp, Lightbulb, Heart, Globe, CheckCircle2 } from 'lucide-react';
import type { BuenaPractica } from '@/types';
import { cn } from '@/lib/utils';

interface PracticaContentProps {
  practica: BuenaPractica;
}

const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '').trim() || '';

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
        <ObjetivoCard objetivo={stripHtml(practica.objetivoPrincipal)} />
      )}

      {/* Descripción */}
      {hasDescripcion && (
        <ContentCard title="Descripción" icon={BookOpen}>
          {practica.descripcionGrupo && (
            <Field label="Descripción General" value={stripHtml(practica.descripcionGrupo)} />
          )}
          {practica.actividadesDesarrolladas && (
            <Field
              label="Actividades Desarrolladas"
              value={stripHtml(practica.actividadesDesarrolladas)}
            />
          )}
          {practica.metodologiaAplicada && (
            <Field label="Metodología" value={stripHtml(practica.metodologiaAplicada)} />
          )}
        </ContentCard>
      )}

      {/* Resultados */}
      {hasResultados && (
        <ContentCard title="Resultados y Evaluación" icon={TrendingUp} titleColor="text-green-600">
          {practica.resultadosObtenidos && (
            <Highlight color="green" label="Resultados Obtenidos">
              {stripHtml(practica.resultadosObtenidos)}
            </Highlight>
          )}
          {practica.indicadoresEvaluacion && (
            <Field
              label="Indicadores de Evaluación"
              value={stripHtml(practica.indicadoresEvaluacion)}
            />
          )}
          {practica.leccionesAprendidas && (
            <Highlight color="yellow" label="Lecciones Aprendidas" icon={Lightbulb}>
              {stripHtml(practica.leccionesAprendidas)}
            </Highlight>
          )}
        </ContentCard>
      )}

      {/* Innovación */}
      {hasInnovacion && (
        <ContentCard title="Innovación y Tecnología" icon={Lightbulb} titleColor="text-purple-600">
          {practica.elementoInnovador && (
            <Field label="Elemento Innovador" value={stripHtml(practica.elementoInnovador)} />
          )}
          {practica.usoTecnologia && (
            <Field label="Uso de Tecnología" value={stripHtml(practica.usoTecnologia)} />
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
                content={stripHtml(practica.respetoDignidadAutonomia)}
              />
            )}
            {practica.prevencionMaltrato && (
              <EthicsItem
                title="Prevención del Maltrato"
                content={stripHtml(practica.prevencionMaltrato)}
              />
            )}
            {practica.participacionPersonas && (
              <EthicsItem
                title="Participación"
                content={stripHtml(practica.participacionPersonas)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {practica.requisitosImplementacion && (
                <TransferItem
                  label="Requisitos"
                  value={stripHtml(practica.requisitosImplementacion)}
                />
              )}
              {practica.sostenibilidad && (
                <TransferItem label="Sostenibilidad" value={stripHtml(practica.sostenibilidad)} />
              )}
            </div>
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
          <p className="text-gray-800 leading-relaxed">{objetivo}</p>
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </label>
      <p className="text-gray-600 leading-relaxed">{value}</p>
    </div>
  );
}

interface HighlightProps {
  color: 'green' | 'yellow';
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function Highlight({ color, label, icon: Icon, children }: HighlightProps) {
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
      <p className="text-gray-600 text-[15px] leading-relaxed">{children}</p>
    </div>
  );
}

function EthicsItem({ title, content }: { title: string; content: string }) {
  return (
    <div className="flex gap-3.5 p-4 bg-rose-50 rounded-xl">
      <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
      <div>
        <strong className="block text-sm text-rose-700 mb-1">{title}</strong>
        <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
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

function TransferItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-sky-50 rounded-lg">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-600 mb-1.5">
        {label}
      </span>
      <p className="text-sm text-gray-600 leading-relaxed">{value}</p>
    </div>
  );
}
