import React from "react";
import { Link } from "react-router-dom";

export default function NodeTable({ nodes = [], selectedIds = [], onToggle }) {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Id</th>
          <th>Labels</th>
          <th>Properties</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((node) => (
          <tr key={node.elementId}>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.includes(node.elementId)}
                onChange={() => onToggle(node.elementId)}
              />
            </td>
            <td>{node.elementId}</td>
            <td>{(node.labels || []).join(", ")}</td>
            <td>{Object.keys(node.properties || {}).length}</td>
            <td><Link to={`/admin/nodes/${node.elementId}`}>Detail</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
