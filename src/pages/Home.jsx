import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

import heroImage from '../assets/images/hero.jpg';
import hero1 from '../assets/images/hero1.webp';
import hero2 from '../assets/images/hero2.webp';

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

                <section className="hero">

                    <div className="hero-image">
                        <img
                            src={heroImage}
                            alt="Luxury Watch Collection"
                            className="hero-watch-image"
                        />
                    </div>

                    {/* Segunda imagen para parallax - hero1.webp */}
                    <div
                        className="hero-image"
                        style={{
                            transform: `translateY(${-scrollY * 0.5}px)`,
                            backgroundImage: `url(/assets/images/hero1.webp)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Texto del hero */}
                    <div className="hero-text">
                        <h1 className="hero-title">
                            EXQUISIT<br />
                            TIME
                        </h1>
                        <p className="hero-subtitle">
                            LUXURY TIMEPIECES
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
                            Experience the pinnacle of horological excellence with our curated collection,
                            featuring masterpieces that combine innovative materials with uncompromising precision.
                        </p>
                    </div>
                </section>

                {/* Primera sección showcase - hero1.webp */}
                <section className="showcase-section">
                    <div className="showcase-container">
                        <div className="showcase-image">
                            <img
                                src={hero1}
                                alt="Precision Engineering"
                                className="showcase-img"
                            />
                        </div>
                        <div className="showcase-content">
                            <h2 className="showcase-title">
                                PRECISION<br />
                                ENGINEERING
                            </h2>
                            <p className="showcase-description">
                                Every timepiece in our collection represents decades of
                                Swiss craftsmanship and innovative design, creating
                                instruments of unparalleled beauty and accuracy.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Segunda sección showcase - hero2.webp */}
                <section className="showcase-section">
                    <div className="showcase-container reverse">
                        <div className="showcase-content">
                            <h2 className="showcase-title">
                                LUXURY<br />
                                REDEFINED
                            </h2>
                            <p className="showcase-description">
                                From the finest materials to the most intricate mechanisms,
                                each timepiece represents the pinnacle of horological
                                artistry and innovation.
                            </p>
                        </div>
                        <div className="showcase-image">
                            <img
                                src={hero2}
                                alt="Luxury Redefined"
                                className="showcase-img"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}