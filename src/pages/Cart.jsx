import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import { useCart } from '../hooks/useCart';
import '../styles/components/Cart.css';

export default function Cart() {
    const { items, total, hasError, itemCount, dispatch } = useCart();

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <>
            <Navbar />
            <main className="cart-container">
                <h1>Tu Carrito ({itemCount} productos)</h1>

                {items.length === 0 ? (
                    <div className="empty-cart">
                        <p>No hay productos en tu carrito.</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {items.map(item => (
                                <CartItem key={item.id} {...item} />
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="cart-total">
                                <h3>Total: ${total.toFixed(2)}</h3>
                                {hasError && (
                                    <p className="cart-error">ERROR: El total excede $999.99</p>
                                )}
                            </div>

                            <div className="cart-actions">
                                <button onClick={clearCart} className="clear-btn">
                                    Vaciar Carrito
                                </button>
                                <button
                                    disabled={hasError || items.length === 0}
                                    className="checkout-btn"
                                >
                                    {hasError ? 'Total excede límite' : 'Comprar'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}