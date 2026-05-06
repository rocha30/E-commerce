import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import PropertyEditor from "../../components/graph/PropertyEditor";
import { nodeService } from "../../services/nodeService";

export default function NodeDetailPage() {
  const { elementId } = useParams();
  const [node, setNode] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNode = async () => {
      try {
        const response = await nodeService.getById(elementId);
        const payload = response.data || response;
        setNode(payload);
        const props = Object.entries(payload.properties || {}).map(([key, value]) => ({
          key,
          type: typeof value === "number" ? "Float" : typeof value === "boolean" ? "Boolean" : "String",
          value: String(value),
        }));
        setProperties(props);
      } catch (err) {
        setError(err.message);
      }
    };
    loadNode();
  }, [elementId]);

  const saveProperties = async () => {
    const values = properties.reduce((acc, property) => {
      if (property.key) acc[property.key] = property.value;
      return acc;
    }, {});
    await nodeService.patchProperties(elementId, { properties: values });
    const response = await nodeService.getById(elementId);
    setNode(response.data || response);
  };

  const removeProperties = async () => {
    const keys = properties.filter((property) => !property.value && property.key).map((property) => property.key);
    if (!keys.length) return;
    await nodeService.removeProperties(elementId, { keys });
    const response = await nodeService.getById(elementId);
    setNode(response.data || response);
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Node Detail</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        {node && (
          <>
            <p><strong>ElementId:</strong> {node.elementId}</p>
            <p><strong>Labels:</strong> {(node.labels || []).join(", ")}</p>
            <PropertyEditor properties={properties} onChange={setProperties} />
            <div className="admin-actions">
              <button onClick={saveProperties}>Save properties</button>
              <button onClick={removeProperties}>Delete empty properties</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
