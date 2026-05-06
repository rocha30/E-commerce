/**
 * Unwrap typical API envelopes: { data: T }, { success, data }, raw T.
 */
export function unwrapPayload(payload) {
  if (payload == null) return payload;
  if (payload.data !== undefined && typeof payload.data === "object") {
    return payload.data;
  }
  return payload;
}

/**
 * Extract a list from common backend shapes (Express / Neo4j handlers).
 */
export function extractList(payload) {
  const raw = unwrapPayload(payload);

  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;

  const candidates = [
    raw.items,
    raw.products,
    raw.results,
    raw.records,
    raw.rows,
    raw.cart,
    raw.wishlist,
    raw.users,
    raw.usuarios,
    raw.nodes,
    raw.brands,
    raw.categories,
    raw.categorias,
    raw.data,
    raw.cart?.items,
    raw.wishlist?.items,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }

  if (typeof raw === "object") {
    const firstArray = Object.values(raw).find((v) => Array.isArray(v));
    if (firstArray) return firstArray;
  }

  return [];
}

/**
 * Pagination meta from common keys (reads root + meta; works when list lives in `data`).
 */
export function extractPagination(payload, fallbackTotalPages = 1) {
  if (payload == null) {
    return { totalPages: fallbackTotalPages, total: 0 };
  }
  const top = Array.isArray(payload) ? {} : typeof payload === "object" ? payload : {};
  const raw = unwrapPayload(payload);
  const data = Array.isArray(raw) ? {} : typeof raw === "object" ? raw : {};
  const topMeta = top.meta || top.pagination || {};
  const dataMeta = data.meta || data.pagination || {};
  const totalPages = Number(
    top.totalPages ??
      top.total_pages ??
      top.pages ??
      top.lastPage ??
      topMeta.totalPages ??
      topMeta.total_pages ??
      topMeta.pages ??
      data.totalPages ??
      data.total_pages ??
      data.pages ??
      data.lastPage ??
      dataMeta.totalPages ??
      dataMeta.total_pages ??
      dataMeta.pages ??
      fallbackTotalPages
  );
  const total = Number(
    top.total ??
      top.totalCount ??
      top.count ??
      topMeta.total ??
      topMeta.count ??
      data.total ??
      data.totalCount ??
      data.count ??
      dataMeta.total ??
      dataMeta.count ??
      0
  );
  return {
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : fallbackTotalPages,
    total,
  };
}
