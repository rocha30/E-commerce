import React from 'react';
import ProductCard from './ProductCard';
import '../styles/components/ModelsList.css';

export default function ModelsList({ selectedBrand, models }) {
    if (!selectedBrand) return null;

    return (
        <section className="models-section">
            <h2 className="catalog-title">Modelos de {selectedBrand}</h2>
            <div className="models-grid">
                {models.map(model => (
                    <ProductCard key={model.id} {...model} />
                ))}
            </div>
        </section>
    );

}