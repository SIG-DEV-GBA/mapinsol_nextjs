import { cn } from '@/lib/utils';

interface PdfBadgeProps {
  className?: string;
}

export function PdfBadge({ className }: PdfBadgeProps) {
  return (
    <span
      className={cn(
        'bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg',
        className
      )}
    >
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
      PDF
    </span>
  );
}
