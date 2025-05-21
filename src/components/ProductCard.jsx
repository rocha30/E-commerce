import React from "react";
import { Button } from "./Button";
import styles from "../styles/components/ProductCard.module.css";


export function ProductCard({ title, description, price, onAdd }) {
    return (
        <div className={styles.card}>
            <img src={image} alt={title} className={styles.image} />
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.price}>${price}</p>
            <Button variant="primary" onClick={onAdd}>Add to Cart</Button>
        </div>
    );

}