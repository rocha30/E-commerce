import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import RelationshipTable from "../../components/graph/RelationshipTable";
import { relationshipService } from "../../services/relationshipService";

export default function RelationshipsPage() {
  const [relationships, setRelationships] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);

  const loadRelationships = async () => {
    try {
      const response = await relationshipService.list({ page: 1, limit: 20 });
      setRelationships(response.items || response.data?.items || response.data || response || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadRelationships();
  }, []);

  const toggleSelection = (elementId) => {
    setSelectedIds((prev) => (prev.includes(elementId) ? prev.filter((id) => id !== elementId) : [...prev, elementId]));
  };

  const removeSelected = async () => {
    if (!selectedIds.length) return;
    await relationshipService.removeBulk({ elementIds: selectedIds });
    setSelectedIds([]);
    await loadRelationships();
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Relationships</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        <div className="admin-actions">
          <Link to="/admin/relationships/create">Create relationship</Link>
          <button onClick={removeSelected}>Delete selected</button>
        </div>
        <RelationshipTable relationships={relationships} selectedIds={selectedIds} onToggle={toggleSelection} />
      </main>
      <Footer />
    </>
  );
}
