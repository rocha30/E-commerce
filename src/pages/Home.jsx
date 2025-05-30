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


                <section className="showcase-section">
                    <div className="showcase-container reverse">
                        <div className="showcase-content">
                            <h2 className="showcase-title">
                                EXCEPTIONAL CRAFTSMANSHIP
                            </h2>
                            <p className="showcase-description">
                                Experience the pinnacle of horological excellence with our curated collection,
                                featuring masterpieces that combine innovative materials with uncompromising precision.
                            </p>
                        </div>
                        <div className="showcase-image">
                            <img
                                src={heroImage}
                                alt="Luxury Redefined"
                                className="showcase-img"
                            />
                        </div>
                    </div>
                </section>


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