import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import { diagnosticsService } from "../../services/diagnosticsService";

export default function GraphDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await diagnosticsService.getConnectivity();
        setDiagnostics(response.data || response);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Graph Diagnostics</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        {diagnostics && (
          <ul>
            <li>Connected: {String(diagnostics.isConnected)}</li>
            <li>Components: {diagnostics.componentCount}</li>
            <li>Total nodes: {diagnostics.totalNodes}</li>
            <li>Largest component: {diagnostics.largestComponentSize}</li>
            <li>Isolated nodes: {diagnostics.isolatedCount}</li>
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
