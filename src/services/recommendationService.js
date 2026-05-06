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
};
