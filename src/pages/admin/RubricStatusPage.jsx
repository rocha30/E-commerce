import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import { rubricService } from "../../services/rubricService";

export default function RubricStatusPage() {
  const [status, setStatus] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await rubricService.getStatus();
        const body = response?.data ?? response ?? {};
        setStatus(body);
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
        <h1 className="admin-page-title">Rubric Status</h1>
        <AdminNav />
        {error && <p className="catalog-status">Error: {error}</p>}
        {status._endpointMissing && (
          <p className="catalog-status">
            {status.message || "Rubric status is not available on this API."}
          </p>
        )}
        {!status._endpointMissing && (
          <ul>
            {Object.entries(status).map(([key, value]) => (
              <li key={key}>{key}: {String(value)}</li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
