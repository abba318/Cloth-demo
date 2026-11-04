'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="footer" className="bg-[#18181B] text-[#FAF9F6] pt-16 pb-12 border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Bar */}
        <div className="pb-12 border-b border-[#2B2B2F] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A27C] block mb-2 font-medium">
              Join the LUMIÈRE Society
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF9F6] mb-2">
              Subscribe for 10% off your first order
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-md leading-relaxed">
              Receive private invitations to seasonal private sales, archival previews, and atelier journal dispatches.
            </p>
          </div>

          <div className="lg:col-span-6">
            {isSubscribed ? (
              <div className="p-4 bg-[#232326] border border-[#3E3E42] text-xs space-y-1">
                <div className="flex items-center gap-2 text-[#C8A27C] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bienvenue to LUMIÈRE. Your 10% privilege is unlocked.</span>
                </div>
                <p className="text-[#A1A1AA]">
                  Use promotional code <strong className="text-white font-mono bg-black/40 px-1.5 py-0.5 border border-[#444]">LUMIERE10</strong> at checkout.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 bg-[#232326] border border-[#3E3E42] text-xs text-white placeholder-[#71717A] focus:outline-hidden focus:border-[#C8A27C] flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C8A27C] hover:bg-[#B8946E] text-[#18181B] text-xs font-semibold tracking-[0.18em] uppercase transition-colors shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-[#2B2B2F] text-xs">
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FAF9F6] mb-4">
              Atelier Collections
            </h4>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li><a href="#shop" className="hover:text-white transition-colors">Autumn/Winter Haute</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Mulberry Silk Slip Dresses</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Italian Wool Melton Coats</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Mongolian Cashmere Knits</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Fine Leather Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FAF9F6] mb-4">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li><a href="#footer" className="hover:text-white transition-colors">Complimentary Worldwide Courier</a></li>
              <li><a href="#footer" className="hover:text-white transition-colors">Bespoke Size Consultation</a></li>
              <li><a href="#footer" className="hover:text-white transition-colors">Returns & Archival Exchanges</a></li>
              <li><a href="#footer" className="hover:text-white transition-colors">Garment Preservation Care</a></li>
              <li><a href="#footer" className="hover:text-white transition-colors">Order Tracking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FAF9F6] mb-4">
              The House
            </h4>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li><a href="#story" className="hover:text-white transition-colors">Philosophy & Architecture</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">Traceable Noble Fibers</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">Artisan Mills Directory</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">Sustainability Charter</a></li>
              <li><a href="#footer" className="hover:text-white transition-colors">Flagship: Paris · 8e</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FAF9F6] mb-4">
              Administrative Studio
            </h4>
            <p className="text-[#A1A1AA] leading-relaxed mb-3">
              Authorized atelier staff access for garment uploads, catalog revisions, and inventory control.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#27272A] hover:bg-[#323236] text-white border border-[#3E3E42] text-[11px] tracking-wider uppercase transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A27C]" />
              <span>{isAdminLoggedIn ? 'Admin Panel (Logged In)' : 'Admin Login (test@gmail.com)'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div className="flex items-center gap-3">
            <span className="font-serif tracking-[0.2em] text-[#FAF9F6] font-light text-base">LUMIÈRE</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 LUMIÈRE Haute Boutique. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#A1A1AA]">
            <span>Privacy Charter</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Paris · Milan · New York · Tokyo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
