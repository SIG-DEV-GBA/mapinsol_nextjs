'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { HighlightBadge, StatusBadge } from '@/components/ui';

export interface MediaItem {
  source_url: string;
  alt_text?: string;
  media_details?: {
    sizes?: {
      large?: { source_url: string };
      medium_large?: { source_url: string };
      medium?: { source_url: string };
      full?: { source_url: string };
    };
  };
}

interface MediaGalleryProps {
  imagenes: MediaItem[];
  youtubeId?: string | null;
  title: string;
  /** Show HighlightBadge (practica only) */
  practicaDestacada?: boolean;
  /** Show StatusBadge (practica only) */
  estadoActual?: string;
  /** Compact mode: smaller sizes, card wrapper with header */
  compact?: boolean;
  /** Stacked layout: main image full-width on top, thumbnails row below */
  layout?: 'grid' | 'stacked';
}

export function MediaGallery({
  imagenes,
  youtubeId,
  title,
  practicaDestacada,
  estadoActual,
  compact = false,
  layout = 'grid',
}: MediaGalleryProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const [isVideoMain, setIsVideoMain] = useState(!imagenes.length && !!youtubeId);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swappingIndex, setSwappingIndex] = useState<number | null>(null);
  const pendingIndexRef = useRef<number | null>(null);

  if (!imagenes.length && !youtubeId) return null;

  const getImageUrl = (img: MediaItem, size: 'large' | 'medium' | 'full' = 'large') => {
    if (size === 'full') return img.source_url;
    return (
      img.media_details?.sizes?.[size]?.source_url ||
      img.media_details?.sizes?.medium_large?.source_url ||
      img.source_url
    );
  };

  const handleImageClick = (index: number) => {
    if (index !== mainIndex && !isSwapping) {
      setIsSwapping(true);
      setSwappingIndex(index);
      pendingIndexRef.current = index;

      setTimeout(() => {
        setMainIndex(pendingIndexRef.current!);
        setIsVideoMain(false);

        setTimeout(() => {
          setIsSwapping(false);
          setSwappingIndex(null);
          pendingIndexRef.current = null;
        }, 50);
      }, 250);
    }
  };

  const handleMainImageClick = () => {
    if (!isVideoMain && imagenes[mainIndex]) {
      setModalImageIndex(mainIndex);
      setIsImageModalOpen(true);
    }
  };

  const handleVideoSwap = () => {
    if (!isSwapping) {
      setIsSwapping(true);
      setSwappingIndex(-1);

      setTimeout(() => {
        setIsVideoMain(true);

        setTimeout(() => {
          setIsSwapping(false);
          setSwappingIndex(null);
        }, 50);
      }, 250);
    }
  };

  const showBadges = !compact && layout !== 'stacked' && (practicaDestacada || estadoActual);

  // ─── STACKED LAYOUT ───────────────────────────────────────────────
  if (layout === 'stacked') {
    const content = (
      <div className="space-y-3">
        {/* Main image — full width */}
        <div
          className={`relative rounded-2xl overflow-hidden bg-gray-100 min-h-[280px] md:min-h-[420px] shadow-xl border-2 border-white transition-all duration-300 ease-out ${
            isSwapping ? 'opacity-60 scale-[0.995]' : 'opacity-100 scale-100'
          }`}
        >
          {isVideoMain && youtubeId ? (
            <div className="absolute inset-0">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
          ) : imagenes[mainIndex] ? (
            <>
              <Image
                src={getImageUrl(imagenes[mainIndex], 'large')}
                alt={imagenes[mainIndex].alt_text || title}
                fill
                className="object-cover cursor-zoom-in transition-transform duration-500 hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 700px"
                priority
                onClick={handleMainImageClick}
              />
              <button
                onClick={handleMainImageClick}
                className="absolute bottom-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[#F29429] transition-colors z-10"
                aria-label="Ampliar imagen"
              >
                <ZoomIcon size={20} />
              </button>
            </>
          ) : null}
        </div>

        {/* Thumbnails row */}
        {(imagenes.length > 1 || (youtubeId && imagenes.length > 0)) && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {/* Video thumbnail */}
            {youtubeId && !isVideoMain && (
              <div
                className={`relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer group flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 transition-all duration-300 ${
                  swappingIndex === -1 ? 'opacity-50' : ''
                }`}
                onClick={handleVideoSwap}
              >
                <div className="absolute inset-0">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title="Video"
                    className="w-full h-full border-none pointer-events-none"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <PlayIcon />
                  </div>
                </div>
              </div>
            )}

            {/* Image thumbnails (all except current main) */}
            {imagenes.map((img, index) => {
              if (index === mainIndex && !isVideoMain) return null;
              const isThisSwapping = swappingIndex === index;
              return (
                <div
                  key={index}
                  className={`relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 group transition-all duration-300 ${
                    isThisSwapping ? 'opacity-50 scale-95' : ''
                  } ${index === mainIndex ? 'ring-2 ring-[#700D39] ring-offset-1' : 'hover:ring-2 hover:ring-gray-300'}`}
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={getImageUrl(img, 'medium')}
                    alt={img.alt_text || `Imagen ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="112px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );

    return (
      <>
        {content}

        {/* Image Lightbox Modal */}
        {isImageModalOpen && imagenes.length > 0 && (
          <ImageLightbox
            imagenes={imagenes}
            currentIndex={modalImageIndex}
            onClose={() => setIsImageModalOpen(false)}
            onIndexChange={setModalImageIndex}
            title={title}
            getImageUrl={getImageUrl}
          />
        )}

        {/* Video Modal */}
        {isVideoModalOpen && youtubeId && (
          <VideoModal youtubeId={youtubeId} onClose={() => setIsVideoModalOpen(false)} />
        )}
      </>
    );
  }

  // ─── GRID LAYOUT (default) ────────────────────────────────────────
  const mainMinH = compact ? 'min-h-[200px]' : 'min-h-[250px] md:min-h-[360px]';
  const thumbMinH = compact ? 'min-h-[96px]' : 'min-h-[120px] md:min-h-[180px]';
  const gridCols = compact ? 'grid-cols-4' : 'grid-cols-2 md:grid-cols-4';
  const gap = compact ? 'gap-2' : 'gap-2 md:gap-4';
  const rounded = compact ? 'rounded-lg' : 'rounded-xl';
  const swapClass = compact
    ? (active: boolean) => active ? 'opacity-50' : 'opacity-100'
    : (active: boolean) => active ? 'animate-swapOut' : 'animate-swapIn';

  const grid = (
    <div className={`relative grid ${gridCols} ${gap} ${compact ? '' : 'mb-8'}`}>
      {/* Badges */}
      {showBadges && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2 flex-wrap z-20 pointer-events-none">
          {practicaDestacada && <HighlightBadge />}
          {estadoActual && <StatusBadge status={estadoActual} />}
        </div>
      )}

      {/* Main item */}
      <div
        className={`col-span-2 row-span-2 relative ${rounded} overflow-hidden bg-gray-100 ${mainMinH} transition-all duration-300 ease-out ${swapClass(isSwapping)}`}
      >
        {isVideoMain && youtubeId ? (
          <div className="absolute inset-0">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            />
          </div>
        ) : imagenes[mainIndex] ? (
          <>
            <Image
              src={getImageUrl(imagenes[mainIndex])}
              alt={imagenes[mainIndex].alt_text || title}
              fill
              className="object-cover cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]"
              sizes={compact ? '(max-width: 768px) 100vw, 300px' : '(max-width: 768px) 100vw, 50vw'}
              priority
              onClick={handleMainImageClick}
            />
            <button
              onClick={handleMainImageClick}
              className={`absolute ${compact ? 'bottom-2 right-2 w-8 h-8' : 'bottom-3 right-3 w-10 h-10'} bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[#F29429] transition-colors z-10`}
              aria-label="Ampliar imagen"
            >
              <ZoomIcon size={compact ? 16 : 20} />
            </button>
          </>
        ) : null}
      </div>

      {/* Video thumbnail if not main */}
      {youtubeId && !isVideoMain && (
        <div
          className={`relative ${rounded} overflow-hidden bg-gray-900 cursor-pointer group ${thumbMinH} transition-all duration-300 ${
            swappingIndex === -1 ? (compact ? 'opacity-50' : 'animate-swapOut') : ''
          }`}
          onClick={handleVideoSwap}
        >
          <div className="absolute inset-0">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title="Video"
              className="w-full h-full border-none pointer-events-none"
            />
          </div>
          {compact ? (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <PlayIcon />
              </div>
            </div>
          ) : (
            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoModalOpen(true);
                }}
                className="w-9 h-9 bg-black/70 rounded-lg flex items-center justify-center text-white hover:bg-[#F29429] transition-colors"
              >
                <ExpandIcon />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Other images — dynamically exclude current main */}
      {(() => {
        const maxThumbs = isVideoMain ? 4 : (youtubeId && !isVideoMain ? 2 : 3);
        const thumbs = isVideoMain
          ? imagenes.slice(0, 4).map((img, i) => ({ img, idx: i }))
          : imagenes
              .map((img, i) => ({ img, idx: i }))
              .filter(({ idx }) => idx !== mainIndex)
              .slice(0, maxThumbs);

        return thumbs.map(({ img, idx }) => {
          const isThisSwapping = swappingIndex === idx;
          return (
            <div
              key={idx}
              className={`relative ${rounded} overflow-hidden bg-gray-100 cursor-pointer ${thumbMinH} group transition-all duration-300 ${
                isThisSwapping ? (compact ? 'opacity-50' : 'animate-swapOut') : ''
              }`}
              onClick={() => handleImageClick(idx)}
            >
              <Image
                src={getImageUrl(img, 'medium')}
                alt={img.alt_text || `Imagen ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={compact ? '150px' : '25vw'}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100`}>
                  <ZoomIcon className="text-gray-700" size={compact ? 16 : 20} />
                </div>
              </div>
            </div>
          );
        });
      })()}
    </div>
  );

  return (
    <>
      {compact ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Galería</h3>
          </div>
          <div className="p-3">{grid}</div>
        </div>
      ) : (
        grid
      )}

      {/* Image Lightbox Modal */}
      {isImageModalOpen && imagenes.length > 0 && (
        <ImageLightbox
          imagenes={imagenes}
          currentIndex={modalImageIndex}
          onClose={() => setIsImageModalOpen(false)}
          onIndexChange={setModalImageIndex}
          title={title}
          getImageUrl={getImageUrl}
        />
      )}

      {/* Video Modal */}
      {isVideoModalOpen && youtubeId && (
        <VideoModal youtubeId={youtubeId} onClose={() => setIsVideoModalOpen(false)} />
      )}
    </>
  );
}

// Video modal
function VideoModal({ youtubeId, onClose }: { youtubeId: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-[90vw] max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 border-2 border-white rounded-full text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
        >
          <CloseIcon />
        </button>
        <div className="relative pb-[56.25%] bg-black rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}

// Lightbox component
interface ImageLightboxProps {
  imagenes: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title: string;
  getImageUrl: (img: MediaItem, size: 'large' | 'medium' | 'full') => string;
}

function ImageLightbox({
  imagenes,
  currentIndex,
  onClose,
  onIndexChange,
  title,
  getImageUrl,
}: ImageLightboxProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    onIndexChange(currentIndex === 0 ? imagenes.length - 1 : currentIndex - 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentIndex, imagenes.length, onIndexChange, isAnimating]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    onIndexChange(currentIndex === imagenes.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentIndex, imagenes.length, onIndexChange, isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, goToPrevious, goToNext]);

  const currentImage = imagenes[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.25s ease-out' }}
    >
      {/* Backdrop — same style as InfografiaViewer */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white"
        aria-label="Cerrar"
      >
        <CloseIcon />
      </button>

      {/* Counter */}
      {imagenes.length > 1 && (
        <div className="absolute top-5 left-5 z-10 text-white/70 text-sm font-medium">
          {currentIndex + 1} / {imagenes.length}
        </div>
      )}

      {/* Main image */}
      <img
        src={getImageUrl(currentImage, 'full')}
        alt={currentImage.alt_text || `${title} - Imagen ${currentIndex + 1}`}
        className="relative z-10 max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Navigation arrows */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Imagen anterior"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Siguiente imagen"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      {/* Hint */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm z-10">
        Pulsa en cualquier lugar para cerrar
      </p>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}

// Icons
function ZoomIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} style={{ width: size, height: size }}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700 ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
