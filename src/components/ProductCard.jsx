import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import '../styles/components/ProductCard.css';

export default function ProductCard({ id, name, price, image, description }) {
    const { dispatch } = useCart();

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            product: { id, name, price, image, description }
        });
    };

    return (
        <div className="product-card">
            <Link to={`/product/${id}`} className="product-link">
                <div className="product-image">
                    <img src={image} alt={name} />
                </div>
                <div className="product-info">
                    <h3>{name}</h3>
                    <p className="product-description">{description}</p>
                    <p className="product-price">${price.toLocaleString()}</p>
                </div>
            </Link>
            <button className="add-to-cart-btn" onClick={addToCart}>
                Agregar al Carrito
            </button>
        </div>
    );
}