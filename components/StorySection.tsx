'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StorySectionProps {
  onExploreCollection: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onExploreCollection }) => {
  return (
    <section id="story" className="py-20 sm:py-28 bg-[#F4F1EA] border-y border-[#ECE6DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#8C6D4C]">
              <span className="w-5 h-[1px] bg-[#C8A27C]" />
              <span>Manifesto & Atelier</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#18181B] leading-tight">
              Quiet Luxury, Architectural Lines & Pure Tactile Form
            </h2>

            <p className="text-sm text-[#52525B] leading-relaxed">
              Founded on the belief that enduring elegance whispers rather than shouts. LUMIÈRE works exclusively with heritage mills in Biella, Italy and master silk weavers in Lyon to create clothes meant to be lived in, treasured, and passed down.
            </p>

            <p className="text-sm text-[#52525B] leading-relaxed">
              Every seam is French finished, every button carved from natural horn or mother-of-pearl, and every silhouette calibrated to move fluidly with the human body.
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreCollection}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#18181B] hover:text-[#8C6D4C] transition-colors border-b border-[#18181B] pb-1 hover:border-[#8C6D4C]"
              >
                <span>Read the Sustainability Atelier Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Visual Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-[#EFECE6] border border-[#E0D9CB] p-2 aspect-[4/5] overflow-hidden">
                <img
                  src="/images/dress.jpg"
                  alt="Liquid silk drape craftsmanship"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 bg-white border border-[#E8E2D6]">
                <h4 className="font-serif text-lg text-[#18181B] mb-1">Single-Origin Silk</h4>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  22-momme pure mulberry silk cultivated without synthetic pesticides, yielding uncompromised natural tensile strength and softness.
                </p>
              </div>
            </div>

            <div className="space-y-6 sm:mt-12">
              <div className="p-6 bg-white border border-[#E8E2D6]">
                <h4 className="font-serif text-lg text-[#18181B] mb-1">Italian Virgin Wool</h4>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Milled in the Alpine foothills of Piedmont, our double-faced melton offers wind resistance and thermal breathability.
                </p>
              </div>
              <div className="bg-[#EFECE6] border border-[#E0D9CB] p-2 aspect-[4/5] overflow-hidden">
                <img
                  src="/images/coat.jpg"
                  alt="Tailored wool trench coat craftsmanship"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
