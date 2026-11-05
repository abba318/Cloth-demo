'use client';

import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import { Product, ColorOption } from '../lib/types';
import { formatNaira } from '../lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color: ColorOption, size: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [selectedColorOverride, setSelectedColorOverride] = useState<ColorOption | null>(null);
  const [selectedSizeOverride, setSelectedSizeOverride] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  if (!isOpen || !product) return null;

  const selectedColor = selectedColorOverride || product.colors[0] || { name: 'Natural', hex: '#E7D5BE' };
  const selectedSize = selectedSizeOverride || product.sizes[0] || 'M';

  const handleClose = () => {
    setSelectedColorOverride(null);
    setSelectedSizeOverride(null);
    setQuantity(1);
    setIsAddedRecently(false);
    onClose();
  };

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#FAF9F6] border border-[#ECE6DB] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-[#18181B] rounded-full transition-colors border border-[#ECE6DB]"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="relative aspect-[3/4] bg-[#F2EFE9] overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#FAF9F6]/95 text-[10px] font-medium tracking-[0.2em] uppercase text-[#18181B] border border-[#E8E2D6]">
                New Arrival
              </span>
            )}
          </div>

          {/* Product Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#71717A] mb-2">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#3F6212] font-medium">Ready to Dispatch</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl text-[#18181B] font-normal leading-snug mb-3">
                {product.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-xl sm:text-2xl font-semibold text-[#18181B] tabular-nums">
                  {formatNaira(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#A1A1AA] line-through tabular-nums">
                    {formatNaira(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-[#71717A] tracking-wider uppercase">Taxes included</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#52525B] leading-relaxed mb-6 font-normal">
                {product.description}
              </p>

              {/* Fabric Detail */}
              <div className="p-3 bg-[#F4F1EA] border border-[#E8E2D6] text-xs text-[#3F3F46] mb-6 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#8C6D4C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#18181B]">Fabric & Composition:</span> {product.fabric}
                </div>
              </div>

              {/* Color Swatch Selection */}
              <div className="mb-6">
                <label className="block text-xs font-medium uppercase tracking-[0.12em] text-[#3F3F46] mb-2.5">
                  Color: <span className="font-semibold text-[#18181B]">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColorOverride(color)}
                        className={`w-7 h-7 rounded-full border transition-all duration-150 flex items-center justify-center ${
                          isSelected ? 'ring-2 ring-[#18181B] ring-offset-2 ring-offset-[#FAF9F6] scale-105' : 'border-[#D4CEBF] opacity-85 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={`Select color ${color.name}`}
                      >
                        {isSelected && <Check className={`w-3.5 h-3.5 ${color.hex === '#1C1B1A' || color.hex === '#171717' || color.hex === '#2B2B2B' ? 'text-white' : 'text-zinc-900'}`} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#3F3F46]">
                    Select Size
                  </span>
                  <span className="text-[11px] text-[#8C6D4C] hover:underline cursor-pointer">
                    Atelier Sizing Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSizeOverride(size)}
                      className={`min-w-[44px] h-10 px-3 text-xs font-medium uppercase tracking-wider transition-all border ${
                        selectedSize === size
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-white text-[#27272A] border-[#D4CEBF] hover:border-[#18181B]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mb-8 flex items-center gap-4">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#3F3F46]">
                  Quantity
                </span>
                <div className="flex items-center border border-[#D4CEBF] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-semibold tabular-nums text-[#18181B]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions: Add to Bag & Wishlist */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#ECE6DB]">
              <button
                onClick={handleAdd}
                className={`flex-1 py-4 px-6 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2.5 border ${
                  isAddedRecently
                    ? 'bg-[#2E5E4E] text-white border-[#2E5E4E]'
                    : 'bg-[#18181B] hover:bg-[#27272A] text-[#FAF9F6] border-[#18181B]'
                }`}
              >
                {isAddedRecently ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#C8A27C]" />
                    <span>Add to Bag — {formatNaira(product.price * quantity)}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-4 border transition-colors ${
                  isWishlisted
                    ? 'bg-[#18181B] text-[#C8A27C] border-[#18181B]'
                    : 'bg-white text-[#52525B] border-[#D4CEBF] hover:border-[#18181B]'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
