import { addToCart, decreaseQuantity, selectCartItems } from "../../store/cartSlice";
import SkeletonLoader from "../SkeletonLoader";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductByIdQuery } from "../../store/apis/productsApi";
import { ArrowLeft, Star, Truck, ShieldCheck, RotateCcw, ShoppingCart, Minus, Plus, Heart } from "lucide-react";

function mapSpecifications(product, variant, t) {
  const specs = [
    { label: t('brand'), value: product?.brand },
    {
      label: t('weight'),
      value:
        variant?.weight && variant?.weight_unit
          ? `${variant.weight} ${variant.weight_unit}`
          : null,
    },
    { label: t('sku'), value: variant?.sku },
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
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: responseData, isLoading, error } = useGetProductByIdQuery(id, {
    skip: !id,
  });
  const product = responseData?.data || responseData;

  const cartItems = useSelector(selectCartItems);
  const cartItem = cartItems.find((item) => item.id === Number(id));
  const cartQty = cartItem?.quantity || 0;

  const variant = product?.variants?.[0] || product?.main_variant || {};
  const title = product?.name || "Товар";
  const imageUrl = product?.image_url || variant?.image_url || "";
  const price = variant?.price || product?.min_price || 0;
  const oldPrice = variant?.old_price || null;
  const stock = variant?.stock ?? 0;
  const rating = product?.metrics?.rating_avg || 0;
  const reviewsCount = product?.metrics?.reviews_count || 0;
  const specifications = mapSpecifications(product, variant, t);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: title,
      price,
      imageUrl,
    }));
  };

  return (
    <section className="bg-[#fffaf5] dark:bg-slate-950 transition-colors duration-300 py-5 md:py-12 lg:py-16">
      <div className="container">
        <Link
          to="/products"
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#ff9800] transition-all hover:gap-3 sm:mb-6 sm:text-sm"
        >
          <ArrowLeft size={18} />
          {t('back_to_catalog')}
        </Link>

        {isLoading ? (
          <SkeletonLoader variant="detail" />
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 dark:bg-rose-900/10 dark:border-rose-800 p-6 text-rose-700 dark:text-rose-400">
            Ошибка загрузки товара. Пожалуйста, попробуйте позже.
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className="rounded-[1.5rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:rounded-[2rem] sm:p-6 lg:sticky lg:top-28">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#fff8ef] dark:bg-slate-800 sm:rounded-[1.75rem]">
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${
                    stock > 0
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {stock > 0 ? `${t('in_stock')}: ${stock}` : t('off_stock')}
                </span>
                {product?.brand ? (
                  <span className="rounded-full bg-[#fff1db] dark:bg-orange-900/20 px-3 py-1.5 text-xs font-semibold text-[#c96a00] dark:text-orange-400 sm:px-4 sm:py-2 sm:text-sm">
                    {product.brand}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="rounded-[1.5rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff9800] sm:text-sm sm:tracking-[0.3em]">
                  {t('details')}
                </p>
                <h1 className="mt-3 text-[28px] font-black leading-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
                  {title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-[#fff5e8] dark:bg-orange-900/20 px-3 py-1.5 text-xs font-semibold text-[#c96a00] dark:text-orange-400 sm:px-4 sm:py-2 sm:text-sm">
                    <Star size={14} className="fill-current sm:h-4 sm:w-4" />
                    {rating ? rating.toFixed(1) : t('new_product')}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 sm:text-sm">{reviewsCount} {t('reviews').toLowerCase()}</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
                <p className="text-xs text-slate-500 dark:text-gray-400 sm:text-sm">{t('price')}</p>
                <div className="mt-3 flex flex-wrap items-end gap-2 sm:gap-3">
                  <p className="text-[34px] font-black leading-none text-[#ff9800] sm:text-4xl">
                    {price} ₽
                  </p>
                  {oldPrice ? (
                    <p className="pb-0.5 text-base text-slate-400 dark:text-gray-500 line-through sm:pb-1 sm:text-lg">
                      {oldPrice} ₽
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-600 dark:text-gray-300 sm:text-sm">
                  {product?.description || "Описание товара пока не добавлено."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-[1.25rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center shadow-sm sm:rounded-[1.5rem] sm:p-4">
                  <Truck className="mx-auto mb-2 text-[#ff9800]" size={22} />
                  <p className="text-xs font-semibold text-slate-800 dark:text-gray-200 sm:text-sm uppercase tracking-wide">{t('fast_delivery')}</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center shadow-sm sm:rounded-[1.5rem] sm:p-4">
                  <ShieldCheck className="mx-auto mb-2 text-[#ff9800]" size={22} />
                  <p className="text-xs font-semibold text-slate-800 dark:text-gray-200 sm:text-sm uppercase tracking-wide">{t('quality_control')}</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center shadow-sm sm:rounded-[1.5rem] sm:p-4">
                  <RotateCcw className="mx-auto mb-2 text-[#ff9800]" size={22} />
                  <p className="text-xs font-semibold text-slate-800 dark:text-gray-200 sm:text-sm uppercase tracking-wide">{t('easy_return')}</p>
                </div>
              </div>

              {specifications.length > 0 ? (
                <div className="rounded-[1.5rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">{t('specifications')}</h2>
                  <div className="mt-4 space-y-3">
                    {specifications.map((specification, index) => (
                      <div
                        key={`${specification.label}-${index}`}
                        className="flex items-start justify-between gap-4 border-b border-[#f4ecdf] pb-3 text-xs sm:text-sm last:border-b-0 last:pb-0"
                      >
                        <span className="text-slate-500 dark:text-gray-400">{specification.label}</span>
                        <span className="text-right font-semibold text-slate-800 dark:text-gray-200">
                          {specification.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                {/* CART BUTTON — with quantity counter */}
                {cartQty === 0 ? (
                  <button
                    type="button"
                    disabled={stock === 0}
                    onClick={handleAddToCart}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff9800] dark:hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800 sm:px-6 sm:py-4 sm:text-base shadow-lg shadow-orange-500/10"
                  >
                    <ShoppingCart size={18} />
                    {stock > 0 ? t('add_to_cart') : t('off_stock')}
                  </button>
                ) : (
                  <div className="inline-flex min-h-[48px] items-center justify-between gap-3 rounded-full bg-[#ff9800] px-4 py-2 text-white shadow-lg shadow-orange-500/20">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(product.id))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-base font-bold min-w-[24px] text-center">{cartQty}</span>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-gray-200 transition hover:border-[#ff9800] hover:text-[#ff9800] sm:px-6 sm:py-4 sm:text-base"
                >
                  <Heart size={18} />
                  {t('add_to_wishlist')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
