'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ShopSection } from '../components/ShopSection';
import { ProductModal } from '../components/ProductModal';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { SearchModal } from '../components/SearchModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { AdminPanelModal } from '../components/AdminPanelModal';
import { StorySection } from '../components/StorySection';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';
import { AiChatbot } from '../components/AiChatbot';
import { Product, CartItem, ColorOption, ToastMessage, OrderConfirmation } from '../lib/types';
import { INITIAL_PRODUCTS } from '../lib/products-data';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const ADMIN_EMAIL = 'test@gmail.com';
const ADMIN_PASSWORD = 'TEST1234556789';
let toastIdCounter = 0;

export default function Home() {
  // Storefront Product State (Persisted in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lumiere_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((p: Product) => ({
              ...p,
              price: p.price < 1000 ? p.price * 1000 : p.price,
              originalPrice: p.originalPrice && p.originalPrice < 1000 ? p.originalPrice * 1000 : p.originalPrice,
            }));
          }
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lumiere_cart');
        if (saved) {
          const parsedCart = JSON.parse(saved);
          if (Array.isArray(parsedCart)) {
            return parsedCart.map((item: CartItem) => ({
              ...item,
              product: {
                ...item.product,
                price: item.product.price < 1000 ? item.product.price * 1000 : item.product.price,
              },
            }));
          }
        }
      } catch (e) {}
    }
    return [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lumiere_wishlist');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('lumiere_admin_auth') === 'true';
      } catch (e) {}
    }
    return false;
  });

  // Modal / Drawer Visibility State
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);

  // Checkout Calculations State
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');

  // Notification Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Save Cart Changes
  useEffect(() => {
    try {
      localStorage.setItem('lumiere_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart save error:', e);
    }
  }, [cart]);

  // Save Wishlist Changes
  useEffect(() => {
    try {
      localStorage.setItem('lumiere_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Wishlist save error:', e);
    }
  }, [wishlistIds]);

  // Save Products Catalog when updated
  const updateProductsCatalog = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem('lumiere_products', JSON.stringify(updatedProducts));
    } catch (e) {
      console.warn('Products save error:', e);
    }
  };

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Operations
  const handleAddToCart = (product: Product, color: ColorOption, size: string, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === color.name &&
          item.selectedSize === size
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
      }
    });

    showToast(
      'Added to Shopping Bag',
      `${product.title} (${size} · ${color.name}) is added to your bag.`,
      'success'
    );
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Removed', 'Item removed from your shopping bag.', 'info');
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast('Wishlist Updated', `Removed ${product.title} from saved garments.`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast('Saved to Wishlist', `Added ${product.title} to your curated lookbook.`, 'success');
    }
  };

  // Admin Authentication
  const handleAdminLogin = (email: string, pass: string): boolean => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('lumiere_admin_auth', 'true');
      } catch (e) {}
      showToast('Admin Authorized', 'Authenticated as test@gmail.com. You can now upload and manage garments.', 'success');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('lumiere_admin_auth');
    } catch (e) {}
    showToast('Signed Out', 'Admin session terminated.', 'info');
  };

  // Admin Garment Management
  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    updateProductsCatalog(updated);
    showToast(
      'Cloth Published',
      `"${newProduct.title}" is now live on the LUMIÈRE storefront!`,
      'success'
    );
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    updateProductsCatalog(updated);
    showToast('Product Removed', 'Garment removed from the storefront catalog.', 'info');
  };

  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    updateProductsCatalog(updated);
    showToast('Stock Status Updated', 'Availability updated in live catalog.', 'info');
  };

  const handleResetCatalog = () => {
    updateProductsCatalog(INITIAL_PRODUCTS);
    showToast('Catalog Reset', 'Restored the original Parisian atelier collection.', 'info');
  };

  // Checkout Flow
  const handleProceedToCheckout = (discountAmount: number, promo: string) => {
    setCheckoutDiscount(discountAmount);
    setCheckoutPromoCode(promo);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderComplete = (order: OrderConfirmation) => {
    // Clear cart upon successful order placement
    setCart([]);
    showToast(
      'Order Confirmed',
      `Order ${order.orderId} successfully registered. Check your email for the receipt.`,
      'success'
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-[#EAE4D9]">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Top Banner for Admin Mode if active */}
      {isAdminLoggedIn && (
        <div className="bg-[#18181B] text-[#FAF9F6] text-[11px] py-1.5 px-4 text-center border-b border-[#2B2B2B] flex items-center justify-center gap-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8A27C]" />
          <span>
            Admin Session Active (<strong className="text-[#C8A27C]">test@gmail.com</strong>)
          </span>
          <button
            onClick={() => setAdminOpen(true)}
            className="underline hover:text-[#C8A27C] transition-colors"
          >
            Upload Garment
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={handleAdminLogout}
            className="text-[#A1A1AA] hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onShopClick={() => {
            const el = document.getElementById('shop');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Featured Editorial Collections Banner */}
        <section id="collections" className="py-12 bg-[#FAF9F6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Silk Atelier */}
              <div
                onClick={() => {
                  const el = document.getElementById('shop');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative aspect-[4/3] bg-[#F2EFE8] border border-[#E5DFD3] overflow-hidden cursor-pointer"
              >
                <img
                  src="/images/dress.jpg"
                  alt="The Liquid Silk Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A27C] block mb-1">
                    Atelier Focus
                  </span>
                  <h3 className="font-serif text-2xl font-light mb-2">The Silk Slip Edit</h3>
                  <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/90 group-hover:text-[#C8A27C] transition-colors">
                    <span>Discover Silhouettes</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Box 2: Outerwear Architecture */}
              <div
                onClick={() => {
                  const el = document.getElementById('shop');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative aspect-[4/3] bg-[#F2EFE8] border border-[#E5DFD3] overflow-hidden cursor-pointer"
              >
                <img
                  src="/images/coat.jpg"
                  alt="Architectural Outerwear"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A27C] block mb-1">
                    Seasonal Tailoring
                  </span>
                  <h3 className="font-serif text-2xl font-light mb-2">Italian Wool Melton</h3>
                  <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/90 group-hover:text-[#C8A27C] transition-colors">
                    <span>View Trench & Overcoats</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Box 3: Cashmere & Leather */}
              <div
                onClick={() => {
                  const el = document.getElementById('shop');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative aspect-[4/3] bg-[#F2EFE8] border border-[#E5DFD3] overflow-hidden cursor-pointer"
              >
                <img
                  src="/images/bag.jpg"
                  alt="Artisanal Accessories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A27C] block mb-1">
                    Bespoke Craft
                  </span>
                  <h3 className="font-serif text-2xl font-light mb-2">Leather & Cashmere</h3>
                  <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/90 group-hover:text-[#C8A27C] transition-colors">
                    <span>Explore Essentials</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Listing Grid (The Shop) */}
        <ShopSection
          products={products}
          wishlistIds={wishlistIds}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setActiveQuickViewProduct(p)}
          onOpenAdminUpload={() => setAdminOpen(true)}
        />

        {/* Brand Philosophy / Story Section */}
        <StorySection
          onExploreCollection={() => {
            const el = document.getElementById('shop');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Modals and Drawers */}
      <ProductModal
        product={activeQuickViewProduct}
        isOpen={Boolean(activeQuickViewProduct)}
        isWishlisted={activeQuickViewProduct ? wishlistIds.includes(activeQuickViewProduct.id) : false}
        onClose={() => setActiveQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        wishlistIds={wishlistIds}
        products={products}
        onClose={() => setWishlistOpen(false)}
        onRemoveWishlist={(id) => {
          setWishlistIds((prev) => prev.filter((item) => item !== id));
        }}
        onAddToCart={handleAddToCart}
      />

      <SearchModal
        isOpen={searchOpen}
        products={products}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(p) => setActiveQuickViewProduct(p)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        cart={cart}
        discountAmount={checkoutDiscount}
        promoApplied={checkoutPromoCode}
        onClose={() => setCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      <AdminPanelModal
        isOpen={adminOpen}
        isAdminLoggedIn={isAdminLoggedIn}
        products={products}
        onClose={() => setAdminOpen(false)}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleStock={handleToggleStock}
        onResetCatalog={handleResetCatalog}
      />

      {/* AI Fashion Stylist & Concierge Chatbot */}
      <AiChatbot
        products={products}
        onQuickView={(p) => setActiveQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
