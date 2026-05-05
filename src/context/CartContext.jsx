import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { userBehaviorService } from "../services/userBehaviorService";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";
const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "SET_ITEMS":
      return { ...state, items: action.value || [] };
    default:
      return state;
  }
};

function normalizeItems(payload) {
  const rawItems = Array.isArray(payload) ? payload : payload?.items || [];
  return rawItems.map((item) => ({
    id: item.idProducto || item.id,
    idProducto: item.idProducto || item.id,
    name: item.nombre || item.name || "Producto",
    price: Number(item.precio ?? item.price ?? 0),
    image: item.image || "/images/default-watch.jpg",
    description: item.descripcion || item.description || "",
    quantity: Number(item.cantidad ?? item.quantity ?? 1),
  }));
}

export function CartProvider({ children }) {
  const [state, rawDispatch] = useReducer(cartReducer, initialState);

  const refreshCart = useCallback(async () => {
    try {
      rawDispatch({ type: "SET_LOADING", value: true });
      rawDispatch({ type: "SET_ERROR", value: null });
      const response = await userBehaviorService.getCart(DEFAULT_USER_ID);
      rawDispatch({ type: "SET_ITEMS", value: normalizeItems(response) });
    } catch (error) {
      rawDispatch({ type: "SET_ERROR", value: error.message });
    } finally {
      rawDispatch({ type: "SET_LOADING", value: false });
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const dispatch = useCallback(async (action) => {
    try {
      rawDispatch({ type: "SET_ERROR", value: null });
      if (action.type === "ADD_TO_CART") {
        await userBehaviorService.addCartItem(DEFAULT_USER_ID, {
          idProducto: action.product.idProducto || action.product.id,
          cantidad: 1,
        });
      }
      if (action.type === "REMOVE_FROM_CART") {
        await userBehaviorService.removeCartItem(DEFAULT_USER_ID, action.id);
      }
      if (action.type === "UPDATE_QUANTITY") {
        await userBehaviorService.updateCartItem(DEFAULT_USER_ID, action.id, {
          cantidad: Math.max(1, Math.min(action.quantity, 99)),
        });
      }
      if (action.type === "CLEAR_CART") {
        await userBehaviorService.clearCart(DEFAULT_USER_ID);
      }
      await refreshCart();
    } catch (error) {
      rawDispatch({ type: "SET_ERROR", value: error.message });
    }
  }, [refreshCart]);

  const value = useMemo(() => ({ state, dispatch, refreshCart }), [state, dispatch, refreshCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};