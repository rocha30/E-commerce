import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import { analyticsService } from "../../services/analyticsService";
import { diagnosticsService } from "../../services/diagnosticsService";

export default function GraphDashboard() {
  const [summary, setSummary] = useState({});
  const [connectivity, setConnectivity] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryResponse, connectivityResponse] = await Promise.all([
          analyticsService.getSummary(),
          diagnosticsService.getConnectivity(),
        ]);
        setSummary(summaryResponse.data || summaryResponse || {});
        setConnectivity(connectivityResponse.data || connectivityResponse || {});
      } catch (err) {
        setError(err.message);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Neo4j Dashboard</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
          <div>Total nodes: {summary.totalNodes ?? "-"}</div>
          <div>Total relationships: {summary.totalRelationships ?? "-"}</div>
          <div>Labels: {summary.totalLabels ?? "-"}</div>
          <div>Relationship types: {summary.totalRelationshipTypes ?? "-"}</div>
          <div>Connected graph: {String(connectivity.isConnected ?? "-")}</div>
          <div>Isolated nodes: {connectivity.isolatedCount ?? "-"}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
