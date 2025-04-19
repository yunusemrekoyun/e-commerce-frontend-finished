import { useContext } from "react";
import CartContext from "../../context/CartContext";

const CartProgress = () => {
  const { cartItems } = useContext(CartContext);

  // Sepetteki toplam tutarı hesapla
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Ücretsiz kargo için gereken tutar
  const targetAmount = 161.00;

  // İlerleme oranını hesapla
  const progress = (totalAmount / targetAmount) * 100;
  const progressBarWidth = progress > 100 ? 100 : progress; // İlerleme %100'ü geçmesin

  return (
    <div className="free-progress-bar">
      <p className="progress-bar-title">
        {totalAmount >= targetAmount
          ? "Congratulations! You get free shipping!" // Hedef tutara ulaşınca kargo bedava
          : `Add $${(targetAmount - totalAmount).toFixed(2)} to cart and get free shipping!`} {/* Eğer hedefe ulaşılmamışsa, eksik tutar yazsın */}
      </p>
      <div className="progress-bar">
        <span
          className="progress"
          style={{ width: `${progressBarWidth}%` }}
        ></span>
      </div>
    </div>
  );
};

export default CartProgress;