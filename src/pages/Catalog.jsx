import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BrandSelector from '../components/BrandSelector';
import ModelsList from '../components/ModelsList';
import { fetchBrands, fetchModels } from '../data/mockData';
import '../styles/Catalog.css';

export default function Catalog() {
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelected] = useState(null);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBrands()
            .then(res => setBrands(res.data || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedBrand) return;
        setLoading(true);
        fetchModels(selectedBrand)
            .then(res => setModels(res.data || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [selectedBrand]);

    if (loading) return <p className="catalog-status">Cargando catálogo…</p>;
    if (error) return <p className="catalog-status">Error: {error}</p>;

    return (
        <>
            <Navbar />
            <main className="catalog-container">
                <BrandSelector
                    brands={brands}
                    selectedBrand={selectedBrand}
                    onSelect={setSelected}
                />
                <ModelsList
                    selectedBrand={selectedBrand}
                    models={models}
                />
            </main>
            <Footer />
        </>
    );
}