import React, { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import '../styles/components/FavoriteButton.css';

export default function FavoriteButton({ product }) {
    const { toggleFavorite, isFavorite } = useFavorites();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAnimating(true);
        toggleFavorite(product);

        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <button
            className={`favorite-btn ${isFavorite(product.id) ? 'favorited' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleClick}
            title={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
            {isFavorite(product.id) ? '❤️' : '🤍'}
        </button>
    );
}