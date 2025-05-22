import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchBrands, fetchModels } from '../../backend/services/watchServices.js'
import '../styles/Catalog.css'

export default function Catalog() {
    const [brands, setBrands] = useState([])
    const [selectedBrand, setSelected] = useState(null)
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // 1) Carga brands al montar
    useEffect(() => {
        fetchBrands()
            .then(res => {
                setBrands(res.data || [])
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    // 2) Carga models cuando seleccionas una brand
    useEffect(() => {
        if (!selectedBrand) return
        setLoading(true)
        fetchModels(selectedBrand)
            .then(res => {
                setModels(res.data || [])
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [selectedBrand])

    if (loading) return <div>Cargando catálogo…</div>
    if (error) return <div>Error: {error}</div>

    return (
        <>
            <Navbar />

            <main className="catalog">
                <section>
                    <h2>Marcas</h2>
                    <ul>
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
                        <h2>Modelos de {selectedBrand}</h2>
                        <ul>
                            {models.map(m => (
                                <li key={m.id}>{m.name}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>

            <Footer />
        </>
    )
}