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

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function firstText(...candidates) {
  for (const value of candidates) {
    if (value == null) continue;
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function readBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  const text = normalizeText(value);
  if (!text) return null;
  if (["true", "1", "yes", "si", "sí", "available", "disponible"].includes(text)) return true;
  if (["false", "0", "no", "unavailable", "agotado", "no disponible"].includes(text)) return false;
  return null;
}

function mapProduct(product) {
  const rawId =
    product.idProducto ??
    product.id ??
    product._id ??
    product.sku ??
    product.codigo;
  const brandSource = product.marca ?? product.brand;
  const categorySource = product.categoria ?? product.category;
  const availableSource =
    product.disponible ??
    product.available ??
    product.inStock ??
    product.activo ??
    product.stock ??
    product.existencias ??
    product.cantidad;

  const brandName =
    typeof brandSource === "object" && brandSource !== null
      ? firstText(
          brandSource.nombre,
          brandSource.name,
          brandSource.nombreMarca,
          brandSource.marca
        )
      : firstText(brandSource, product.nombreMarca);

  const categoryName =
    typeof categorySource === "object" && categorySource !== null
      ? firstText(
          categorySource.nombre,
          categorySource.name,
          categorySource.nombreCategoria,
          categorySource.categoria
        )
      : firstText(categorySource, product.nombreCategoria);

  const brandId =
    typeof brandSource === "object" && brandSource !== null
      ? firstText(brandSource.idMarca, brandSource.id, brandSource.codigo)
      : firstText(product.idMarca, product.brandId, product.marcaId);

  const categoryId =
    typeof categorySource === "object" && categorySource !== null
      ? firstText(categorySource.idCategoria, categorySource.id, categorySource.codigo)
      : firstText(product.idCategoria, product.categoryId, product.categoriaId);

  return {
    id: rawId != null ? String(rawId) : undefined,
    idProducto: rawId != null ? String(rawId) : undefined,
    name: product.nombre || product.name,
    price: Number(product.precio ?? product.price ?? 0),
    image: product.image || "/images/default-watch.jpg",
    description: product.descripcion || product.description || "No description",
    brand: brandName,
    brandId,
    category: categoryName,
    categoryId,
    available: readBool(availableSource),
  };
}

function applySearchFilter(products, term) {
  const query = String(term || "").trim().toLowerCase();
  if (!query) return products;

  return products.filter((product) => {
    const haystack = [
      product.id,
      product.idProducto,
      product.name,
      product.description,
      product.brand,
      product.brandId,
      product.category,
      product.categoryId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

function applyCatalogFilters(products, filters) {
  const selectedBrand = normalizeText(filters.brand);
  const selectedCategory = normalizeText(filters.category);
  const selectedAvailability = filters.available === "" ? null : filters.available === "true";
  const hasMinPrice = filters.minPrice !== "";
  const hasMaxPrice = filters.maxPrice !== "";
  const minPrice = Number(filters.minPrice);
  const maxPrice = Number(filters.maxPrice);

  return products.filter((product) => {
    if (selectedBrand) {
      const brandCandidates = [product.brand, product.brandId].map(normalizeText).filter(Boolean);
      if (!brandCandidates.includes(selectedBrand)) return false;
    }
    if (selectedCategory) {
      const categoryCandidates = [product.category, product.categoryId].map(normalizeText).filter(Boolean);
      if (!categoryCandidates.includes(selectedCategory)) return false;
    }
    if (selectedAvailability !== null && product.available !== null && product.available !== selectedAvailability) {
      return false;
    }
    if (selectedAvailability !== null && product.available === null) return false;
    if (hasMinPrice && Number.isFinite(minPrice) && product.price < minPrice) return false;
    if (hasMaxPrice && Number.isFinite(maxPrice) && product.price > maxPrice) return false;
    return true;
  });
}

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
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
    setFilters((prev) => {
      if (prev.search === searchFromUrl) return prev;
      return { ...prev, search: searchFromUrl };
    });
    setPage(1);
  }, [searchFromUrl]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestFilters = {
          search: filters.search || undefined,
          brand: filters.brand || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          available: filters.available || undefined,
        };
        const response = await catalogService.getProducts(requestFilters);
        let payload = response.data ?? response;
        let items = extractList(payload);

        const hasNonSearchFilter = Boolean(
          filters.brand || filters.category || filters.minPrice || filters.maxPrice || filters.available
        );

        // If backend filtering returns no rows, retry without filters and apply locally.
        if (items.length === 0 && hasNonSearchFilter) {
          const fallbackResponse = await catalogService.getProducts({});
          payload = fallbackResponse.data ?? fallbackResponse;
          items = extractList(payload);
        }

        const mapped = items.map(mapProduct);
        const textFiltered = applySearchFilter(mapped, filters.search);
        const filtered = applyCatalogFilters(textFiltered, filters);
        setProducts(filtered);
        setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
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
                <option
                  key={brand.idMarca || brand.id || brand.nombre || brand.name}
                  value={brand.idMarca || brand.id || brand.nombre || brand.name}
                >
                  {brand.nombre || brand.name}
                </option>
              ))}
            </select>
            <select className="catalog-filter-input" name="category" value={filters.category} onChange={onFilterChange}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option
                  key={category.idCategoria || category.id || category.nombre || category.name}
                  value={category.idCategoria || category.id || category.nombre || category.name}
                >
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