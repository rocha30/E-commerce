
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/Home.css'

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="home">
                {/* tu contenido Hero, secciones, etc. */}
            </main>
            <Footer />
        </>
    )
}