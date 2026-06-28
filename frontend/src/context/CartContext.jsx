import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { cartReducer, initialCartState, CART_ACTIONS } from './cartReducer.jsx';

const STORAGE_KEY = 'rentease-cart';
const CartContext = createContext(null);

const loadStoredItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () => ({
    items: loadStoredItems(),
  }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item) => dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  const updateQuantity = (productId, tenureMonths, quantity) =>
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { productId, tenureMonths, quantity } });
  const removeItem = (productId, tenureMonths) =>
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId, tenureMonths } });
  const clearCart = () => dispatch({ type: CART_ACTIONS.CLEAR_CART });

  const totals = useMemo(
    () => ({
      totalItems: state.items.reduce((sum, i) => sum + i.quantity, 0),
      monthlyTotal: state.items.reduce((sum, i) => sum + i.monthlyRent * i.quantity, 0),
      depositTotal: state.items.reduce((sum, i) => sum + i.securityDeposit * i.quantity, 0),
    }),
    [state.items]
  );

  const value = {
    items: state.items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems: () => totals.totalItems,
    monthlyTotal: () => totals.monthlyTotal,
    depositTotal: () => totals.depositTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
