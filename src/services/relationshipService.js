import { apiClient } from "./apiClient";
import { buildQueryString } from "../utils/queryString";

export const relationshipService = {
  list(params = {}) {
    return apiClient.get(`/relationships${buildQueryString(params)}`);
  },
  create(payload) {
    return apiClient.post("/relationships", payload);
  },
  remove(elementId) {
    return apiClient.delete(`/relationships/${encodeURIComponent(elementId)}`);
  },
  removeBulk(payload) {
    return apiClient.delete("/relationships/bulk", payload);
  },
  patchProperties(elementId, payload) {
    return apiClient.patch(`/relationships/${encodeURIComponent(elementId)}/properties`, payload);
  },
  removeProperties(elementId, payload) {
    return apiClient.delete(`/relationships/${encodeURIComponent(elementId)}/properties`, payload);
  },
  bulkPatchProperties(payload) {
    return apiClient.patch("/relationships/bulk/properties", payload);
  },
  bulkRemoveProperties(payload) {
    return apiClient.delete("/relationships/bulk/properties", payload);
  },
};
