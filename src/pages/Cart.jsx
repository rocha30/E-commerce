
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import { useCart } from '../hooks/useCart';
import '../styles/components/Cart.css';
import '../styles/components/CheckoutModal.css';

// ... resto del código igual que antes

export default function Cart() {
    const { items, total, hasError, itemCount, dispatch } = useCart();
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const handleCheckout = () => {
        setShowCheckoutModal(true);
    };

    const handleConfirmOrder = async () => {
        setIsProcessing(true);

        // Simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setOrderConfirmed(true);

        // Auto cerrar y limpiar
        setTimeout(() => {
            setShowCheckoutModal(false);
            setOrderConfirmed(false);
            clearCart();
        }, 3000);
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
                    <h1>Tu Carrito</h1>
                    <div className="cart-count">
                        <span className="count-badge">{itemCount}</span>
                        <span className="count-text">
                            {itemCount === 1 ? 'producto' : 'productos'}
                        </span>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>¡Descubre nuestra increíble colección de relojes de lujo!</p>
                        <Link to="/catalog" className="continue-shopping-btn">
                            Explorar Catálogo
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
                                <h3>Resumen del Pedido</h3>

                                <div className="summary-line">
                                    <span>Productos ({itemCount})</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <div className="summary-line">
                                    <span>Envío</span>
                                    <span className="free-shipping">GRATIS</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span>Total</span>
                                    <span className="total-amount">${total.toFixed(2)}</span>
                                </div>

                                {hasError && (
                                    <div className="cart-error">
                                        <span>⚠️</span>
                                        <span>El total excede el límite de $999.99</span>
                                    </div>
                                )}

                                <div className="cart-actions">
                                    <button
                                        disabled={hasError || items.length === 0}
                                        className="checkout-btn"
                                        onClick={handleCheckout}
                                    >
                                        {hasError ? 'Total excede límite' : 'Proceder al Pago'}
                                    </button>

                                    <button onClick={clearCart} className="clear-btn">
                                        Vaciar Carrito
                                    </button>

                                    <Link to="/catalog" className="continue-shopping-link">
                                        ← Continuar Comprando
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
                                    <h2>Confirmar Compra</h2>
                                    <button className="close-btn" onClick={handleCloseModal}>×</button>
                                </div>

                                <div className="modal-body">
                                    <div className="order-summary">
                                        <h3>Resumen del Pedido</h3>
                                        <div className="summary-items">
                                            {items.map(item => (
                                                <div key={item.id} className="summary-item">
                                                    <img src={item.image} alt={item.name} />
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-quantity">Cantidad: {item.quantity}</span>
                                                    </div>
                                                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="total-section">
                                            <div className="total-line">
                                                <span>Productos ({itemCount})</span>
                                                <span>${total.toFixed(2)}</span>
                                            </div>
                                            <div className="total-line">
                                                <span>Envío</span>
                                                <span className="free">GRATIS</span>
                                            </div>
                                            <div className="total-final">
                                                <span>Total a Pagar</span>
                                                <span>${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="payment-info">
                                        <h3>Información de Entrega</h3>
                                        <div className="delivery-info">
                                            <div className="info-item">
                                                <span className="icon">📍</span>
                                                <span>Entrega a domicilio gratuita</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="icon">⏰</span>
                                                <span>Tiempo estimado: 3-5 días hábiles</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="icon">🔒</span>
                                                <span>Pago 100% seguro</span>
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
                                        Cancelar
                                    </button>
                                    <button
                                        className="confirm-btn"
                                        onClick={handleConfirmOrder}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Confirmar Compra'
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="success-message">
                                <div className="success-icon">✅</div>
                                <h2>¡Compra Confirmada!</h2>
                                <p>Tu pedido ha sido procesado exitosamente</p>
                                <p className="order-number">Número de orden: #EX{Date.now().toString().slice(-6)}</p>
                                <p className="success-note">Recibirás un email de confirmación en breve</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}