import React, { createContext, useContext, useReducer } from 'react';


const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            {
                const existing = state.items.find(item => item.id === action.product.id);
                if (existing) {
                    return {
                        ...state,
                        items: state.items.map(item =>
                            item.id === action.product.id
                                ? { ...item, quantity: Math.min(item.quantity + 1, 9) }
                                : item
                        )
                    };
                }
                return {
                    ...state,
                    items: [...state.items, { ...action.product, quantity: 1 }]
                };
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.id)
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.id
                        ? { ...item, quantity: Math.max(0, Math.min(action.quantity, 9)) }
                        : item
                )
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
}