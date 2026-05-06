import { apiClient } from "./apiClient";
import { buildQueryString } from "../utils/queryString";

function isInvalidIntegerBackendError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return (
    err?.status === 500 &&
    msg.includes("not a valid value") &&
    msg.includes("non-negative integer")
  );
}

async function fallbackProductsFromQuery() {
  const candidates = [
    { preset: "topViewedProducts" },
    { preset: "topCartProducts" },
  ];

  for (const body of candidates) {
    try {
      const result = await apiClient.post("/query", body);
      const rows = result?.data || result?.items || [];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const ids = rows
        .map((r) => r?.idProducto || r?.id || r?.productId)
        .filter(Boolean)
        .slice(0, 12);

      const details = await Promise.allSettled(
        ids.map((id) => apiClient.get(`/products/${encodeURIComponent(id)}`))
      );

      const products = details
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value?.data ?? r.value)
        .filter(Boolean);

      if (products.length > 0) {
        return { data: products, meta: { fallback: "query-preset" } };
      }
    } catch {
      // Try next preset.
    }
  }

  return { data: [], meta: { fallback: "none" } };
}

export const catalogService = {
  async getProducts(params = {}) {
    try {
      return await apiClient.get(`/products${buildQueryString(params)}`);
    } catch (err) {
      if (!isInvalidIntegerBackendError(err)) throw err;
      if (import.meta.env.DEV) {
        console.warn(
          "[catalogService] /products failed with integer validation error; using query preset fallback."
        );
      }
      return fallbackProductsFromQuery();
    }
  },
  getProductById(id) {
    return apiClient.get(`/products/${encodeURIComponent(id)}`);
  },
  getBrands() {
    return apiClient.get("/brands");
  },
  getCategories() {
    return apiClient.get("/products/categorias");
  },
  /**
   * Related products: tries `/products/:id/related`, then `/products/:id/recommendations`.
   */
  async getRelatedProducts(id) {
    const encoded = encodeURIComponent(id);
    try {
      return await apiClient.get(`/products/${encoded}/related`);
    } catch {
      try {
        return await apiClient.get(`/products/${encoded}/recommendations`);
      } catch {
        return { items: [], products: [] };
      }
    }
  },
  getReviews(id) {
    return apiClient.get(`/products/${encodeURIComponent(id)}/reviews`).catch(() => []);
  },
  getProductRecommendations(id) {
    return apiClient.get(`/products/${encodeURIComponent(id)}/recommendations`);
  },
};
