import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext'; // ⭐ IMPORTAR
import '../styles/components/CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose }) {
    const { pendingOrder, confirmOrder, cancelOrder } = useOrder(); // ⭐ USAR CONTEXT
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    if (!isOpen || !pendingOrder) return null;

    const handleConfirmOrder = async () => {
        setIsProcessing(true);

        // Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setOrderConfirmed(true);

        // ⭐ CONFIRMAR ORDEN EN CONTEXT
        confirmOrder();

        // Auto cerrar después de 3 segundos Y vaciar carrito
        setTimeout(() => {
            onClose(true); // ⭐ PASAR true PARA VACIAR CARRITO
            setOrderConfirmed(false);
        }, 3000);
    };

    const handleCancel = () => {
        // ⭐ CANCELAR ORDEN EN CONTEXT
        cancelOrder();
        onClose(false); // ⭐ PASAR false PARA NO VACIAR CARRITO
    };

    const { items, total, itemCount, orderId } = pendingOrder;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {!orderConfirmed ? (
                    <>
                        <div className="modal-header">
                            <h2>Confirm Purchase</h2>
                            <button className="close-btn" onClick={handleCancel}>×</button>
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
                                                <span className="item-quantity">Cantidad: {item.quantity}</span>
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
                                        <span>100% secure payment</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
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
                                    'Confirm Purchase'
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">✅</div>
                        <h2>Purchase Confirmed!</h2>
                        <p>Your order has been processed successfully.</p>
                        <p className="order-number">Número de orden: #{orderId}</p>
                        <p className="success-note">Recibirás un email de confirmación en breve</p>
                    </div>
                )}
            </div>
        </div>
    );
}