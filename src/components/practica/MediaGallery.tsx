'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { HighlightBadge, StatusBadge } from '@/components/ui';

interface MediaItem {
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
  youtubeId: string | null;
  practicaDestacada?: boolean;
  estadoActual?: string;
  title: string;
}

export function MediaGallery({
  imagenes,
  youtubeId,
  practicaDestacada,
  estadoActual,
  title,
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
    if (size === 'full') {
      return img.source_url;
    }
    return (
      img.media_details?.sizes?.[size]?.source_url ||
      img.media_details?.sizes?.medium_large?.source_url ||
      img.source_url
    );
  };

  const handleImageClick = (index: number) => {
    if (index !== mainIndex && !isSwapping) {
      // Start swap animation
      setIsSwapping(true);
      setSwappingIndex(index);
      pendingIndexRef.current = index;

      // After fade out, swap the images
      setTimeout(() => {
        setMainIndex(pendingIndexRef.current!);
        setIsVideoMain(false);

        // After swap, fade in
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
      setSwappingIndex(-1); // -1 indicates video

      setTimeout(() => {
        setIsVideoMain(true);

        setTimeout(() => {
          setIsSwapping(false);
          setSwappingIndex(null);
        }, 50);
      }, 250);
    }
  };

  return (
    <>
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8">
        {/* Badges flotantes */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2 flex-wrap z-20 pointer-events-none">
          {practicaDestacada && <HighlightBadge />}
          {estadoActual && <StatusBadge status={estadoActual} />}
        </div>

        {/* Main item */}
        <div
          className={`col-span-2 row-span-2 relative rounded-xl overflow-hidden bg-gray-100 min-h-[250px] md:min-h-[360px] transition-all duration-300 ease-out ${
            isSwapping ? 'animate-swapOut' : 'animate-swapIn'
          }`}
        >
          {isVideoMain && youtubeId ? (
            <div className="absolute inset-0">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title="Video de la buena practica"
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
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onClick={handleMainImageClick}
              />
              {/* Indicador de zoom */}
              <button
                onClick={handleMainImageClick}
                className="absolute bottom-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[#FF6900] transition-colors z-10"
                aria-label="Ampliar imagen"
              >
                <ZoomIcon />
              </button>
            </>
          ) : null}
        </div>

        {/* Video thumbnail if not main */}
        {youtubeId && !isVideoMain && (
          <div
            className={`relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer group min-h-[120px] md:min-h-[180px] transition-all duration-300 ${
              swappingIndex === -1 ? 'animate-swapOut' : ''
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
            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoModalOpen(true);
                }}
                className="w-9 h-9 bg-black/70 rounded-lg flex items-center justify-center text-white hover:bg-[#FF6900] transition-colors"
              >
                <ExpandIcon />
              </button>
            </div>
          </div>
        )}

        {/* Other images */}
        {imagenes.slice(isVideoMain ? 0 : 1, isVideoMain ? 4 : youtubeId ? 3 : 4).map((img, i) => {
          const actualIndex = isVideoMain ? i : i + 1;
          const isThisSwapping = swappingIndex === actualIndex;
          return (
            <div
              key={actualIndex}
              className={`relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer min-h-[120px] md:min-h-[180px] group transition-all duration-300 ${
                isThisSwapping ? 'animate-swapOut' : ''
              }`}
              onClick={() => handleImageClick(actualIndex)}
            >
              <Image
                src={getImageUrl(img, 'medium')}
                alt={img.alt_text || `Imagen ${actualIndex + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="25vw"
                loading="lazy"
              />
              {/* Overlay con icono de zoom en hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                  <ZoomIcon className="text-gray-700" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div className="relative w-[90vw] max-w-5xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
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
      )}
    </>
  );
}

// Lightbox component for images
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

  // Keyboard navigation
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
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent z-10 flex items-center justify-between px-4 md:px-6">
        <span className="text-white/80 text-sm font-medium">
          {currentIndex + 1} / {imagenes.length}
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Main image container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-6xl max-h-[85vh] animate-scaleIn">
          <Image
            src={getImageUrl(currentImage, 'full')}
            alt={currentImage.alt_text || `${title} - Imagen ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Navigation arrows */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Imagen anterior"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Siguiente imagen"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {imagenes.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4 px-4">
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
            {imagenes.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange(index);
                }}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-[#FF6900] ring-offset-2 ring-offset-black scale-110'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={getImageUrl(img, 'medium')}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Caption */}
      {currentImage.alt_text && (
        <div className="absolute bottom-28 left-0 right-0 text-center px-4">
          <p className="text-white/90 text-sm md:text-base bg-black/40 inline-block px-4 py-2 rounded-full">
            {currentImage.alt_text}
          </p>
        </div>
      )}
    </div>
  );
}

// Icons
function ZoomIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-5 h-5 ${className}`}>
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
