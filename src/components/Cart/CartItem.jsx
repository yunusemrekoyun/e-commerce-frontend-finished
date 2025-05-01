import PropTypes from "prop-types";
import { useContext } from "react";
import CartContext from "../../context/CartContext";
import "./CartItem.css";

const CartItem = ({ cartItem }) => {
  const { removeFromCart, updateCartItemQuantity } = useContext(CartContext);

  const handleIncrease = () =>
    updateCartItemQuantity(cartItem._id, cartItem.quantity + 1);
  const handleDecrease = () =>
    cartItem.quantity > 1
      ? updateCartItemQuantity(cartItem._id, cartItem.quantity - 1)
      : removeFromCart(cartItem);

  return (
    <tr className="cart-item">
      <td className="cart-image">
        <img
          src={cartItem.img[0]?.base64}
          alt={cartItem.name}
          className="cart-thumbnail"
        />
      </td>

      <td>{cartItem.name}</td>

      <td className="product-options">
        {cartItem.selectedColor && (
          <div>
            <strong>Renk:</strong> {cartItem.selectedColor}
          </div>
        )}
        {cartItem.selectedSize && (
          <div>
            <strong>Boyut:</strong> {cartItem.selectedSize}
          </div>
        )}
      </td>

      <td>₺{Number(cartItem.price).toFixed(2)}</td>

      <td className="product-quantity">
        <div className="quantity-wrapper">
          <button className="quantity-btn" onClick={handleDecrease}>
            −
          </button>
          <span className="quantity-text">{cartItem.quantity}</span>
          <button className="quantity-btn" onClick={handleIncrease}>
            ＋
          </button>
        </div>
      </td>

      <td className="product-subtotal">
        ₺{(Number(cartItem.price) * cartItem.quantity).toFixed(2)}
      </td>
    </tr>
  );
};

CartItem.propTypes = { cartItem: PropTypes.object };
export default CartItem;
