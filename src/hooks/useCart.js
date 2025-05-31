// src/hooks/useCart.js
import { useMemo } from 'react';
import { useCartContext } from '../context/CartContext';

export function useCart() {
    const { state, dispatch } = useCartContext();

    const totals = useMemo(() => {
        const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const hasError = subtotal > 999.99;
        const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

        return {
            subtotal,
            total: subtotal,
            hasError,
            itemCount
        };
    }, [state.items]);

    return {
        items: state.items,
        ...totals,
        dispatch
    };
}