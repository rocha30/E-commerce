import { apiClient } from "./apiClient";

/**
 * Generic Cypher / preset query endpoint (matches backend POST /query).
 * Body shape depends on your backend contract.
 */
export const queryService = {
  run(body) {
    return apiClient.post("/query", body);
  },
};
