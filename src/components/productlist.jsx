import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../config/axios'; // Sizning axios instansiyangiz

// Swiper stillari
import 'swiper/css';
import 'swiper/css/navigation';

const ProductCard = ({ product }) => {
  // Backend Schema bo'yicha ma'lumotlarni ajratib olish
  const name = product?.name;
  const mainVariant = product?.main_variant;
  const imageUrl = product?.image_url;
  
  // Chegirma foizini hisoblash
  const discount = (mainVariant?.old_price && mainVariant?.price) 
    ? Math.round(((mainVariant.old_price - mainVariant.price) / mainVariant.old_price) * 100) 
    : 0;

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col h-full relative group hover:shadow-lg transition-all duration-300">
      {/* Chegirma belgisi (Aksiya) */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10">
          -{discount}%
        </div>
      )}

      {/* Rasm qismi */}
      <div className="h-44 w-full flex items-center justify-center mb-4 p-2 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" 
        />
      </div>

      {/* Mahsulot nomi va og'irligi */}
      <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem] leading-tight font-medium">
        {name}
      </h3>
      
      <div className="text-[11px] text-gray-400 mb-4">
        {mainVariant?.weight} {mainVariant?.weight_unit}
      </div>

      {/* Narxlar va Savatcha */}
      <div className="mt-auto">
        <div className="flex flex-col mb-3">
          <span className="text-xl font-black text-red-600 leading-none">
            {mainVariant?.price} ₽
          </span>
          {mainVariant?.old_price && (
            <span className="text-xs text-gray-400 line-through mt-1 italic">
              {mainVariant.old_price} ₽
            </span>
          )}
        </div>

        <button className="w-full bg-[#ff9800] text-white py-2.5 rounded-lg font-bold hover:bg-[#e68a00] active:scale-95 transition-all text-sm shadow-md">
          В корзину
        </button>
        
        <button className="w-full text-[#ff9800] text-[11px] mt-2 font-semibold hover:underline">
          Купить в 1 клик
        </button>
      </div>
    </div>
  );
};

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API'dan ma'lumotlarni xavfsiz olish
    api.get('/products')
      .then(response => {
        // Schema bo'yicha ma'lumot 'data.data' ichida bo'lsa
        const fetchedData = response.data?.data || response.data;
        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ma'lumot olishda xatolik:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9800]"></div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white overflow-visible">
      <div className="container mx-auto px-4 relative">
        
        {/* Sarlavha */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight text-[32px]">Акции</h2>
          <button className="text-[#ff9800] flex items-center gap-1 text-sm font-bold hover:gap-2 transition-all">
            Смотреть все <ChevronRight size={20} />
          </button>
        </div>

        {/* Slider Konteyneri */}
        <div className="relative group">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.2} // Mobilda keyingi karta qisman ko'rinadi
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 }, // Skrinshotdagidek 5 ta karta
            }}
            className="pb-5"
          >
            {/* Map'dan oldin products borligini tekshiramiz */}
            {products && products.length > 0 ? (
              products.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <ProductCard product={item} />
                </SwiperSlide>
              ))
            ) : (
              <div className="text-center w-full py-10 text-gray-400">Mahsulotlar topilmadi.</div>
            )}
          </Swiper>

          {/* Navigatsiya tugmalari */}
          <button className="custom-prev absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white shadow-2xl rounded-full flex items-center justify-center border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:text-[#ff9800]">
            <ChevronLeft size={28} />
          </button>
          <button className="custom-next absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white shadow-2xl rounded-full flex items-center justify-center border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:text-[#ff9800]">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;