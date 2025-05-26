import React from 'react';

export default function BrandSelector({ brands, selectedBrand, onSelect }) {
    return (
        <section className="brands-section">
            <h2 className="catalog-title">Marcas de Lujo</h2>
            <div className="brands-grid">
                {brands.map(brand => (
                    <button
                        key={brand.id}
                        className={`brand-card ${selectedBrand === brand.name ? 'selected' : ''}`}
                        onClick={() => onSelect(brand.name)}
                    >
                        {brand.name}
                    </button>
                ))}
            </div>
        </section>
    );
}
