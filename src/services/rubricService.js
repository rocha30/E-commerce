import { apiClient } from "./apiClient";

export const rubricService = {
  /**
   * Optional admin endpoint — many backends omit this; 404 yields a soft placeholder.
   */
  async getStatus() {
    try {
      return await apiClient.get("/rubric/status");
    } catch (err) {
      if (err?.status === 404) {
        return {
          _endpointMissing: true,
          message: "This server does not expose GET /rubric/status.",
        };
      }
      throw err;
    }
  },
};
