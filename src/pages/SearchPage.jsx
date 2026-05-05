import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SearchPage() {
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") || "").trim();
    navigate(`/catalog?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1>Search</h1>
        <form onSubmit={onSubmit} style={{ display: "flex", gap: 8 }}>
          <input name="search" placeholder="Search product..." />
          <button type="submit">Search</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
