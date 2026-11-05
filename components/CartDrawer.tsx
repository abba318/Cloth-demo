'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../lib/types';
import { formatNaira } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (discountAmount: number, promoApplied: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountRate = appliedPromo === 'LUMIERE10' ? 0.10 : 0;
  const discountAmount = subtotal * discountRate;
  const freeShippingThreshold = 250000;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15000;
  const total = subtotal - discountAmount + shipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === 'LUMIERE10') {
      setAppliedPromo('LUMIERE10');
      setPromoCode('');
    } else {
      setPromoError('Invalid promotion code. Try LUMIERE10 for 10% off.');
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] border-l border-[#ECE6DB] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#ECE6DB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8C6D4C]" />
              <h2 className="font-serif text-xl tracking-wider uppercase text-[#18181B]">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-[#18181B] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-[#F3EFE7] px-6 py-3 border-b border-[#E8E2D6] text-xs">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-[#2E5E4E] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E5E4E]" />
                You unlocked Complimentary Express Global Shipping.
              </span>
            ) : (
              <div>
                <p className="text-[#52525B] mb-1.5">
                  Add <span className="font-semibold text-[#18181B] tabular-nums">{formatNaira(freeShippingThreshold - subtotal)}</span> more for Complimentary Courier.
                </p>
                <div className="w-full bg-[#E5DFD3] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C8A27C] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#ECE6DB]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#71717A]">
                <ShoppingBag className="w-12 h-12 stroke-[1] text-[#A1A1AA] mb-4" />
                <p className="font-serif text-xl text-[#18181B] mb-2">Your Bag is Empty</p>
                <p className="text-xs text-[#71717A] max-w-xs mb-6">
                  Explore our seasonal curated collection to find architectural tailoring and natural fibers.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#18181B] text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#27272A] transition-colors"
                >
                  Discover Collection
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#F2EFE9] shrink-0 border border-[#E8E2D6] overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-[#18181B] line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-[#A1A1AA] hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-[#71717A] flex items-center gap-2 mt-1">
                        <span>Size: <strong className="text-[#18181B]">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D4CEBF] bg-white">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-xs text-[#71717A] hover:text-[#18181B]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-medium tabular-nums text-[#18181B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-[#71717A] hover:text-[#18181B]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#18181B] tabular-nums">
                        {formatNaira(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#ECE6DB] bg-[#FAF9F6]">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. LUMIERE10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B] uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F2EFE9] text-[#18181B] border border-[#D4CEBF] text-xs font-medium tracking-wider uppercase hover:bg-[#EAE4D9] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-[11px] text-[#2E5E4E] mt-1 font-medium">
                    10% boutique discount applied ({appliedPromo})
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600 mt-1">{promoError}</p>
                )}
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#71717A] mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#18181B] font-medium tabular-nums">{formatNaira(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-[#2E5E4E]">
                    <span>Discount (10%)</span>
                    <span className="font-medium tabular-nums">-{formatNaira(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span className="text-[#18181B] font-medium tabular-nums">
                    {shipping === 0 ? 'Complimentary' : formatNaira(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#18181B] pt-2 border-t border-[#ECE6DB]">
                  <span>Total Due</span>
                  <span className="tabular-nums">{formatNaira(total)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => onProceedToCheckout(discountAmount, appliedPromo || '')}
                className="w-full py-4 px-6 bg-[#18181B] hover:bg-[#27272A] text-[#FAF9F6] text-xs font-medium tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C8A27C]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
