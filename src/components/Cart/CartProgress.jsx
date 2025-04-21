import { useContext } from "react";
import CartContext from "../../context/CartContext";

const CartProgress = () => {
  const { cartItems } = useContext(CartContext);

  const freeShippingThreshold = 161.0;

  // Sepetteki toplam tutarı hesapla
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Ücretsiz kargo için gereken miktara ne kadar yaklaşıldığını hesapla
  const progress = (totalAmount / freeShippingThreshold) * 100;
  const progressBarWidth = progress > 100 ? 100 : progress;

  // Mesajı oluştur
  const message =
    totalAmount >= freeShippingThreshold
      ? "Tebrikler! Kargonuz Ücretsiz"
      : `Ücretsiz kargo için sepetinize ${(freeShippingThreshold - totalAmount).toFixed(2)} TL ürün ekleyin.`;

  return (
    <div className="cart-progress">
      <div className="progress-bar-wrapper">
        <div className="progress-bar" style={{ width: `${progressBarWidth}%` }}></div>
      </div>
      <p className="progress-message">{message}</p>
    </div>
  );
};

export default CartProgress;