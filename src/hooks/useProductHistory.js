// src/hooks/useProductHistory.js
import { useRef } from 'react';

export function useProductHistory() {
    const historyRef = useRef([]);

    const addToHistory = (product) => {
        const history = historyRef.current;
        const existingIndex = history.findIndex(p => p.id === product.id);

        if (existingIndex > -1) {
            history.splice(existingIndex, 1);
        }

        history.unshift(product);
        if (history.length > 5) {
            history.pop();
        }
    };

    const getHistory = () => historyRef.current;

    return { addToHistory, getHistory };
}