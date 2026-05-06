import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import { useUser } from "../../context/UserContext";
import { analyticsService } from "../../services/analyticsService";
import { recommendationService } from "../../services/recommendationService";
import { diagnosticsService } from "../../services/diagnosticsService";

export default function QueriesPage() {
  const { userId } = useUser();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (queryName) => {
    const queryMap = {
      topViewedProducts: () => analyticsService.getTopViewedProducts(),
      topWishlistProducts: () => analyticsService.getTopWishlistProducts(),
      salesByBrand: () => analyticsService.getSalesByBrand(),
      recommendationsByUser: () => recommendationService.getUserRecommendations(userId),
      topCartProducts: () => analyticsService.getTopCartProducts(),
      graphHealth: () => diagnosticsService.getConnectivity(),
    };
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
