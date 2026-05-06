import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductReviews from "../components/ProductReviews";
import FavoriteButton from "../components/FavoriteButton";
import { useUser } from "../context/UserContext";
import { useCart } from "../hooks/useCart";
import { catalogService } from "../services/catalogService";
import { userBehaviorService } from "../services/userBehaviorService";
import "../styles/components/ProductDetail.css";

function mapProduct(product) {
  return {
    id: product.idProducto || product.id,
    idProducto: product.idProducto || product.id,
    name: product.nombre || product.name,
    price: Number(product.precio ?? product.price ?? 0),
    image: product.image || "/images/default-watch.jpg",
    description: product.descripcion || product.description || "No description",
  };
}

export default function ProductDetail() {
  const { id } = useParams();
  const { userId } = useUser();
  const { items, dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productResponse, reviewsResponse, relatedResponse] = await Promise.all([
          catalogService.getProductById(id),
          catalogService.getReviews(id),
          catalogService.getRelatedProducts(id),
        ]);
        const loadedProduct = mapProduct(productResponse.data || productResponse);
        setProduct(loadedProduct);
        setReviews(reviewsResponse.data || reviewsResponse || []);
        const relRaw = relatedResponse?.data ?? relatedResponse;
        const relList = Array.isArray(relRaw)
          ? relRaw
          : relRaw?.items || relRaw?.products || [];
        setRelated(relList.map(mapProduct));
        await userBehaviorService.trackView(userId, loadedProduct.idProducto, {
          secondsOnPage: 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, userId]);

  const addToCart = async () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    try {
      if (isInCart) {
        await dispatch({
          type: "REMOVE_FROM_CART",
          id: product.idProducto || product.id,
        });
      } else {
        await dispatch({ type: "ADD_TO_CART", product });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const isInCart = useMemo(() => {
    if (!product) return false;
    const productId = String(product.idProducto || product.id);
    return items.some((item) => String(item.idProducto || item.id) === productId);
  }, [items, product]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="catalog-status">Loading product...</p>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="product-not-found">
          <h1>Product not found</h1>
          <p>{error || "The requested product was not found."}</p>
          <Link to="/catalog">Back to catalog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Link to="/catalog" className="back-btn-floating">← Back to Catalog</Link>
      <main className="product-detail">
        <div className="product-detail__image">
          <FavoriteButton product={product} />
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <h1>{product.name}</h1>
          <p className="product-detail__description">{product.description}</p>
          <div className="price-container">
            <span className="current-price">${product.price.toLocaleString()}</span>
          </div>
          <div className="product-actions">
            <button
              onClick={addToCart}
              className={`add-to-cart-btn${isInCart ? " add-to-cart-btn--added" : ""}`}
              disabled={isAdding}
            >
              {isAdding ? "Updating..." : isInCart ? "Remove from cart" : "Add to Cart"}
            </button>
            <Link to="/catalog" className="back-link-inline">← Continue Shopping</Link>
          </div>
        </div>
      </main>

      {related.length > 0 && (
        <section className="reviews-section">
          <h3>Related products</h3>
          <ul>
            {related.slice(0, 5).map((item) => (
              <li key={item.idProducto}>
                <Link to={`/product/${item.idProducto}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="reviews-section">
        <ProductReviews reviews={reviews} />
      </section>
      <Footer />
    </>
  );
}
