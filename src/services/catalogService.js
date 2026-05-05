import { apiClient } from "./apiClient";

export const catalogService = {
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/catalog/products${query ? `?${query}` : ""}`);
  },
  getProductById(idProducto) {
    return apiClient.get(`/catalog/products/${idProducto}`);
  },
  getBrands() {
    return apiClient.get("/catalog/brands");
  },
  getCategories() {
    return apiClient.get("/catalog/categories");
  },
  getRelatedProducts(idProducto) {
    return apiClient.get(`/catalog/products/${idProducto}/related`);
  },
  getReviews(idProducto) {
    return apiClient.get(`/catalog/products/${idProducto}/reviews`);
  },
};
