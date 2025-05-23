import '../styles/components/CartItem.css';  // Correcto para CSS global
export function CartItem({ title, image, price, quantity, onRemove }) {
    return (
        <div className="item">
            <img src={image} alt={title} className="image" />
            <div className="info">
                <h4 className="title">{title}</h4>
                <p className="details">Qty: {quantity} x ${price}</p>
                <p className="subtotal">Subtotal: ${price * quantity}</p>
                <button className="remove" onClick={onRemove}>Remove</button>
            </div>
        </div>
    );
}

export default CartItem;

