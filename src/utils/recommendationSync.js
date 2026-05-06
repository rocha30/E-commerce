const RECOMMENDATION_REFRESH_KEY = "exquisit_time_recommendations_refresh";
const RECOMMENDATION_EVENT = "exquisit-time:recommendations-refresh";

function nowToken() {
  return String(Date.now());
}

export function readRecommendationRefreshToken() {
  if (typeof window === "undefined") return "0";
  try {
    return window.localStorage.getItem(RECOMMENDATION_REFRESH_KEY) || "0";
  } catch {
    return "0";
  }
}

export function triggerRecommendationRefresh(reason = "unknown") {
  const token = nowToken();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(RECOMMENDATION_REFRESH_KEY, token);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(
      new CustomEvent(RECOMMENDATION_EVENT, {
        detail: { token, reason },
      })
    );
  }
  return token;
}

export function subscribeRecommendationRefresh(onRefresh) {
  if (typeof window === "undefined") return () => {};

  const onCustomEvent = (event) => {
    onRefresh(event?.detail?.token || readRecommendationRefreshToken());
  };
  const onStorage = (event) => {
    if (event.key !== RECOMMENDATION_REFRESH_KEY) return;
    onRefresh(event.newValue || "0");
  };

  window.addEventListener(RECOMMENDATION_EVENT, onCustomEvent);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(RECOMMENDATION_EVENT, onCustomEvent);
    window.removeEventListener("storage", onStorage);
  };
}
