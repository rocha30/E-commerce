import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../services/apiClient";
import { catalogService } from "../services/catalogService";
import { extractList } from "../utils/normalizeApi";
import "../styles/Catalog.css";

const PAGE_SIZE = 12;

function mapProduct(product) {
  const rawId =
    product.idProducto ??
    product.id ??
    product._id ??
    product.sku ??
    product.codigo;
  return {
    id: rawId != null ? String(rawId) : undefined,
    idProducto: rawId != null ? String(rawId) : undefined,
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
  const [filterWarning, setFilterWarning] = useState(null);

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
      setFilterWarning(null);
      try {
        const [brandsResponse, categoriesResponse] = await Promise.allSettled([
          catalogService.getBrands(),
          catalogService.getCategories(),
        ]);
        const warnings = [];
        if (brandsResponse.status === "fulfilled") {
          const raw = brandsResponse.value?.data ?? brandsResponse.value;
          setBrands(extractList(raw));
        } else {
          setBrands([]);
          warnings.push(`Brands: ${brandsResponse.reason?.message || brandsResponse.reason}`);
        }
        if (categoriesResponse.status === "fulfilled") {
          const raw = categoriesResponse.value?.data ?? categoriesResponse.value;
          setCategories(extractList(raw));
        } else {
          setCategories([]);
          warnings.push(`Categories: ${categoriesResponse.reason?.message || categoriesResponse.reason}`);
        }
        setFilterWarning(warnings.length ? warnings.join(" · ") : null);
      } catch (err) {
        setFilterWarning(err.message);
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
          search: filters.search || undefined,
          brand: filters.brand || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          available: filters.available || undefined,
        });
        const payload = response.data ?? response;
        const items = extractList(payload);
        const mapped = items.map(mapProduct);
        setProducts(mapped);
        setTotalPages(Math.max(1, Math.ceil(mapped.length / PAGE_SIZE)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters]);

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

        {filterWarning && (
          <p className="catalog-status" style={{ marginBottom: 12 }}>
            Filters: {filterWarning}
          </p>
        )}

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
        {error && (
          <div className="catalog-status" style={{ marginBottom: 16 }}>
            <p style={{ margin: "0 0 8px" }}>Error: {error}</p>
            <p style={{ margin: 0, fontSize: "0.9em", opacity: 0.85 }}>
              API base in use: <code>{API_BASE_URL}</code>
              {" — "}
              Set <code>VITE_API_URL</code> in <code>.env</code> to match your backend (include <code>/api</code> only if routes are mounted there), then restart{" "}
              <code>npm run dev</code>.
            </p>
          </div>
        )}

        {!loading && !error && (
          <section className="models-section">
            <div className="models-grid">
              {products
                .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                .map((model) => (
                <ProductCard key={model.idProducto || model.id} {...model} />
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