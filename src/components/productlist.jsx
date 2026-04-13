import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, getQty } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*');
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9800]" />
      </div>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-360 mx-auto px-5 relative">
        {/* Sarlavha */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[28px] font-black text-[#222]">Акции</h2>
          <Link to="/sales" className="text-[#ff9800] flex items-center gap-1 text-[15px] font-bold hover:gap-2 transition-all cursor-pointer">
            Смотреть все <ChevronRight size={18} />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="relative group/slider">
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: '.product-prev', nextEl: '.product-next' }}
              spaceBetween={16}
              slidesPerView="auto"
            >
              {products.map((product) => {
                const mainVariant = product.main_variant ?? {};
                const qty = getQty(product.id);
                const price = product.price ?? mainVariant.price ?? 0;
                const oldPrice = product.old_price ?? mainVariant.old_price ?? 0;
                const imageSrc = product.image_url || product.image || '';
                const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

                return (
                  <SwiperSlide key={product.id} className="h-auto!" style={{ width: 230 }}>
                    <div className="group bg-white border border-[#e0e0e0] flex flex-col relative overflow-hidden transition-shadow duration-300 hover:shadow-xl" style={{ width: 230, height: 500 }}>

                      {/* Chegirma belgisi */}
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-[#e53935] text-white text-[13px] font-bold px-2.5 py-1 rounded-sm z-10">
                          –{discount}%
                        </div>
                      )}

                      {/* Rasm */}
                      <div className="w-full overflow-hidden" style={{ height: 220 }}>
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                            Нет фото
                          </div>
                        )}
                      </div>

                      {/* Matn qismi */}
                      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">

                        {/* Nomi */}
                        <h3 className="text-[15px] text-[#222] font-normal leading-snug mb-2 min-h-10 line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Variant tanlash */}
                        {(Array.isArray(product.variants) && product.variants.length > 0) || mainVariant.weight ? (
                          <div className="mb-3 relative">
                            <select className="w-full h-10 border border-[#e0e0e0] rounded-md bg-white text-[15px] text-[#45494f] pl-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#ff9800] transition-colors">
                              {Array.isArray(product.variants) && product.variants.length > 0
                                ? product.variants.map((v, i) => (
                                    <option key={i} value={v.id || v.weight}>
                                      {v.weight} {v.weight_unit}
                                    </option>
                                  ))
                                : (
                                    <option>{mainVariant.weight} {mainVariant.weight_unit}</option>
                                  )}
                            </select>
                            <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                          </div>
                        ) : null}

                        {/* Narx */}
                        <div className="flex items-end gap-2 mb-3">
                          <span className="text-[#ff9800] text-[22px] font-extrabold leading-none">
                            {price} ₽
                          </span>
                          {oldPrice && (
                            <span className="text-[#bdbdbd] text-[15px] line-through leading-none">
                              {oldPrice} ₽
                            </span>
                          )}
                        </div>

                        {/* Savat tugmalari */}
                        <div className="mt-auto">
                          {qty > 0 ? (
                            <>
                              <div className="w-full h-10 flex mb-2">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="w-10 h-full bg-[#ff9800] text-white text-xl leading-none rounded-l-md cursor-pointer transition-colors duration-200 hover:bg-[#e68a00] active:scale-95"
                                >
                                  −
                                </button>
                                <div className="flex-1 border-y-2 border-[#ff9800] flex items-center justify-center text-[15px] font-bold text-[#222] select-none">
                                  {qty} шт
                                </div>
                                <button
                                  onClick={() => addToCart(product)}
                                  className="w-10 h-full bg-[#ff9800] text-white text-xl leading-none rounded-r-md cursor-pointer transition-colors duration-200 hover:bg-[#e68a00] active:scale-95"
                                >
                                  +
                                </button>
                              </div>
                              <button className="w-full h-10 bg-[#ff9800] text-white rounded-md font-bold text-base mb-2 hover:bg-[#e68a00] transition-colors cursor-pointer active:scale-[0.98]">
                                В корзину
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full h-11 bg-[#ff9800] text-white rounded-md font-bold text-[16px] mb-2 hover:bg-[#e68a00] transition-colors cursor-pointer active:scale-[0.98]"
                            >
                              В корзину
                            </button>
                          )}

                          <button className="w-full text-[#ff9800] text-[14px] leading-none font-medium pt-2 pb-1 hover:underline cursor-pointer transition-all">
                            Купить в 1 клик
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Yo'nalish tugmalari */}
            <button className="product-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-10 h-10 bg-white border border-[#e0e0e0] shadow-md rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:shadow-lg hover:text-[#ff9800]">
              <ChevronLeft size={22} />
            </button>
            <button className="product-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-10 h-10 bg-white border border-[#e0e0e0] shadow-md rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:shadow-lg hover:text-[#ff9800]">
              <ChevronRight size={22} />
            </button>
          </div>
        ) : (
          <div className="text-center w-full py-10 text-gray-400">Mahsulotlar topilmadi.</div>
        )}
      </div>
    </section>
  );
};

export default ProductList;