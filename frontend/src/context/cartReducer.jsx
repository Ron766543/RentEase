export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  HYDRATE: 'HYDRATE',
};

export const initialCartState = {
  items: [],
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.HYDRATE:
      return { ...state, items: action.payload || [] };

    case CART_ACTIONS.ADD_ITEM: {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.tenureMonths === item.tenureMonths
      );
      if (existingIndex > -1) {
        const items = [...state.items];
        items[existingIndex] = {
          ...items[existingIndex],
          quantity: Math.min(items[existingIndex].quantity + item.quantity, item.availableUnits),
        };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, item] };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, tenureMonths, quantity } = action.payload;
      const items = state.items
        .map((i) =>
          i.productId === productId && i.tenureMonths === tenureMonths
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.availableUnits)) }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId, tenureMonths } = action.payload;
      return {
        ...state,
        items: state.items.filter((i) => !(i.productId === productId && i.tenureMonths === tenureMonths)),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
};
