// src/hooks/useCart.js
import { useState, useMemo } from 'react';

/**
 * Hook que devuelve los items del carrito y el precio total.
 * Por ahora usa datos estáticos de ejemplo.
 */
export function useCart() {
    // Items estáticos de ejemplo; en el futuro los cargarás de contexto o localStorage
    const [items] = useState([
        {
            id: '1',
            name: 'Rolex Datejust',
            price: 6500,
            quantity: 1,
            image: '/assets/rolex-datejust.jpg'
        },
        // …más items si quieres…
    ]);

    // Calculamos el total con useMemo para que solo se recalcule cuando cambien los items
    const totalPrice = useMemo(
        () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        [items]
    );

    return { items, totalPrice };
}
