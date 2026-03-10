'use client';

import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export function InfografiaViewer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative group w-full cursor-zoom-in rounded-xl overflow-hidden"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <ZoomIn className="h-6 w-6 text-[#A10D5E]" />
          </div>
        </div>
      </button>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          onClick={() => setOpen(false)}
          style={{ animation: 'fadeIn 0.25s ease-out' }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Hint */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm z-10">
            Pulsa en cualquier lugar para cerrar
          </p>

          {/* Image */}
          <img
            src={src}
            alt={alt}
            className="relative z-10 max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
            style={{ animation: 'scaleIn 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          />

          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
          `}</style>
        </div>
      )}
    </>
  );
}
