'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product } from '../lib/types';
import { formatNaira } from '../lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  products,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] border border-[#ECE6DB] shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#ECE6DB] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#8C6D4C] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search silhouettes, noble fabrics, silk, trench coats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#18181B] placeholder-[#A1A1AA] focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-[#71717A] hover:text-[#18181B] transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="p-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] block mb-3 font-semibold">
              Suggested Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {['Silk Slip Dress', 'Virgin Wool', 'Cashmere', 'Trench', 'Shoulder Bag', 'New Arrivals'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 bg-white border border-[#E5DFD3] text-xs text-[#52525B] hover:border-[#18181B] hover:text-[#18181B] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="max-h-96 overflow-y-auto divide-y divide-[#ECE6DB] p-4 sm:p-6">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-[#71717A]">
                <p className="text-sm font-medium text-[#18181B]">No garments match &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-[#A1A1AA] mt-1">Try another keyword or browse our full collections.</p>
              </div>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-white transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-[#F2EFE9] border border-[#E8E2D6] overflow-hidden shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#18181B] group-hover:text-[#8C6D4C] transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-xs text-[#71717A] uppercase tracking-wider">
                        {product.category} · {product.fabric}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-[#18181B] tabular-nums">
                      {formatNaira(product.price)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#18181B] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
