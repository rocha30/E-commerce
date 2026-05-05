import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Catalog from "./pages/Catalog.jsx"
import ProductDetail from "./pages/ProductDetail.jsx"
import Cart from "./pages/Cart.jsx"
import SearchPage from "./pages/SearchPage.jsx"
import RecommendationsPage from "./pages/RecommendationsPage.jsx"
import GraphDashboard from "./pages/admin/GraphDashboard.jsx"
import NodesPage from "./pages/admin/NodesPage.jsx"
import NodeCreatePage from "./pages/admin/NodeCreatePage.jsx"
import NodeDetailPage from "./pages/admin/NodeDetailPage.jsx"
import RelationshipsPage from "./pages/admin/RelationshipsPage.jsx"
import RelationshipCreatePage from "./pages/admin/RelationshipCreatePage.jsx"
import CsvImportPage from "./pages/admin/CsvImportPage.jsx"
import QueriesPage from "./pages/admin/QueriesPage.jsx"
import GraphDiagnosticsPage from "./pages/admin/GraphDiagnosticsPage.jsx"
import RubricStatusPage from "./pages/admin/RubricStatusPage.jsx"
import CustomerCarePage from "./pages/CustomerCarePage.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/collections" element={<Catalog />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/admin" element={<GraphDashboard />} />
      <Route path="/admin/nodes" element={<NodesPage />} />
      <Route path="/admin/nodes/create" element={<NodeCreatePage />} />
      <Route path="/admin/nodes/:elementId" element={<NodeDetailPage />} />
      <Route path="/admin/relationships" element={<RelationshipsPage />} />
      <Route path="/admin/relationships/create" element={<RelationshipCreatePage />} />
      <Route path="/admin/import" element={<CsvImportPage />} />
      <Route path="/admin/queries" element={<QueriesPage />} />
      <Route path="/admin/diagnostics" element={<GraphDiagnosticsPage />} />
      <Route path="/admin/rubric" element={<RubricStatusPage />} />
      <Route path="/contact" element={<CustomerCarePage pageKey="contact" />} />
      <Route path="/shipping" element={<CustomerCarePage pageKey="shipping" />} />
      <Route path="/returns" element={<CustomerCarePage pageKey="returns" />} />
      <Route path="/warranty" element={<CustomerCarePage pageKey="warranty" />} />
      <Route path="/size-guide" element={<CustomerCarePage pageKey="size-guide" />} />
    </Routes>
  )
}