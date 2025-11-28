import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface CategoryIconProps {
  href: string;
  name: string;
  Icon: LucideIcon;
}

export function CategoryIcon({ href, name, Icon }: CategoryIconProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
        <Icon className="h-9 w-9 text-[#700D39] transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF6900]" />
      </div>
      <span className="text-xs font-semibold text-white text-center max-w-[80px]">
        {name}
      </span>
    </Link>
  );
}
