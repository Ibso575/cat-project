import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function getProductMeta(product) {
  const variant = product?.main_variant || product?.variants?.[0] || {};
  const discount =
    variant?.old_price && variant?.price
      ? Math.round(((variant.old_price - variant.price) / variant.old_price) * 100)
      : 0;

  return {
    title: product?.name || "Товар",
    imageUrl: product?.image_url || "",
    price: variant?.price || product?.min_price || 0,
    oldPrice: variant?.old_price || null,
    weight:
      variant?.weight && variant?.weight_unit
        ? `${variant.weight} ${variant.weight_unit}`
        : null,
    discount,
  };
}

export default function ProductCard({ product }) {
  const { title, imageUrl, price, oldPrice, weight, discount } =
    getProductMeta(product);

  return (
    <article className="group relative flex h-full flex-col border border-[#dedede] bg-white p-0">
      {discount > 0 ? (
        <div className="absolute left-0 top-0 z-10 bg-[#ff3535] px-3 py-1 text-[12px] font-bold leading-none text-white">
          -{discount}%
        </div>
      ) : null}

      <Link
        to={`/products/${product.id}`}
        className="relative block h-[220px] w-full overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </Link>
      
      <div className="flex flex-col flex-grow p-4 pt-2">

      <Link
        to={`/products/${product.id}`}
        className="mt-4 min-h-[78px] text-[15px] leading-7 text-[#333333] transition hover:text-[#ff8a00]"
      >
        {title}
      </Link>

      {weight ? (
        <button
          type="button"
          className="mt-3 flex h-[40px] w-full items-center justify-between rounded-[4px] border border-[#d9d9d9] px-3 text-[14px] text-[#444444]"
        >
          <span>{weight}</span>
          <ChevronDown size={16} />
        </button>
      ) : (
        <div className="mt-3 h-[40px]" />
      )}

      <div className="mt-4 flex items-end gap-3">
        <span className="text-[17px] font-extrabold leading-none text-[#333333]">
          {price} ₽
        </span>
        {oldPrice ? (
          <span className="text-[15px] leading-none text-[#9a9a9a] line-through">
            {oldPrice} ₽
          </span>
        ) : null}
      </div>

      <button
        type="button"
        className="mt-4 h-[40px] rounded-[4px] bg-[#ff9519] text-[14px] font-semibold text-white transition hover:bg-[#ff8400]"
      >
        В корзину
      </button>
      <button
        type="button"
        className="mt-3 text-[14px] text-[#ff9519] transition hover:text-[#ff8400]"
      >
        Купить в 1 клик
      </button>
      </div>
    </article>
  );
}
