import { apiClient } from "./apiClient";

const STORAGE_KEY = "exquisit_time_user_behavior_v1";

function normalizeId(id) {
  return String(id || "").trim();
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { users: {} };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { users: {} };
  } catch {
    return { users: {} };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore local persistence issues
  }
}

function ensureUser(store, idUsuario) {
  const id = normalizeId(idUsuario);
  if (!store.users[id]) {
    store.users[id] = {
      cart: [],
      wishlist: [],
      views: {},
      orders: [],
      reviews: [],
    };
  }
  return store.users[id];
}

function asProductId(item) {
  return normalizeId(item?.idProducto || item?.id || item?.productId);
}

function toWishlistItem(item) {
  return {
    idProducto: asProductId(item),
    id: asProductId(item),
    nombre: item?.nombre || item?.name || item?.idProducto || item?.id || "Producto",
    name: item?.name || item?.nombre || item?.idProducto || item?.id || "Product",
    image: item?.image || "/images/default-watch.jpg",
    precio: Number(item?.precio ?? item?.price ?? 0),
    price: Number(item?.price ?? item?.precio ?? 0),
  };
}

function toCartItem(item) {
  return {
    ...toWishlistItem(item),
    cantidad: Number(item?.cantidad ?? item?.quantity ?? 1) || 1,
    quantity: Number(item?.quantity ?? item?.cantidad ?? 1) || 1,
    descripcion: item?.descripcion || item?.description || "",
    description: item?.description || item?.descripcion || "",
  };
}

function useLocalFallback(err) {
  if (!err) return true;
  const status = Number(err?.status || 0);
  return !status || status >= 400;
}

export const userBehaviorService = {
  async trackView(idUsuario, idProducto, payload = {}) {
    try {
      return await apiClient.post(`/users/${idUsuario}/views/${idProducto}`, payload);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      const pid = normalizeId(idProducto);
      user.views[pid] = (Number(user.views[pid]) || 0) + 1;
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  async addCartItem(idUsuario, item) {
    try {
      return await apiClient.post(`/users/${idUsuario}/cart/items`, item);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      const pid = asProductId(item);
      const qty = Number(item?.cantidad ?? item?.quantity ?? 1) || 1;
      const existing = user.cart.find((x) => asProductId(x) === pid);
      if (existing) {
        existing.cantidad = Math.min(99, Number(existing.cantidad || 1) + qty);
        existing.quantity = existing.cantidad;
      } else {
        user.cart.push(toCartItem({ ...item, idProducto: pid, cantidad: qty }));
      }
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  async removeCartItem(idUsuario, idProducto) {
    try {
      return await apiClient.delete(`/users/${idUsuario}/cart/items/${idProducto}`);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      const pid = normalizeId(idProducto);
      user.cart = user.cart.filter((x) => asProductId(x) !== pid);
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  async updateCartItem(idUsuario, idProducto, payload) {
    try {
      return await apiClient.patch(`/users/${idUsuario}/cart/items/${idProducto}`, payload);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      const pid = normalizeId(idProducto);
      const qty = Math.max(1, Math.min(99, Number(payload?.cantidad ?? payload?.quantity ?? 1) || 1));
      const existing = user.cart.find((x) => asProductId(x) === pid);
      if (existing) {
        existing.cantidad = qty;
        existing.quantity = qty;
      }
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  async getCart(idUsuario) {
    try {
      return await apiClient.get(`/users/${idUsuario}/cart`);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      return { items: user.cart || [] };
    }
  },
  async clearCart(idUsuario) {
    try {
      return await apiClient.delete(`/users/${idUsuario}/cart/items`);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      user.cart = [];
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  async addWishlistItem(idUsuario, item) {
    try {
      return await apiClient.post(`/users/${idUsuario}/wishlist/items`, item);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      const pid = asProductId(item);
      if (!user.wishlist.some((x) => asProductId(x) === pid)) {
        user.wishlist.push(toWishlistItem({ ...item, idProducto: pid }));
      }
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  async removeWishlistItem(idUsuario, idProducto) {
    try {
      return await apiClient.delete(`/users/${idUsuario}/wishlist/items/${idProducto}`);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      const pid = normalizeId(idProducto);
      user.wishlist = user.wishlist.filter((x) => asProductId(x) !== pid);
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  async getWishlist(idUsuario) {
    try {
      return await apiClient.get(`/users/${idUsuario}/wishlist/items`);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      return { items: user.wishlist || [] };
    }
  },
  async createOrder(idUsuario, payload) {
    try {
      return await apiClient.post(`/users/${idUsuario}/orders`, payload);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      const orderId = `LOCAL-${Date.now()}`;
      user.orders.push({ idPedido: orderId, ...payload, createdAt: new Date().toISOString() });
      user.cart = [];
      writeStore(store);
      return { idPedido: orderId, local: true };
    }
  },
  async createReview(idUsuario, payload) {
    try {
      return await apiClient.post(`/users/${idUsuario}/reviews`, payload);
    } catch (err) {
      if (!useLocalFallback(err)) throw err;
      const store = readStore();
      const user = ensureUser(store, idUsuario);
      user.reviews.push({ ...payload, createdAt: new Date().toISOString() });
      writeStore(store);
      return { ok: true, local: true };
    }
  },
  getUserSignals(idUsuario) {
    const store = readStore();
    const user = ensureUser(store, idUsuario);
    const wishlistIds = (user.wishlist || []).map((x) => asProductId(x)).filter(Boolean);
    const cartIds = (user.cart || []).map((x) => asProductId(x)).filter(Boolean);
    const viewCounts = user.views || {};
    return { wishlistIds, cartIds, viewCounts };
  },
};
