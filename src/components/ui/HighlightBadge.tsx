import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HighlightBadgeProps {
  className?: string;
}

export function HighlightBadge({ className }: HighlightBadgeProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-lg flex items-center gap-1.5',
        className
      )}
    >
      <Star className="w-3.5 h-3.5 fill-current" />
      Destacada
    </div>
  );
}
