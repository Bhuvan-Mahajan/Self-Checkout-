import { create } from 'zustand';
import api from '../services/api';

export const useCartStore = create((set, get) => ({
  cart: null,
  items: [],
  sensorWeight: 0,
  weightTolerance: 15, // Grams discrepancy tolerance

  setCart: (cart) => {
    set({
      cart,
      items: cart?.items
        ? cart.items.map((item) => ({
            barcode: item.productId?.barcode || item.barcode || item._id,
            name: item.productName || item.name,
            price: item.unitPrice != null ? item.unitPrice / 100 : item.price || 0,
            weightGrams: item.unitWeight || item.weightGrams || 0,
            quantity: item.quantity,
            subtotal: item.subtotal,
            productId: item.productId,
            _id: item._id,
          }))
        : [],
    });
  },

  getCurrentCart: async () => {
    try {
      const res = await api.get('/api/cart/current');
      if (res && res.cart) {
        get().setCart(res.cart);
        return res.cart;
      } else {
        set({ cart: null, items: [] });
        return null;
      }
    } catch (err) {
      console.warn('Error fetching current cart:', err);
      return null;
    }
  },

  addItem: (product) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.barcode === product.barcode);

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      set({ items: updated });
    } else {
      set({
        items: [...items, { ...product, quantity: 1 }],
      });
    }
  },

  removeItem: async (productId) => {
    try {
      const id =
        typeof productId === 'object' && productId?._id
          ? productId._id
          : productId;
      const res = await api.delete(`/api/cart/item/${id}`);
      if (res && res.cart) {
        get().setCart(res.cart);
        return res.cart;
      }
    } catch (err) {
      console.warn('Error removing item from cart:', err);
      const { items } = get();
      const updated = items.filter(
        (i) => i.productId !== productId && i.barcode !== productId && i._id !== productId
      );
      set({ items: updated });
    }
  },

  updateQuantity: (barcode, delta) => {
    const { items } = get();
    const updated = items
      .map((i) => {
        if (i.barcode === barcode) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter(Boolean);

    set({ items: updated });
  },

  clearCart: () => set({ items: [], sensorWeight: 0 }),

  setSensorWeight: (weight) => set({ sensorWeight: weight }),

  // Computed helpers
  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTotalItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalExpectedWeight: () => {
    return get().items.reduce(
      (sum, item) => sum + (item.weightGrams || 100) * item.quantity,
      0
    );
  },

  isWeightVerified: () => {
    const expected = get().getTotalExpectedWeight();
    const actual = get().sensorWeight;
    const tolerance = get().weightTolerance;
    return Math.abs(expected - actual) <= tolerance;
  },
}));

export default useCartStore;
