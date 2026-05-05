import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import NodeTable from "../../components/graph/NodeTable";
import { nodeService } from "../../services/nodeService";

export default function NodesPage() {
  const [nodes, setNodes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);

  const loadNodes = async () => {
    try {
      const response = await nodeService.list({ page: 1, limit: 20 });
      setNodes(response.items || response.data?.items || response.data || response || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  const toggleSelection = (elementId) => {
    setSelectedIds((prev) => (prev.includes(elementId) ? prev.filter((id) => id !== elementId) : [...prev, elementId]));
  };

  const removeSelected = async () => {
    if (!selectedIds.length) return;
    await nodeService.removeBulk({ elementIds: selectedIds });
    setSelectedIds([]);
    await loadNodes();
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Nodes</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        <div className="admin-actions">
          <Link to="/admin/nodes/create">Create node</Link>
          <button onClick={removeSelected}>Delete selected</button>
        </div>
        <NodeTable nodes={nodes} selectedIds={selectedIds} onToggle={toggleSelection} />
      </main>
      <Footer />
    </>
  );
}
