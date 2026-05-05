import React, { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import "../styles/components/FavoriteButton.css";

export default function FavoriteButton({ product }) {
  const { toggleFavorite, isFavorite, loading } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const productId = product.idProducto || product.id;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    try {
      await toggleFavorite(product);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      className={`favorite-btn ${isFavorite(productId) ? "favorited" : ""} ${isAnimating ? "animating" : ""}`}
      onClick={handleClick}
      title={isFavorite(productId) ? "Remove from wishlist" : "Add to wishlist"}
      disabled={loading}
    >
      {isFavorite(productId) ? "❤️" : "🤍"}
    </button>
  );
}