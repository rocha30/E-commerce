import React from 'react';
import '../styles/components/DiscountBadge.css';

export default function DiscountBadge({ discount }) {
    if (!discount) return null;

    return (
        <div className="discount-badge">
            -{discount}%
        </div>
    );
}