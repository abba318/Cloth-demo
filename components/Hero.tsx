'use client';

import React from 'react';
import { ArrowRight, Sparkles, Feather, Shield } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section className="relative pt-24 sm:pt-28 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E8E2D6] min-h-[580px] lg:min-h-[640px] flex items-center">
          {/* Background Image Container with Measured Contrast Scrim */}
          <div className="absolute inset-0">
            <img
              src="/images/hero.jpg"
              alt="LUMIÈRE Editorial Autumn/Winter Haute Collection"
              className="w-full h-full object-cover object-[center_28%]"
              referrerPolicy="no-referrer"
            />
            {/* Elegant luxury gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/75 to-transparent md:to-[#FAF9F6]/10" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#FAF9F6]/20 to-[#FAF9F6]/60 md:hidden" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-xl py-12 px-6 sm:px-12 lg:px-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#8C6D4C] mb-4">
              <span className="w-6 h-[1px] bg-[#C8A27C]" />
              <span>Saison 2026 Édition Limitée</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#18181B] leading-[1.1] text-balance mb-6">
              Elevate Your Everyday Wardrobe
            </h1>

            <p className="text-sm sm:text-base text-[#52525B] leading-relaxed mb-8 max-w-lg font-normal">
              An unhurried study in timeless minimalism. Sculptural tailoring, pure Italian virgin wool, and pure silk designed for fluid movement and quiet distinction.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onShopClick}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#18181B] text-[#FAF9F6] text-xs font-medium tracking-[0.18em] uppercase hover:bg-[#27272A] transition-all duration-200 shadow-sm"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-[#C8A27C]" />
              </button>

              <a
                href="#collections"
                className="inline-flex items-center px-6 py-4 border border-[#BDB4A1] text-[#18181B] text-xs font-medium tracking-[0.18em] uppercase hover:border-[#18181B] transition-colors"
              >
                Lookbook
              </a>
            </div>
          </div>
        </div>

        {/* 3 Refined Value Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-b border-[#EAE4D9]/80 pb-10">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-[#F2EFE9] text-[#8C6D4C] shrink-0 border border-[#E3DDD0]">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#18181B] mb-1">
                Noble Natural Fibers
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Single-origin 22mm mulberry silk, Mongolian cashmere, and certified Italian virgin wool.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-[#F2EFE9] text-[#8C6D4C] shrink-0 border border-[#E3DDD0]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#18181B] mb-1">
                Conscious Small-Batch
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Limited production runs crafted with artisan ateliers to ensure exceptional finishing and zero waste.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-[#F2EFE9] text-[#8C6D4C] shrink-0 border border-[#E3DDD0]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#18181B] mb-1">
                White-Glove Delivery
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Complimentary global courier on orders over $200. Archival linen dust bags and gold-embossed boxes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
