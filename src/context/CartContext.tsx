"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { type Producto } from "@/data/productos";

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export interface CartToast {
  nombre: string;
  imagenUrl: string | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (producto: Producto) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  /** Último producto agregado. Se limpia automáticamente después de 2.5s. */
  cartToast: CartToast | null;
}

// createContext crea un "contenedor global" para compartir datos entre componentes
// sin tener que pasar props manualmente por cada nivel del árbol.
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ── Patrón de "hydration" para evitar SSR mismatch ──────────────────────
  // Next.js renderiza la página en el servidor (SSR) antes de enviarla al navegador.
  // El servidor no tiene acceso a localStorage (es solo del navegador).
  // Si intentamos leer localStorage inmediatamente, el servidor renderiza [] y
  // el navegador renderiza el carrito guardado → React detecta diferencia y da error.
  // Solución: empezar con hydrated=false, leer localStorage solo en el cliente,
  // y marcar hydrated=true cuando ya tenemos los datos reales.
  const [hydrated, setHydrated] = useState(false);

  const [cartToast, setCartToast] = useState<CartToast | null>(null);

  // useRef guarda una referencia que persiste entre renders sin causar un re-render.
  // Se usa aquí para el ID del timer del toast porque:
  // - No necesitamos que React re-dibuje cuando cambia el timer
  // - Necesitamos cancelarlo antes de crear uno nuevo (evitar memory leaks)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── useEffect con [] → se ejecuta UNA SOLA VEZ cuando el componente aparece ─
  // Lee el carrito guardado en localStorage y lo carga en el estado.
  // El [] vacío significa "sin dependencias" → no se vuelve a ejecutar.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("distriesthetic_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true); // marcar que ya cargamos del localStorage
  }, []);

  // ── useEffect de persistencia: guarda en localStorage cada vez que items cambia ─
  // La dependencia `hydrated` es crítica: sin ella, este efecto correría en el
  // servidor (donde no hay localStorage) o antes de leer el carrito guardado,
  // sobreescribiendo los datos con el array vacío inicial.
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("distriesthetic_cart", JSON.stringify(items));
    }
  }, [items, hydrated]); // se ejecuta cuando items O hydrated cambian

  const addItem = (producto: Producto) => {
    setItems(prev => {
      // prev es el estado anterior — nunca modificar el array directamente,
      // siempre crear uno nuevo (inmutabilidad en React)
      const existing = prev.find(i => i.producto.id === producto.id);
      if (existing) {
        // El producto ya está en el carrito → solo sumar la cantidad
        return prev.map(i =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
          //                               ↑ spread: copiar el objeto y solo cambiar cantidad
        );
      }
      // Producto nuevo → agregar al final del array
      return [...prev, { producto, cantidad: 1 }];
    });

    // Mostrar notificación (toast) del producto agregado
    setCartToast({ nombre: producto.nombre, imagenUrl: producto.imagenUrl ?? null });
    // Cancelar el timer anterior si existe (evitar que el toast desaparezca antes de tiempo)
    if (toastTimer.current) clearTimeout(toastTimer.current);
    // Crear nuevo timer: ocultar el toast después de 2.5 segundos
    toastTimer.current = setTimeout(() => setCartToast(null), 2500);
  };

  const removeItem = (id: number) => {
    // filter devuelve un nuevo array sin el producto eliminado
    setItems(prev => prev.filter(i => i.producto.id !== id));
  };

  const updateQuantity = (id: number, cantidad: number) => {
    if (cantidad < 1) {
      removeItem(id); // si la cantidad llega a 0, eliminar el producto
      return;
    }
    setItems(prev =>
      prev.map(i => (i.producto.id === id ? { ...i, cantidad } : i))
    );
  };

  const clearCart = () => setItems([]); // vaciar todo el carrito

  // reduce recorre el array acumulando un valor.
  // Empieza en 0 (sum) y va sumando precio × cantidad de cada producto.
  // Si precio es null (no tiene precio definido), suma 0 con el operador ??.
  const total = items.reduce(
    (sum, i) => sum + (i.producto.precio ?? 0) * i.cantidad,
    0
  );

  // Total de unidades en el carrito (puede ser más que items.length si hay cantidades > 1)
  const itemCount = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    // Provider hace que todos los componentes hijo puedan acceder a estos valores
    // usando useCart() sin necesidad de pasar props manualmente
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, cartToast }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para consumir el contexto del carrito.
// Si se usa fuera de CartProvider, lanza un error claro en lugar de fallar silenciosamente.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
