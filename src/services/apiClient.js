const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { "Content-Type": "application/json" };
  const response = await fetch(url, {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (payload && payload.message) ||
      (typeof payload === "string" ? payload : "API error");
    throw new Error(message);
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
