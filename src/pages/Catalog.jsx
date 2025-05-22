import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchBrands, fetchModels } from '../server/services/WatchService';
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
                <section>
                    <h2 className="catalog-title">Marcas</h2>
                    <ul className="catalog-grid">
                        {brands.map(b => (
                            <li key={b.id}>
                                <button onClick={() => setSelected(b.name)}>
                                    {b.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                {selectedBrand && (
                    <section>
                        <h2 className="catalog-title">Modelos de {selectedBrand}</h2>
                        <ul className="catalog-grid">
                            {models.map(m => (
                                <li key={m.id}>{m.name}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>

            <Footer />
        </>
    );
}
