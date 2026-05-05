import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNav from "../../components/graph/AdminNav";
import LabelSelector from "../../components/graph/LabelSelector";
import PropertyEditor from "../../components/graph/PropertyEditor";
import { nodeService } from "../../services/nodeService";

function parsePropertyValue(type, rawValue) {
  if (type === "Float") return Number.parseFloat(rawValue);
  if (type === "Integer") return Number.parseInt(rawValue, 10);
  if (type === "Boolean") return rawValue === "true";
  if (type === "List") return String(rawValue).split(",").map((item) => item.trim()).filter(Boolean);
  return rawValue;
}

export default function NodeCreatePage() {
  const navigate = useNavigate();
  const [labelsInput, setLabelsInput] = useState("");
  const [properties, setProperties] = useState([
    { key: "", type: "String", value: "" },
    { key: "", type: "String", value: "" },
    { key: "", type: "String", value: "" },
    { key: "", type: "String", value: "" },
    { key: "", type: "String", value: "" },
  ]);
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const labels = labelsInput.split(",").map((item) => item.trim()).filter(Boolean);
      const payload = {
        labels,
        properties: properties
          .filter((property) => property.key)
          .reduce((acc, property) => {
            acc[property.key] = parsePropertyValue(property.type, property.value);
            return acc;
          }, {}),
      };
      await nodeService.create(payload);
      navigate("/admin/nodes");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="admin-page-title">Create Node</h1>
        <AdminNav />
        {error && <p>Error: {error}</p>}
        <form onSubmit={onSubmit}>
          <LabelSelector value={labelsInput} onChange={setLabelsInput} />
          <PropertyEditor properties={properties} onChange={setProperties} />
          <button type="submit">Save node</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
