import { apiClient } from "./apiClient";

export const rubricService = {
  getStatus() {
    return apiClient.get("/rubric/status");
  },
};
