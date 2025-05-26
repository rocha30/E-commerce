import React from 'react';
import { useCart } from '../hooks/useCart';
import '../styles/components/CartItem.css';

export default function CartItem({ id, name, image, price, quantity }) {
    const { dispatch } = useCart();

    const updateQuantity = (newQuantity) => {
        if (newQuantity === 0) {
            dispatch({ type: 'REMOVE_FROM_CART', id });
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', id, quantity: newQuantity });
        }
    };

    return (
        <div className="cart-item">
            <img src={image} alt={name} className="cart-item__image" />
            <div className="cart-item__info">
                <h4>{name}</h4>
                <p>${price.toLocaleString()}</p>
            </div>
            <div className="cart-item__controls">
                <button
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                >
                    -
                </button>
                <span className="quantity">{quantity}</span>
                <button
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= 9}
                    className="quantity-btn"
                >
                    +
                </button>
            </div>
            <div className="cart-item__subtotal">
                ${(price * quantity).toFixed(2)}
            </div>
        </div>
    );
}
