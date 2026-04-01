import React from 'react';

const ProductList = ({ products, onEdit, onDelete, onToggleFeatured, isAdmin = false, darkMode = false }) => {
  if (products.length === 0) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product) => (
        <div
          key={product._id || product.id}
          className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
            
            {/* Featured Badge */}
            {product.featured && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                ⭐ Featured
              </span>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="absolute top-3 right-3 flex gap-1.5">
                <button
                  onClick={() => onToggleFeatured?.(product._id || product.id)}
                  className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
                    product.featured 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white/90 text-gray-600 hover:bg-orange-500 hover:text-white'
                  }`}
                  title="Toggle Featured"
                >
                  ⭐
                </button>
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 rounded-lg bg-white/90 text-blue-600 hover:bg-blue-500 hover:text-white backdrop-blur-sm"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => window.confirm(`Delete "${product.name}"?`) && onDelete(product._id || product.id)}
                  className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-red-500 hover:text-white backdrop-blur-sm"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            {product.category && (
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {product.category}
              </span>
            )}

            {/* Name */}
            <h3 className={`font-semibold text-lg mt-1 mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {product.name}
            </h3>

            {/* Price */}
            {product.price > 0 && (
              <p className="text-xl font-bold text-green-500 mb-3">
                {formatPrice(product.price)}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {product.description}
              </p>
            )}

            {/* Buy Buttons */}
            <div className="flex gap-2">
              {product.amazonLink && (
                <a
                  href={product.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 py-2.5 rounded-lg font-semibold text-center text-sm transition-colors"
                >
                  Amazon
                </a>
              )}
              {product.flipkartLink && (
                <a
                  href={product.flipkartLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-center text-sm transition-colors"
                >
                  Flipkart
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
