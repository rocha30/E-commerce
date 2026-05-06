import { apiClient } from "./apiClient";
import { extractList } from "../utils/normalizeApi";

function isMissingEndpoint(err) {
  const st = err?.status;
  return st === 404 || st === 405 || st === 501;
}

/**
 * Tries several shapes backends may expose; returns empty payload if none exist (no throw).
 */
export const recommendationService = {
  async getUserRecommendations(idUsuario) {
    const encoded = encodeURIComponent(idUsuario);

    const attempts = [
      () => apiClient.get(`/users/${encoded}/recommendations`),
      () => apiClient.get(`/recommendations?userId=${encoded}`),
      () => apiClient.get(`/products/recommendations?userId=${encoded}`),
      () => apiClient.post("/query", { preset: "userRecommendations", userId: idUsuario }),
    ];

    let lastErr;
    for (let i = 0; i < attempts.length; i++) {
      try {
        const response = await attempts[i]();
        const rows = extractList(response?.data ?? response);
        if (rows.length > 0) return response;
      } catch (e) {
        lastErr = e;
        if (isMissingEndpoint(e)) continue;
        const isPreset =
          i === attempts.length - 1 &&
          (e.status === 400 || e.status === 422 || e.status === 500);
        if (isPreset) {
          if (import.meta.env.DEV) {
            console.warn("[recommendationService] POST /query preset failed; using empty list.", e.message);
          }
          break;
        }
        throw e;
      }
    }

    if (import.meta.env.DEV && lastErr) {
      console.warn("[recommendationService] No recommendations route matched.", lastErr.message);
    }

    throw new Error(
      "No backend recommendation endpoint is available. Implement one of: GET /users/:id/recommendations, GET /recommendations?userId=..., GET /products/recommendations?userId=..., or POST /query preset=userRecommendations."
    );
  },

  async testRecommendationsUpdate(idUsuario, targetProductId) {
    const encodedUser = encodeURIComponent(idUsuario);
    const encodedProduct = encodeURIComponent(targetProductId);

    const getRecIds = async () => {
      const response = await apiClient.get(`/products/recommendations?userId=${encodedUser}`);
      const rows = extractList(response?.data ?? response);
      return rows
        .slice(0, 10)
        .map((p) => p?.idProducto || p?.id)
        .filter(Boolean)
        .map(String);
    };

    const before = await getRecIds();

    await apiClient.post(`/users/${encodedUser}/views/${encodedProduct}`, {
      secondsOnPage: 60,
    });
    await apiClient.post(`/users/${encodedUser}/cart/items`, {
      idProducto: targetProductId,
      cantidad: 1,
    });
    await apiClient.post(`/users/${encodedUser}/wishlist/items`, {
      idProducto: targetProductId,
    });

    const after = await getRecIds();
    const overlap = before.filter((id) => after.includes(id)).length;
    const overlapPct = Math.round((overlap / Math.max(before.length, 1)) * 100);
    const updated = before.join(",") !== after.join(",");
    const entered = after.filter((id) => !before.includes(id));
    const exited = before.filter((id) => !after.includes(id));
    const moved = before.filter(
      (id, index) => after.includes(id) && after.indexOf(id) !== index
    );
    const changeType =
      entered.length || exited.length
        ? "composition"
        : moved.length
          ? "reorder"
          : "none";

    return { before, after, updated, overlapPct, entered, exited, moved, changeType };
  },
};
