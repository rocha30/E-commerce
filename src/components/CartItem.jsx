import React from 'react';
import { useCart } from '../hooks/useCart';
import '../styles/components/CartItem.css';

export default function CartItem({ id, name, price, image, quantity }) {
    const { dispatch } = useCart();

    const increaseQuantity = () => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            id: id,
            quantity: quantity + 1
        });
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            dispatch({
                type: 'UPDATE_QUANTITY',
                id: id,
                quantity: quantity - 1
            });
        }
    };

    const removeItem = () => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            id: id
        });
    };

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={image} alt={name} />
            </div>

            <div className="cart-item-info">
                <h3 className="cart-item-name">{name}</h3>
                <p className="cart-item-price">${price.toFixed(2)}</p>
            </div>

            {/* ⭐ CONTROLES DE CANTIDAD MEJORADOS */}
            <div className="quantity-controls">
                <button
                    className="quantity-btn decrease"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                >
                    −
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                    className="quantity-btn increase"
                    onClick={increaseQuantity}
                    disabled={quantity >= 9}
                >
                    +
                </button>
            </div>

            <div className="cart-item-total">
                <span className="item-total">${(price * quantity).toFixed(2)}</span>
            </div>

            <button className="remove-btn" onClick={removeItem}>
                🗑️
            </button>
        </div>
    );
}
