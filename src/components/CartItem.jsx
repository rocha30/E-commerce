import styles from '../styles/components/CartItem.module.css';
export function CartItem({ title, image, price, quantity, onRemove }) {
    return (
        <div className={styles.item}>
            <img src={image} alt={title} className={styles.image} />
            <div className={styles.info}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.details}>Qty: {quantity} x ${price}</p>
                <p className={styles.subtotal}>Subtotal: ${price * quantity}</p>
                <button className={styles.remove} onClick={onRemove}>Remove</button>
            </div>
        </div>
    );
}
