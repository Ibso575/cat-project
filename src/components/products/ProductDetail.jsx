import { ArrowLeft, Heart, RotateCcw, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../store/apis/productsApi";
import SkeletonLoader from "../SkeletonLoader";

function mapSpecifications(product, variant) {
  const specs = [
    { label: "Бренд", value: product?.brand },
    {
      label: "Вес",
      value:
        variant?.weight && variant?.weight_unit
          ? `${variant.weight} ${variant.weight_unit}`
          : null,
    },
    { label: "Артикул", value: variant?.sku },
  ].filter((item) => item.value);

  const attributeSpecs =
    product?.attributes?.flatMap((attribute) =>
      attribute.values.map((value) => ({
        label: attribute.name,
        value: value.value,
      })),
    ) || [];

  return [...specs, ...attributeSpecs];
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  const variant = product?.variants?.[0] || product?.main_variant || {};
  const title = product?.name || "Товар";
  const imageUrl = product?.image_url || variant?.image_url || "";
  const price = variant?.price || product?.min_price || 0;
  const oldPrice = variant?.old_price || null;
  const stock = variant?.stock ?? 0;
  const rating = product?.metrics?.rating_avg || 0;
  const reviewsCount = product?.metrics?.reviews_count || 0;
  const specifications = mapSpecifications(product, variant);

  return (
    <section className="bg-[#fffaf5] py-5 md:py-12 lg:py-16">
      <div className="container">
        <Link
          to="/products"
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#ff9800] transition hover:gap-3 sm:mb-6 sm:text-sm"
        >
          <ArrowLeft size={18} />
          Вернуться к каталогу
        </Link>

        {isLoading ? (
          <SkeletonLoader variant="detail" />
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700">
            Ошибка загрузки товара. Пожалуйста, попробуйте позже.
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className="rounded-[1.5rem] border border-[#eadfcf] bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 lg:sticky lg:top-28">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#fff8ef] p-5 sm:rounded-[1.75rem] sm:p-8">
                <img
                  src={imageUrl}
                  alt={title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${
                    stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {stock > 0 ? `В наличии: ${stock}` : "Нет в наличии"}
                </span>
                {product?.brand ? (
                  <span className="rounded-full bg-[#fff1db] px-3 py-1.5 text-xs font-semibold text-[#c96a00] sm:px-4 sm:py-2 sm:text-sm">
                    {product.brand}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="rounded-[1.5rem] border border-[#eadfcf] bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff9800] sm:text-sm sm:tracking-[0.3em]">
                  Детали товара
                </p>
                <h1 className="mt-3 text-[28px] font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl">
                  {title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-[#fff5e8] px-3 py-1.5 text-xs font-semibold text-[#c96a00] sm:px-4 sm:py-2 sm:text-sm">
                    <Star size={14} className="fill-current sm:h-4 sm:w-4" />
                    {rating ? rating.toFixed(1) : "Новый"}
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">{reviewsCount} отзывов</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#eadfcf] bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
                <p className="text-xs text-slate-500 sm:text-sm">Цена</p>
                <div className="mt-3 flex flex-wrap items-end gap-2 sm:gap-3">
                  <p className="text-[34px] font-black leading-none text-[#ff9800] sm:text-4xl">
                    {price} ₽
                  </p>
                  {oldPrice ? (
                    <p className="pb-0.5 text-base text-slate-400 line-through sm:pb-1 sm:text-lg">
                      {oldPrice} ₽
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-600 sm:text-sm">
                  {product?.description || "Описание товара пока не добавлено."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-[1.25rem] border border-[#eadfcf] bg-white p-3 text-center shadow-sm sm:rounded-[1.5rem] sm:p-4">
                  <Truck className="mx-auto mb-2 text-[#ff9800]" size={22} />
                  <p className="text-xs font-semibold text-slate-800 sm:text-sm">Быстрая доставка</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#eadfcf] bg-white p-3 text-center shadow-sm sm:rounded-[1.5rem] sm:p-4">
                  <ShieldCheck className="mx-auto mb-2 text-[#ff9800]" size={22} />
                  <p className="text-xs font-semibold text-slate-800 sm:text-sm">Контроль качества</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#eadfcf] bg-white p-3 text-center shadow-sm sm:rounded-[1.5rem] sm:p-4">
                  <RotateCcw className="mx-auto mb-2 text-[#ff9800]" size={22} />
                  <p className="text-xs font-semibold text-slate-800 sm:text-sm">Удобный возврат</p>
                </div>
              </div>

              {specifications.length > 0 ? (
                <div className="rounded-[1.5rem] border border-[#eadfcf] bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">Характеристики</h2>
                  <div className="mt-4 space-y-3">
                    {specifications.map((specification, index) => (
                      <div
                        key={`${specification.label}-${index}`}
                        className="flex items-start justify-between gap-4 border-b border-[#f4ecdf] pb-3 text-xs sm:text-sm last:border-b-0 last:pb-0"
                      >
                        <span className="text-slate-500">{specification.label}</span>
                        <span className="text-right font-semibold text-slate-800">
                          {specification.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={stock === 0}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff9800] disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-6 sm:py-4 sm:text-base"
                >
                  <ShoppingCart size={18} />
                  {stock > 0 ? "Добавить в корзину" : "Нет в наличии"}
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#eadfcf] bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#ff9800] hover:text-[#ff9800] sm:px-6 sm:py-4 sm:text-base"
                >
                  <Heart size={18} />
                  В избранное
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
