// filepath: src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import styles from '../styles/components/Navbar.module.css'

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>Exquisit Time</div>
            <ul className={styles.links}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/catalog">Catalog</Link></li>
                <li><Link to="/cart">Cart</Link></li>
            </ul>
        </nav>
    )
}
