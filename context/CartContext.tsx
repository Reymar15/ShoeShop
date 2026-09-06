"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    product: {
      id: number;
      name: string;
      price: number | string;
      image_url?: string | null;
      image?: string;
      size?: string;
      color?: string;
    },
    size?: string,
    color?: string
  ) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("shoeshop-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("shoeshop-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: {
      id: number;
      name: string;
      price: number | string;
      image_url?: string | null;
      image?: string;
      size?: string;
      color?: string;
    },
    size?: string,
    color?: string
  ) => {
    const cartProduct: CartItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || product.image || "https://placehold.co/600x500",
      size: size || product.size,
      color: color || product.color,
      quantity: 1,
    };

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === cartProduct.id && item.size === cartProduct.size
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === cartProduct.id && item.size === cartProduct.size
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [...currentCart, cartProduct];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartCount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}