import React from 'react';
import '../styles/components/BrandSelector.css';

export default function BrandSelector({ brands, selectedBrand, onSelect }) {
    return (
        <section className="brands-section">
            <h2 className="catalog-title"></h2>

            {/* Si no hay marca seleccionada, mostrar todas */}
            {!selectedBrand && (
                <div className="brands-grid">
                    {brands.map(brand => (
                        <div
                            key={brand.id}
                            className="brand-card"
                            onClick={() => onSelect(brand.name)}
                        >
                            <div className="brand-image">
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    onError={(e) => {
                                        e.target.src = '/assets/images/placeholder-brand.jpg';
                                    }}
                                />
                            </div>
                            <div className="brand-content">
                                <h3 className="brand-name">{brand.name}</h3>
                                <p className="brand-description">{brand.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Si hay marca seleccionada, SOLO mostrar el botón de regreso */}
            {selectedBrand && (
                <div className="selected-brand-container">
                    <button
                        className="back-to-brands-btn"
                        onClick={() => onSelect(null)}
                    >
                        ← Volver a todas las marcas
                    </button>
                </div>
            )}
        </section>
    );
}