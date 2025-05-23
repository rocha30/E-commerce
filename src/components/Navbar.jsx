import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar__left">
                <Link to="/search" className="navbar__link">SEARCH</Link>
            </div>

            <div className="navbar__center">
                <Link to="/" className="navbar__logo">Exquisit Time</Link>
            </div>

            <div className="navbar__right">
                <Link to="/catalog" className="navbar__link">COLLECTIONS</Link>
                <Link to="/cart" className="navbar__link">BAG</Link>
            </div>
        </nav>
    );
};

export default Navbar;