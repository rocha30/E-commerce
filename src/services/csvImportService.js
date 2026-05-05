import { apiClient } from "./apiClient";

export const csvImportService = {
  importNodes(file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm("/import/csv/nodes", formData);
  },
  importRelationships(file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm("/import/csv/relationships", formData);
  },
};
