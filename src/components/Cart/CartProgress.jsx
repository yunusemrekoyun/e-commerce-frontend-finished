import { useContext } from "react";
import CartContext from "../../context/CartContext";

const CartProgress = () => {
  const { cartItems } = useContext(CartContext);

  const freeShippingThreshold = 161.0;

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const progress = (totalAmount / freeShippingThreshold) * 100;
  const progressBarWidth = progress > 100 ? 100 : progress;

  const message =
    totalAmount >= freeShippingThreshold
      ? "Tebrikler! Kargonuz Ücretsiz"
      : `Ücretsiz kargo için sepetinize $${(freeShippingThreshold - totalAmount).toFixed(2)} ürün ekleyin. `;


};

export default CartProgress;