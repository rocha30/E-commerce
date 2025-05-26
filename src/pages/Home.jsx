import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

export default function Home() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <>
            <Navbar />

            <main className="home">
                {/* Sección Hero */}
                <section className="hero">
                    {/* Primera imagen de fondo */}
                    <div className="hero-image">
                        <img
                            src="/src/assets/images/Richard-Mille-RM-27-04-Rafael-Nadal-Cover.jpg"
                            alt="Richard Mille RM 27-04 Rafael Nadal"
                            className="hero-watch-image"
                        />
                    </div>

                    {/* Segunda imagen de fondo para parallax */}
                    <div
                        className="hero-image"
                        style={{
                            transform: `translateY(${-scrollY * 0.5}px)`,
                            backgroundImage: `url(/src/assets/images/Richard-Mille-RM-27-04-Rafael-Nadal-Cover.jpg)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Texto del hero */}
                    <div className="hero-text">
                        <h1 className="hero-title">
                            RICHARD<br />
                            MILLE
                        </h1>
                        <p className="hero-subtitle">
                            RM 27-04 TIMEPIECE
                        </p>
                    </div>

                    {/* Indicador de scroll */}
                    <div className="scroll-indicator">
                        <div className="scroll-line"></div>
                        <div className="scroll-text">SCROLL</div>
                    </div>
                </section>

                {/* Sección adicional para mostrar el scroll */}
                <section className="content-section">
                    <div>
                        <h2 className="content-title">
                            EXCEPTIONAL CRAFTSMANSHIP
                        </h2>
                        <p className="content-description">
                            Experience the pinnacle of horological excellence with the RM 27-04,
                            a masterpiece that combines innovative materials with uncompromising precision.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}