import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";
import vetImg from "../assets/vet.png";

const CARD_W = 230;
const CARD_H = 500;
const IMG_H = 220;

/* ─── Reusable product card ─── */
const ProductCard = ({ product, qty, onAdd, onRemove }) => {
  const main = product.main_variant || {};
  const price = product.price || main.price;
  const oldPrice = product.old_price || main.old_price;
  const discount =
    oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const imgSrc = product.image_url || product.image;

  return (
    <div
      className="group bg-white border border-[#e0e0e0] flex flex-col relative overflow-hidden transition-shadow duration-300 hover:shadow-xl rounded-md"
      style={{ width: CARD_W, height: CARD_H }}
    >
      {/* Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-[#e53935] text-white text-[13px] font-bold px-2.5 py-1 rounded-sm z-10">
          –{discount}%
        </div>
      )}

      {/* Image — hover zoom */}
      <div className="w-full overflow-hidden" style={{ height: IMG_H }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
            Нет фото
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
        {/* Title */}
        <h3 className="text-[15px] text-[#222] font-normal leading-snug mb-2 min-h-10 line-clamp-2">
          {product.name}
        </h3>

        {/* Variants select */}
        {(Array.isArray(product.variants) && product.variants.length > 0) ||
        main.weight ? (
          <div className="mb-3 relative">
            <select className="w-full h-10 border border-[#e0e0e0] rounded-md bg-white text-[15px] text-[#45494f] pl-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#ff9800] transition-colors">
              {Array.isArray(product.variants) && product.variants.length > 0
                ? product.variants.map((v, i) => (
                    <option key={i} value={v.id || v.weight}>
                      {v.weight} {v.weight_unit}
                    </option>
                  ))
                : (
                    <option>
                      {main.weight} {main.weight_unit}
                    </option>
                  )}
            </select>
            <ChevronRight
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
            />
          </div>
        ) : null}

        {/* Price */}
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

        {/* Cart controls */}
        <div className="mt-auto">
          {qty > 0 ? (
            <>
              <div className="w-full h-10 flex mb-2">
                <button
                  onClick={() => onRemove(product.id)}
                  className="w-10 h-full bg-[#ff9800] text-white text-xl leading-none rounded-l-md cursor-pointer transition-colors duration-200 hover:bg-[#e68a00] active:scale-95"
                >
                  −
                </button>
                <div className="flex-1 border-y-2 border-[#ff9800] flex items-center justify-center text-[15px] font-bold text-[#222] select-none">
                  {qty} шт
                </div>
                <button
                  onClick={() => onAdd(product)}
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
              onClick={() => onAdd(product)}
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
  );
};

/* ─── Product grid section with scroll buttons ─── */
const ProductGrid = ({ title, items, getQty, onAdd, onRemove }) => {
  const scrollRef = useRef(null);

  if (!items || items.length === 0) return null;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = (CARD_W + 16) * 2; // scroll 2 cards at a time
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[28px] font-black text-[#222]">{title}</h2>
          <button className="text-[#ff9800] flex items-center gap-1 text-[15px] font-bold hover:gap-2 transition-all cursor-pointer">
            Смотреть все <ChevronRight size={18} />
          </button>
        </div>

        {/* Scrollable row with nav buttons */}
        <div className="relative group/scroll">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-12 h-12 bg-white border border-[#e0e0e0] shadow-lg rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:shadow-xl hover:scale-110 hover:text-[#ff9800] active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {items.map((product) => (
              <div key={product.id} className="flex-shrink-0">
                <ProductCard
                  product={product}
                  qty={getQty(product.id)}
                  onAdd={onAdd}
                  onRemove={onRemove}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-12 h-12 bg-white border border-[#e0e0e0] shadow-lg rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:shadow-xl hover:scale-110 hover:text-[#ff9800] active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

/* ─── Main Vet component ─── */
const Vet = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, getQty } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*");
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <>
      {/* ── Banner ── */}
      <section className="w-full bg-white py-6 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="relative w-full bg-[#ff9800] rounded-[16px] lg:rounded-[40px] p-6 lg:p-12 flex items-center min-h-[260px] lg:min-h-[360px] overflow-visible shadow-2xl">
            {/* Text */}
            <div className="w-full lg:w-1/2 space-y-4 z-20">
              <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1]">
                Лохматость сильно
                <br />
                повысится!
              </h1>
              <p className="text-white text-sm lg:text-lg font-medium opacity-95">
                Скидка 20% на все шампуни
                <br />
                для котеек.
              </p>
              <button className="bg-white text-[#ff9800] font-bold py-3 px-8 rounded-full flex items-center gap-3 hover:scale-105 transition">
                Смотреть шампуни
                <ArrowRight size={22} />
              </button>
            </div>

            {/* Cat image */}
            <div className="hidden lg:block absolute right-[-51px] bottom-[-40px] w-[42%] overflow-hidden">
              <img
                src={vetImg}
                alt="cat"
                className="w-full translate-y-6 -translate-y-6 scale-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Loading ── */}
      {loading && (
        <div className="w-full py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9800]" />
        </div>
      )}

      {/* ── Хиты продаж ── */}
      {!loading && (
        <ProductGrid
          title="Хиты продаж"
          items={products}
          getQty={getQty}
          onAdd={addToCart}
          onRemove={removeFromCart}
        />
      )}
    </>
  );
};

export default Vet;