import { useMemo } from "react";
import { useCartContext } from "../context/CartContext";

export function useCart() {
  const { state, dispatch, refreshCart } = useCartContext();

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      total: subtotal,
      itemCount,
    };
  }, [state.items]);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    ...totals,
    dispatch,
    refreshCart,
  };
}