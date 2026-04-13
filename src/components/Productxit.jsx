import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./products/ProductCard";
import SkeletonLoader from "./SkeletonLoader";
import { useGetProductsQuery } from "../store/apis/productsApi";

import "swiper/css";
import "swiper/css/navigation";

const ProductXit = () => {
  const { data, isLoading, isError } = useGetProductsQuery({
    limit: 10,
    page: 1,
  });
  const products = data?.data || [];

  if (isLoading) {
    return (
      <section className="bg-white py-12">
        <div className="container">
          <SkeletonLoader count={5} variant="product" />
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-visible bg-white py-12">
      <div className="container relative">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Хиты продаж
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-bold text-[#ff9800] transition hover:gap-2"
          >
            Смотреть все <ChevronRight size={20} />
          </Link>
        </div>

        <div className="relative group">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.15}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 4.5 },
            }}
            className="pb-5"
          >
            {products.length > 0 ? (
              products.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <ProductCard product={item} />
                </SwiperSlide>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400">
                {isError ? "Не удалось загрузить товары." : "Товары не найдены."}
              </div>
            )}
          </Swiper>

          <button className="custom-prev absolute -left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#eadfcf] bg-white text-slate-700 shadow-xl transition hover:text-[#ff9800] group-hover:flex">
            <ChevronLeft size={28} />
          </button>
          <button className="custom-next absolute -right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#eadfcf] bg-white text-slate-700 shadow-xl transition hover:text-[#ff9800] group-hover:flex">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductXit;
