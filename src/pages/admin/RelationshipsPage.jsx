import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import RelationshipTable from "../../components/graph/RelationshipTable";
import { relationshipService } from "../../services/relationshipService";
import { extractList, extractPagination } from "../../utils/normalizeApi";

const PAGE_SIZE = 20;

export default function RelationshipsPage() {
  const [relationships, setRelationships] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRelationships, setTotalRelationships] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRelationships = async (nextPage = page) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await relationshipService.list({ page: nextPage, limit: PAGE_SIZE });
      const pagination = extractPagination(response, 1);
      setRelationships(extractList(response));
      setTotalPages(pagination.totalPages);
      setTotalRelationships(pagination.total);
      setSelectedIds([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRelationships(page);
  }, [page]);

  const canGoBack = useMemo(() => page > 1 && !isLoading, [page, isLoading]);
  const canGoNext = useMemo(() => page < totalPages && !isLoading, [page, totalPages, isLoading]);

  const toggleSelection = (elementId) => {
    setSelectedIds((prev) => (prev.includes(elementId) ? prev.filter((id) => id !== elementId) : [...prev, elementId]));
  };

  const removeSelected = async () => {
    if (!selectedIds.length) return;
    await relationshipService.removeBulk({ elementIds: selectedIds });
    setSelectedIds([]);
    await loadRelationships(page);
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
          <button onClick={removeSelected} disabled={!selectedIds.length || isLoading}>Delete selected</button>
        </div>
        <p className="catalog-status" style={{ margin: "0 0 12px", padding: "0.8rem 1rem", fontSize: "0.95rem" }}>
          {isLoading ? "Loading relationships..." : `Showing ${relationships.length} relationships (total: ${totalRelationships})`}
        </p>
        <RelationshipTable relationships={relationships} selectedIds={selectedIds} onToggle={toggleSelection} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 20 }}>
          <button className="back-to-brands-btn" onClick={() => setPage((prev) => prev - 1)} disabled={!canGoBack}>
            Previous
          </button>
          <span style={{ color: "#f5f5f5", minWidth: 110, textAlign: "center" }}>
            Page {page} of {totalPages}
          </span>
          <button className="back-to-brands-btn" onClick={() => setPage((prev) => prev + 1)} disabled={!canGoNext}>
            Next
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
