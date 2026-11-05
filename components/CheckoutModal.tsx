'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, ArrowLeft } from 'lucide-react';
import { CartItem, OrderConfirmation } from '../lib/types';
import { formatNaira } from '../lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  discountAmount: number;
  promoApplied: string;
  onClose: () => void;
  onOrderComplete: (order: OrderConfirmation) => void;
}

function createOrderId(): string {
  return `LUM-${(Date.now() % 90000) + 10000}`;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cart,
  discountAmount,
  promoApplied,
  onClose,
  onOrderComplete,
}) => {
  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 250000 ? 0 : 15000;
  const tax = Math.round((subtotal - discountAmount) * 0.075); // 7.5% VAT
  const total = subtotal - discountAmount + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setFormError('Please fill in all shipping details to proceed.');
      return;
    }

    const newOrder: OrderConfirmation = {
      orderId: createOrderId(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      customerName: fullName,
      customerEmail: email,
      shippingAddress: address,
      city,
      postalCode,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shipping,
      tax,
      total,
    };

    setConfirmedOrder(newOrder);
    setStep('confirmation');
    onOrderComplete(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] border border-[#ECE6DB] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#ECE6DB] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C6D4C] block">
              Boutique Atelier Checkout
            </span>
            <h2 className="font-serif text-2xl text-[#18181B] font-light">
              {step === 'details' ? 'Delivery & Payment' : 'Order Confirmed'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71717A] hover:text-[#18181B] transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                {formError}
              </div>
            )}

            {/* Contact Details */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#18181B] mb-3 flex items-center gap-2">
                <span>01. Client Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#52525B] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Genevieve Laurent"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#52525B] mb-1">Email for Receipt</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. g.laurent@paris.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#18181B] mb-3 flex items-center gap-2">
                <span>02. Delivery Address</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#52525B] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14 Rue de Rivoli, Apt 4B"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#52525B] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Paris / New York"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#52525B] mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="75001"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#52525B] mb-1">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                    >
                      <option>Nigeria</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>France</option>
                      <option>Canada</option>
                      <option>South Africa</option>
                      <option>Ghana</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#18181B] mb-3 flex items-center gap-2">
                <span>03. Payment Method</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 border cursor-pointer flex items-center gap-3 transition-colors ${
                    paymentMethod === 'card' ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]' : 'border-[#D4CEBF] bg-[#F7F4EE]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#8C6D4C]" />
                  <div>
                    <div className="text-xs font-medium text-[#18181B]">Credit / Debit Card</div>
                    <div className="text-[10px] text-[#71717A]">Secure 256-bit SSL</div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 border cursor-pointer flex items-center gap-3 transition-colors ${
                    paymentMethod === 'cod' ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]' : 'border-[#D4CEBF] bg-[#F7F4EE]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#8C6D4C]" />
                  <div>
                    <div className="text-xs font-medium text-[#18181B]">Cash on Delivery</div>
                    <div className="text-[10px] text-[#71717A]">Pay courier on arrival</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-3 p-3 bg-white border border-[#E8E2D6] space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Card number (demo: 4242 •••• •••• 4242)"
                      defaultValue="4242 •••• •••• 4242"
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D4CEBF] focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="12/28"
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D4CEBF] focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      defaultValue="888"
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D4CEBF] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-4 bg-[#F2EFE8] border border-[#E5DFD3] space-y-2 text-xs">
              <div className="flex justify-between text-[#71717A]">
                <span>Items Subtotal</span>
                <span className="tabular-nums font-medium text-[#18181B]">{formatNaira(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2E5E4E]">
                  <span>Promotion ({promoApplied})</span>
                  <span className="tabular-nums font-medium">-{formatNaira(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#71717A]">
                <span>Global Express Courier</span>
                <span className="tabular-nums font-medium text-[#18181B]">
                  {shipping === 0 ? 'Complimentary' : formatNaira(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>Estimated VAT (7.5%)</span>
                <span className="tabular-nums font-medium text-[#18181B]">{formatNaira(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#18181B] pt-2 border-t border-[#D9D3C5]">
                <span>Total Amount</span>
                <span className="tabular-nums">{formatNaira(total)}</span>
              </div>
            </div>

            {/* Action */}
            <button
              type="submit"
              className="w-full py-4 bg-[#18181B] hover:bg-[#27272A] text-[#FAF9F6] text-xs font-medium tracking-[0.2em] uppercase transition-colors shadow-sm"
            >
              Complete Order & Authorize Payment
            </button>
          </form>
        ) : (
          /* Order Confirmation Screen */
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-[#F2EFE8] border border-[#C8A27C]/40 text-[#8C6D4C] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#8C6D4C] font-semibold">
                Order Confirmed
              </span>
              <h3 className="font-serif text-3xl text-[#18181B] mt-1 mb-2">
                Merci, {confirmedOrder?.customerName}
              </h3>
              <p className="text-xs text-[#71717A] max-w-md mx-auto">
                Your order <strong className="text-[#18181B] font-mono">{confirmedOrder?.orderId}</strong> is registered with our Parisian atelier. A confirmation receipt has been dispatched to {confirmedOrder?.customerEmail}.
              </p>
            </div>

            <div className="p-4 bg-[#F2EFE8] border border-[#E5DFD3] text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-[#71717A]">
                <span>Destination:</span>
                <span className="text-[#18181B] font-medium">{confirmedOrder?.shippingAddress}, {confirmedOrder?.city}</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>Estimated Dispatch:</span>
                <span className="text-[#18181B] font-medium">Within 24 Hours</span>
              </div>
              <div className="flex justify-between text-[#71717A] pt-2 border-t border-[#D9D3C5]">
                <span>Total Charged:</span>
                <span className="text-sm font-semibold text-[#18181B] tabular-nums">{confirmedOrder ? formatNaira(confirmedOrder.total) : ''}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-[#18181B] text-[#FAF9F6] text-xs font-medium tracking-[0.18em] uppercase hover:bg-[#27272A] transition-colors"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
