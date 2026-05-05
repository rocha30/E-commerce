import { useEffect, useState } from "react";
import { userBehaviorService } from "../services/userBehaviorService";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";

function normalizeWishlist(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userBehaviorService.getWishlist(DEFAULT_USER_ID);
      setFavorites(normalizeWishlist(response));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const isFavorite = (productId) => favorites.some((p) => String(p.idProducto || p.id) === String(productId));

  const toggleFavorite = async (product) => {
    try {
      setError(null);
      if (isFavorite(product.idProducto || product.id)) {
        await userBehaviorService.removeWishlistItem(DEFAULT_USER_ID, product.idProducto || product.id);
      } else {
        await userBehaviorService.addWishlistItem(DEFAULT_USER_ID, {
          idProducto: product.idProducto || product.id,
        });
      }
      await refresh();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    favorites,
    favoritesCount: favorites.length,
    loading,
    error,
    refresh,
    isFavorite,
    toggleFavorite,
  };
}