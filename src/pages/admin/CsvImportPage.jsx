import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import { csvImportService } from "../../services/csvImportService";

export default function CsvImportPage() {
  const [nodesFile, setNodesFile] = useState(null);
  const [relationshipsFile, setRelationshipsFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const importNodes = async () => {
    if (!nodesFile) return;
    try {
      const response = await csvImportService.importNodes(nodesFile);
      setResult(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const importRelationships = async () => {
    if (!relationshipsFile) return;
    try {
      const response = await csvImportService.importRelationships(relationshipsFile);
      setResult(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">CSV Import</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <h3>Nodes CSV</h3>
            <input type="file" accept=".csv" onChange={(e) => setNodesFile(e.target.files?.[0] || null)} />
            <button onClick={importNodes} disabled={!nodesFile}>Import nodes</button>
          </div>
          <div>
            <h3>Relationships CSV</h3>
            <input type="file" accept=".csv" onChange={(e) => setRelationshipsFile(e.target.files?.[0] || null)} />
            <button onClick={importRelationships} disabled={!relationshipsFile}>Import relationships</button>
          </div>
        </div>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </main>
      <Footer />
    </>
  );
}
