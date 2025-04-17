import { message } from "antd";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartProvider";

const CartCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { cartItems, setCartItems } = useContext(CartContext);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const applyCoupon = async () => {
    if (couponCode.trim().length === 0) {
      return message.warning("Boş değer girilemez.");
    }

    try {
      const res = await fetch(`${apiUrl}/api/coupons/code/${couponCode}`);
      if (!res.ok) {
        return message.warning("Girdiğiniz kupon kodu yanlış!");
      }

      const data = await res.json();
      const discountPercent = data.discountPercent;

      const updatedCartItems = cartItems.map((item) => {
        const updatePrice = item.originalPrice
          ? item.originalPrice * (1 - discountPercent / 100)
          : item.price * (1 - discountPercent / 100);
        return {
          ...item,
          originalPrice: item.originalPrice || item.price,
          price: updatePrice,
        };
      });

      setCartItems(updatedCartItems);
      setAppliedCoupon({ code: couponCode, discountPercent });
      message.success(`${couponCode} kupon kodu başarıyla uygulandı.`);
    } catch (error) {
      console.log(error);
    }
  };

  const removeCoupon = () => {
    const resetCartItems = cartItems.map((item) => ({
      ...item,
      price: item.originalPrice || item.price,
      originalPrice: undefined,
    }));

    setCartItems(resetCartItems);
    setAppliedCoupon(null);
    setCouponCode("");
    message.info("Kupon kaldırıldı.");
  };

  return (
    <div className="actions-wrapper">
      {appliedCoupon ? (
        <div className="applied-coupon-message">
          <p style={{ color: "green", fontWeight: "bold", marginBottom: "8px" }}>
            ✅ {appliedCoupon.code} kuponu uygulandı (%{appliedCoupon.discountPercent} indirim)
          </p>
          <button className="btn" onClick={removeCoupon}>
            Kuponu Kaldır
          </button>
        </div>
      ) : (
        <div className="coupon">
          <input
            type="text"
            className="input-text"
            placeholder="Kupon kodu"
            onChange={(e) => setCouponCode(e.target.value)}
            value={couponCode}
          />
          <button className="btn" type="button" onClick={applyCoupon}>
            Kuponu Uygula
          </button>
        </div>
      )}

      <div className="update-cart">
        <button className="btn">Sepeti Güncelle</button>
      </div>
    </div>
  );
};

export default CartCoupon;