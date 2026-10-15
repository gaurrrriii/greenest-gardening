import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from './supabase';

type CartContextType = {
  items: { product: Product; quantity: number }[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
});

const STORAGE_KEY = 'greennest_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ product: Product; quantity: number }[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persist = (newItems: { product: Product; quantity: number }[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      persist(
        items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      );
    } else {
      persist([...items, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    persist(items.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    persist(
      items.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => persist([]);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
