// src/pages/Success.jsx
import { Button, Result } from "antd";
import { useContext, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";
import { fetchWithAuth } from "../components/Auth/fetchWithAuth";
import { isAdmin } from "../config/isAdmin";

const Success = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const finalizeOrder = useCallback(async () => {
    try {
      // 1) Kullanıcının adresini al
      const addrRes = await fetchWithAuth(`${apiUrl}/api/address`);
      if (!addrRes.ok) throw new Error("Adres alınamadı");
      const addrData = await addrRes.json();
      const address = addrData[0];
      if (!address) throw new Error("Adres bulunamadı");

      // 2) Sepette ürün yoksa kaydetme, direkt temizle
      if (!cartItems.length) {
        return setCartItems([]);
      }

      // 3) Order payload hazırla
      const orderPayload = {
        addressId: address._id,
        items: cartItems.map((it) => ({
          productId: it._id,
          quantity: it.quantity,
          price: it.price,
        })),
      };

      // 4) POST /api/orders
      const orderRes = await fetchWithAuth(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        console.error("Order creation failed:", await orderRes.json());
      }
    } catch (err) {
      console.error("Finalize order error:", err);
    } finally {
      // 5) Sepeti temizle
      setCartItems([]);
    }
  }, [apiUrl, cartItems, setCartItems]);

  useEffect(() => {
    finalizeOrder();
  }, [finalizeOrder]);

  return (
    <div className="success-page">
      <div className="container">
        <Result
          status="success"
          title="Ödeme Başarılı!"
          subTitle="Siparişiniz başarıyla tamamlandı"
          extra={[
            <Link to="/" key="home">
              <Button type="primary">Ana Sayfa</Button>
            </Link>,
            <Button
              key="order"
              onClick={() => {
                if (isAdmin()) {
                  navigate("/admin/orders");
                } else {
                  navigate("/account");
                }
              }}
            >
              Siparişlerim
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default Success;
