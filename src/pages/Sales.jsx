import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";

const CARD_W = 230;
const IMG_H = 220;

/* ─── Product Card ─── */
const SaleProductCard = ({ product }) => {
  const { addToCart, removeFromCart, getQty } = useCart();
  const main = product.main_variant || {};
  const price = product.price || main.price;
  const oldPrice = product.old_price || main.old_price;
  const discount =
    oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const imgSrc = product.image_url || product.image;
  const qty = getQty(product.id);

  return (
    <div
      className="group bg-white border border-[#e0e0e0] flex flex-col relative overflow-hidden transition-shadow duration-300 hover:shadow-xl rounded-md"
      style={{ width: CARD_W }}
    >
      {/* Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-[#e53935] text-white text-[13px] font-bold px-2.5 py-1 rounded-sm z-10">
          –{discount}%
        </div>
      )}

      {/* Sale label */}
      <div className="absolute top-2 right-2 bg-[#ff9800] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm z-10">
        АКЦИЯ
      </div>

      {/* Image */}
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
        <h3 className="text-[14px] text-[#222] font-normal leading-snug mb-2 min-h-10 line-clamp-2">
          {product.name}
        </h3>

        {/* Variants */}
        {(Array.isArray(product.variants) && product.variants.length > 0) || main.weight ? (
          <div className="mb-3 relative">
            <select className="w-full h-9 border border-[#e0e0e0] rounded-md bg-white text-[13px] text-[#45494f] pl-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#ff9800] transition-colors">
              {Array.isArray(product.variants) && product.variants.length > 0
                ? product.variants.map((v, i) => (
                    <option key={i} value={v.id || v.weight}>
                      {v.weight} {v.weight_unit}
                    </option>
                  ))
                : <option>{main.weight} {main.weight_unit}</option>}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-end gap-2 mb-3">
          <span className="text-[#e53935] text-[20px] font-extrabold leading-none">
            {price} ₽
          </span>
          {oldPrice && (
            <span className="text-[#bdbdbd] text-[13px] line-through leading-none">
              {oldPrice} ₽
            </span>
          )}
        </div>

        {/* Savings */}
        {oldPrice && price && (
          <div className="text-[12px] text-green-600 font-medium mb-2">
            Экономия: {oldPrice - price} ₽
          </div>
        )}

        {/* Cart */}
        <div className="mt-auto">
          {qty > 0 ? (
            <>
              <div className="w-full h-9 flex mb-2">
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="w-9 h-full bg-[#ff9800] text-white text-lg leading-none rounded-l-md cursor-pointer transition-colors duration-200 hover:bg-[#e68a00] active:scale-95"
                >
                  −
                </button>
                <div className="flex-1 border-y-2 border-[#ff9800] flex items-center justify-center text-[14px] font-bold text-[#222] select-none">
                  {qty} шт
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-9 h-full bg-[#ff9800] text-white text-lg leading-none rounded-r-md cursor-pointer transition-colors duration-200 hover:bg-[#e68a00] active:scale-95"
                >
                  +
                </button>
              </div>
              <button className="w-full h-9 bg-[#ff9800] text-white rounded-md font-bold text-sm mb-2 hover:bg-[#e68a00] transition-colors cursor-pointer active:scale-[0.98]">
                В корзину
              </button>
            </>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full h-10 bg-[#ff9800] text-white rounded-md font-bold text-[15px] mb-2 hover:bg-[#e68a00] transition-colors cursor-pointer active:scale-[0.98]"
            >
              В корзину
            </button>
          )}
          <button className="w-full text-[#ff9800] text-[13px] leading-none font-medium pt-2 pb-1 hover:underline cursor-pointer transition-all">
            Купить в 1 клик
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Sales Page ─── */
const Sales = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("discount");

  useEffect(() => {
    async function fetchSaleProducts() {
      const { data } = await supabase.from("products").select("*");
      // Faqat aksiyali (old_price bor) mahsulotlarni filtrlash
      const allProducts = Array.isArray(data) ? data : [];
      const saleProducts = allProducts.filter((p) => {
        const oldPrice = p.old_price || p.main_variant?.old_price;
        const price = p.price || p.main_variant?.price;
        return oldPrice && price && oldPrice > price;
      });
      setProducts(saleProducts);
      setLoading(false);
    }
    fetchSaleProducts();
  }, []);

  /* Sort */
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.price || a.main_variant?.price || 0;
    const priceB = b.price || b.main_variant?.price || 0;
    const oldPriceA = a.old_price || a.main_variant?.old_price || 0;
    const oldPriceB = b.old_price || b.main_variant?.old_price || 0;
    const discountA = oldPriceA ? Math.round(((oldPriceA - priceA) / oldPriceA) * 100) : 0;
    const discountB = oldPriceB ? Math.round(((oldPriceB - priceB) / oldPriceB) * 100) : 0;

    if (sortBy === "discount") return discountB - discountA;
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    return 0;
  });

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9800]" />
      </div>
    );
  }

  return (
    <section className="bg-[#fafafa] min-h-screen pb-16">
      <div className="max-w-[1400px] mx-auto px-4 pt-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-[#ff9800] transition-colors">Главная</Link>
          <span>›</span>
          <span className="text-[#222]">Акции</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#222] flex items-center gap-3">
              🔥 Акции и скидки
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">
              {sortedProducts.length > 0
                ? `${sortedProducts.length} товаров со скидкой`
                : "Нет товаров со скидкой"}
            </p>
          </div>

          {/* Sort */}
          <div className="relative flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 border border-gray-200 rounded-md bg-white text-sm text-[#444] pl-4 pr-10 appearance-none cursor-pointer focus:outline-none focus:border-[#ff9800] transition-colors"
            >
              <option value="discount">По размеру скидки</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Sale banner */}
        <div className="bg-gradient-to-r from-[#e53935] to-[#ff9800] rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black mb-1">Специальные предложения!</h2>
              <p className="text-white/80 text-[15px]">Успейте купить товары по сниженным ценам</p>
            </div>
            <div className="text-5xl">🎉</div>
          </div>
        </div>

        {/* Product grid */}
        {sortedProducts.length > 0 ? (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_W}px, 1fr))` }}
          >
            {sortedProducts.map((product) => (
              <div key={product.id} className="flex justify-center">
                <SaleProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-400 text-lg mb-2">Сейчас нет активных акций</p>
            <p className="text-gray-400 text-sm mb-6">Загляните позже — мы часто обновляем скидки!</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-[#ff9800] text-white rounded-md font-bold hover:bg-[#e68a00] transition-colors"
            >
              На главную
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sales;
