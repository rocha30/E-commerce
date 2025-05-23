import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Exquisit Time</h3>
                        <p>
                            Luxury timepieces for the discerning collector.
                            Experience the finest in Swiss craftsmanship and precision.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">F</a>
                            <a href="#" aria-label="Instagram">I</a>
                            <a href="#" aria-label="Twitter">T</a>
                            <a href="#" aria-label="YouTube">Y</a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Shop</h4>
                        <ul>
                            <li><Link to="/catalog">All Watches</Link></li>
                            <li><Link to="/brands">Brands</Link></li>
                            <li><Link to="/collections">Collections</Link></li>
                            <li><Link to="/new-arrivals">New Arrivals</Link></li>
                            <li><Link to="/sale">Sale</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Customer Care</h4>
                        <ul>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/shipping">Shipping Info</Link></li>
                            <li><Link to="/returns">Returns</Link></li>
                            <li><Link to="/warranty">Warranty</Link></li>
                            <li><Link to="/size-guide">Size Guide</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Newsletter</h4>
                        <div className="newsletter">
                            <p>Subscribe to receive updates on new arrivals and exclusive offers.</p>
                            <div className="newsletter-input">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    aria-label="Email address"
                                />
                                <button type="submit">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Exquisit Time. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
            </div>
        </footer>
    );
}