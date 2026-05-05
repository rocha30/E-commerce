import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { catalogService } from "../services/catalogService";
import "../styles/Catalog.css";

function mapProduct(product) {
  return {
    id: product.idProducto || product.id,
    idProducto: product.idProducto || product.id,
    name: product.nombre || product.name,
    price: Number(product.precio ?? product.price ?? 0),
    originalPrice: Number(product.precioOriginal ?? product.originalPrice ?? 0) || null,
    image: product.image || "/images/default-watch.jpg",
    description: product.descripcion || product.description || "No description",
    discount: Number(product.descuento ?? product.discount ?? 0),
  };
}

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    brand: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    available: "",
  });

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          catalogService.getBrands(),
          catalogService.getCategories(),
        ]);
        setBrands(brandsResponse.data || brandsResponse || []);
        setCategories(categoriesResponse.data || categoriesResponse || []);
      } catch (err) {
        setError(err.message);
      }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await catalogService.getProducts({
          page,
          limit: 12,
          search: filters.search || undefined,
          brand: filters.brand || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          available: filters.available || undefined,
        });
        const payload = response.data || response;
        const items = payload.items || payload.products || [];
        setProducts(items.map(mapProduct));
        setTotalPages(Number(payload.totalPages || 1));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters, page]);

  const canGoBack = useMemo(() => page > 1, [page]);
  const canGoNext = useMemo(() => page < totalPages, [page, totalPages]);

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <main className="catalog-container">
        <h1 className="catalog-title">Collection</h1>

        <section className="catalog-filters-section">
          <div className="catalog-filters-grid">
            <input className="catalog-filter-input" name="search" placeholder="Search..." value={filters.search} onChange={onFilterChange} />
            <select className="catalog-filter-input" name="brand" value={filters.brand} onChange={onFilterChange}>
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand.idMarca || brand.id || brand.name} value={brand.nombre || brand.name}>
                  {brand.nombre || brand.name}
                </option>
              ))}
            </select>
            <select className="catalog-filter-input" name="category" value={filters.category} onChange={onFilterChange}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.idCategoria || category.id || category.name} value={category.nombre || category.name}>
                  {category.nombre || category.name}
                </option>
              ))}
            </select>
            <input className="catalog-filter-input" type="number" name="minPrice" placeholder="Min price" value={filters.minPrice} onChange={onFilterChange} />
            <input className="catalog-filter-input" type="number" name="maxPrice" placeholder="Max price" value={filters.maxPrice} onChange={onFilterChange} />
            <select className="catalog-filter-input" name="available" value={filters.available} onChange={onFilterChange}>
              <option value="">Availability</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </section>

        {loading && <p className="catalog-status">Loading catalog...</p>}
        {error && <p className="catalog-status">Error: {error}</p>}

        {!loading && !error && (
          <section className="models-section">
            <div className="models-grid">
              {products.map((model) => (
                <ProductCard key={model.idProducto} {...model} />
              ))}
            </div>
            {products.length === 0 && <p className="catalog-status">No products found for the selected filters.</p>}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <button className="back-to-brands-btn" onClick={() => setPage((p) => p - 1)} disabled={!canGoBack}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button className="back-to-brands-btn" onClick={() => setPage((p) => p + 1)} disabled={!canGoNext}>
                Next
              </button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}