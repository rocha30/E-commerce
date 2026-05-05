import React from "react";
import { Link } from "react-router-dom";

export default function AdminNav() {
  return (
    <nav className="admin-nav">
      <Link className="admin-nav__link" to="/admin">Dashboard</Link>
      <Link className="admin-nav__link" to="/admin/nodes">Nodes</Link>
      <Link className="admin-nav__link" to="/admin/relationships">Relationships</Link>
      <Link className="admin-nav__link" to="/admin/import">CSV Import</Link>
      <Link className="admin-nav__link" to="/admin/queries">Queries</Link>
      <Link className="admin-nav__link" to="/admin/diagnostics">Diagnostics</Link>
      <Link className="admin-nav__link" to="/admin/rubric">Rubric</Link>
    </nav>
  );
}
