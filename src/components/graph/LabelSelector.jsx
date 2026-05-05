import React from "react";

export default function LabelSelector({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Comma-separated labels, e.g. Product,Premium"
    />
  );
}
