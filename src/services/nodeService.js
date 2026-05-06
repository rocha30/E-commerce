import { apiClient } from "./apiClient";
import { buildQueryString } from "../utils/queryString";

/** Paths aligned with backend: PATCH/DELETE `/nodes/:id/properties`, bulk under `/nodes/bulk/...` */
export const nodeService = {
  list(params = {}) {
    return apiClient.get(`/nodes${buildQueryString(params)}`);
  },
  getById(elementId) {
    return apiClient.get(`/nodes/${encodeURIComponent(elementId)}`);
  },
  create(payload) {
    return apiClient.post("/nodes", payload);
  },
  remove(elementId) {
    return apiClient.delete(`/nodes/${encodeURIComponent(elementId)}`);
  },
  removeBulk(payload) {
    return apiClient.delete("/nodes/bulk", payload);
  },
  patchProperties(elementId, payload) {
    return apiClient.patch(`/nodes/${encodeURIComponent(elementId)}/properties`, payload);
  },
  removeProperties(elementId, payload) {
    return apiClient.delete(`/nodes/${encodeURIComponent(elementId)}/properties`, payload);
  },
  bulkPatchProperties(payload) {
    return apiClient.patch("/nodes/bulk/properties", payload);
  },
  bulkRemoveProperties(payload) {
    return apiClient.delete("/nodes/bulk/properties", payload);
  },
};
