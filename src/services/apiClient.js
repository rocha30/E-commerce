function normalizeBaseUrl(raw) {
  const s = (raw || "").trim();
  if (!s) return "http://localhost:4000/api";
  return s.replace(/\/+$/, "");
}

/** Resolved API origin (no trailing slash). Used by fetch wrapper and for troubleshooting. */
export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
);

function joinUrl(base, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

const MAX_ERR_TEXT = 400;

function truncateStr(s, max = MAX_ERR_TEXT) {
  if (!s || s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}

function errorMessageFromBody(payload, response) {
  if (payload == null || payload === "") {
    return `${response.status} ${response.statusText || ""}`.trim();
  }
  if (typeof payload === "string") {
    const t = truncateStr(payload.trim());
    return t || `${response.status} ${response.statusText || ""}`.trim();
  }
  if (typeof payload !== "object") {
    return String(payload);
  }

  const msg =
    payload.message ??
    payload.error ??
    payload.detail ??
    payload.title ??
    payload.description;

  if (typeof msg === "string" && msg.trim()) return msg.trim();
  if (msg && typeof msg === "object" && typeof msg.message === "string") {
    return msg.message;
  }

  if (Array.isArray(payload.errors) && payload.errors.length) {
    const first = payload.errors[0];
    if (typeof first === "string") return first;
    if (first?.message) return String(first.message);
    if (first?.msg) return String(first.msg);
  }

  try {
    const compact = JSON.stringify(payload);
    if (compact && compact !== "{}") {
      return compact.length > 280 ? `${compact.slice(0, 280)}…` : compact;
    }
  } catch {
    /* ignore */
  }

  return `${response.status} ${response.statusText || ""}`.trim();
}

async function request(path, options = {}) {
  const url = joinUrl(API_BASE_URL, path);
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { "Content-Type": "application/json" };
  let response;
  try {
    response = await fetch(url, {
      headers: { ...defaultHeaders, ...(options.headers || {}) },
      ...options,
    });
  } catch (netErr) {
    const hint =
      netErr?.message ||
      "Network error (is the backend running? Check VITE_API_URL / CORS.)";
    throw new Error(`${hint} → ${url}`);
  }

  const contentType = response.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("application/json")) {
    const text = await response.text();
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    const message = errorMessageFromBody(payload, response);
    const err = new Error(`${response.status} ${message}`);
    err.status = response.status;
    err.url = url;
    if (import.meta.env.DEV) {
      console.error("[apiClient]", options.method || "GET", url, payload);
    }
    throw err;
  }

  return payload;
}

export const apiClient = {
  get(path) {
    return request(path, { method: "GET" });
  },
  post(path, body) {
    return request(path, { method: "POST", body: JSON.stringify(body) });
  },
  patch(path, body) {
    return request(path, { method: "PATCH", body: JSON.stringify(body) });
  },
  delete(path, body) {
    return request(path, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  postForm(path, formData) {
    return request(path, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
};
