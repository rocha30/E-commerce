import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import { useCart } from "../hooks/useCart";
import { userBehaviorService } from "../services/userBehaviorService";
import "../styles/components/Cart.css";
import "../styles/components/CheckoutModal.css";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";

export default function Cart() {
    const { items, total, hasError, itemCount, dispatch, loading, error } = useCart();
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const clearCart = async () => {
        await dispatch({ type: "CLEAR_CART" });
    };

    const handleCheckout = () => {
        setShowCheckoutModal(true);
    };

    const handleConfirmOrder = async () => {
        setIsProcessing(true);
        try {
            const response = await userBehaviorService.createOrder(DEFAULT_USER_ID, {
                items: items.map((item) => ({ idProducto: item.idProducto || item.id, cantidad: item.quantity })),
            });
            setOrderId(response.idPedido || response.orderId || "NO-ID");
            setOrderConfirmed(true);
            await clearCart();
            setTimeout(() => {
                setShowCheckoutModal(false);
                setOrderConfirmed(false);
                setOrderId(null);
            }, 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseModal = () => {
        if (!isProcessing) {
            setShowCheckoutModal(false);
            setOrderConfirmed(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="cart-container">
                <div className="cart-header">
                    <h1>Your Cart</h1>
                    <div className="cart-count">
                        <span className="count-badge">{itemCount}</span>
                        <span className="count-text">
                            {itemCount === 1 ? "item" : "items"}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-cart"><h2>Loading cart...</h2></div>
                ) : items.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Explore our premium collection of luxury watches.</p>
                        <Link to="/catalog" className="continue-shopping-btn">
                            Explore Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {items.map(item => (
                                <CartItem key={item.id} {...item} />
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-card">
                                <h3>Order Summary</h3>

                                <div className="summary-line">
                                    <span>Items ({itemCount})</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <div className="summary-line">
                                    <span>Shipping</span>
                                    <span className="free-shipping">FREE</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span>Total</span>
                                    <span className="total-amount">${total.toFixed(2)}</span>
                                </div>

                                {(hasError || error) && (
                                    <div className="cart-error">
                                        <span>⚠️</span>
                                        <span>{error || "The total exceeds the allowed limit"}</span>
                                    </div>
                                )}

                                <div className="cart-actions">
                                    <button
                                        disabled={hasError || items.length === 0}
                                        className="checkout-btn"
                                        onClick={handleCheckout}
                                    >
                                        {hasError ? "Total exceeds limit" : "Proceed to Checkout"}
                                    </button>

                                    <button onClick={clearCart} className="clear-btn">
                                        Clear Cart
                                    </button>

                                    <Link to="/catalog" className="continue-shopping-link">
                                        ← Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ⭐ MODAL SIMPLE INTEGRADO */}
            {showCheckoutModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {!orderConfirmed ? (
                            <>
                                <div className="modal-header">
                                    <h2>Confirm Purchase</h2>
                                    <button className="close-btn" onClick={handleCloseModal}>×</button>
                                </div>

                                <div className="modal-body">
                                    <div className="order-summary">
                                        <h3>Order Summary</h3>
                                        <div className="summary-items">
                                            {items.map(item => (
                                                <div key={item.id} className="summary-item">
                                                    <img src={item.image} alt={item.name} />
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-quantity">Quantity: {item.quantity}</span>
                                                    </div>
                                                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="total-section">
                                            <div className="total-line">
                                                <span>Items ({itemCount})</span>
                                                <span>${total.toFixed(2)}</span>
                                            </div>
                                            <div className="total-line">
                                                <span>Shipping</span>
                                                <span className="free">FREE</span>
                                            </div>
                                            <div className="total-final">
                                                <span>Total to Pay</span>
                                                <span>${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="payment-info">
                                        <h3>Delivery Information</h3>
                                        <div className="delivery-info">
                                            <div className="info-item">
                                                <span className="icon">📍</span>
                                                <span>Free home delivery</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="icon">⏰</span>
                                                <span>Estimated time: 3-5 business days</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="icon">🔒</span>
                                                <span>100% secure payment</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCloseModal}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="confirm-btn"
                                        onClick={handleConfirmOrder}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            "Confirm Purchase"
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="success-message">
                                <div className="success-icon">✅</div>
                                <h2>Purchase Confirmed!</h2>
                                <p>Your order has been processed successfully.</p>
                                <p className="order-number">Order number: #{orderId || "NO-ID"}</p>
                                <p className="success-note">You will receive a confirmation email shortly.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}