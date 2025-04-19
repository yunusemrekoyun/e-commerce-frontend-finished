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

  const freeShippingThreshold = 161.0;
  const cargoFee = 15;

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
      ? "Congratulations! You get free shipping!"
      : `Add $${(freeShippingThreshold - totalAmount).toFixed(
          2
        )} to cart and get free shipping!`;

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (res && res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch {
      // kullanıcı giriş yapmamışsa sessizce geç
    }
  }, [apiUrl]);

  const fetchAddress = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address`);
      if (res && res.ok) {
        const arr = await res.json();
        setAddressData(arr[0] || null);
      }
    } catch {
      // adres yoksa sessizce geç
    }
  }, [apiUrl]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (userInfo) fetchAddress();
  }, [userInfo, fetchAddress]);

  const handlePayment = async () => {
    if (!userInfo) {
      Modal.confirm({
        title: "Giriş Gerekli",
        content: "Ödeme yapabilmek için lütfen giriş yapın.",
        okText: "Giriş Yap",
        cancelText: "Kapat",
        onOk() {
          navigate("/auth");
        },
      });
      return;
    }

    if (!addressData) {
      Modal.warning({
        title: "Adres Bilgisi Eksik",
        content:
          "Ödeme işlemi yapabilmek için adres bilgilerinizi girmelisiniz.",
        okText: "Tamam",
        onOk() {
          navigate("/account");
        },
      });
      return;
    }

    const body = {
      products: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color, 
        size: item.size,
      })),
      user: {
        _id: userInfo._id,
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
        Modal.error({
          title: "Hata",
          content: "Ödeme işlemi başarısız oldu.",
        });
        return;
      }

      const { id: sessionId } = await res.json();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) throw new Error(result.error.message);
    } catch (err) {
      console.error(err);
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
      <h2>Cart totals</h2>
      <table>
        <tbody>
          <tr className="cart-subtotal">
            <th>Subtotal</th>
            <td>${subTotals.toFixed(2)}</td>
          </tr>
          <tr className="cart-shipping">
            <th>Shipping</th>
            <td>
              {totalAmount >= freeShippingThreshold ? (
                <label>Free</label>
              ) : (
                <label>$15.00</label>
              )}
            </td>
          </tr>
          <tr className="cart-total">
            <th>Total</th>
            <td>
              <strong>${cartTotals.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Free shipping progress bar */}
      <div className="free-progress-bar">
        <p className="progress-bar-title">{shippingMessage}</p>
        <div className="progress-bar">
          <span
            className="progress"
            style={{ width: `${progressBarWidth}%` }}
          ></span>
        </div>
      </div>

      <div className="checkout">
        <Spin spinning={loading}>
          <button className="btn btn-lg" onClick={handlePayment}>
            Proceed to checkout
          </button>
        </Spin>
      </div>
    </div>
  );
};

export default CartTotals;
