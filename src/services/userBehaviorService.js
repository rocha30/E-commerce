import { apiClient } from "./apiClient";
import { triggerRecommendationRefresh } from "../utils/recommendationSync";
import { extractList, unwrapPayload } from "../utils/normalizeApi";

function normalizeId(id) {
  const text = String(id || "").trim();
  if (!text) throw new Error("Invalid id");
  return text;
}

async function tryGet(paths) {
  let lastError;
  for (const path of paths) {
    try {
      return await apiClient.get(path);
    } catch (err) {
      lastError = err;
      if (![404, 405, 501].includes(err?.status)) throw err;
    }
  }
  throw lastError || new Error("No valid GET endpoint available.");
}

function pickItemsFromPayload(payload, keys = []) {
  const raw = unwrapPayload(payload);
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== "object") return [];

  for (const key of keys) {
    const value = raw[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object" && Array.isArray(value.items)) return value.items;
  }

  return extractList(raw);
}

export const userBehaviorService = {
  async trackView(idUsuario, idProducto, payload = {}) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const product = encodeURIComponent(normalizeId(idProducto));
    const result = await apiClient.post(`/users/${user}/views/${product}`, payload);
    triggerRecommendationRefresh("track-view");
    return result;
  },
  async addCartItem(idUsuario, item) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const result = await apiClient.post(`/users/${user}/cart/items`, item);
    triggerRecommendationRefresh("add-cart-item");
    return result;
  },
  async removeCartItem(idUsuario, idProducto) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const product = encodeURIComponent(normalizeId(idProducto));
    const result = await apiClient.delete(`/users/${user}/cart/items/${product}`);
    triggerRecommendationRefresh("remove-cart-item");
    return result;
  },
  async updateCartItem(idUsuario, idProducto, payload) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const product = encodeURIComponent(normalizeId(idProducto));
    const result = await apiClient.patch(`/users/${user}/cart/items/${product}`, payload);
    triggerRecommendationRefresh("update-cart-item");
    return result;
  },
  async getCart(idUsuario) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const ts = Date.now();
    const response = await tryGet([
      `/users/${user}/cart?_ts=${ts}`,
      `/users/${user}/cart/items?_ts=${ts}`,
    ]);
    return {
      items: pickItemsFromPayload(response, ["items", "cart", "cartItems", "productos", "products"]),
    };
  },
  async clearCart(idUsuario) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const result = await apiClient.delete(`/users/${user}/cart/items`);
    triggerRecommendationRefresh("clear-cart");
    return result;
  },
  async addWishlistItem(idUsuario, item) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const result = await apiClient.post(`/users/${user}/wishlist/items`, item);
    triggerRecommendationRefresh("add-wishlist-item");
    return result;
  },
  async removeWishlistItem(idUsuario, idProducto) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const product = encodeURIComponent(normalizeId(idProducto));
    const result = await apiClient.delete(`/users/${user}/wishlist/items/${product}`);
    triggerRecommendationRefresh("remove-wishlist-item");
    return result;
  },
  async getWishlist(idUsuario) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    const ts = Date.now();
    const response = await tryGet([
      `/users/${user}/wishlist/items?_ts=${ts}`,
      `/users/${user}/wishlist?_ts=${ts}`,
    ]);
    return {
      items: pickItemsFromPayload(response, ["items", "wishlist", "wishlistItems", "productos", "products"]),
    };
  },
  async createOrder(idUsuario, payload) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    return apiClient.post(`/users/${user}/orders`, payload);
  },
  async createReview(idUsuario, payload) {
    const user = encodeURIComponent(normalizeId(idUsuario));
    return apiClient.post(`/users/${user}/reviews`, payload);
  },
  getUserSignals() {
    return { wishlistIds: [], cartIds: [], viewCounts: {} };
  },
};
