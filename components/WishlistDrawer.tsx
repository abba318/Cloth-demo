'use client';

import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, ColorOption } from '../lib/types';
import { formatNaira } from '../lib/utils';

interface WishlistDrawerProps {
  isOpen: boolean;
  wishlistIds: string[];
  products: Product[];
  onClose: () => void;
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product, color: ColorOption, size: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  wishlistIds,
  products,
  onClose,
  onRemoveWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] border-l border-[#ECE6DB] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#ECE6DB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#8C6D4C]" />
              <h2 className="font-serif text-xl tracking-wider uppercase text-[#18181B]">
                Saved Pieces ({wishlistedProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-[#18181B] transition-colors"
              aria-label="Close wishlist drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#ECE6DB]">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#71717A]">
                <Heart className="w-12 h-12 stroke-[1] text-[#A1A1AA] mb-4" />
                <p className="font-serif text-xl text-[#18181B] mb-2">No Saved Garments</p>
                <p className="text-xs text-[#71717A] max-w-xs mb-6">
                  Save your favorite silhouettes to curate your personalized seasonal lookbook.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#18181B] text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#27272A] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-20 h-24 bg-[#F2EFE9] shrink-0 border border-[#E8E2D6] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-[#18181B] line-clamp-1">
                          {product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveWishlist(product.id)}
                          className="text-[#A1A1AA] hover:text-red-600 transition-colors p-1"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#71717A] uppercase tracking-wider mt-0.5">
                        {product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <span className="text-sm font-semibold text-[#18181B] tabular-nums">
                        {formatNaira(product.price)}
                      </span>
                      <button
                        onClick={() => {
                          onAddToCart(product, product.colors[0], product.sizes[0] || 'M');
                        }}
                        className="px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-medium tracking-wider uppercase flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#C8A27C]" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-6 border-t border-[#ECE6DB] bg-white text-center">
              <p className="text-xs text-[#71717A]">
                Pieces saved in your boutique wishlist will remain active during this browser session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
