// /Applications/Works/kozmetik/frontend/src/components/Cart/CartTotals.jsx
import { useContext, useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import { fetchWithAuth } from "../Auth/fetchWithAuth";

const CartTotals = () => {
  const { cartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [addressData, setAddressData] = useState(null);

  const navigate = useNavigate();
  const stripePublicKey = import.meta.env.VITE_API_STRIPE_PUBLIC_KEY;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const freeShippingThreshold = 1750;
  const cargoFee = 200;

  const subTotals = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalAmount = subTotals;
  const cartTotals =
    totalAmount >= freeShippingThreshold ? totalAmount : totalAmount + cargoFee;

  const progress = (totalAmount / freeShippingThreshold) * 100;
  const progressBarWidth = progress > 100 ? 100 : progress;

  const shippingMessage =
    totalAmount >= freeShippingThreshold
      ? "Tebrikler! Kargonuz Ücretsiz."
      : `Ücretsiz kargo için sepetinize ${(
          freeShippingThreshold - totalAmount
        ).toFixed(2)} TL ürün ekleyin.`;

  // 1) Sadece token varsa /me çağrısı yap
  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // token yoksa sessiz çık
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (!res.ok) return; // geçersiz token da sessiz çık
      const data = await res.json();
      setUserInfo(data);
    } catch {
      // sessizce geç
    }
  }, [apiUrl]);

  const fetchAddress = useCallback(async () => {
    if (!userInfo) return;
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address`);
      if (res.ok) {
        const { data } = await res.json();
        setAddressData(data[0] || null);
      }
    } catch {
      // sessizce geç
    }
  }, [apiUrl, userInfo]);

  // Mount’ta kullanıcı bilgisini çek
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  // userInfo geldikten sonra adresi çek
  useEffect(() => {
    if (userInfo) fetchAddress();
  }, [userInfo, fetchAddress]);

  const handlePayment = async () => {
    if (!userInfo) {
      return Modal.confirm({
        title: "Giriş Gerekli",
        content: "Ödeme yapabilmek için lütfen giriş yapın.",
        okText: "Giriş Yap",
        cancelText: "Kapat",
        onOk() {
          navigate("/auth");
        },
      });
    }

    if (!addressData) {
      return Modal.warning({
        title: "Adres Bilgisi Eksik",
        content:
          "Ödeme işlemi yapabilmek için adres bilgilerinizi girmelisiniz.",
        okText: "Tamam",
        onOk() {
          navigate("/account");
        },
      });
    }

    const body = {
      products: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.selectedColor,
        size: item.selectedSize,
      })),
      user: {
        _id: userInfo.id,
        email: userInfo.email,
      },
      cargoFee: totalAmount >= freeShippingThreshold ? 0 : cargoFee,
    };

    try {
      setLoading(true);
      const stripe = await loadStripe(stripePublicKey);
      const res = await fetchWithAuth(`${apiUrl}/api/payment`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error();
      }
      const { data } = await res.json();
      const sessionId = data.sessionId;
      await stripe.redirectToCheckout({ sessionId });
    } catch {
      Modal.error({
        title: "Hata",
        content: "Ödeme sırasında bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-totals">
      <h2>Sepetiniz</h2>
      <table>
        <tbody>
          <tr className="cart-subtotal">
            <th>Toplam</th>
            <td>{subTotals.toFixed(2)} TL</td>
          </tr>
          <tr className="cart-shipping">
            <th>Kargo Ücreti</th>
            <td>
              {totalAmount >= freeShippingThreshold ? (
                <label>Ücretsiz</label>
              ) : (
                <label>200.00 TL</label>
              )}
            </td>
          </tr>
          <tr className="cart-total">
            <th>Sepet Tutarı</th>
            <td>
              <strong>{cartTotals.toFixed(2)} TL</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="free-progress-bar">
        <p className="progress-bar-title">{shippingMessage}</p>
        <div className="progress-bar">
          <span
            className="progress"
            style={{ width: `${progressBarWidth}%` }}
          />
        </div>
      </div>
      <div className="checkout">
        <Spin spinning={loading}>
          <button className="btn btn-lg" onClick={handlePayment}>
            Sepeti Onayla
          </button>
        </Spin>
      </div>
    </div>
  );
};

export default CartTotals;
