import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/components/Navbar.css';

const Navbar = () => {
    const { userId, setUserId, users, usersLoading, usersError } = useUser();

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <Link to="/search" className="navbar__link">SEARCH</Link>
                <Link to="/admin" className="navbar__link">PANEL NEO4J</Link>
            </div>

            <div className="navbar__center">
                <Link to="/" className="navbar__logo">Exquisit Time</Link>
            </div>

            <div className="navbar__right">
                <Link to="/catalog" className="navbar__link">COLLECTIONS</Link>
                <Link to="/recommendations" className="navbar__link">RECOMMEND</Link>
                <Link to="/cart" className="navbar__link">BAG</Link>
                <div className="navbar__user-switcher">
                    <span className="navbar__user-label">USER</span>
                    <select
                        className="navbar__user-select"
                        value={userId}
                        onChange={(event) => setUserId(event.target.value)}
                        title={usersError ? `Could not load users: ${usersError}` : "Active user"}
                    >
                        {users.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                        ))}
                    </select>
                    {usersLoading && <span className="navbar__user-loading">...</span>}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;