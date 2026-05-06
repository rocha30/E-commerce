/**
 * Query serialization that satisfies strict backends (non-negative integers for page/limit, etc.).
 * Avoids sending "12.0" or "0.0" when integers are required.
 */

const NON_NEG_INT_KEYS = new Set([
  "page",
  "limit",
  "offset",
  "skip",
  "take",
  "perPage",
  "pageSize",
  "size",
]);

function appendParam(searchParams, key, raw) {
  if (raw === undefined || raw === null || raw === "") return;

  if (NON_NEG_INT_KEYS.has(key)) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    searchParams.set(key, String(Math.max(0, Math.floor(n))));
    return;
  }

  if (key === "minPrice" || key === "maxPrice") {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return;
    // Some backend validators require strict integer strings (reject "50.0").
    searchParams.set(key, String(Math.floor(n)));
    return;
  }

  searchParams.set(key, String(raw));
}

/**
 * @param {Record<string, unknown>} params
 * @returns {URLSearchParams}
 */
export function buildSearchParams(params = {}) {
  const out = new URLSearchParams();
  for (const [key, raw] of Object.entries(params)) {
    appendParam(out, key, raw);
  }
  return out;
}

/**
 * @param {Record<string, unknown>} params
 * @returns {string} `?a=1&b=2` or ""
 */
export function buildQueryString(params = {}) {
  const qs = buildSearchParams(params).toString();
  return qs ? `?${qs}` : "";
}
