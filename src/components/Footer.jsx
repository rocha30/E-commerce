import styles from '../styles/components/Footer.module.css';


export function Footer() {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Exquisit Time. All rights reserved.</p>
        </footer>
    );
}
