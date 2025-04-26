import { useContext } from "react";
import CartContext from "../../context/CartContext";

const CartProgress = () => {
  const { cartItems } = useContext(CartContext);

  const freeShippingThreshold = 161.0;

  // Sepetteki toplam tutarı hesapla
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Mesajı oluştur
  const message =
    totalAmount >= freeShippingThreshold
      ? ""
      : ``;

  return (
    <div className="cart-progress">
      {/* Progress bar kaldırıldı, sadece mesaj kaldı */}
      <p className="progress-message">{message}</p>
    </div>
  );
};

export default CartProgress;