'use client';

import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, ColorOption } from '../lib/types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product, color: ColorOption, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Natural', hex: '#E7D5BE' });
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    onAddToCart(product, selectedColor, defaultSize);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-[#FAF9F6] border border-[#ECE6DB] hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full bg-[#F3EFE8] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#EFECE6] animate-pulse" />
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#EFECE6] text-[#71717A]">
            <span className="font-serif text-lg tracking-wider text-[#18181B] mb-1">{product.title}</span>
            <span className="text-xs uppercase tracking-widest text-[#8C6D4C]">{product.category}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Top Badges / Indicators (Quiet text, zero pill) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-[#FAF9F6]/90 backdrop-blur-xs text-[10px] font-medium tracking-[0.16em] uppercase text-[#18181B] border border-[#E8E2D6]">
              New Arrival
            </span>
          )}
          {product.uploadedBy && (
            <span className="px-2 py-0.5 bg-[#18181B]/90 backdrop-blur-xs text-[9px] font-medium tracking-[0.12em] uppercase text-[#C8A27C]">
              Admin Uploaded
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-[#18181B] text-[#C8A27C] shadow-sm'
              : 'bg-[#FAF9F6]/90 text-[#52525B] hover:text-[#18181B] hover:bg-white border border-[#E8E2D6]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 bg-[#FAF9F6]/95 hover:bg-white text-[#18181B] text-xs font-medium tracking-wider uppercase border border-[#D4CEBF] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-[#FAF9F6]">
        <div>
          {/* Metadata: Category and Fabric quiet text */}
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#71717A] mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-[#A1A1AA]">·</span>
            <span className="truncate">{product.inStock ? 'In Stock' : 'Pre-Order'}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-[#18181B] tracking-normal line-clamp-1 group-hover:text-[#8C6D4C] transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Swatches and Price Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F0EBE1]">
          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.slice(0, 4).map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                    isSelected ? 'ring-2 ring-[#18181B] ring-offset-1 ring-offset-[#FAF9F6] scale-110' : 'border-[#D4CEBF] opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                />
              );
            })}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-[#A1A1AA] tabular-nums">+{product.colors.length - 4}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 shrink-0">
            {product.originalPrice && (
              <span className="text-xs text-[#A1A1AA] line-through tabular-nums">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-semibold text-[#18181B] tabular-nums">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add To Cart Primary Action Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-2.5 px-3 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${
            isAddedRecently
              ? 'bg-[#2E5E4E] text-white border-[#2E5E4E]'
              : 'bg-[#18181B] hover:bg-[#27272A] text-[#FAF9F6] border-[#18181B]'
          }`}
        >
          {isAddedRecently ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-[#C8A27C]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
