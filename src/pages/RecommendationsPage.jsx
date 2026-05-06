import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../services/apiClient";
import { recommendationService } from "../services/recommendationService";
import { extractList } from "../utils/normalizeApi";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";

function mapProduct(product) {
  const id = product.idProducto || product.id;
  return {
    id,
    idProducto: id,
    name: product.nombre || product.name || id,
    price: Number(product.precio ?? product.price ?? 0),
    originalPrice: Number(product.precioOriginal ?? product.originalPrice ?? 0) || null,
    image: product.image || "/images/default-watch.jpg",
    description: product.reason || product.razon || product.descripcion || product.description || "Recommended for you.",
    discount: Number(product.descuento ?? product.discount ?? 0),
    score: product.score,
  };
}

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationService.getUserRecommendations(DEFAULT_USER_ID);
      const raw = response?.data ?? response;
      setRecommendations(extractList(raw).map(mapProduct));
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
              Verify the API is running and that <code>VITE_API_URL</code> is configured correctly.
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
