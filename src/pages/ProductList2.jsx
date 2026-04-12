import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";

const CARD_W = 230;
const IMG_H = 220;

/* ─── Filtr bo'limi komponenti ─── */
const FilterSection = ({ title, items, selected, onToggle, defaultOpen = false, maxVisible = 8 }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full cursor-pointer"
      >
        <h4 className="text-[15px] font-bold text-[#222]">{title}</h4>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <ul className="mt-3 space-y-2.5">
            {visibleItems.map((item) => (
              <li key={item.name} className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selected.includes(item.name)}
                  onChange={() => onToggle(item.name)}
                  className="w-4 h-4 rounded border-gray-300 text-[#ff9800] accent-[#ff9800] cursor-pointer"
                />
                <span className="text-sm text-[#444] flex-1">{item.name}</span>
                <span className="text-xs text-gray-400">{item.count}</span>
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-3 text-sm text-[#ff9800] font-medium hover:underline cursor-pointer transition-colors"
            >
              {showAll ? "Скрыть" : "Показать еще"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

/* ─── Mahsulot kartasi ─── */
const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, getQty } = useCart();
  const main = product.main_variant ?? {};
  const price = product.price ?? main.price ?? 0;
  const oldPrice = product.old_price ?? main.old_price ?? 0;
  const discount =
    oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const imgSrc = product.image_url ?? product.image ?? "";
  const qty = getQty(product.id);

  return (
    <div
      className="group bg-white border border-[#e0e0e0] flex flex-col relative overflow-hidden transition-shadow duration-300 hover:shadow-xl rounded-md"
      style={{ width: CARD_W }}
    >
      {/* Chegirma belgisi */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-[#e53935] text-white text-[13px] font-bold px-2.5 py-1 rounded-sm z-10">
          –{discount}%
        </div>
      )}

      {/* Rasm */}
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

      {/* Matn qismi */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
        <h3 className="text-[14px] text-[#222] font-normal leading-snug mb-2 min-h-10 line-clamp-2">
          {product.name}
        </h3>

        {/* Variantlar */}
        {(Array.isArray(product.variants) && product.variants.length > 0) || main.weight ? (
          <div className="mb-3 relative">
            <select className="w-full h-9 border border-[#e0e0e0] rounded-md bg-white text-[13px] text-[#45494f] pl-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#ff9800] transition-colors">
              {Array.isArray(product.variants) && product.variants.length > 0
                ? product.variants.map((v, i) => (
                    <option key={i} value={v.id ?? v.weight}>
                      {v.weight} {v.weight_unit}
                    </option>
                  ))
                : <option>{main.weight} {main.weight_unit}</option>}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        ) : null}

        {/* Narx */}
        <div className="flex items-end gap-2 mb-3">
          <span className="text-[#ff9800] text-[20px] font-extrabold leading-none">
            {price} ₽
          </span>
          {oldPrice && (
            <span className="text-[#bdbdbd] text-[13px] line-through leading-none">
              {oldPrice} ₽
            </span>
          )}
        </div>

        {/* Savat */}
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

/* ─── Asosiy sahifa ─── */
const ProductList2 = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Filtr holatlari */
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*");
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  /* Filtr ma'lumotlari */
  const typeFilters = [
    { name: "Породные корма", count: 20 },
    { name: "Сухой корм", count: 435 },
    { name: "Премиум", count: 380 },
    { name: "Холистик", count: 194 },
    { name: "Консервы", count: 443 },
    { name: "Влажный корм", count: 294 },
    { name: "Лечебный корм", count: 120 },
    { name: "Заменитель молока", count: 1 },
  ];

  const ageFilters = [
    { name: "Взрослые", count: 20 },
    { name: "Котята", count: 435 },
    { name: "Пожилые", count: 380 },
  ];

  const purposeFilters = [
    { name: "Беременные и кормящие", count: 20 },
    { name: "Гипоаллергенный", count: 435 },
    { name: "Для шерсти и кожи", count: 380 },
    { name: "Крупные породы", count: 194 },
    { name: "Ожирение", count: 443 },
    { name: "Стерилизованные", count: 294 },
    { name: "Для суставов", count: 120 },
    { name: "Для чистки зубов", count: 1 },
    { name: "Против комочков шерсти", count: 20 },
    { name: "С чувствительным пищеварением", count: 435 },
  ];

  const brandFilters = [
    { name: "Royal Canin", count: 100 },
    { name: "Brit", count: 39 },
    { name: "Brit Care", count: 24 },
    { name: "Brit Veterinary Diet", count: 5 },
    { name: "Eukanuba", count: 10 },
    { name: "Farmina Vet Life", count: 16 },
    { name: "Farmina Matisse", count: 12 },
    { name: "Farmina ND", count: 41 },
    { name: "Farmina NDH3", count: 4 },
    { name: "Gemon", count: 20 },
  ];

  const quickTags = ["Влажный", "Сухой", "Холистик", "При аллергии", "Котятам"];

  const toggleFilter = (list, setList) => (name) => {
    setList((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const allActiveTags = [...selectedTypes, ...selectedAges, ...selectedPurposes, ...selectedBrands, ...activeTags];

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedAges([]);
    setSelectedPurposes([]);
    setSelectedBrands([]);
    setActiveTags([]);
    setPriceFrom("");
    setPriceTo("");
  };

  const removeTag = (tag) => {
    setSelectedTypes((p) => p.filter((t) => t !== tag));
    setSelectedAges((p) => p.filter((t) => t !== tag));
    setSelectedPurposes((p) => p.filter((t) => t !== tag));
    setSelectedBrands((p) => p.filter((t) => t !== tag));
    setActiveTags((p) => p.filter((t) => t !== tag));
  };

  /* Filtrlangan mahsulotlar */
  const filteredProducts = products.filter((p) => {
    const main = p.main_variant ?? {};
    const price = p.price ?? main.price ?? 0;
    const name = (p.name ?? "").toLowerCase();
    const category = (p.category ?? p.type ?? "").toLowerCase();
    const brand = (p.brand ?? p.manufacturer ?? "").toLowerCase();
    const age = (p.age ?? "").toLowerCase();
    const purpose = (p.purpose ?? p.designation ?? "").toLowerCase();

    // URL kategoriya filtri
    if (categoryParam) {
      const catLow = categoryParam.toLowerCase();
      const matchCat = name.includes(catLow) || category.includes(catLow);
      if (!matchCat) return false;
    }

    // Narx filtri
    if (priceFrom && price < Number(priceFrom)) return false;
    if (priceTo && price > Number(priceTo)) return false;

    // Turi filtri — kategoriya yoki nom bo'yicha
    if (selectedTypes.length > 0) {
      const matchType = selectedTypes.some((t) => {
        const tLow = t.toLowerCase();
        return category.includes(tLow) || name.includes(tLow);
      });
      if (!matchType) return false;
    }

    // Yosh filtri
    if (selectedAges.length > 0) {
      const matchAge = selectedAges.some((a) => {
        const aLow = a.toLowerCase();
        return age.includes(aLow) || name.includes(aLow) || category.includes(aLow);
      });
      if (!matchAge) return false;
    }

    // Maqsad filtri
    if (selectedPurposes.length > 0) {
      const matchPurpose = selectedPurposes.some((pp) => {
        const pLow = pp.toLowerCase();
        return purpose.includes(pLow) || name.includes(pLow) || category.includes(pLow);
      });
      if (!matchPurpose) return false;
    }

    // Brend filtri
    if (selectedBrands.length > 0) {
      const matchBrand = selectedBrands.some((b) => {
        const bLow = b.toLowerCase();
        return brand.includes(bLow) || name.includes(bLow);
      });
      if (!matchBrand) return false;
    }

    // Tez teglar filtri
    if (activeTags.length > 0) {
      const matchTag = activeTags.some((tag) => {
        const tagLow = tag.toLowerCase();
        return name.includes(tagLow) || category.includes(tagLow) || purpose.includes(tagLow);
      });
      if (!matchTag) return false;
    }

    return true;
  });

  /* Saralash */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price ?? a.main_variant?.price ?? 0;
    const priceB = b.price ?? b.main_variant?.price ?? 0;
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
        {/* Yo'l ko'rsatkich */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-[#ff9800] transition-colors">Главная</Link>
          <span>›</span>
          {categoryParam ? (
            <>
              <Link to="/catalog" className="hover:text-[#ff9800] transition-colors">Каталог</Link>
              <span>›</span>
              <span className="text-[#222]">{categoryParam}</span>
            </>
          ) : (
            <span className="text-[#222]">Каталог</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-black text-[#222] mb-6">
          {categoryParam || "Каталог товаров"}
        </h1>

        <div className="flex gap-8">
          {/* ── Sidebar Filters ── */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            {/* Price */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h4 className="text-[15px] font-bold text-[#222] mb-3 flex items-center gap-1">
                <ChevronDown size={14} className="rotate-180 text-gray-400" />
                Цена
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="От 56"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-[#ff9800] transition-colors"
                />
                <input
                  type="number"
                  placeholder="До 2300"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-[#ff9800] transition-colors"
                />
              </div>
            </div>

            {/* Type */}
            <FilterSection
              title="Тип"
              items={typeFilters}
              selected={selectedTypes}
              onToggle={toggleFilter(selectedTypes, setSelectedTypes)}
              defaultOpen={true}
            />

            {/* Age */}
            <FilterSection
              title="Возраст"
              items={ageFilters}
              selected={selectedAges}
              onToggle={toggleFilter(selectedAges, setSelectedAges)}
              defaultOpen={true}
            />

            {/* Purpose */}
            <FilterSection
              title="Назначение"
              items={purposeFilters}
              selected={selectedPurposes}
              onToggle={toggleFilter(selectedPurposes, setSelectedPurposes)}
              defaultOpen={true}
              maxVisible={8}
            />

            {/* Brand */}
            <FilterSection
              title="Производитель"
              items={brandFilters}
              selected={selectedBrands}
              onToggle={toggleFilter(selectedBrands, setSelectedBrands)}
              defaultOpen={true}
              maxVisible={8}
            />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Top bar: quick tags + sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              {/* Quick tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 mr-1">Часто ищут:</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`px-3 py-1.5 rounded-md text-sm border cursor-pointer transition-all duration-200 ${
                      activeTags.includes(tag)
                        ? "bg-[#ff9800] text-white border-[#ff9800]"
                        : "bg-white text-[#444] border-gray-200 hover:border-[#ff9800] hover:text-[#ff9800]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 border border-gray-200 rounded-md bg-white text-sm text-[#444] pl-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#ff9800] transition-colors"
                >
                  <option value="popular">По популярности</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active filter tags */}
            {allActiveTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-5">
                {allActiveTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-[#ff9800] text-white text-sm font-medium px-3 py-1.5 rounded-md"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="cursor-pointer hover:scale-110 transition-transform">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#ff9800] border border-[#ff9800] px-3 py-1.5 rounded-md hover:bg-[#ff9800] hover:text-white cursor-pointer transition-all duration-200"
                >
                  Сбросить фильтры ×
                </button>
              </div>
            )}

            {/* Product grid */}
            {sortedProducts.length > 0 ? (
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_W}px, 1fr))` }}
              >
                {sortedProducts.map((product) => (
                  <div key={product.id} className="flex justify-center">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400 text-lg">
                Товары не найдены
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList2;
