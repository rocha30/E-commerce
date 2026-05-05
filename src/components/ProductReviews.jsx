import React, { useMemo, useState } from "react";
import "../styles/components/ProductReviews.css";

const fallbackReviews = [
  { id: 1, user: "Carlos M.", rating: 5, comment: "Excellent quality, it exceeded my expectations." },
  { id: 2, user: "Ana L.", rating: 4, comment: "Very elegant, perfect for special occasions." },
  { id: 3, user: "Miguel R.", rating: 5, comment: "Amazing precision and impeccable design." },
  { id: 4, user: "Sofia P.", rating: 4, comment: "Worth every cent, highly recommended." },
];

export default function ProductReviews({ reviews = [] }) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const resolvedReviews = useMemo(() => (reviews.length ? reviews : fallbackReviews), [reviews]);
    const averageRating = resolvedReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / resolvedReviews.length;
    const displayedReviews = showAllReviews ? resolvedReviews : resolvedReviews.slice(0, 2);

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
                <h3>Customer Reviews</h3>
                <div className="rating-summary">
                    <StarRating rating={averageRating} />
                    <span className="rating-text">
                        {averageRating.toFixed(1)}/5 ({reviews.length} reviews)
                    </span>
                </div>
            </div>

            <div className="reviews-list">
                {displayedReviews.map((review, index) => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <strong className="reviewer-name">{review.user || review.usuario || `User ${index + 1}`}</strong>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="review-comment">{review.comment || review.comentario || "No comment provided."}</p>
                    </div>
                ))}
            </div>

            {resolvedReviews.length > 2 && (
                <button
                    className="toggle-reviews-btn"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                >
                    {showAllReviews ? "Show fewer reviews" : `Show all reviews (${resolvedReviews.length})`}
                </button>
            )}
        </div>
    );
}