import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { recommendationService } from "../services/recommendationService";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationService.getUserRecommendations(DEFAULT_USER_ID);
      setRecommendations(response.data || response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1>Recommendations</h1>
        {loading && <p className="catalog-status">Loading recommendations...</p>}
        {error && (
          <div className="catalog-status">
            <p>Could not load recommendations from the backend.</p>
            <p>
              Verify the API is running and that <code>VITE_API_BASE_URL</code> is configured correctly.
            </p>
            <p>
              Current API: <code>{API_BASE_URL}</code>
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
              <p className="catalog-status">No recommendations are currently available for this user.</p>
            ) : (
              <div className="models-grid">
                {recommendations.map((item, index) => (
                  <article key={item.idProducto || index} className="product-card">
                    <h3>{item.nombre || item.name || item.idProducto}</h3>
                    <p>Score: {item.score ?? "N/A"}</p>
                    <p>{item.reason || item.razon || "No reason provided."}</p>
                  </article>
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
