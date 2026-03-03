"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Producto } from "@/data/productos";

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (producto: Producto) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("distriesthetic_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("distriesthetic_cart", JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = (producto: Producto) => {
    setItems(prev => {
      const existing = prev.find(i => i.producto.id === producto.id);
      if (existing) {
        return prev.map(i =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.producto.id !== id));
  };

  const updateQuantity = (id: number, cantidad: number) => {
    if (cantidad < 1) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.producto.id === id ? { ...i, cantidad } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, i) => sum + (i.producto.precio ?? 0) * i.cantidad,
    0
  );

  const itemCount = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
