import { apiClient } from "./apiClient";

export const userBehaviorService = {
  trackView(idUsuario, idProducto, payload = {}) {
    return apiClient.post(`/users/${idUsuario}/views/${idProducto}`, payload);
  },
  addCartItem(idUsuario, item) {
    return apiClient.post(`/users/${idUsuario}/cart/items`, item);
  },
  removeCartItem(idUsuario, idProducto) {
    return apiClient.delete(`/users/${idUsuario}/cart/items/${idProducto}`);
  },
  updateCartItem(idUsuario, idProducto, payload) {
    return apiClient.patch(`/users/${idUsuario}/cart/items/${idProducto}`, payload);
  },
  getCart(idUsuario) {
    return apiClient.get(`/users/${idUsuario}/cart`);
  },
  clearCart(idUsuario) {
    return apiClient.delete(`/users/${idUsuario}/cart/items`);
  },
  addWishlistItem(idUsuario, item) {
    return apiClient.post(`/users/${idUsuario}/wishlist/items`, item);
  },
  removeWishlistItem(idUsuario, idProducto) {
    return apiClient.delete(`/users/${idUsuario}/wishlist/items/${idProducto}`);
  },
  getWishlist(idUsuario) {
    return apiClient.get(`/users/${idUsuario}/wishlist/items`);
  },
  createOrder(idUsuario, payload) {
    return apiClient.post(`/users/${idUsuario}/orders`, payload);
  },
  createReview(idUsuario, payload) {
    return apiClient.post(`/users/${idUsuario}/reviews`, payload);
  },
};
