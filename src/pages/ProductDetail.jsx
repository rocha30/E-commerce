import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductReviews from "../components/ProductReviews";
import DiscountBadge from "../components/DiscountBadge";
import FavoriteButton from "../components/FavoriteButton";
import { useCart } from "../hooks/useCart";
import { catalogService } from "../services/catalogService";
import { userBehaviorService } from "../services/userBehaviorService";
import "../styles/components/ProductDetail.css";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";

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

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        await userBehaviorService.trackView(DEFAULT_USER_ID, loadedProduct.idProducto, {
          secondsOnPage: 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    await dispatch({ type: "ADD_TO_CART", product });
  };

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
          <DiscountBadge discount={product.discount} />
          <FavoriteButton product={product} />
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <h1>{product.name}</h1>
          <p className="product-detail__description">{product.description}</p>
          <div className="price-container">
            {product.originalPrice ? (
              <>
                <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                <span className="current-price">${product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="current-price">${product.price.toLocaleString()}</span>
            )}
          </div>
          <div className="product-actions">
            <button onClick={addToCart} className="add-to-cart-btn">Add to Cart</button>
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
