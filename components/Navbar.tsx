'use client';

import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, ShieldCheck, UserCheck, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  isAdminLoggedIn: boolean;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  isAdminLoggedIn,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-xs border-b border-[#EAE4D9]/80 py-3.5'
            : 'bg-[#FAF9F6]/80 backdrop-blur-xs border-b border-[#EAE4D9]/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-[#18181B] hover:text-[#C8A27C] transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <a
                href="#"
                className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-light uppercase text-[#18181B] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0"
              >
                LUMIÈRE
              </a>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase text-[#52525B]">
              <a href="#" className="hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#18181B]">
                Home
              </a>
              <a href="#shop" className="hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#18181B]">
                Shop
              </a>
              <a href="#collections" className="hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#18181B]">
                Collections
              </a>
              <a href="#story" className="hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#18181B]">
                About
              </a>
              <a href="#footer" className="hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#18181B]">
                Contact
              </a>
            </nav>

            {/* Zone 3: Actions (Search, Wishlist, Cart, Admin) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Search */}
              <button
                onClick={onOpenSearch}
                className="p-2 text-[#27272A] hover:text-[#C8A27C] transition-colors"
                aria-label="Search collection"
                title="Search garments"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist */}
              <button
                onClick={onOpenWishlist}
                className="p-2 text-[#27272A] hover:text-[#C8A27C] transition-colors relative"
                aria-label={`Wishlist (${wishlistCount} items)`}
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8A27C] text-white text-[10px] font-medium flex items-center justify-center rounded-full tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart */}
              <button
                onClick={onOpenCart}
                className="p-2 text-[#27272A] hover:text-[#C8A27C] transition-colors relative"
                aria-label={`Shopping Cart (${cartCount} items)`}
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#18181B] text-white text-[10px] font-medium flex items-center justify-center rounded-full tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Button */}
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap shrink-0 border ${
                  isAdminLoggedIn
                    ? 'bg-[#18181B] text-[#FAF9F6] border-[#18181B] hover:bg-[#27272A]'
                    : 'bg-transparent text-[#52525B] border-[#D4CEBF] hover:border-[#18181B] hover:text-[#18181B]'
                }`}
                title={isAdminLoggedIn ? 'Admin Panel (Logged in: test@gmail.com)' : 'Admin Login (test@gmail.com)'}
              >
                {isAdminLoggedIn ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8A27C]" />
                    <span className="hidden sm:inline">Admin Studio</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-[#71717A]" />
                    <span className="hidden sm:inline">Admin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAE4D9] bg-[#FAF9F6] px-6 py-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-4 text-xs font-medium tracking-[0.15em] uppercase text-[#52525B]">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#18181B] transition-colors py-1"
              >
                Home
              </a>
              <a
                href="#shop"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#18181B] transition-colors py-1"
              >
                Shop Collection
              </a>
              <a
                href="#collections"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#18181B] transition-colors py-1"
              >
                Featured Collections
              </a>
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#18181B] transition-colors py-1"
              >
                About LUMIÈRE
              </a>
              <a
                href="#footer"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#18181B] transition-colors py-1"
              >
                Contact & Client Services
              </a>
              <div className="pt-2 border-t border-[#EAE4D9]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#A1A1AA]">Admin Management</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="text-xs font-medium tracking-wider text-[#C8A27C] hover:underline"
                >
                  {isAdminLoggedIn ? 'Open Admin Studio' : 'Admin Login'}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
