import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import DiscountBadge from "./DiscountBadge";
import FavoriteButton from "./FavoriteButton";
import "../styles/components/ProductCard.css";

export default function ProductCard({ id, idProducto, name, price, originalPrice, discount, image, description }) {
    const { dispatch } = useCart();
    const productId = idProducto || id;
    const safeImage = image || "/images/default-watch.jpg";

    const addToCart = async () => {
        await dispatch({
            type: "ADD_TO_CART",
            product: { id: productId, idProducto: productId, name, price, image: safeImage, description },
        });
    };

    return (
        <div className="product-card">
            <DiscountBadge discount={discount} />
            <FavoriteButton product={{ id: productId, idProducto: productId, name, price, image: safeImage, description }} />

            <Link to={`/product/${productId}`} className="product-link">
                <div className="product-image">
                    <img src={safeImage} alt={name} />
                </div>
                <div className="product-info">
                    <h3>{name}</h3>
                    <p className="product-description">{description}</p>

                    <div className="price-container">
                        {originalPrice ? (
                            <>
                                <span className="original-price">${originalPrice.toLocaleString()}</span>
                                <span className="current-price">${price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="current-price">${price.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </Link>
            <button className="add-to-cart-btn" onClick={addToCart}>
                Add to Cart
            </button>
        </div>
    );
}