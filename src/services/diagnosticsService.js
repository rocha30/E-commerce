import { apiClient } from "./apiClient";

export const diagnosticsService = {
  getConnectivity() {
    return apiClient.get("/graph/diagnostics/connectivity");
  },
};
