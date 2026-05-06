import { apiClient } from "./apiClient";
import { buildQueryString } from "../utils/queryString";
import { extractList, extractPagination } from "../utils/normalizeApi";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;
const FALLBACK_USER_COUNT = Math.max(1, Number(import.meta.env.VITE_USER_COUNT || 1000));

function toCanonicalUserId(value) {
  const text = String(value || "").trim();
  const match = text.match(/^USR-(\d{1,5})$/i);
  if (!match) return text;
  const n = Number(match[1]);
  if (!Number.isFinite(n) || n <= 0) return text.toUpperCase();
  return `USR-${String(n).padStart(5, "0")}`;
}

function generateSequentialUsers(total = FALLBACK_USER_COUNT) {
  const out = [];
  for (let i = 1; i <= total; i += 1) {
    out.push(`USR-${String(i).padStart(5, "0")}`);
  }
  return out;
}

function sortUserIds(ids) {
  return [...ids].sort((a, b) => {
    const aa = String(a);
    const bb = String(b);
    const ma = aa.match(/^USR-(\d{1,5})$/i);
    const mb = bb.match(/^USR-(\d{1,5})$/i);
    if (ma && mb) return Number(ma[1]) - Number(mb[1]);
    return aa.localeCompare(bb);
  });
}

function normalizeUser(item) {
  if (typeof item === "string" || typeof item === "number") {
    const plain = String(item).trim();
    return plain ? toCanonicalUserId(plain) : null;
  }
  const id =
    item?.idUsuario ??
    item?.userId ??
    item?.id ??
    item?._id ??
    item?.usuarioId ??
    item?.codigo ??
    item?.usuario?.idUsuario ??
    item?.usuario?.id ??
    item?.user?.idUsuario ??
    item?.user?.id;
  if (id == null) return null;
  const text = String(id).trim();
  if (!text) return null;
  return toCanonicalUserId(text);
}

function isMissingEndpoint(err) {
  return [404, 405, 501].includes(Number(err?.status || 0));
}

async function safeGet(path) {
  try {
    return await apiClient.get(path);
  } catch (err) {
    if (isMissingEndpoint(err)) return null;
    throw err;
  }
}

async function listFromEndpoint(basePath) {
  const collected = [];
  const seen = new Set();

  const pushRows = (rows) => {
    for (const row of rows) {
      const normalized = normalizeUser(row);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      collected.push(normalized);
    }
  };

  // First try without pagination query params.
  const firstResponse = await safeGet(basePath);
  if (!firstResponse) return collected;
  const firstRows = extractList(firstResponse);
  pushRows(firstRows);

  // Then try explicit pagination; some backends only return complete lists with page/limit.
  let firstPagedRows = [];
  let totalPages = extractPagination(firstResponse, 1).totalPages;
  try {
    const firstPagedResponse = await safeGet(
      `${basePath}${buildQueryString({ page: 1, limit: PAGE_SIZE })}`
    );
    if (!firstPagedResponse) {
      return collected;
    }
    firstPagedRows = extractList(firstPagedResponse);
    pushRows(firstPagedRows);
    totalPages = Math.max(totalPages, extractPagination(firstPagedResponse, 1).totalPages);
  } catch {
    // Keep unpaged result if paged endpoint is unavailable.
  }

  // If totalPages is known, honor it. If not, continue until a short/empty page.
  let page = 2;
  while (page <= MAX_PAGES) {
    if (totalPages > 1 && page > totalPages) break;
    if (totalPages <= 1 && firstPagedRows.length > 0 && firstPagedRows.length < PAGE_SIZE && page > 2) break;

    const response = await safeGet(`${basePath}${buildQueryString({ page, limit: PAGE_SIZE })}`);
    if (!response) break;
    const rows = extractList(response);
    pushRows(rows);

    const metaPages = extractPagination(response, 1).totalPages;
    totalPages = Math.max(totalPages, metaPages);

    if (rows.length === 0) break;
    if (totalPages <= 1 && rows.length < PAGE_SIZE) break;

    page += 1;
  }

  return collected;
}

export const userService = {
  async listAllUserIds() {
    const endpoints = ["/users", "/usuarios", "/customers", "/users/list", "/users/all"];
    let lastError;
    const allIds = new Set();

    for (const path of endpoints) {
      try {
        const ids = await listFromEndpoint(path);
        ids.forEach((id) => allIds.add(id));
      } catch (err) {
        lastError = err;
      }
    }

    const generated = generateSequentialUsers();
    generated.forEach((id) => allIds.add(id));

    if (allIds.size > 0) return sortUserIds(Array.from(allIds));

    if (lastError) throw lastError;
    return generated;
  },
};
