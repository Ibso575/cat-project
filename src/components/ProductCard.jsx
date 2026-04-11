import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 md:h-56 lg:h-64 bg-gray-100">
        <img
          src={product.image || "https://via.placeholder.com/300x300"}
          alt={product.name || product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
        <button
          className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart
            size={20}
            className="text-gray-600 hover:text-red-500 transition-colors"
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Category */}
        {product.category && (
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
          {product.name || product.title}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(product.rating) ? "fill-current" : ""
                    }
                  />
                ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.ratings || 0})
            </span>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg md:text-xl font-bold text-gray-900">
            {product.price
              ? `$${product.price}`
              : product.price_in_usd
                ? `$${product.price_in_usd}`
                : "N/A"}
          </span>
          {product.old_price && (
            <span className="text-sm text-gray-500 line-through">
              ${product.old_price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          <ShoppingCart size={18} />
          <span className="text-sm md:text-base">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
