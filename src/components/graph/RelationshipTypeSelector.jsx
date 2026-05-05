import React from "react";

export default function RelationshipTypeSelector({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Type, e.g. PURCHASED" />;
}
