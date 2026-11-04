'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  ShieldCheck,
  LogOut,
  Layers,
  Sparkles,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Product, ColorOption } from '../lib/types';

interface AdminPanelModalProps {
  isOpen: boolean;
  isAdminLoggedIn: boolean;
  products: Product[];
  onClose: () => void;
  onLogin: (email: string, pass: string) => boolean;
  onLogout: () => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStock: (productId: string) => void;
  onResetCatalog: () => void;
}

const PRESET_COLORS: ColorOption[] = [
  { name: 'Noir Matte', hex: '#18181A' },
  { name: 'Champagne Satin', hex: '#E7D5BE' },
  { name: 'Camel Taupe', hex: '#C8A27C' },
  { name: 'Alabaster White', hex: '#F4EFE6' },
  { name: 'Oatmeal Heather', hex: '#D2C8BC' },
  { name: 'Forest Olive', hex: '#4B5342' },
  { name: 'Espresso Brown', hex: '#342621' },
];

const PRESET_IMAGES = [
  { label: 'Silk Slip Dress', url: '/images/dress.jpg' },
  { label: 'Wool Trench Coat', url: '/images/coat.jpg' },
  { label: 'Cashmere Knit', url: '/images/sweater.jpg' },
  { label: 'Leather Shoulder Bag', url: '/images/bag.jpg' },
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  isAdminLoggedIn,
  products,
  onClose,
  onLogin,
  onLogout,
  onAddProduct,
  onDeleteProduct,
  onToggleStock,
  onResetCatalog,
}) => {
  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'upload' | 'inventory'>('upload');

  // New Cloth Form State
  const [clothTitle, setClothTitle] = useState('');
  const [clothCategory, setClothCategory] = useState<Product['category']>('Dresses');
  const [clothPrice, setClothPrice] = useState<string>('320');
  const [clothOriginalPrice, setClothOriginalPrice] = useState<string>('');
  const [clothFabric, setClothFabric] = useState('100% Organic Mulberry Silk');
  const [clothDescription, setClothDescription] = useState(
    'Tailored with fluid drape and French seam finishes. Designed for effortless transitions from day to evening.'
  );
  const [clothImage, setClothImage] = useState<string>('/images/dress.jpg');
  const [clothSizes, setClothSizes] = useState<string[]>(['XS', 'S', 'M', 'L']);
  const [clothColors, setClothColors] = useState<ColorOption[]>([
    { name: 'Champagne Satin', hex: '#E7D5BE' },
    { name: 'Noir Matte', hex: '#18181A' },
  ]);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);

  // Custom Color inputs
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#C8A27C');

  // File Upload Handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Search in inventory
  const [inventorySearch, setInventorySearch] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = onLogin(emailInput.trim(), passwordInput.trim());
    if (!success) {
      setLoginError('Invalid credentials. Required Gmail: test@gmail.com | Password: TEST1234556789');
    }
  };

  const fillTestCredentials = () => {
    setEmailInput('test@gmail.com');
    setPasswordInput('TEST1234556789');
    setLoginError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please choose an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setClothImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClothSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clothTitle.trim()) {
      alert('Please enter a title for the garment.');
      return;
    }
    if (!clothImage) {
      alert('Please upload or select an image for this cloth.');
      return;
    }
    const parsedPrice = parseFloat(clothPrice) || 120;
    const parsedOriginalPrice = clothOriginalPrice ? parseFloat(clothOriginalPrice) : undefined;

    const newProduct: Product = {
      id: `lum-custom-${Date.now()}`,
      title: clothTitle.trim(),
      category: clothCategory,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      image: clothImage,
      description: clothDescription.trim(),
      fabric: clothFabric.trim(),
      colors: clothColors.length > 0 ? clothColors : [{ name: 'Default', hex: '#E7D5BE' }],
      sizes: clothSizes.length > 0 ? clothSizes : ['M'],
      inStock: true,
      isNewArrival,
      isFeatured,
      createdAt: Date.now(),
      uploadedBy: 'test@gmail.com',
    };

    onAddProduct(newProduct);
    setUploadSuccessMessage(`Garment "${clothTitle}" uploaded successfully to LUMIÈRE storefront!`);
    setTimeout(() => setUploadSuccessMessage(null), 4000);

    // Reset some fields for next upload
    setClothTitle('');
    setClothDescription('Fluid architectural silhouette tailored from noble natural fibers.');
  };

  const toggleSize = (size: string) => {
    if (clothSizes.includes(size)) {
      if (clothSizes.length > 1) {
        setClothSizes(clothSizes.filter((s) => s !== size));
      }
    } else {
      setClothSizes([...clothSizes, size]);
    }
  };

  const addCustomColor = () => {
    if (!newColorName.trim()) return;
    setClothColors([...clothColors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const removeColor = (idx: number) => {
    if (clothColors.length > 1) {
      setClothColors(clothColors.filter((_, i) => i !== idx));
    }
  };

  const filteredInventory = products.filter(
    (p) =>
      p.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF9F6] border border-[#ECE6DB] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-[#ECE6DB] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#18181B] text-[#C8A27C]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C6D4C] block font-semibold">
                LUMIÈRE Atelier Studio
              </span>
              <h2 className="font-serif text-xl sm:text-2xl text-[#18181B] font-light">
                {isAdminLoggedIn ? 'Cloth & Garment Administration' : 'Admin Security Verification'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#F4F1EA] border border-[#E5DFD3] text-xs text-[#52525B]">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-mono text-[11px]">test@gmail.com</span>
              </div>
            )}
            {isAdminLoggedIn && (
              <button
                onClick={onLogout}
                className="p-2 text-[#71717A] hover:text-[#18181B] transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#71717A] hover:text-[#18181B] transition-colors"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAdminLoggedIn ? (
          /* Admin Login Screen */
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto max-w-md mx-auto w-full flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#F3EFE7] border border-[#D4CEBF] text-[#8C6D4C] rounded-full mx-auto flex items-center justify-center mb-3">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#18181B] mb-1">Boutique Admin Access</h3>
              <p className="text-xs text-[#71717A]">
                Sign in to upload custom garments, update pricing, and manage live storefront inventory.
              </p>
            </div>

            {/* Quick Demo Fill Box */}
            <div className="mb-6 p-4 bg-[#F5F2EB] border border-[#E3DDD0] text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#18181B] uppercase tracking-wider text-[10px]">
                  Configured Admin Credentials:
                </span>
                <button
                  type="button"
                  onClick={fillTestCredentials}
                  className="text-[11px] font-semibold text-[#8C6D4C] hover:underline"
                >
                  Auto-Fill
                </button>
              </div>
              <div className="font-mono text-[11px] space-y-1 text-[#52525B]">
                <div>Email: <span className="text-[#18181B] font-bold">test@gmail.com</span></div>
                <div>Password: <span className="text-[#18181B] font-bold">TEST1234556789</span></div>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1 font-medium">
                  Admin Gmail
                </label>
                <input
                  type="email"
                  required
                  placeholder="test@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1 font-medium">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="TEST1234556789"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-medium tracking-[0.2em] uppercase transition-colors"
              >
                Authenticate & Enter Studio
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex border-b border-[#ECE6DB] bg-[#F7F4EE] px-6 gap-6 shrink-0">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-3 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'upload'
                    ? 'border-[#18181B] text-[#18181B]'
                    : 'border-transparent text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Garment</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-3 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'inventory'
                    ? 'border-[#18181B] text-[#18181B]'
                    : 'border-transparent text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Manage Inventory ({products.length})</span>
              </button>
            </div>

            {uploadSuccessMessage && (
              <div className="bg-[#2E5E4E] text-white px-6 py-2.5 text-xs flex items-center justify-between shrink-0">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  {uploadSuccessMessage}
                </span>
                <button onClick={() => setUploadSuccessMessage(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab 1: Upload Cloth Form */}
            {activeTab === 'upload' && (
              <form onSubmit={handleAddClothSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Image Upload Area */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#18181B] font-semibold mb-2">
                      Cloth Image Upload *
                    </label>

                    {/* Drag & Drop / Click Upload Box */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative border-2 border-dashed border-[#D4CEBF] hover:border-[#18181B] bg-white transition-colors cursor-pointer aspect-[3/4] flex flex-col items-center justify-center p-4 text-center overflow-hidden group"
                    >
                      {clothImage ? (
                        <>
                          <img
                            src={clothImage}
                            alt="Cloth preview"
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                            <Upload className="w-6 h-6 mb-2" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                              Click or Drag to Replace Image
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2 text-[#71717A]">
                          <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E5DFD3] mx-auto flex items-center justify-center text-[#8C6D4C]">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-medium text-[#18181B]">
                            Click to upload high-res clothing image
                          </p>
                          <p className="text-[11px] text-[#A1A1AA]">
                            JPG, PNG, WebP supported
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Quick Selection from Luxury Presets */}
                    <div className="mt-4">
                      <span className="block text-[11px] uppercase tracking-wider text-[#71717A] mb-2">
                        Or pick from Atelier photography presets:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setClothImage(preset.url)}
                            className={`p-1 border text-left transition-all ${
                              clothImage === preset.url
                                ? 'border-[#18181B] ring-1 ring-[#18181B]'
                                : 'border-[#E5DFD3] hover:border-[#18181B]'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full aspect-square object-cover mb-1"
                            />
                            <span className="text-[10px] text-[#52525B] truncate block">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direct Image URL input */}
                    <div className="mt-4">
                      <label className="block text-[11px] uppercase tracking-wider text-[#71717A] mb-1">
                        Or paste image URL:
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={clothImage.startsWith('data:') ? '' : clothImage}
                        onChange={(e) => setClothImage(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Right Column: Garment Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1 font-semibold">
                        Garment Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sculptural Double-Breasted Camel Coat"
                        value={clothTitle}
                        onChange={(e) => setClothTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1 font-semibold">
                          Category
                        </label>
                        <select
                          value={clothCategory}
                          onChange={(e) => setClothCategory(e.target.value as Product['category'])}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden"
                        >
                          <option value="Dresses">Dresses</option>
                          <option value="Outerwear">Outerwear</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Tops">Tops</option>
                          <option value="Knitwear">Knitwear</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1 font-semibold">
                          Price ($ USD) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          required
                          value={clothPrice}
                          onChange={(e) => setClothPrice(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1 font-semibold">
                        Fabric & Materials
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 100% Pure Virgin Italian Wool"
                        value={clothFabric}
                        onChange={(e) => setClothFabric(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1 font-semibold">
                        Garment Description
                      </label>
                      <textarea
                        rows={3}
                        value={clothDescription}
                        onChange={(e) => setClothDescription(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden"
                      />
                    </div>

                    {/* Sizes Selection */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1.5 font-semibold">
                        Available Sizes
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'One Size'].map((size) => {
                          const active = clothSizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSize(size)}
                              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                                active
                                  ? 'bg-[#18181B] text-white border-[#18181B]'
                                  : 'bg-white text-[#52525B] border-[#D4CEBF] hover:border-[#18181B]'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Color Swatches Builder */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#52525B] mb-1.5 font-semibold">
                        Color Swatches ({clothColors.length})
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {clothColors.map((color, idx) => (
                          <div
                            key={color.name + idx}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-[#D4CEBF] text-xs"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                            <button
                              type="button"
                              onClick={() => removeColor(idx)}
                              className="text-[#A1A1AA] hover:text-red-600 ml-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new swatch */}
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-8 h-8 cursor-pointer rounded-none border border-[#D4CEBF]"
                          title="Choose color"
                        />
                        <input
                          type="text"
                          placeholder="Color name (e.g. Sage Green)"
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={addCustomColor}
                          className="px-3 py-1.5 bg-[#F2EFE9] border border-[#D4CEBF] text-xs font-medium uppercase tracking-wider hover:bg-[#EAE4D9]"
                        >
                          Add Swatch
                        </button>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs text-[#18181B] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNewArrival}
                          onChange={(e) => setIsNewArrival(e.target.checked)}
                          className="accent-[#18181B]"
                        />
                        <span>Mark as New Arrival</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#18181B] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="accent-[#18181B]"
                        />
                        <span>Feature on Storefront</span>
                      </label>
                    </div>

                    {/* Submit Action */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-4 bg-[#18181B] hover:bg-[#27272A] text-[#FAF9F6] text-xs font-semibold tracking-[0.2em] uppercase transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-[#C8A27C]" />
                        <span>Publish Cloth to LUMIÈRE Storefront</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Tab 2: Inventory Catalog Management */}
            {activeTab === 'inventory' && (
              <div className="flex-1 flex flex-col overflow-hidden p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-lg text-[#18181B]">Storefront Garment Catalog</h3>
                    <p className="text-xs text-[#71717A]">
                      Manage availability, inspect admin-uploaded garments, or remove products.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-[#D4CEBF] focus:outline-hidden w-full sm:w-48"
                    />
                    <button
                      type="button"
                      onClick={onResetCatalog}
                      className="px-3 py-1.5 text-xs text-[#71717A] hover:text-[#18181B] border border-[#D4CEBF] hover:bg-[#F2EFE9] whitespace-nowrap"
                      title="Reset back to default curated items"
                    >
                      Reset Catalog
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto border border-[#ECE6DB] bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#FAF9F6] border-b border-[#ECE6DB] text-[#71717A] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Garment</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECE6DB]">
                      {filteredInventory.map((item) => (
                        <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <div className="w-10 h-12 bg-[#F2EFE9] border border-[#E8E2D6] overflow-hidden shrink-0">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-[#18181B] line-clamp-1">{item.title}</div>
                              {item.uploadedBy && (
                                <span className="text-[10px] text-[#8C6D4C] uppercase tracking-wider font-semibold">
                                  Custom Admin Upload
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-[#52525B]">{item.category}</td>
                          <td className="p-3 font-semibold text-[#18181B] tabular-nums">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => onToggleStock(item.id)}
                              className={`px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase border ${
                                item.inStock
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                              }`}
                            >
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Delete garment "${item.title}" from store?`)) {
                                  onDeleteProduct(item.id);
                                }
                              }}
                              className="text-[#A1A1AA] hover:text-red-600 p-1 transition-colors"
                              title="Delete from storefront"
                              aria-label="Delete garment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
