"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  productId: string | number;
  planId?: string | number;
  quantity: number;
  productData: {
    name: string;
    image_url?: string;
    category: string;
    price_per_month: number;
    deposit_amount?: number;
  };
  planData?: {
    name: string;
    base_price: number;
    duration_months: number;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string | number, planId?: string | number) => void;
  updateQuantity: (productId: string | number, planId: string | number | undefined, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  totalDeposit: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === newItem.productId && item.planId === newItem.planId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }

      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (productId: string | number, planId?: string | number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.productId === productId && item.planId === planId))
    );
  };

  const updateQuantity = (productId: string | number, planId: string | number | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, planId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.planId === planId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce((total, item) => {
    const price = item.planData ? item.planData.base_price : item.productData.price_per_month;
    return total + (price * item.quantity);
  }, 0);

  const totalDeposit = items.reduce((total, item) => {
    return total + ((item.productData.deposit_amount || 0) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        totalDeposit,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
