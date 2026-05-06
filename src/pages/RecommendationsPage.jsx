import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../services/apiClient";
import { recommendationService } from "../services/recommendationService";
import {
  readRecommendationRefreshToken,
  subscribeRecommendationRefresh,
} from "../utils/recommendationSync";
import { extractList } from "../utils/normalizeApi";

function mapProduct(product) {
  const id = product.idProducto || product.id;
  return {
    id,
    idProducto: id,
    name: product.nombre || product.name || id,
    price: Number(product.precio ?? product.price ?? 0),
    image: product.image || "/images/default-watch.jpg",
    description: product.reason || product.razon || product.descripcion || product.description || "Recommended for you.",
    score: product.score,
  };
}

export default function RecommendationsPage() {
  const { userId } = useUser();
  const [refreshToken, setRefreshToken] = useState(readRecommendationRefreshToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationService.getUserRecommendations(userId);
      const raw = response?.data ?? response;
      const mapped = extractList(raw).map(mapProduct);
      setRecommendations(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [userId, refreshToken]);

  useEffect(() => {
    const unsubscribe = subscribeRecommendationRefresh((token) => {
      setRefreshToken(String(token || "0"));
    });
    return unsubscribe;
  }, []);

  const runUpdateTest = async () => {
    const productId = String(recommendations[0]?.idProducto || "").trim();
    if (!productId) {
      setTestError("No recommended product is available to run the test.");
      return;
    }
    try {
      setTestLoading(true);
      setTestError(null);
      const result = await recommendationService.testRecommendationsUpdate(userId, productId);
      setTestResult(result);
      setRefreshToken(String(Date.now()));
    } catch (err) {
      setTestError(err.message);
    } finally {
      setTestLoading(false);
    }
  };

  const testSummary = (() => {
    if (!testResult) return null;
    if (testResult.changeType === "none") {
      return { label: "No change in recommendations", tone: "#94a3b8" };
    }
    if (testResult.changeType === "reorder") {
      return { label: "Recommendations reordered (same products)", tone: "#fbbf24" };
    }
    return { label: "Recommendations changed (different products)", tone: "#34d399" };
  })();

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1>Recommendations</h1>
        <p className="catalog-status" style={{ marginBottom: 12, padding: "0.7rem 1rem" }}>
          Current user: <strong>{userId}</strong>
        </p>
        <section className="catalog-filters-section">
          <div className="catalog-filters-grid" style={{ gridTemplateColumns: "1fr", alignItems: "center" }}>
            <button className="back-to-brands-btn" onClick={runUpdateTest} disabled={testLoading}>
              {testLoading ? "Running test..." : "Test recommendation update"}
            </button>
          </div>
          {testError && (
            <p className="catalog-status" style={{ marginTop: 10, padding: "0.7rem 1rem" }}>
              Test error: {testError}
            </p>
          )}
          {testResult && (
            <div className="catalog-status" style={{ marginTop: 10, padding: "1rem" }}>
              <p style={{ marginBottom: 8, fontSize: "1rem" }}>
                Result:{" "}
                <strong style={{ color: testSummary?.tone }}>
                  {testSummary?.label}
                </strong>
              </p>
              <p style={{ marginBottom: 6 }}>
                Changed: <strong>{testResult.updated ? "Yes" : "No"}</strong>
              </p>
              <p style={{ marginBottom: 6 }}>
                Overlap: <strong>{testResult.overlapPct}%</strong>
              </p>
              <p style={{ marginBottom: 6 }}>
                Entered: <strong>{testResult.entered.length}</strong> · Exited: <strong>{testResult.exited.length}</strong> · Reordered:{" "}
                <strong>{testResult.moved.length}</strong>
              </p>
              <p style={{ marginBottom: 6 }}>
                Tested product: <code>{recommendations[0]?.idProducto || "-"}</code>
              </p>
              <p style={{ marginBottom: 6 }}>
                Before: <code>{testResult.before.join(", ") || "-"}</code>
              </p>
              <p style={{ margin: 0 }}>
                After: <code>{testResult.after.join(", ") || "-"}</code>
              </p>
            </div>
          )}
        </section>
        {loading && <p className="catalog-status">Loading recommendations...</p>}
        {error && (
          <div className="catalog-status">
            <p>Could not load recommendations from the backend.</p>
            <p>
              Verify the API is running and that <code>VITE_API_URL</code> is configured correctly.
            </p>
            <p>
              Current API: <code>{API_BASE_URL}</code>
            </p>
            <p>
              User ID: <code>{userId}</code>
            </p>
            <p>Technical detail: {error}</p>
            <button className="back-to-brands-btn" onClick={loadRecommendations}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <>
            {recommendations.length === 0 ? (
              <p className="catalog-status">No recommendations are currently available for user {userId}.</p>
            ) : (
              <div className="models-grid">
                {recommendations.map((item, index) => (
                  <ProductCard key={item.idProducto || index} {...item} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
