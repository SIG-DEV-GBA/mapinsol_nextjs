import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  'en curso': { bg: 'bg-white', text: 'text-[#A61966]', dot: 'bg-[#A61966]' },
  'finalizado': { bg: 'bg-white', text: 'text-[#A61966]', dot: 'bg-[#A61966]' },
  'finalizada': { bg: 'bg-white', text: 'text-[#A61966]', dot: 'bg-[#A61966]' },
  'pausa': { bg: 'bg-white', text: 'text-[#A61966]', dot: 'bg-[#A61966]' },
  'default': { bg: 'bg-white', text: 'text-[#A61966]', dot: 'bg-[#A61966]' },
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
        'text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-2 border border-[#A61966]/20',
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
