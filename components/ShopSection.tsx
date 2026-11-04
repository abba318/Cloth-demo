'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { Product, ColorOption } from '../lib/types';
import { ProductCard } from './ProductCard';

interface ShopSectionProps {
  products: Product[];
  wishlistIds: string[];
  onAddToCart: (product: Product, color: ColorOption, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenAdminUpload: () => void;
}

type FilterCategory = 'All' | 'New Arrivals' | 'Dresses' | 'Outerwear' | 'Accessories' | 'Tops';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  wishlistIds,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onOpenAdminUpload,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const categories: FilterCategory[] = [
    'All',
    'New Arrivals',
    'Dresses',
    'Outerwear',
    'Accessories',
    'Tops',
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter
    if (selectedCategory === 'New Arrivals') {
      list = list.filter((p) => p.isNewArrival);
    } else if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      // featured
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  return (
    <section id="shop" className="py-16 sm:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#ECE6DB]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#8C6D4C] mb-2">
              <span className="w-5 h-[1px] bg-[#C8A27C]" />
              <span>Curated Haute Collection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] font-light tracking-tight">
              The Boutique Catalog
            </h2>
          </div>

          {/* Quick upload cloth shortcut for convenience */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdminUpload}
              className="text-xs text-[#8C6D4C] hover:text-[#18181B] flex items-center gap-1.5 transition-colors underline underline-offset-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin: Upload Cloth Image</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Sort Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Functional Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-[#18181B] text-[#FAF9F6] border-[#18181B]'
                      : 'bg-white text-[#52525B] border-[#E8E2D6] hover:border-[#18181B] hover:text-[#18181B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
            <span className="text-xs text-[#71717A] uppercase tracking-wider hidden sm:inline">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort boutique collection"
                className="appearance-none pl-3 pr-8 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B] tracking-wider uppercase text-[#18181B] cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#71717A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="text-xs text-[#71717A] tabular-nums whitespace-nowrap">
              ({filteredAndSortedProducts.length} items)
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#ECE6DB] p-8">
            <p className="font-serif text-2xl text-[#18181B] mb-2">No garments found in this category</p>
            <p className="text-xs text-[#71717A] mb-6">
              Try switching your filter or use the admin studio to upload a new piece.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-6 py-2.5 bg-[#18181B] text-white text-xs font-medium tracking-wider uppercase"
            >
              View All Garments
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
