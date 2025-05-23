// src/pages/Cart.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import '../components/CartItem'; // Asegúrate de tener estilos para el carrito

// Ejemplo de hook personalizado para manejar el carrito
// Si no lo tienes aún, reemplázalo por un array de ejemplo o implémentalo en src/hooks/useCart.js
import { useCart } from '../hooks/useCart';

export default function Cart() {
    const { items, totalPrice } = useCart(); // items: [{ id, name, price, quantity, image }]

    return (
        <>
            <Navbar />
            <main className="cart-container">
                <h1 className="cart-title">Tu Carrito</h1>

                {items.length === 0 ? (
                    <p className="cart-empty">No hay productos en tu carrito.</p>
                ) : (
                    <>
                        <ul className="cart-list">
                            {items.map(item => (
                                <li key={item.id}>
                                    <CartItem
                                        id={item.id}
                                        name={item.name}
                                        price={item.price}
                                        quantity={item.quantity}
                                        image={item.image}
                                    />
                                </li>
                            ))}
                        </ul>

                        <div className="cart-summary">
                            <span>Total:</span>
                            <strong>${totalPrice.toFixed(2)}</strong>
                        </div>

                        <button className="cart-checkout-button">
                            Ir a pagar
                        </button>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}
