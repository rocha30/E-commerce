import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import { analyticsService } from "../../services/analyticsService";
import { recommendationService } from "../../services/recommendationService";
import { diagnosticsService } from "../../services/diagnosticsService";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";

const queryMap = {
  topViewedProducts: () => analyticsService.getTopViewedProducts(),
  topWishlistProducts: () => analyticsService.getTopWishlistProducts(),
  salesByBrand: () => analyticsService.getSalesByBrand(),
  recommendationsByUser: () => recommendationService.getUserRecommendations(DEFAULT_USER_ID),
  topCartProducts: () => analyticsService.getTopCartProducts(),
  graphHealth: () => diagnosticsService.getConnectivity(),
};

export default function QueriesPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (queryName) => {
    try {
      setError(null);
      const response = await queryMap[queryName]();
      setResult(response.data || response);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Predefined Queries</h1>
        <AdminNav />
        <div className="admin-actions">
          <button onClick={() => execute("topViewedProducts")}>Top viewed products</button>
          <button onClick={() => execute("topWishlistProducts")}>Top wishlist products</button>
          <button onClick={() => execute("salesByBrand")}>Top brands by sales</button>
          <button onClick={() => execute("recommendationsByUser")}>User recommendations</button>
          <button onClick={() => execute("topCartProducts")}>Top cart products</button>
          <button onClick={() => execute("graphHealth")}>Graph health</button>
        </div>
        {error && <p>Error: {error}</p>}
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </main>
      <Footer />
    </>
  );
}
