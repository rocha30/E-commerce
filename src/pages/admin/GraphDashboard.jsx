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
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setWarnings([]);
        const summaryResponse = await analyticsService.getSummary();
        const merged = summaryResponse?.data || summaryResponse || {};
        setSummary(merged);
        if (merged.partialErrors?.length) {
          setWarnings(merged.partialErrors);
        }

        try {
          const connectivityResponse = await diagnosticsService.getConnectivity();
          setConnectivity(connectivityResponse?.data || connectivityResponse || {});
        } catch (connErr) {
          setWarnings((w) => [...w, `Connectivity: ${connErr.message}`]);
          setConnectivity({});
        }
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
        {error && <p className="catalog-status">Error: {error}</p>}
        {warnings.length > 0 && (
          <div className="catalog-status" style={{ marginBottom: 16 }}>
            <strong>Some metrics could not load:</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
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
