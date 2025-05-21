
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import styles from '../styles/pages/Home.module.css';

export default function Home() {
    // Aquí iría la lógica para obtener productos, p. ej. usando useFetchProducts('Rolex')
    const products = [];

    return (
        <div className={styles.container}>
            <Navbar />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Bienvenido a Exquisit Time</h1>
                    <p>Descubre relojes de alta gama</p>
                </div>
            </section>

            {/* Featured Products Grid */}
            <section className={styles.grid}>
                {products.map(product => (
                    <ProductCard
                        key={product.reference}
                        title={product.title}
                        image={product.images[0]}
                        price={product.marketPrice}
                        onAdd={() => {/* manejar añadir al carrito */ }}
                    />
                ))}
            </section>

            <Footer />
        </div>
    );
}
