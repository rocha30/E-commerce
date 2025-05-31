
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductReviews from '../components/ProductReviews';
import DiscountBadge from '../components/DiscountBadge';
import FavoriteButton from '../components/FavoriteButton';
import { useCart } from '../hooks/useCart';
import { mockModels } from '../data/mockData';
import '../styles/components/ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const { dispatch } = useCart();

    const product = Object.values(mockModels)
        .flat()
        .find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="product-not-found">
                    <h1>Producto no encontrado</h1>
                    <Link to="/catalog">Volver al catálogo</Link>
                </div>
                <Footer />
            </>
        );
    }

    const addToCart = () => {
        dispatch({ type: 'ADD_TO_CART', product });
    };

    return (
        <>
            <Navbar />


            <Link to="/catalog" className="back-btn-floating">
                ← Volver al Catálogo
            </Link>

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
                        <button onClick={addToCart} className="add-to-cart-btn">
                            Agregar al Carrito
                        </button>
                        <Link to="/catalog" className="back-link-inline">
                            ← Continuar Comprando
                        </Link>
                    </div>
                </div>
            </main>


            <section className="reviews-section">
                <ProductReviews productId={product.id} />
            </section>

            <Footer />
        </>
    );
}
