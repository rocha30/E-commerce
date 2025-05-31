import React, { useState } from 'react';
import '../styles/components/ProductReviews.css';

export default function ProductReviews({ productId }) {
    const [showAllReviews, setShowAllReviews] = useState(false);

    const [reviews] = useState([
        { id: 1, user: "Carlos M.", rating: 5, comment: "Excelente calidad, superó mis expectativas" },
        { id: 2, user: "Ana L.", rating: 4, comment: "Muy elegante, perfecto para ocasiones especiales" },
        { id: 3, user: "Miguel R.", rating: 5, comment: "Increíble precisión y diseño impecable" },
        { id: 4, user: "Sofia P.", rating: 4, comment: "Vale cada centavo, altamente recomendado" }
    ]);

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2); // ⭐ MOSTRAR SOLO 2 INICIALMENTE

    const StarRating = ({ rating }) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : 'empty'}`}
                    >
                        ⭐
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="product-reviews">
            <div className="reviews-header">
                <h3>Reviews de Clientes</h3>
                <div className="rating-summary">
                    <StarRating rating={averageRating} />
                    <span className="rating-text">
                        {averageRating.toFixed(1)}/5 ({reviews.length} reviews)
                    </span>
                </div>
            </div>

            <div className="reviews-list">
                {displayedReviews.map(review => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <strong className="reviewer-name">{review.user}</strong>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="review-comment">{review.comment}</p>
                    </div>
                ))}
            </div>

            {/* ⭐ BOTÓN PARA VER MÁS/MENOS REVIEWS */}
            {reviews.length > 2 && (
                <button
                    className="toggle-reviews-btn"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                >
                    {showAllReviews ? 'Ver menos reviews' : `Ver todas las reviews (${reviews.length})`}
                </button>
            )}
        </div>
    );
}