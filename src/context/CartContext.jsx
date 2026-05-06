import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { userBehaviorService } from "../services/userBehaviorService";
import { useUser } from "./UserContext";
import { extractList } from "../utils/normalizeApi";

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
  const rawItems = extractList(payload);
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

function toCartItem(product) {
  const id = product.idProducto || product.id;
  return {
    id,
    idProducto: id,
    name: product.nombre || product.name || "Producto",
    price: Number(product.precio ?? product.price ?? 0),
    image: product.image || "/images/default-watch.jpg",
    description: product.descripcion || product.description || "",
    quantity: Number(product.cantidad ?? product.quantity ?? 1) || 1,
  };
}

function scheduleRefresh(refreshFn, delay = 450) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    refreshFn().catch(() => {
      // keep optimistic state if delayed sync fails
    });
  }, delay);
}

export function CartProvider({ children }) {
  const { userId } = useUser();
  const [state, rawDispatch] = useReducer(cartReducer, initialState);

  const refreshCart = useCallback(async () => {
    try {
      rawDispatch({ type: "SET_LOADING", value: true });
      rawDispatch({ type: "SET_ERROR", value: null });
      const response = await userBehaviorService.getCart(userId);
      rawDispatch({ type: "SET_ITEMS", value: normalizeItems(response) });
    } catch (error) {
      rawDispatch({ type: "SET_ERROR", value: error.message });
    } finally {
      rawDispatch({ type: "SET_LOADING", value: false });
    }
  }, [userId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const dispatch = useCallback(async (action) => {
    try {
      rawDispatch({ type: "SET_ERROR", value: null });
      if (action.type === "ADD_TO_CART") {
        const incoming = toCartItem(action.product || {});
        await userBehaviorService.addCartItem(userId, {
          idProducto: incoming.idProducto,
          cantidad: 1,
          nombre: incoming.name,
          precio: incoming.price,
          image: incoming.image,
          descripcion: incoming.description,
        });
        const existing = state.items.find((item) => String(item.idProducto || item.id) === String(incoming.idProducto));
        if (existing) {
          rawDispatch({
            type: "SET_ITEMS",
            value: state.items.map((item) =>
              String(item.idProducto || item.id) === String(incoming.idProducto)
                ? { ...item, quantity: Math.min(99, Number(item.quantity || 1) + 1) }
                : item
            ),
          });
        } else {
          rawDispatch({ type: "SET_ITEMS", value: [...state.items, incoming] });
        }
        scheduleRefresh(refreshCart);
      }
      if (action.type === "REMOVE_FROM_CART") {
        await userBehaviorService.removeCartItem(userId, action.id);
        rawDispatch({
          type: "SET_ITEMS",
          value: state.items.filter((item) => String(item.idProducto || item.id) !== String(action.id)),
        });
        scheduleRefresh(refreshCart);
      }
      if (action.type === "UPDATE_QUANTITY") {
        const nextQty = Math.max(1, Math.min(action.quantity, 99));
        await userBehaviorService.updateCartItem(userId, action.id, {
          cantidad: nextQty,
        });
        rawDispatch({
          type: "SET_ITEMS",
          value: state.items.map((item) =>
            String(item.idProducto || item.id) === String(action.id)
              ? { ...item, quantity: nextQty }
              : item
          ),
        });
        scheduleRefresh(refreshCart);
      }
      if (action.type === "CLEAR_CART") {
        await userBehaviorService.clearCart(userId);
        rawDispatch({ type: "SET_ITEMS", value: [] });
        scheduleRefresh(refreshCart);
      }
      if (action.type !== "ADD_TO_CART" && action.type !== "REMOVE_FROM_CART" && action.type !== "UPDATE_QUANTITY" && action.type !== "CLEAR_CART") {
        await refreshCart();
      }
    } catch (error) {
      rawDispatch({ type: "SET_ERROR", value: error.message });
    }
  }, [refreshCart, state.items, userId]);

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