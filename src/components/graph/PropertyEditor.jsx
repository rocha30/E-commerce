import React from "react";

const PROPERTY_TYPES = ["String", "Float", "Integer", "Boolean", "List", "Date", "DateTime"];

export default function PropertyEditor({ properties, onChange }) {
  const update = (index, key, value) => {
    const next = [...properties];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const addProperty = () => onChange([...properties, { key: "", type: "String", value: "" }]);
  const removeProperty = (index) => onChange(properties.filter((_, i) => i !== index));

  return (
    <div>
      {properties.map((property, index) => (
        <div key={`${property.key}-${index}`} style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 1fr auto", marginBottom: 8 }}>
          <input
            placeholder="Property"
            value={property.key}
            onChange={(e) => update(index, "key", e.target.value)}
          />
          <select value={property.type} onChange={(e) => update(index, "type", e.target.value)}>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            placeholder="Value"
            value={property.value}
            onChange={(e) => update(index, "value", e.target.value)}
          />
          <button type="button" onClick={() => removeProperty(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addProperty}>Add property</button>
    </div>
  );
}
