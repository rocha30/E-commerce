import { useEffect, useState } from "react";
import { userBehaviorService } from "../services/userBehaviorService";
import { extractList } from "../utils/normalizeApi";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";

const listeners = new Set();
const shared = {
  favorites: [],
  loading: false,
  error: null,
  initialized: false,
};

function emit() {
  listeners.forEach((cb) => cb(shared));
}

function setShared(partial) {
  Object.assign(shared, partial);
  emit();
}

function normalizeWishlist(payload) {
  return extractList(payload);
}

async function refreshShared() {
  try {
    setShared({ loading: true, error: null });
    const response = await userBehaviorService.getWishlist(DEFAULT_USER_ID);
    setShared({ favorites: normalizeWishlist(response?.data ?? response), initialized: true });
  } catch (err) {
    setShared({ error: err.message, initialized: true });
  } finally {
    setShared({ loading: false });
  }
}

function isFavoriteShared(productId) {
  return shared.favorites.some((p) => String(p.idProducto || p.id) === String(productId));
}

export function useFavorites() {
  const [state, setState] = useState(shared);

  useEffect(() => {
    const onState = (next) => setState({ ...next });
    listeners.add(onState);
    if (!shared.initialized && !shared.loading) {
      refreshShared();
    } else {
      onState(shared);
    }
    return () => listeners.delete(onState);
  }, []);

  const refresh = async () => {
    await refreshShared();
  };

  const isFavorite = (productId) => isFavoriteShared(productId);

  const toggleFavorite = async (product) => {
    const id = product.idProducto || product.id;
    if (!id) return;
    try {
      setShared({ error: null, loading: true });
      if (isFavoriteShared(id)) {
        await userBehaviorService.removeWishlistItem(DEFAULT_USER_ID, id);
      } else {
        await userBehaviorService.addWishlistItem(DEFAULT_USER_ID, {
          idProducto: id,
          nombre: product.nombre || product.name,
          image: product.image,
          precio: product.precio ?? product.price,
        });
      }
      await refreshShared();
    } catch (err) {
      setShared({ error: err.message, loading: false });
      throw err;
    } finally {
      setShared({ loading: false });
    }
  };

  return {
    favorites: state.favorites,
    favoritesCount: state.favorites.length,
    loading: state.loading,
    error: state.error,
    refresh,
    isFavorite,
    toggleFavorite,
  };
}