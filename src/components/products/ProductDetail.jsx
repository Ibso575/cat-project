import { addToCart, decreaseQuantity, selectCartItems } from "../../store/cartSlice";
import SkeletonLoader from "../SkeletonLoader";
import { useTranslation } from "react-i18next";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductByIdQuery } from "../../store/apis/productsApi";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

function getProductData(rawProduct) {
  const product = rawProduct || {};
  const variant = product.variants?.[0] || product.main_variant || {};

  return {
    id: product.id,
    title: product.name || "Товар",
    imageUrl: product.image_url || variant.image_url || "https://placehold.co/600x600/f6f6f6/8b8b8b?text=No+Image",
    description: product.description || "",
    brand: product.brand || "",
    price: variant.price ?? product.min_price ?? 0,
    oldPrice: variant.old_price ?? null,
    stock: variant.stock ?? 0,
    weight: variant.weight && variant.weight_unit ? `${variant.weight} ${variant.weight_unit}` : "",
    sku: variant.sku || "",
  };
}

export default function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: responseData, isLoading, error } = useGetProductByIdQuery(id, {
    skip: !id,
  });
  const product = responseData?.data || responseData;
  const productData = getProductData(product);

  const cartItems = useSelector(selectCartItems);
  const cartItem = cartItems.find((item) => item.id === Number(productData.id));
  const cartQty = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productData.id,
        name: productData.title,
        price: productData.price,
        imageUrl: productData.imageUrl,
      }),
    );
  };

  return (
    <section className="bg-[#fffaf5] dark:bg-slate-950 py-5 transition-colors duration-300 md:py-10 lg:py-14">
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
            {t("error_loading_product", { defaultValue: "Mahsulotni yuklashda xatolik" })}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#eadfcf] bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#fff8ef] dark:bg-slate-800">
                <img
                  src={productData.imageUrl}
                  alt={productData.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${productData.stock > 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"}`}>
                  {productData.stock > 0 ? `${t("in_stock")}: ${productData.stock}` : t("off_stock")}
                </span>
                {productData.brand ? <span className="rounded-full bg-[#fff1db] px-4 py-1.5 text-xs font-semibold text-[#c96a00] dark:bg-orange-900/20 dark:text-orange-400">{productData.brand}</span> : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-[#eadfcf] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ff9800]">{t("details")}</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{productData.title}</h1>

                <p className="mt-5 text-xs text-slate-500 dark:text-gray-400">{t("price")}</p>
                <div className="mt-2 flex items-end gap-3">
                  <p className="text-4xl font-black leading-none text-[#ff9800]">{productData.price} ₽</p>
                  {productData.oldPrice ? <p className="text-lg text-slate-400 line-through dark:text-gray-500">{productData.oldPrice} ₽</p> : null}
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-gray-300">
                  {productData.description || t("no_description", { defaultValue: "Tavsif yo'q" })}
                </p>
              </div>

              <div className="rounded-3xl border border-[#eadfcf] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{t("specifications")}</h2>
                <div className="mt-3 space-y-2 text-sm">
                  {productData.brand ? <p className="text-slate-600 dark:text-gray-300"><span className="font-semibold">{t("brand")}:</span> {productData.brand}</p> : null}
                  {productData.weight ? <p className="text-slate-600 dark:text-gray-300"><span className="font-semibold">{t("weight")}:</span> {productData.weight}</p> : null}
                  {productData.sku ? <p className="text-slate-600 dark:text-gray-300"><span className="font-semibold">SKU:</span> {productData.sku}</p> : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {cartQty === 0 ? (
                  <button
                    type="button"
                    disabled={productData.stock === 0}
                    onClick={handleAddToCart}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff9800] dark:hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800 sm:px-6 sm:py-4 sm:text-base shadow-lg shadow-orange-500/10"
                  >
                    <ShoppingCart size={18} />
                    {productData.stock > 0 ? t("add_to_cart") : t("off_stock")}
                  </button>
                ) : (
                  <div className="inline-flex min-h-[48px] items-center justify-between gap-3 rounded-full bg-[#ff9800] px-4 py-2 text-white shadow-lg shadow-orange-500/20">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(productData.id))}
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
                  disabled={productData.stock === 0}
                  onClick={() => navigate(`/checkout/${productData.id}`)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#ff9800] hover:bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition active:scale-95 sm:px-6 sm:py-4 sm:text-base shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🛒 {t("buy_now", { defaultValue: "Купить сейчас" })}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
