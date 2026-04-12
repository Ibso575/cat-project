import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }) => {
  // cart = { [productId]: { product, qty } }
  const [cart, setCart] = useState({});

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      if (existing) {
        return { ...prev, [product.id]: { ...existing, qty: existing.qty + 1 } };
      }
      return { ...prev, [product.id]: { product, qty: 1 } };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: { ...existing, qty: existing.qty - 1 } };
    });
  };

  const deleteFromCart = (productId) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const getQty = (productId) => cart[productId]?.qty || 0;

  const { totalItems, totalPrice } = useMemo(() => {
    let items = 0;
    let price = 0;
    Object.values(cart).forEach(({ product, qty }) => {
      items += qty;
      const main = product.main_variant || {};
      const p = product.price || main.price || 0;
      price += p * qty;
    });
    return { totalItems: items, totalPrice: price };
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, deleteFromCart, getQty, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
