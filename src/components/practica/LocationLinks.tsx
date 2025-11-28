'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface LocationLinksProps {
  municipio?: string;
  provincia?: string;
  ccaa?: string;
  size?: 'sm' | 'md';
}

export function LocationLinks({ municipio, provincia, ccaa, size = 'md' }: LocationLinksProps) {
  const isSm = size === 'sm';

  return (
    <div className={`flex items-center gap-1.5 text-gray-${isSm ? '500' : '600'} ${isSm ? 'text-xs' : ''}`}>
      <MapPin className={`${isSm ? 'w-3.5 h-3.5' : 'w-5 h-5'} text-[#FF6900] flex-shrink-0`} />
      <span className={`flex items-center gap-1 flex-wrap ${isSm ? 'truncate' : ''}`}>
        {municipio && (
          <>
            <Link
              href={`/practicas/?localidad=${encodeURIComponent(municipio)}`}
              className="hover:text-[#FF6900] hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {municipio}
            </Link>
            {(provincia || ccaa) && <span>,</span>}
          </>
        )}
        {provincia && (
          <>
            <Link
              href={`/practicas/?localidad=${encodeURIComponent(provincia)}`}
              className="hover:text-[#FF6900] hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {provincia}
            </Link>
            {ccaa && <span>,</span>}
          </>
        )}
        {ccaa && (
          <Link
            href={`/practicas/?ccaa=${encodeURIComponent(ccaa)}`}
            className="hover:text-[#FF6900] hover:underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {ccaa}
          </Link>
        )}
      </span>
    </div>
  );
}
