import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { BangleSize } from '@/data/products';

export interface CartLine {
  productId: number;
  size: BangleSize;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  totalItems: number;
  addToCart: (productId: number, size: BangleSize, quantity?: number) => void;
  changeQuantity: (productId: number, size: BangleSize, delta: number) => void;
  removeFromCart: (productId: number, size: BangleSize) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addToCart = (productId: number, size: BangleSize, quantity = 1) => {
    setLines((current) => {
      const existing = current.find(
        (line) => line.productId === productId && line.size === size,
      );
      if (existing) {
        return current.map((line) =>
          line.productId === productId && line.size === size
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [...current, { productId, size, quantity }];
    });
  };

  const changeQuantity = (
    productId: number,
    size: BangleSize,
    delta: number,
  ) => {
    setLines((current) =>
      current.flatMap((line) => {
        if (line.productId !== productId || line.size !== size) {
          return [line];
        }
        const quantity = line.quantity + delta;
        return quantity > 0 ? [{ ...line, quantity }] : [];
      }),
    );
  };

  const removeFromCart = (productId: number, size: BangleSize) => {
    setLines((current) =>
      current.filter(
        (line) => line.productId !== productId || line.size !== size,
      ),
    );
  };

  const totalItems = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, totalItems, addToCart, changeQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }
  return context;
}
