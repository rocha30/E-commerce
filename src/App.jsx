import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Catalog from "./pages/Catalog.jsx"
// import Cart from "./pages/Cart.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  )
}


