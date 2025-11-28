import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  'en curso': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'finalizado': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', dot: 'bg-fuchsia-500' },
  'finalizada': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', dot: 'bg-fuchsia-500' },
  'pausa': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'default': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

function getStatusStyle(status: string) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('curso')) return statusConfig['en curso'];
  if (statusLower.includes('final')) return statusConfig['finalizado'];
  if (statusLower.includes('pausa')) return statusConfig['pausa'];
  return statusConfig['default'];
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = getStatusStyle(status);

  return (
    <div
      className={cn(
        'text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-2',
        style.bg,
        style.text,
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full animate-pulse', style.dot)} />
      {status}
    </div>
  );
}
