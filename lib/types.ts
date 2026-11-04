export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'Dresses' | 'Outerwear' | 'Accessories' | 'Tops' | 'Knitwear';
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  description: string;
  fabric: string;
  colors: ColorOption[];
  sizes: string[];
  inStock: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  createdAt: number;
  uploadedBy?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ColorOption;
  selectedSize: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface OrderConfirmation {
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}
