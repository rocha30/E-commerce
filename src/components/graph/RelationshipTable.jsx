import React from "react";

export default function RelationshipTable({ relationships = [], selectedIds = [], onToggle }) {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Id</th>
          <th>Type</th>
          <th>Source</th>
          <th>Target</th>
          <th>Direction</th>
        </tr>
      </thead>
      <tbody>
        {relationships.map((relationship) => (
          <tr key={relationship.elementId}>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.includes(relationship.elementId)}
                onChange={() => onToggle(relationship.elementId)}
              />
            </td>
            <td>{relationship.elementId}</td>
            <td>{relationship.type}</td>
            <td>{relationship.startNodeId}</td>
            <td>{relationship.endNodeId}</td>
            <td>{relationship.direction || "OUTGOING"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
