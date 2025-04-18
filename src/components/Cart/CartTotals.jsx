/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/CartTotals.jsx
 ********************************************************/
import { useContext, useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CartContext from "../../context/CartContext";
import { message, Modal, Spin } from "antd";
import { fetchWithAuth } from "../Auth/fetchWithAuth"; // ✅

const CartTotals = () => {
  const [addressData, setAddressData] = useState(null);
  const [fastCargoChecked, setFastCargoChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const { cartItems } = useContext(CartContext);
  const stripePublicKey = import.meta.env.VITE_API_STRIPE_PUBLIC_KEY;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else {
        message.error("Kullanıcı bilgisi alınamadı.");
      }
    } catch (error) {
      console.error("fetchUserInfo error:", error);
      message.error("Kullanıcı bilgisi alınamadı.");
    }
  }, [apiUrl]);

  const fetchAddress = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address`);
      if (res.ok) {
        const data = await res.json();
        setAddressData(data[0] || null);
      } else {
        message.error("Adres bilgisi alınamadı.");
      }
    } catch (error) {
      console.error("Adres bilgisi alınamadı:", error);
      message.error("Bir hata oluştu.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (!userInfo) return;
    fetchAddress();
  }, [userInfo, fetchAddress]);

  const cartItemTotals = cartItems.map((item) => item.price * item.quantity);
  const subTotals = cartItemTotals.reduce((prev, curr) => prev + curr, 0);

  const cargoFee = 15;
  const cartTotals = fastCargoChecked
    ? (subTotals + cargoFee).toFixed(2)
    : subTotals.toFixed(2);

  const handlePayment = async () => {
    if (!userInfo) {
      return message.info("Ödeme yapabilmek için giriş yapmalısınız!");
    }
    if (!addressData) {
      return Modal.warning({
        title: "Adres Bilgisi Eksik",
        content:
          "Ödeme işlemi yapabilmek için adres bilgilerinizi girmelisiniz",
        onOk() {
          window.location.href = "/account";
        },
      });
    }

    const body = {
      products: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      user: {
        _id: userInfo._id,
        email: userInfo.email,
      },
      cargoFee: fastCargoChecked ? cargoFee : 0,
    };

    console.log("Gönderilen ödeme verisi:", body);

    try {
      setLoading(true);

      const stripe = await loadStripe(stripePublicKey);

      const res = await fetchWithAuth(`${apiUrl}/api/payment`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setLoading(false);
        return message.error("Ödeme işlemi başarısız oldu.");
      }

      const session = await res.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.log(error);
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
            <td>
              <span id="subtotal">${subTotals.toFixed(2)}</span>
            </td>
          </tr>
          <tr>
            <th>Shipping</th>
            <td>
              <ul>
                <li>
                  <label>
                    Fast Cargo: $15.00
                    <input
                      type="checkbox"
                      checked={fastCargoChecked}
                      onChange={() => setFastCargoChecked(!fastCargoChecked)}
                    />
                  </label>
                </li>
                <li>
                  <a href="#">Change Address</a>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              <strong id="cart-total">${cartTotals}</strong>
            </td>
          </tr>
        </tbody>
      </table>
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
