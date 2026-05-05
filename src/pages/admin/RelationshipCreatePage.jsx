import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import PropertyEditor from "../../components/graph/PropertyEditor";
import RelationshipTypeSelector from "../../components/graph/RelationshipTypeSelector";
import { relationshipService } from "../../services/relationshipService";

export default function RelationshipCreatePage() {
  const navigate = useNavigate();
  const [startNodeId, setStartNodeId] = useState("");
  const [endNodeId, setEndNodeId] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [properties, setProperties] = useState([
    { key: "", type: "String", value: "" },
    { key: "", type: "String", value: "" },
    { key: "", type: "String", value: "" },
  ]);
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        startNodeId,
        endNodeId,
        type: relationshipType,
        properties: properties.reduce((acc, property) => {
          if (property.key) acc[property.key] = property.value;
          return acc;
        }, {}),
      };
      await relationshipService.create(payload);
      navigate("/admin/relationships");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Create Relationship</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
          <input value={startNodeId} onChange={(e) => setStartNodeId(e.target.value)} placeholder="Source node" />
          <input value={endNodeId} onChange={(e) => setEndNodeId(e.target.value)} placeholder="Target node" />
          <RelationshipTypeSelector value={relationshipType} onChange={setRelationshipType} />
          <PropertyEditor properties={properties} onChange={setProperties} />
          <button type="submit">Create relationship</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
