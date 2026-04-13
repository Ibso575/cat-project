import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import SkeletonLoader from "../SkeletonLoader";
import { useGetCategoriesQuery, useGetProductsQuery } from "../../store/apis/productsApi";

const SORT_OPTIONS = [
  { value: "popular", labelKey: "by_popularity", fallback: "Mashhurligi" },
  { value: "price_asc", labelKey: "price_low_high", fallback: "Narx: arzon → qimmat" },
  { value: "price_desc", labelKey: "price_high_low", fallback: "Narx: qimmat → arzon" },
  { value: "name_asc", labelKey: "name_asc", fallback: "Nomi: A → Z" },
];

const CATEGORY_KEYWORDS = {
  cats: ["cat", "cats", "кошка", "кошки", "кот", "коты"],
  dogs: ["dog", "dogs", "собака", "собаки", "пес", "псы"],
  rodents: ["rodent", "rodents", "грызун", "грызуны", "хомяк", "кролик"],
  birds: ["bird", "birds", "птица", "птицы", "попугай"],
  aquarium: ["aquarium", "аквариум", "рыба", "рыбы", "fish"],
  vet: ["vet", "вет", "ветаптека", "аптека", "лекарство"],
  promotions: ["sale", "discount", "акция", "акции", "скидка"],
  franchise: ["franchise", "франшиза", "франчайзинг"],
  vetclinic: ["clinic", "ветклиника", "ветеринар", "клиника"],
};

const SIDEBAR_GROUPS = [
  {
    key: "type",
    title: "type",
    items: [
      { label: "Породные корма", count: 20 },
      { label: "Сухой корм", count: 435 },
      { label: "Премиум", count: 380 },
      { label: "Холистик", count: 194 },
      { label: "Консервы", count: 443 },
      { label: "Влажный корм", count: 294 },
      { label: "Лечебный корм", count: 120 },
      { label: "Заменитель молока", count: 1 },
    ],
    expandable: false,
  },
  {
    key: "age",
    title: "age",
    items: [
      { label: "Взрослые", count: 20 },
      { label: "Котята", count: 435 },
      { label: "Пожилые", count: 380 },
    ],
    expandable: false,
  },
  {
    key: "purpose",
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

function normalizeProducts(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function normalizeCategories(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function normalizeMeta(response) {
  return response?.meta || response?.data?.meta || {};
}

function getProductPrice(product) {
  const variant = product?.main_variant || product?.variants?.[0] || {};
  return Number(variant?.price ?? product?.min_price ?? 0);
}

function getProductSearchBlob(product) {
  const attributes =
    product?.attributes
      ?.flatMap((attribute) => [
        attribute?.name,
        ...(attribute?.values?.map((value) => value?.value) || []),
      ])
      .filter(Boolean)
      .join(" ") || "";

  return `${product?.name || ""} ${product?.brand || ""} ${attributes}`.toLowerCase();
}

function SidebarSection({
  title,
  sectionKey,
  items,
  selectedValues,
  onToggle,
  expandable,
  isExpanded,
  onToggleExpand,
}) {
  const { t } = useTranslation();
  const visibleItems = expandable && !isExpanded ? items.slice(0, 8) : items;

  return (
    <div className="border-t border-[#ececec] py-6 first:border-t-0 first:pt-0 dark:border-slate-800">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-[#333333] dark:text-gray-400">⌃</span>
        <h3 className="text-[31px] font-semibold leading-none text-[#333333] dark:text-white uppercase">
          {t(title, { defaultValue: title })}
        </h3>
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => {
          const checked = selectedValues.includes(item.label);

          return (
            <label
              key={`${sectionKey}-${item.label}`}
              className="flex cursor-pointer items-start gap-3 text-[15px] leading-5 text-[#333333] dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(sectionKey, item.label)}
                className="mt-0.5 h-4 w-4 rounded-sm border-[#d0d0d0] accent-[#ff9519] dark:border-slate-600"
              />
              <span>
                {item.label}{" "}
                <span className="text-[#9a9a9a] dark:text-gray-500">{item.count}</span>
              </span>
            </label>
          );
        })}
      </div>

      {expandable && items.length > 8 ? (
        <button
          type="button"
          onClick={() => onToggleExpand(sectionKey)}
          className="mt-5 text-[15px] text-[#ff9519] transition hover:text-[#ff8400]"
        >
          {isExpanded
            ? t("show_less", { defaultValue: "Скрыть" })
            : t("show_more", { defaultValue: "Показать еще" })}
        </button>
      ) : null}
    </div>
  );
}

export default function ProductList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "");
  const [categorySlug, setCategorySlug] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");

  const [selectedSidebar, setSelectedSidebar] = useState({
    type: [],
    age: [],
    purpose: [],
    manufacturer: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    purpose: false,
    manufacturer: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParamsKey);

    setSearchInput(params.get("search") || "");
    setSearchTerm(params.get("search") || "");
    setCategoryId(params.get("category_id") || "");
    setCategorySlug(params.get("category") || "");
    setPage(Number(params.get("page")) || 1);
    setSortBy(params.get("sort") || "popular");
    setMinPrice(params.get("min_price") || "");
    setMaxPrice(params.get("max_price") || "");
  }, [searchParamsKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();
      setSearchTerm((previousValue) => {
        if (previousValue !== value) {
          setPage(1);
        }
        return value;
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (categoryId) params.set("category_id", categoryId);
    if (categorySlug) params.set("category", categorySlug);
    if (sortBy !== "popular") params.set("sort", sortBy);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (page > 1) params.set("page", String(page));

    if (params.toString() !== searchParamsKey) {
      setSearchParams(params, { replace: true });
    }
  }, [searchTerm, categoryId, categorySlug, sortBy, minPrice, maxPrice, page, searchParamsKey, setSearchParams]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 12,
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(categoryId ? { category_id: categoryId } : {}),
    }),
    [page, searchTerm, categoryId],
  );

  const { data: productsResponse, isLoading, isFetching, error } = useGetProductsQuery(queryParams);
  const { data: categoriesResponse } = useGetCategoriesQuery();

  const products = useMemo(() => normalizeProducts(productsResponse), [productsResponse]);
  const categories = useMemo(() => normalizeCategories(categoriesResponse), [categoriesResponse]);
  const meta = useMemo(() => normalizeMeta(productsResponse), [productsResponse]);
  const isInitialLoading = (isLoading || isFetching) && products.length === 0;
  const isRefreshing = isFetching && products.length > 0;

  const manufacturerItems = useMemo(() => {
    const brandCounts = new Map();

    products.forEach((product) => {
      if (!product?.brand) return;
      brandCounts.set(product.brand, (brandCounts.get(product.brand) || 0) + 1);
    });

    return [...brandCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  const sidebarGroups = useMemo(
    () => {
      if (manufacturerItems.length === 0) return SIDEBAR_GROUPS;

      return [
        ...SIDEBAR_GROUPS,
        {
          key: "manufacturer",
          title: "manufacturer",
          items: manufacturerItems,
          expandable: true,
        },
      ];
    },
    [manufacturerItems],
  );

  const visibleProducts = useMemo(() => {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const normalizedCategorySlug = categorySlug.trim().toLowerCase();
    const hasSidebarFilters =
      selectedSidebar.type.length > 0 ||
      selectedSidebar.age.length > 0 ||
      selectedSidebar.purpose.length > 0 ||
      selectedSidebar.manufacturer.length > 0;
    const hasStrictFilters =
      Boolean(categoryId) ||
      Boolean(normalizedSearchTerm) ||
      Boolean(minPrice) ||
      Boolean(maxPrice) ||
      hasSidebarFilters;

    const filtered = products.filter((product) => {
      const price = getProductPrice(product);
      if (Number.isFinite(min) && minPrice !== "" && price < min) return false;
      if (Number.isFinite(max) && maxPrice !== "" && price > max) return false;

      const productBlob = getProductSearchBlob(product);
      const searchMatch = !normalizedSearchTerm || productBlob.includes(normalizedSearchTerm);

      const categoryKeywords = CATEGORY_KEYWORDS[normalizedCategorySlug] || [];
      const categoryMatch =
        Boolean(categoryId) ||
        !normalizedCategorySlug ||
        categoryKeywords.length === 0 ||
        categoryKeywords.some((keyword) => productBlob.includes(keyword));

      const typeMatch =
        selectedSidebar.type.length === 0 ||
        selectedSidebar.type.some((label) => productBlob.includes(label.toLowerCase()));

      const ageMatch =
        selectedSidebar.age.length === 0 ||
        selectedSidebar.age.some((label) => productBlob.includes(label.toLowerCase()));

      const purposeMatch =
        selectedSidebar.purpose.length === 0 ||
        selectedSidebar.purpose.some((label) => productBlob.includes(label.toLowerCase()));

      const manufacturerMatch =
        selectedSidebar.manufacturer.length === 0 ||
        selectedSidebar.manufacturer.includes(product?.brand || "");

      if (!searchMatch || !categoryMatch || !typeMatch || !ageMatch || !purposeMatch || !manufacturerMatch) {
        return false;
      }

      return true;
    });

    const sourceProducts =
      filtered.length === 0 && normalizedCategorySlug && !hasStrictFilters ? products : filtered;

    const sorted = [...sourceProducts];

    if (sortBy === "price_asc") {
      sorted.sort((first, second) => getProductPrice(first) - getProductPrice(second));
    } else if (sortBy === "price_desc") {
      sorted.sort((first, second) => getProductPrice(second) - getProductPrice(first));
    } else if (sortBy === "name_asc") {
      sorted.sort((first, second) => (first?.name || "").localeCompare(second?.name || ""));
    }

    return sorted;
  }, [products, minPrice, maxPrice, sortBy, selectedSidebar, categorySlug, searchTerm, categoryId]);

  const categoryName = categories.find((item) => String(item.id) === String(categoryId))?.name || t("products");
  const totalPages = Math.max(1, Number(meta?.total_pages) || 1);

  const visiblePages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    for (let current = start; current <= end; current += 1) {
      pages.push(current);
    }

    return pages;
  }, [page, totalPages]);

  const toggleSidebarOption = (sectionKey, label) => {
    setSelectedSidebar((previous) => {
      const current = previous[sectionKey] || [];
      const next = current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label];

      return {
        ...previous,
        [sectionKey]: next,
      };
    });
    setPage(1);
  };

  const toggleExpand = (sectionKey) => {
    setExpandedSections((previous) => ({
      ...previous,
      [sectionKey]: !previous[sectionKey],
    }));
  };

  return (
    <section className="bg-white dark:bg-slate-900 py-8 transition-colors duration-300 md:py-10">
      <div className="container">
        <div className="mb-3 text-[13px] text-[#8d8d8d] dark:text-gray-500">
          {t("home")} <span className="mx-2">›</span> {categoryName}
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="relative block w-full">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9a9a]" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t("search_placeholder")}
              className="h-10 w-full rounded-sm border border-[#dddddd] pl-11 pr-4 text-[14px] text-[#333333] outline-none transition focus:border-[#ff9519] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setCategorySlug("");
              setPage(1);
            }}
            className="h-10 rounded-sm border border-[#dddddd] px-3 text-[14px] text-[#333333] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">{t("all_categories", { defaultValue: "All categories" })}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => {
              setMinPrice(event.target.value);
              setPage(1);
            }}
            placeholder={t("min_price", { defaultValue: "Min narx" })}
            className="h-10 rounded-sm border border-[#dddddd] px-3 text-[14px] text-[#333333] outline-none transition focus:border-[#ff9519] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <div className="grid grid-cols-2 gap-3 md:col-span-2 lg:col-span-1">
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => {
                setMaxPrice(event.target.value);
                setPage(1);
              }}
              placeholder={t("max_price", { defaultValue: "Max narx" })}
              className="h-10 rounded-sm border border-[#dddddd] px-3 text-[14px] text-[#333333] outline-none transition focus:border-[#ff9519] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-sm border border-[#dddddd] px-3 text-[14px] text-[#333333] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey, { defaultValue: option.fallback })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[275px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs text-[#333333] dark:text-gray-400">⌃</span>
                <h3 className="text-[31px] font-semibold text-[#333333] dark:text-white">{t("price")}</h3>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={minPrice ? `От ${minPrice}` : "От 0"}
                  readOnly
                  className="h-10 w-20 rounded-sm border border-[#dddddd] px-3 text-[14px] text-[#777777] dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400"
                />
                <input
                  type="text"
                  value={maxPrice ? `До ${maxPrice}` : "До 9999"}
                  readOnly
                  className="h-10 w-24 rounded-sm border border-[#dddddd] px-3 text-[14px] text-[#777777] dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400"
                />
              </div>

              <div className="mt-5 h-0.5 w-44 bg-[#dddddd] dark:bg-slate-800">
                <div className="relative h-full w-[96%] bg-[#dddddd] dark:bg-slate-700">
                  <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#ff9519]" />
                </div>
              </div>

              <div className="mt-6">
                {sidebarGroups.map((section) => (
                  <SidebarSection
                    key={section.key}
                    title={section.title}
                    sectionKey={section.key}
                    items={section.items}
                    selectedValues={selectedSidebar[section.key] || []}
                    onToggle={toggleSidebarOption}
                    expandable={section.expandable}
                    isExpanded={Boolean(expandedSections[section.key])}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>
            </div>
          </aside>

          <div className="relative">
            {isInitialLoading ? (
              <SkeletonLoader count={12} variant="product" />
            ) : error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
                {t("error_loading_products", { defaultValue: "Mahsulotlarni yuklashda xatolik" })}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="rounded-lg border border-[#dedede] p-12 text-center text-[#666666] dark:border-slate-800 dark:text-gray-400">
                {t("not_found")}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 border border-[#dedede] dark:border-slate-800 md:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-[#333333] dark:text-gray-300">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="rounded-full p-2 transition hover:text-[#ff9519] disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-8 w-8 rounded-full text-sm ${
                        page === pageNumber ? "bg-[#ff9519] text-white" : "hover:text-[#ff9519]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                    className="rounded-full p-2 transition hover:text-[#ff9519] disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}

            {isRefreshing ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-[1px] dark:bg-slate-900/70">
                <div className="flex items-center gap-2 text-sm font-medium text-[#333333] dark:text-gray-200">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#ff9519] border-t-transparent" />
                  {t("loading", { defaultValue: "Yuklanmoqda..." })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
