import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import DiscountBadge from './DiscountBadge';
import FavoriteButton from './FavoriteButton';
import '../styles/components/ProductCard.css';

export default function ProductCard({ id, name, price, originalPrice, discount, image, description }) {
    const { dispatch } = useCart();

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            product: { id, name, price, image, description }
        });
    };

    return (
        <div className="product-card">
            <DiscountBadge discount={discount} />
            <FavoriteButton product={{ id, name, price, image, description }} />

            <Link to={`/product/${id}`} className="product-link">
                <div className="product-image">
                    <img src={image} alt={name} />
                </div>
                <div className="product-info">
                    <h3>{name}</h3>
                    <p className="product-description">{description}</p>

                    <div className="price-container">
                        {originalPrice ? (
                            <>
                                <span className="original-price">${originalPrice.toLocaleString()}</span>
                                <span className="current-price">${price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="current-price">${price.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </Link>
            <button className="add-to-cart-btn" onClick={addToCart}>
                Agregar al Carrito
            </button>
        </div>
    );
}