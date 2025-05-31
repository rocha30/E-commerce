// src/hooks/useFavorites.js - VERSION con localStorage
import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        // Cargar favoritos del localStorage al inicializar
        const saved = localStorage.getItem('exquisit-time-favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Guardar en localStorage cada vez que cambien los favoritos
    useEffect(() => {
        localStorage.setItem('exquisit-time-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (product) => {
        setFavorites(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (!exists) {
                console.log(`❤️ ${product.name} agregado a favoritos`);
                return [...prev, product];
            }
            return prev;
        });
    };

    const removeFromFavorites = (productId) => {
        setFavorites(prev => {
            const filtered = prev.filter(p => p.id !== productId);
            const removed = prev.find(p => p.id === productId);
            if (removed) {
                console.log(`💔 ${removed.name} removido de favoritos`);
            }
            return filtered;
        });
    };

    const isFavorite = (productId) => {
        return favorites.some(p => p.id === productId);
    };

    const toggleFavorite = (product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
            return false;
        } else {
            addToFavorites(product);
            return true;
        }
    };

    return {
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        getFavorites: () => favorites,
        favoritesCount: favorites.length
    };
}