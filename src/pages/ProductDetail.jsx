import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useProductHistory } from '../hooks/useProductHistory';
import { mockModels } from '../data/mockData';
import '../styles/components/ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const { dispatch } = useCart();
    const { addToHistory } = useProductHistory();

    const product = Object.values(mockModels)
        .flat()
        .find(p => p.id === parseInt(id));

    useEffect(() => {
        if (product) {
            addToHistory(product);
        }
    }, [product, addToHistory]);

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
            <main className="product-detail">
                <div className="product-detail__image">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="product-detail__info">
                    <h1>{product.name}</h1>
                    <p className="product-detail__description">{product.description}</p>
                    <p className="product-detail__price">${product.price.toLocaleString()}</p>
                    <button onClick={addToCart} className="add-to-cart-btn">
                        Agregar al Carrito
                    </button>
                    <Link to="/catalog" className="back-link">
                        ← Volver al catálogo
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}
