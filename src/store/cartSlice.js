import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart(state, { payload }) {
      const item = state.items.find((i) => i.id === payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...payload, quantity: 1 });
      }
    },
    decreaseQuantity(state, { payload: id }) {
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    removeFromCart(state, { payload: id }) {
      state.items = state.items.filter((i) => i.id !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

export default cartSlice.reducer;
