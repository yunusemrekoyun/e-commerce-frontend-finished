import { Layout, Table, Form, Input, Button, message, Collapse } from "antd";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../components/Auth/fetchWithAuth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OrderDetailsModal from "../components/Orders/OrderDetailModal";
import "./UserAccountPage.css";

const { Content } = Layout;

const UserAccountPage = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [userInfo, setUserInfo] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);

  const [profileForm] = Form.useForm();
  const [addressForm] = Form.useForm();

  // 1) Sadece token varsa /me isteği yap, yoksa ana sayfaya yönlendir
  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (!res.ok) {
        navigate("/");
        return;
      }
      const data = await res.json();
      setUserInfo(data);
      profileForm.setFieldsValue({
        username: data.username,
        email: data.email,
      });
    } catch {
      navigate("/");
    }
  }, [apiUrl, navigate, profileForm]);

  const fetchAddress = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address`);
      if (res.ok) {
        const { data } = await res.json();
        setAddressData(data[0] || null);
      }
    } catch {
      message.error("Adres bilgisi alınamadı.");
    }
  }, [apiUrl]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/orders`);
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setOrders(data || []);
    } catch {
      message.error("Siparişler alınamadı.");
    }
  }, [apiUrl]);

  // Mount’ta kullanıcı bilgilerini çek
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  // Adres verisi geldikçe formu güncelle
  useEffect(() => {
    if (addressData) {
      addressForm.setFieldsValue({
        email: userInfo?.email || "",
        name: addressData.name || "",
        address: addressData.address || "",
        district: addressData.district || "",
        phone: addressData.phone || "",
        city: addressData.city || "",
      });
    }
  }, [addressData, userInfo, addressForm]);

  const handleCollapseChange = (key) => {
    const activeKey = Array.isArray(key) ? key[0] : key;
    if (activeKey === "address") {
      fetchAddress();
    } else if (activeKey === "orders") {
      fetchOrders();
    }
  };

  const handleProfileSubmit = async (values) => {
    try {
      const { username, oldPassword, newPassword, confirmPassword } = values;
      const profileRes = await fetchWithAuth(
        `${apiUrl}/api/users/${userInfo.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      if (!profileRes.ok) throw new Error("Profil güncelleme başarısız.");

      if (oldPassword) {
        const passRes = await fetchWithAuth(
          `${apiUrl}/api/auth/change-password`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
          }
        );
        if (!passRes.ok) {
          const err = await passRes.json();
          throw new Error(err.error || "Şifre güncelleme başarısız.");
        }
        message.success("Şifreniz başarıyla güncellendi.");
      }

      message.success("Profiliniz güncellendi.");
      fetchUserInfo();
      profileForm.resetFields([
        "oldPassword",
        "newPassword",
        "confirmPassword",
      ]);
    } catch (err) {
      message.error(err.message);
    }
  };

  const profileFormJsx = (
    <Form form={profileForm} layout="vertical" onFinish={handleProfileSubmit}>
      <Form.Item
        label="Kullanıcı Adı"
        name="username"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="E-posta" name="email">
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="Eski Şifre"
        name="oldPassword"
        tooltip="Şifrenizi değiştirmek için girin"
      >
        <Input.Password placeholder="Eski şifreniz" />
      </Form.Item>
      <Form.Item
        label="Yeni Şifre"
        name="newPassword"
        dependencies={["oldPassword"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!getFieldValue("oldPassword")) return Promise.resolve();
              if (!value) return Promise.reject("Yeni şifre zorunludur.");
              if (value.length < 6)
                return Promise.reject("En az 6 karakter girin.");
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password placeholder="Yeni şifreniz" />
      </Form.Item>
      <Form.Item
        label="Yeni Şifre (Tekrar)"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!getFieldValue("newPassword")) return Promise.resolve();
              if (value !== getFieldValue("newPassword"))
                return Promise.reject("Şifreler eşleşmiyor.");
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password placeholder="Yeni şifreniz (tekrar)" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Güncelle
        </Button>
      </Form.Item>
    </Form>
  );

  const handleAddressSubmit = async (vals) => {
    try {
      const url = addressData
        ? `${apiUrl}/api/address/${addressData._id}`
        : `${apiUrl}/api/address/add`;
      const method = addressData ? "PUT" : "POST";
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals),
      });
      if (!res.ok) throw new Error();
      const { address } = await res.json();
      setAddressData(address);
      message.success("Adres kaydedildi.");
    } catch {
      message.error("Adres işleminde hata.");
    }
  };

  const addressFormJsx = (
    <Form form={addressForm} layout="vertical" onFinish={handleAddressSubmit}>
      <Form.Item label="E-posta" name="email">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Ad Soyad" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Adres" name="address">
        <Input />
      </Form.Item>
      <Form.Item label="Adres (Opsiyonel)" name="district">
        <Input />
      </Form.Item>
      <Form.Item
        label="Telefon Numarası"
        name="phone"
        rules={[{ required: true, message: "Telefon numarası zorunludur!" }]}
      >
        <PhoneInput
          country="tr"
          onlyCountries={["tr"]}
          masks={{ tr: "(...) ... .. .." }}
          countryCodeEditable={false}
          enableAreaCodes={false}
          onChange={(v) => addressForm.setFieldsValue({ phone: v })}
        />
      </Form.Item>
      <Form.Item label="Şehir" name="city">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {addressData ? "Güncelle" : "Ekle"}
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Layout className="layout-with-border">
      <Layout.Header className="header">
        <div className="logo" />
      </Layout.Header>
      <Layout style={{ minHeight: "10vh" }}>
        <Content style={{ padding: 24, minHeight: 280 }}>
          <Collapse
            defaultActiveKey={["profile"]}
            accordion
            onChange={handleCollapseChange}
            items={[
              {
                key: "profile",
                label: "Profil Bilgilerim",
                children: profileFormJsx,
              },
              {
                key: "address",
                label: "Adres Bilgilerim",
                children: addressFormJsx,
              },
              {
                key: "orders",
                label: "Siparişlerim",
                children: (
                  <div className="orders-table-container">
                    <Table
                      dataSource={orders}
                      columns={[
                        {
                          title: "Sipariş No",
                          dataIndex: "_id",
                          key: "_id",
                          render: (id) => id.slice(-6),
                        },
                        {
                          title: "Tarih",
                          dataIndex: "createdAt",
                          key: "createdAt",
                          render: (d) => new Date(d).toLocaleDateString(),
                        },
                        {
                          title: "Durum",
                          dataIndex: "status",
                          key: "status",
                          render: (s) => s || "Processing",
                        },
                        {
                          title: "Sipariş Hakkında",
                          key: "actions",
                          render: (_, record) => (
                            <Button
                              type="link"
                              onClick={() => setModalOrder(record)}
                            >
                              Detaylar
                            </Button>
                          ),
                          responsive: ["md"], // ✅ sadece webde göster
                        },
                      ]}
                      rowKey={(rec) => rec._id}
                      pagination={{ pageSize: 5 }}
                      onRow={(record) => ({
                        onClick: () => {
                          if (window.innerWidth < 768) {
                            setModalOrder(record); // ✅ mobilde satır tıklayınca aç
                          }
                        },
                      })}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Content>
      </Layout>
      <OrderDetailsModal
        visible={!!modalOrder}
        onClose={() => setModalOrder(null)}
        order={modalOrder}
      />
    </Layout>
  );
};

export default UserAccountPage;
