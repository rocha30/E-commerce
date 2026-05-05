import { apiClient } from "./apiClient";

export const nodeService = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/nodes${query ? `?${query}` : ""}`);
  },
  getById(elementId) {
    return apiClient.get(`/nodes/${elementId}`);
  },
  create(payload) {
    return apiClient.post("/nodes", payload);
  },
  remove(elementId) {
    return apiClient.delete(`/nodes/${elementId}`);
  },
  removeBulk(payload) {
    return apiClient.delete("/nodes/bulk", payload);
  },
  addProperties(elementId, payload) {
    return apiClient.patch(`/nodes/${elementId}/properties/add`, payload);
  },
  addPropertiesBulk(payload) {
    return apiClient.patch("/nodes/properties/add-bulk", payload);
  },
  updateProperties(elementId, payload) {
    return apiClient.patch(`/nodes/${elementId}/properties/update`, payload);
  },
  updatePropertiesBulk(payload) {
    return apiClient.patch("/nodes/properties/update-bulk", payload);
  },
  removeProperties(elementId, payload) {
    return apiClient.patch(`/nodes/${elementId}/properties/remove`, payload);
  },
  removePropertiesBulk(payload) {
    return apiClient.patch("/nodes/properties/remove-bulk", payload);
  },
};
