import PropTypes from "prop-types";
import { useContext } from "react";
import CartContext from "../../context/CartContext";
import "./CartItem.css";

const CartItem = ({ cartItem }) => {
  const { removeFromCart, updateCartItemQuantity } = useContext(CartContext);

  const handleIncrease = () => {
    updateCartItemQuantity(cartItem._id, cartItem.quantity + 1);
  };

  const handleDecrease = () => {
    if (cartItem.quantity > 1) {
      updateCartItemQuantity(cartItem._id, cartItem.quantity - 1);
    } else {
      // Eğer miktar 1'e düşerse, ürünü sepetten kaldır
      removeFromCart(cartItem);
    }
  };

  return (
    <tr className="cart-item">
      <td className="cart-image">
        <div className="single-image-wrapper">
          <img
            src={cartItem.img[0]?.base64}
            alt={cartItem.name}
            className="cart-thumbnail"
          />
        </div>
      </td>
      <td>
        <div>{cartItem.name}</div>
      </td>
      {/* Ürün Seçeneklerini burada yerleştiriyoruz */}
      <td className="product-options">
        {cartItem.selectedColor && (
          <div className="cart-item-option">
            <strong>Color:</strong> {cartItem.selectedColor}
          </div>
        )}
        {cartItem.selectedSize && (
          <div className="cart-item-option">
            <strong>Size:</strong> {cartItem.selectedSize}
          </div>
        )}
      </td>
      <td>₺{cartItem.price.toFixed(2)}</td>
      <td className="product-quantity">
        <button
          className="quantity-btn"
          onClick={handleDecrease}
        >
          -
        </button>
        <span className="quantity-text">{cartItem.quantity}</span>
        <button className="quantity-btn" onClick={handleIncrease}>
          +
        </button>
      </td>
      <td className="product-subtotal">
        ₺{(cartItem.price * cartItem.quantity).toFixed(2)}
      </td>
    </tr>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.object,
};

export default CartItem;