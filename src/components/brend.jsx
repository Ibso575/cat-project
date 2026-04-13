import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

// Swiper stillari
import 'swiper/css';
import 'swiper/css/navigation';

// Brendlar logotiplari (SVG kengaytmasi bo'lsa, import shunday qoladi)
import brand1 from '../assets/freshstep.svg';
import brand2 from '../assets/acana.svg';
import brand3 from '../assets/furminator.svg';
import brand4 from '../assets/beapher.svg';
import brand5 from '../assets/gurman.svg';
import brand6 from '../assets/hm.svg';

const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand1, brand2];

const BrandCard = ({ logo }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl lg:rounded-2xl flex items-center justify-center p-4 lg:p-6 h-28 md:h-32 lg:h-36 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-gray-200 dark:hover:border-slate-700 hover:-translate-y-1">
      <img 
        src={logo} 
        alt="Brand Logo" 
        className="max-h-full max-w-[80%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 dark:invert-[0.1]" 
      />
    </div>
  );
};

const BrandsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white dark:bg-slate-950 select-none overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 relative">
        
        {/* Sarlavha qismi - Mobilda matn kichikroq bo'ladi */}
        <div className="mb-6 lg:mb-10 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl lg:text-[32px] font-black text-gray-900 dark:text-white tracking-tight uppercase">
            {t('popular_brands')}
          </h2>
          <button className="text-[#ff9800] flex items-center gap-1 text-xs md:text-sm font-bold hover:underline whitespace-nowrap uppercase tracking-wide">
            {t('view_all')} <ChevronRight size={16} className="md:w-[18px]" />
          </button>
        </div>

        {/* Slider Konteyneri */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={12} // Mobilda kichikroq masofa
            slidesPerView={2.2} // Mobilda 2 tadan ko'proq ko'rinishi slider ekanini bildiradi
            navigation={{
              nextEl: '.brands-next',
              prevEl: '.brands-prev',
            }}
            breakpoints={{
              // Planshet (Vertical)
              640: { 
                slidesPerView: 3.2,
                spaceBetween: 16 
              },
              // Planshet (Horizontal)
              768: { 
                slidesPerView: 4,
                spaceBetween: 20 
              },
              // Desktop
              1024: { 
                slidesPerView: 5,
                spaceBetween: 20 
              },
              // Katta monitor
              1280: { 
                slidesPerView: 6,
                spaceBetween: 20 
              },
            }}
            className="!pb-6"
          >
            {brands.map((logo, index) => (
              <SwiperSlide key={index} className="h-auto">
                <BrandCard logo={logo} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigatsiya tugmalari - Mobilda yashiriladi (hidden), faqat lg ekranda chiqadi */}
          <button className="brands-prev absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 bg-white dark:bg-slate-800 shadow-xl rounded-full hidden lg:flex items-center justify-center border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:text-[#ff9800] active:scale-95 disabled:opacity-0">
            <ChevronLeft size={24} />
          </button>
          
          <button className="brands-next absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 bg-white dark:bg-slate-800 shadow-xl rounded-full hidden lg:flex items-center justify-center border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:text-[#ff9800] active:scale-95 disabled:opacity-0">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;