'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BuenaPractica } from '@/types';
import { PracticaCard } from '@/components/PracticaCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FeaturedPracticesCarouselProps {
  practicas: BuenaPractica[];
}

export function FeaturedPracticesCarousel({ practicas }: FeaturedPracticesCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (practicas.length === 0) {
    return null;
  }

  return (
    <section className="relative pt-20 pb-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 text-[#FF6900]">
            <Star className="h-6 w-6 fill-current" />
            <span className="text-sm font-semibold uppercase tracking-wider">Destacadas</span>
            <Star className="h-6 w-6 fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-[#700D39] lg:text-4xl mb-3">
            Buenas Prácticas Destacadas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Iniciativas reconocidas por su impacto y excelencia en la mejora de la calidad de vida de las personas mayores
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative pb-16 mt-8 pt-4">
          <div className="relative mx-4 md:mx-16">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={30}
              loop={practicas.length > 3}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                el: '.featured-pagination',
                bulletClass: 'featured-bullet',
                bulletActiveClass: 'featured-bullet-active',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
              }}
              className="py-8 featured-swiper"
            >
              {practicas.map((practica) => (
                <SwiperSlide key={practica.id} className="!h-auto">
                  <div className="w-full h-full py-2 px-1">
                    <PracticaCard practica={practica} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 md:-left-2 lg:left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FF6900] to-[#F18E19] rounded-full shadow-lg flex items-center justify-center text-white border-[3px] border-white hover:scale-110 transition-transform duration-300 hover:shadow-xl"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={3} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 md:-right-2 lg:right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FF6900] to-[#F18E19] rounded-full shadow-lg flex items-center justify-center text-white border-[3px] border-white hover:scale-110 transition-transform duration-300 hover:shadow-xl"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={3} />
          </button>

          {/* Pagination */}
          <div className="featured-pagination flex justify-center gap-2 mt-10" />
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />

      {/* Inner shadow bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ boxShadow: 'inset 0 -15px 25px -10px rgba(0, 0, 0, 0.08)' }}
      />

      <style jsx global>{`
        .featured-bullet {
          width: 10px;
          height: 10px;
          background-color: #d1d5db;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .featured-bullet:hover {
          background-color: #9ca3af;
          transform: scale(1.2);
        }

        .featured-bullet-active {
          background: linear-gradient(90deg, #FF6900 0%, #F18E19 100%);
          width: 40px;
          box-shadow: 0 2px 8px rgba(255, 105, 0, 0.3);
        }
      `}</style>
    </section>
  );
}
