import { apiClient } from "./apiClient";

function unwrap(payload) {
  return payload?.data !== undefined ? payload.data : payload;
}

function sumRelationshipCounts(typesPayload) {
  const raw = unwrap(typesPayload);
  const arr = raw?.types ?? raw?.items ?? (Array.isArray(raw) ? raw : []);
  if (!Array.isArray(arr)) return undefined;
  return arr.reduce((sum, row) => sum + (Number(row.count ?? row.total ?? 0) || 0), 0);
}

function countLabels(labelsPayload) {
  const raw = unwrap(labelsPayload);
  if (typeof raw?.totalLabels === "number") return raw.totalLabels;
  const arr = raw?.labels ?? raw?.items ?? (Array.isArray(raw) ? raw : []);
  if (Array.isArray(arr)) return arr.length;
  if (raw && typeof raw === "object") return Object.keys(raw).length;
  return undefined;
}

function countRelationshipTypes(typesPayload) {
  const raw = unwrap(typesPayload);
  if (typeof raw?.totalTypes === "number") return raw.totalTypes;
  const arr = raw?.types ?? raw?.items ?? (Array.isArray(raw) ? raw : []);
  if (Array.isArray(arr)) return arr.length;
  return undefined;
}

/**
 * Dashboard "summary" built from graph endpoints (no /analytics/summary on backend).
 */
export const analyticsService = {
  async getSummary() {
    const endpoints = [
      { key: "nodeCount", path: "/graph/nodes/count" },
      { key: "labels", path: "/graph/nodes/labels" },
      { key: "types", path: "/graph/relationships/types" },
    ];

    const settled = await Promise.allSettled(
      endpoints.map((e) => apiClient.get(e.path))
    );

    const byKey = {};
    const errors = [];
    settled.forEach((result, i) => {
      const name = endpoints[i].key;
      if (result.status === "fulfilled") {
        byKey[name] = result.value;
      } else {
        errors.push(`${endpoints[i].path}: ${result.reason?.message || result.reason}`);
      }
    });

    const nodeCountRes = byKey.nodeCount;
    const labelsRes = byKey.labels;
    const typesRes = byKey.types;

    const nc = nodeCountRes != null ? unwrap(nodeCountRes) : {};
    const totalNodes = nc?.count ?? nc?.total ?? nc?.nodeCount ?? nc?.nodes;

    const totalLabels = labelsRes != null ? countLabels(labelsRes) : undefined;
    const totalRelationshipTypes = typesRes != null ? countRelationshipTypes(typesRes) : undefined;
    const totalRelationships =
      (typesRes != null && unwrap(typesRes)?.totalRelationships) ??
      (typesRes != null ? sumRelationshipCounts(typesRes) : undefined) ??
      (nodeCountRes != null ? unwrap(nodeCountRes)?.totalRelationships : undefined);

    return {
      totalNodes,
      totalRelationships,
      totalLabels,
      totalRelationshipTypes,
      partialErrors: errors.length ? errors : undefined,
    };
  },

  getNodesByLabel() {
    return apiClient.get("/graph/nodes/labels");
  },

  getRelationshipsByType() {
    return apiClient.get("/graph/relationships/types");
  },

  /** Prefer POST /query with presets — backend must implement these bodies */
  getTopViewedProducts() {
    return apiClient.post("/query", { preset: "topViewedProducts" });
  },

  getTopCartProducts() {
    return apiClient.post("/query", { preset: "topCartProducts" });
  },

  getTopWishlistProducts() {
    return apiClient.post("/query", { preset: "topWishlistProducts" });
  },

  getSalesByBrand() {
    return apiClient.post("/query", { preset: "salesByBrand" });
  },

  getReviewsByProduct() {
    return apiClient.post("/query", { preset: "reviewsByProduct" });
  },
};
