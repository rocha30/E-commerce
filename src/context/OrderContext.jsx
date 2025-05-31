import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
    const [pendingOrder, setPendingOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);

    const savePendingOrder = (orderData) => {
        setPendingOrder({
            ...orderData,
            timestamp: Date.now(),
            orderId: `EX${Date.now().toString().slice(-6)}`
        });
    };

    const confirmOrder = () => {
        if (pendingOrder) {
            setOrderHistory(prev => [...prev, { ...pendingOrder, status: 'confirmed' }]);
            setPendingOrder(null);
            return true;
        }
        return false;
    };

    const cancelOrder = () => {
        setPendingOrder(null);
    };

    const clearOrderHistory = () => {
        setOrderHistory([]);
    };

    return (
        <OrderContext.Provider value={{
            pendingOrder,
            orderHistory,
            savePendingOrder,
            confirmOrder,
            cancelOrder,
            clearOrderHistory
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within OrderProvider');
    }
    return context;
};

