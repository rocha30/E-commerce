import { apiClient } from "./apiClient";

export const relationshipService = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/relationships${query ? `?${query}` : ""}`);
  },
  create(payload) {
    return apiClient.post("/relationships", payload);
  },
  remove(elementId) {
    return apiClient.delete(`/relationships/${elementId}`);
  },
  removeBulk(payload) {
    return apiClient.delete("/relationships/bulk", payload);
  },
  addProperties(elementId, payload) {
    return apiClient.patch(`/relationships/${elementId}/properties/add`, payload);
  },
  addPropertiesBulk(payload) {
    return apiClient.patch("/relationships/properties/add-bulk", payload);
  },
  updateProperties(elementId, payload) {
    return apiClient.patch(`/relationships/${elementId}/properties/update`, payload);
  },
  updatePropertiesBulk(payload) {
    return apiClient.patch("/relationships/properties/update-bulk", payload);
  },
  removeProperties(elementId, payload) {
    return apiClient.patch(`/relationships/${elementId}/properties/remove`, payload);
  },
  removePropertiesBulk(payload) {
    return apiClient.patch("/relationships/properties/remove-bulk", payload);
  },
};
