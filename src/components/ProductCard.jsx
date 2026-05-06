import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import FavoriteButton from "./FavoriteButton";
import "../styles/components/ProductCard.css";

export default function ProductCard({ id, idProducto, name, price, image, description }) {
    const { items, dispatch } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const productId = idProducto || id;
    const safeImage = image || "/images/default-watch.jpg";
    const productIdText = String(productId);
    const cartItem = useMemo(
        () =>
            items.find(
                (item) =>
                    String(item.idProducto ?? item.id) === productIdText
            ),
        [items, productIdText]
    );
    const isInCart = Boolean(cartItem);

    const addToCart = async () => {
        if (isAdding) return;
        setIsAdding(true);
        try {
            if (isInCart) {
                await dispatch({
                    type: "REMOVE_FROM_CART",
                    id: cartItem?.idProducto || cartItem?.id || productId,
                });
            } else {
                await dispatch({
                    type: "ADD_TO_CART",
                    product: { id: productId, idProducto: productId, name, price, image: safeImage, description },
                });
            }
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="product-card">
            <FavoriteButton product={{ id: productId, idProducto: productId, name, price, image: safeImage, description }} />

            <Link to={`/product/${productId}`} className="product-link">
                <div className="product-image">
                    <img src={safeImage} alt={name} />
                </div>
                <div className="product-info">
                    <h3>{name}</h3>
                    <p className="product-description">{description}</p>

                    <div className="price-container">
                        <span className="current-price">${price.toLocaleString()}</span>
                    </div>
                </div>
            </Link>
            <button
                className={`add-to-cart-btn${isInCart ? " add-to-cart-btn--added" : ""}`}
                onClick={addToCart}
                disabled={isAdding}
            >
                {isAdding ? "Updating..." : isInCart ? "Remove from cart" : "Add to Cart"}
            </button>
        </div>
    );
}