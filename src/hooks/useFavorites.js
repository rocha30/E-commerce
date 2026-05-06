import { useEffect, useState } from "react";
import { userBehaviorService } from "../services/userBehaviorService";
import { useUser } from "../context/UserContext";
import { extractList } from "../utils/normalizeApi";

const listeners = new Set();
const shared = {
  userId: "",
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

function getFavoriteId(item) {
  const nested = item?.producto || item?.product || item?.item || {};
  const id =
    item?.idProducto ??
    item?.productId ??
    item?.productoId ??
    nested?.idProducto ??
    nested?.productId ??
    item?.id ??
    nested?.id;
  if (id == null) return "";
  return String(id).trim();
}

function normalizeFavoriteItem(item) {
  const nested = item?.producto || item?.product || item?.item || {};
  const id = getFavoriteId(item);
  if (!id) return null;
  return {
    idProducto: id,
    id,
    nombre: item?.nombre || nested?.nombre || item?.name || nested?.name || "Producto",
    name: item?.name || nested?.name || item?.nombre || nested?.nombre || "Product",
    image: item?.image || nested?.image || "/images/default-watch.jpg",
    precio: Number(item?.precio ?? nested?.precio ?? item?.price ?? nested?.price ?? 0),
    price: Number(item?.price ?? nested?.price ?? item?.precio ?? nested?.precio ?? 0),
  };
}

function normalizeWishlist(payload) {
  const out = [];
  const seen = new Set();
  for (const raw of extractList(payload)) {
    const normalized = normalizeFavoriteItem(raw);
    if (!normalized) continue;
    if (seen.has(normalized.idProducto)) continue;
    seen.add(normalized.idProducto);
    out.push(normalized);
  }
  return out;
}

function toFavoriteItem(product) {
  const id = product.idProducto || product.id;
  return {
    idProducto: id,
    id,
    nombre: product.nombre || product.name || "Producto",
    name: product.name || product.nombre || "Product",
    image: product.image || "/images/default-watch.jpg",
    precio: Number(product.precio ?? product.price ?? 0),
    price: Number(product.price ?? product.precio ?? 0),
  };
}

async function refreshShared() {
  if (!shared.userId) return;
  try {
    setShared({ loading: true, error: null });
    const response = await userBehaviorService.getWishlist(shared.userId);
    setShared({ favorites: normalizeWishlist(response?.data ?? response), initialized: true });
  } catch (err) {
    setShared({ error: err.message, initialized: true });
  } finally {
    setShared({ loading: false });
  }
}

function scheduleFavoritesRefresh(delay = 450) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    refreshShared().catch(() => {
      // keep optimistic state if delayed sync fails
    });
  }, delay);
}

function isFavoriteShared(productId) {
  const wanted = String(productId || "").trim();
  if (!wanted) return false;
  return shared.favorites.some((p) => getFavoriteId(p) === wanted);
}

export function useFavorites() {
  const { userId } = useUser();
  const [state, setState] = useState(shared);

  useEffect(() => {
    const onState = (next) => setState({ ...next });
    listeners.add(onState);
    if (shared.userId !== userId) {
      setShared({ userId, favorites: [], initialized: false, error: null });
    }
    if (!shared.initialized && !shared.loading && shared.userId) {
      refreshShared();
    } else {
      onState(shared);
    }
    return () => listeners.delete(onState);
  }, [userId]);

  const refresh = async () => {
    await refreshShared();
  };

  const isFavorite = (productId) => isFavoriteShared(productId);

  const toggleFavorite = async (product) => {
    const id = product.idProducto || product.id;
    if (!id) return;
    const wasFavorite = isFavoriteShared(id);
    const previous = shared.favorites;
    const normalizedId = String(id);
    const optimisticFavorites = wasFavorite
      ? previous.filter((p) => getFavoriteId(p) !== normalizedId)
      : [...previous.filter((p) => getFavoriteId(p) !== normalizedId), toFavoriteItem(product)];
    try {
      setShared({ error: null, loading: true, favorites: optimisticFavorites });
      if (wasFavorite) {
        await userBehaviorService.removeWishlistItem(userId, id);
      } else {
        await userBehaviorService.addWishlistItem(userId, {
          idProducto: id,
          nombre: product.nombre || product.name,
          image: product.image,
          precio: product.precio ?? product.price,
        });
      }
      scheduleFavoritesRefresh();
    } catch (err) {
      setShared({ error: err.message, loading: false, favorites: previous });
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