import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import ProductCard from "./ProductCard";
import SkeletonLoader from "../SkeletonLoader";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "../../store/apis/productsApi";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const quickTags = ["Влажный", "Сухой", "Холистик", "При аллергии", "Котятам"];
const activeTags = ["Природные корма", "Консервы", "Взрослые"];

const sidebarSections = [
  {
    title: "type",
    items: [
      { label: "Породные корма", count: 20, checked: true },
      { label: "Сухой корм", count: 435 },
      { label: "Премиум", count: 380 },
      { label: "Холистик", count: 194 },
      { label: "Консервы", count: 443, checked: true },
      { label: "Влажный корм", count: 294 },
      { label: "Лечебный корм", count: 120 },
      { label: "Заменитель молока", count: 1 },
    ],
  },
  {
    title: "age",
    items: [
      { label: "Взрослые", count: 20, checked: true },
      { label: "Котята", count: 435 },
      { label: "Пожилые", count: 380 },
    ],
  },
  {
    title: "purpose",
    items: [
      { label: "Беременные и кормящие", count: 20 },
      { label: "Гипоаллергенный", count: 435 },
      { label: "Для шерсти и кожи", count: 380 },
      { label: "Крупные породы", count: 194 },
      { label: "Ожирение", count: 443 },
      { label: "Стерилизованные", count: 294 },
      { label: "Для суставов", count: 120 },
      { label: "Для чистки зубов", count: 1 },
      { label: "Против комочков шерсти", count: 20 },
      { label: "С чувствительным пищеварением", count: 435 },
    ],
    expandable: true,
  },
];

function FilterSection({ title, items, expandable = false }) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-[#ececec] dark:border-slate-800 py-6 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center gap-2">
        <ChevronDown size={14} className="text-[#333333] dark:text-gray-400" />
        <h3 className="text-[18px] font-semibold text-[#333333] dark:text-white uppercase tracking-tight">{t(title)}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={`${title}-${item.label}`}
            className="flex cursor-pointer items-start gap-3 text-[15px] leading-5 text-[#333333] dark:text-gray-300"
          >
            <input
              type="checkbox"
              defaultChecked={item.checked}
              className="mt-[2px] h-4 w-4 rounded-[2px] border-[#d0d0d0] dark:border-slate-600 accent-[#ff9519]"
            />
            <span>
              {item.label}{" "}
              <span className="text-[#9a9a9a] dark:text-gray-500">{item.count}</span>
            </span>
          </label>
        ))}
      </div>

      {expandable ? (
        <button
          type="button"
          className="mt-5 text-[15px] text-[#ff9519] transition hover:text-[#ff8400]"
        >
          Показать еще
        </button>
      ) : null}
    </div>
  );
}

export default function ProductList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category_id") || "");
  const [activeTags, setActiveTags] = useState([]);

  // Sync with URL params (reacts to Navbar search and browser back/forward)
  useEffect(() => {
    const s = searchParams.get("search") || "";
    if (s !== search) {
      setSearch(s);
      setDebouncedSearch(s);
    }
    const c = searchParams.get("category_id") || "";
    if (c !== selectedCategory) {
      setSelectedCategory(c);
    }
    const p = Number(searchParams.get("page")) || 1;
    if (p !== page) {
      setPage(p);
    }
  }, [searchParams]);

  // Update URL params when local state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    
    if (selectedCategory) {
      params.set("category_id", selectedCategory);
    } else {
      params.delete("category_id");
    }
    
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [debouncedSearch, selectedCategory, page, setSearchParams, searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    limit: 12,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedCategory ? { category_id: selectedCategory } : {}),
  };

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    error,
  } = useGetProductsQuery(queryParams);
  const { data: categories = [] } = useGetCategoriesQuery();

  const products = useMemo(() => productsResponse?.data || [], [productsResponse]);
  const meta = productsResponse?.meta;

  const manufacturerItems = useMemo(() => {
    const brandCounts = new Map();

    products.forEach((product) => {
      if (!product?.brand) return;
      brandCounts.set(product.brand, (brandCounts.get(product.brand) || 0) + 1);
    });

    return [...brandCounts.entries()].map(([label, count]) => ({
      label,
      count,
    }));
  }, [products]);

  const currentCategoryName =
    categories.find((category) => String(category.id) === String(selectedCategory))
      ?.name || "Корм для кошек";

  const totalPages = meta?.total_pages || 1;
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  return (
    <section className="bg-white dark:bg-slate-900 transition-colors duration-300 py-8 md:py-10">
      <div className="container">
        <div className="mb-6 text-[13px] text-[#8d8d8d] dark:text-gray-500">
          {t('home')} <span className="mx-2">›</span> {t('products')}{" "}
          <span className="mx-2">›</span> {currentCategoryName}
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-[34px] font-bold leading-none text-[#333333] dark:text-white md:text-[48px]">
            {currentCategoryName}
          </h1>

          <label className="relative block w-full max-w-[280px]">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9a9a]"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('search_placeholder')}
              className="h-[42px] w-full rounded-[4px] border border-[#dddddd] dark:border-slate-700 dark:bg-slate-800 dark:text-white pl-11 pr-4 text-[14px] text-[#333333] outline-none transition focus:border-[#ff9519]"
            />
          </label>
        </div>

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <ChevronDown size={14} className="text-[#333333] dark:text-gray-400" />
                  <span className="text-[18px] font-semibold text-[#333333] dark:text-white">{t('price')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value="От 56"
                    readOnly
                    className="h-[40px] w-[78px] rounded-[4px] border border-[#dddddd] dark:border-slate-700 dark:bg-slate-800 px-3 text-[14px] text-[#777777] dark:text-gray-400"
                  />
                  <input
                    type="text"
                    value="До 2300"
                    readOnly
                    className="h-[40px] w-[84px] rounded-[4px] border border-[#dddddd] dark:border-slate-700 dark:bg-slate-800 px-3 text-[14px] text-[#777777] dark:text-gray-400"
                  />
                </div>
                <div className="mt-5 h-[2px] w-[165px] bg-[#dddddd] dark:bg-slate-800">
                  <div className="relative h-full w-[96%] bg-[#dddddd] dark:bg-slate-700">
                    <span className="absolute right-0 top-1/2 h-[13px] w-[13px] -translate-y-1/2 rounded-full bg-[#ff9519]" />
                  </div>
                </div>
              </div>

              <div className="flex max-w-[520px] flex-wrap items-center gap-2">
                <span className="mr-2 text-[14px] text-[#666666] dark:text-gray-400">{t('often_search')}:</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="rounded-[4px] border border-[#dddddd] dark:border-slate-700 dark:text-gray-300 px-3 py-1.5 text-[14px] text-[#555555] hover:border-[#ff9519] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded-[4px] bg-[#ff9519] px-3 py-1.5 text-[14px] text-white"
                >
                  {tag} <span className="ml-1">×</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 lg:min-w-[250px] lg:justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[16px] text-[#333333] dark:text-gray-200"
            >
              {t('by_popularity')} <ChevronDown size={16} />
            </button>
            <button
              type="button"
              className="rounded-[4px] border border-[#ff9519] px-3 py-2 text-[14px] text-[#ff9519] hover:bg-[#ff9519] hover:text-white transition-all"
            >
              {t('reset_filters')} ×
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[275px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              {sidebarSections.map((section) => (
                <FilterSection key={section.title} {...section} />
              ))}
              {manufacturerItems.length > 0 ? (
                <FilterSection
                  title="manufacturer"
                  items={manufacturerItems}
                  expandable
                />
              ) : null}
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-[4px] border border-[#dddddd] dark:border-slate-700 px-4 py-2 text-[14px] text-[#333333] dark:text-gray-300"
              >
                <SlidersHorizontal size={16} />
                {t('filters')}
              </button>
              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setPage(1);
                }}
                className="h-[40px] rounded-[4px] border border-[#dddddd] dark:border-slate-700 dark:bg-slate-800 px-3 text-[14px] text-[#333333] dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {isLoading || isFetching ? (
              <SkeletonLoader count={12} variant="product" />
            ) : error ? (
              <div className="border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 rounded-lg">
                Ошибка при загрузке товаров. Попробуйте позже.
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 border border-[#dedede] dark:border-slate-800 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[18px] text-[#333333] dark:text-gray-400">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="text-[#333333] dark:text-gray-400 hover:text-[#ff9519] disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[18px] ${
                        page === pageNumber
                          ? "bg-[#ff9519] text-white"
                          : "text-[#333333]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {totalPages > 5 ? <span>...</span> : null}
                  {totalPages > 1 ? <span>{totalPages}</span> : null}

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                    className="text-[#333333] dark:text-gray-400 hover:text-[#ff9519] disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="border border-[#dedede] dark:border-slate-800 p-12 text-center text-[#666666] dark:text-gray-400 rounded-lg">
                {t('not_found')}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-[980px] text-[#6f6f6f]">
          <h2 className="mb-4 text-[31px] font-semibold text-[#333333]">
            О кормлении кошек
          </h2>
          <p className="mb-10 text-[15px] leading-7">
            Знаете ли вы желания и потребности своей кошки? Взяв в дом четвероногого
            питомца, нужно сразу продумать систему его кормления. Вариантов выбора
            всего два: обычная «человеческая» еда и специализированный корм.
            Готовый корм от авторитетных производителей помогает поддерживать
            сбалансированный рацион и ежедневный уход за питомцем.
          </p>

          <h3 className="mb-4 text-[31px] font-semibold text-[#333333]">
            Виды кошачьего корма в магазине «Сытая морда»
          </h3>
          <p className="mb-10 text-[15px] leading-7">
            Мы предлагаем оптимальный вариант купить корм для кошек в интернет-магазине
            «Сытая Морда». В каталоге представлены лучшие виды кормов от известных
            брендов: влажные и сухие, консервированные, лечебные и повседневные.
            В нашем каталоге вы найдете решения для разных возрастных категорий,
            образа жизни и индивидуальных потребностей питомцев.
          </p>

          <h3 className="mb-4 text-[31px] font-semibold text-[#333333]">
            Купить корм для кошек в Тюмени: быстро, выгодно удобно
          </h3>
          <p className="text-[15px] leading-7">
            Интернет-магазин «Сытая Морда» дает возможность купить сертифицированный
            корм для кошек с доставкой. Просто позвоните нам или оставьте заявку,
            менеджеры компании согласуют удобную дату и время доставки. Посетите
            наш интернет-магазин и пусть у вашего кота всегда будет сытая и довольная
            морда.
          </p>
        </div>
      </div>
    </section>
  );
}
