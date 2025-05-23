import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchBrands, fetchModels } from '../data/mockData';
import '../styles/Catalog.css';

export default function Catalog() {
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelected] = useState(null);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1) Carga brands al montar
    useEffect(() => {
        fetchBrands()
            .then(res => {
                setBrands(res.data || []);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // 2) Carga models cuando seleccionas una brand
    useEffect(() => {
        if (!selectedBrand) return;
        setLoading(true);
        fetchModels(selectedBrand)
            .then(res => {
                setModels(res.data || []);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedBrand]);

    if (loading) return <p className="catalog-status">Cargando catálogo…</p>;
    if (error) return <p className="catalog-status">Error: {error}</p>;

    return (
        <>
            <Navbar />

            <main className="catalog-container">
                <section className="brands-section">
                    <h2 className="catalog-title">Marcas de Lujo</h2>
                    <div className="brands-grid">
                        {brands.map(b => (
                            <button
                                key={b.id}
                                className={`brand-card ${selectedBrand === b.name ? 'selected' : ''}`}
                                onClick={() => setSelected(b.name)}
                            >
                                {b.name}
                            </button>
                        ))}
                    </div>
                </section>

                {selectedBrand && (
                    <section className="models-section">
                        <h2 className="catalog-title">Modelos de {selectedBrand}</h2>
                        <div className="models-grid">
                            {models.map(m => (
                                <div key={m.id} className="model-card">
                                    <div className="model-image">
                                        <img src={m.image} alt={m.name} />
                                    </div>
                                    <div className="model-info">
                                        <h3>{m.name}</h3>
                                        <p className="model-description">{m.description}</p>
                                        <p className="model-price">${m.price.toLocaleString()}</p>
                                        <button className="add-to-cart-btn">Agregar al Carrito</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </>
    );
}