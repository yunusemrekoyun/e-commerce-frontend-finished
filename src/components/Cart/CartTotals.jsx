import { useContext, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext } from "../../context/CartProvider";
import { message, Modal, Spin } from "antd";

const CartTotals = () => {
  const [addressData, setAddressData] = useState(null);
  const [fastCargoChecked, setFastCargoChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const { cartItems } = useContext(CartContext);
  const stripePublicKey = import.meta.env.VITE_API_STRIPE_PUBLIC_KEY;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const localRefresh = localStorage.getItem("refreshToken");
    if (localToken) setToken(localToken);
    if (localRefresh) setRefreshToken(localRefresh);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchUserInfo();
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        const newToken = await tryRefreshToken();
        if (newToken) {
          return fetchUserInfo();
        } else {
          message.error("Lütfen yeniden giriş yapın.");
        }
      } else if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else {
        message.error("Kullanıcı bilgisi alınamadı.");
      }
    } catch (error) {
      console.error("fetchUserInfo error:", error);
      message.error("Kullanıcı bilgisi alınamadı.");
    }
  };

  const tryRefreshToken = async () => {
    if (!refreshToken) return null;
    try {
      const resp = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (resp.ok) {
        const data = await resp.json();
        localStorage.setItem("token", data.token);
        setToken(data.token);
        return data.token;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return null;
      }
    } catch (err) {
      console.error("Refresh token error:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!userInfo || !token) return;
    fetchAddress();
  }, [userInfo, token]);

  const fetchAddress = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/address`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        const newToken = await tryRefreshToken();
        if (newToken) {
          return fetchAddress();
        } else {
          message.error("Adres bilgisi alınamadı. Yeniden giriş yapın.");
        }
      } else if (response.ok) {
        const data = await response.json();
        setAddressData(data[0] || null);
      } else {
        message.error("Adres bilgisi alınamadı.");
      }
    } catch (error) {
      console.error("Adres bilgisi alınamadı:", error);
      message.error("Bir hata oluştu.");
    }
  };

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

    // 🔧 Sadeleştirilmiş veri: img vs gönderilmiyor
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
      const res = await fetch(`${apiUrl}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        const newToken = await tryRefreshToken();
        if (!newToken) {
          setLoading(false);
          return message.error("Ödeme işlemi başarısız. Tekrar giriş yapın.");
        }
        const retryRes = await fetch(`${apiUrl}/api/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!retryRes.ok) {
          setLoading(false);
          return message.error("Ödeme işlemi başarısız oldu.");
        }
        const session2 = await retryRes.json();
        const result2 = await stripe.redirectToCheckout({
          sessionId: session2.id,
        });
        if (result2.error) {
          throw new Error(result2.error.message);
        }
        setLoading(false);
        return;
      }

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
