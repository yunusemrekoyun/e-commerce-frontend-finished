import { useContext, useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CartContext from "../../context/CartContext";
import { Modal, Spin } from "antd";
import { fetchWithAuth } from "../Auth/fetchWithAuth";
import { useNavigate } from "react-router-dom";

const CartTotals = () => {
  const { cartItems } = useContext(CartContext); // Sepet öğeleri
  const [fastCargoChecked, setFastCargoChecked] = useState(false); // Hızlı kargo seçeneği
  const [loading, setLoading] = useState(false); // Ödeme işlemi yükleniyor durumu
  const navigate = useNavigate();
  const stripePublicKey = import.meta.env.VITE_API_STRIPE_PUBLIC_KEY;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [userInfo, setUserInfo] = useState(null); // Kullanıcı bilgileri
  const [addressData, setAddressData] = useState(null); // Adres bilgileri

  // 1) Kullanıcıyı çek (sessiz fail)
  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (res && res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch {
      // login değilse sessizce geç
    }
  }, [apiUrl]);

  // 2) Adresi çek (sessiz fail)
  const fetchAddress = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address`);
      if (res && res.ok) {
        const arr = await res.json();
        setAddressData(arr[0] || null);
      }
    } catch {
      // sessizce geç
    }
  }, [apiUrl]);

  // İlk mount'ta, token varsa kullanıcıyı al
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUserInfo();
  }, [fetchUserInfo]);

  // userInfo geldiyse adresi al
  useEffect(() => {
    if (userInfo) fetchAddress();
  }, [userInfo, fetchAddress]);

  // Sepet tutarları ve toplam hesaplama
  const subTotals = cartItems
    .map((i) => i.price * i.quantity) // Her ürünün toplam fiyatı
    .reduce((a, b) => a + b, 0); // Hepsinin toplamı
  const cargoFee = 15; // Kargo ücreti
  const cartTotals = fastCargoChecked ? subTotals + cargoFee : subTotals; // Kargo ücreti eklenmiş toplam

  // Ödeme işlemi
  const handlePayment = async () => {
    // 1) Giriş kontrolü: modal ile
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

    // 2) Adres kontrolü
    if (!addressData) {
      Modal.warning({
        title: "Adres Bilgisi Eksik",
        content:
          "Ödeme işlemi yapabilmek için adres bilgilerinizi girmelisiniz",
        okText: "Tamam",
        onOk() {
          navigate("/account");
        },
      });
      return;
    }

    // 3) Sipariş payload’u
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
          <tr>
            <th>Shipping</th>
            <td>
              <label>
                Fast Cargo: $15.00
                <input
                  type="checkbox"
                  checked={fastCargoChecked}
                  onChange={() => setFastCargoChecked(!fastCargoChecked)}
                />
              </label>
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              <strong>${cartTotals.toFixed(2)}</strong>
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