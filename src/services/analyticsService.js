import { apiClient } from "./apiClient";

export const analyticsService = {
  getSummary() {
    return apiClient.get("/analytics/summary");
  },
  getNodesByLabel() {
    return apiClient.get("/analytics/nodes-by-label");
  },
  getRelationshipsByType() {
    return apiClient.get("/analytics/relationships-by-type");
  },
  getTopViewedProducts() {
    return apiClient.get("/analytics/top-viewed-products");
  },
  getTopCartProducts() {
    return apiClient.get("/analytics/top-cart-products");
  },
  getTopWishlistProducts() {
    return apiClient.get("/analytics/top-wishlist-products");
  },
  getSalesByBrand() {
    return apiClient.get("/analytics/sales-by-brand");
  },
  getReviewsByProduct() {
    return apiClient.get("/analytics/reviews-by-product");
  },
};
