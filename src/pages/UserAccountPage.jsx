/********************************************************
 * /Applications/Works/e-commerce/frontend/src/pages/UserAccountPage.jsx
 ********************************************************/
import { Layout, Menu, Table, Form, Input, Button, message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../components/Auth/fetchWithAuth"; // ✅

const { Sider, Content } = Layout;

const UserAccountPage = () => {
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState("profile");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [addressData, setAddressData] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else {
        return navigate("/");
      }
    } catch (error) {
      console.error("fetchUserInfo error:", error);
      return navigate("/");
    }
  };

  useEffect(() => {
    if (selectedMenu === "address" && userInfo) {
    }
    if (selectedMenu === "profile") {
      setIsEditingProfile(false);
    }
  }, [selectedMenu, userInfo]);

  const fetchAddress = async () => {
    try {
      const response = await fetchWithAuth(`${apiUrl}/api/address`);
      if (response.ok) {
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

  const handleProfileUpdate = async (values) => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/users/${values.email}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        return message.error("Profil güncellenemedi.");
      }

      message.success("Profile updated successfully.");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile update error:", error);
      message.error("Profil güncelleme hatası.");
    }
  };

  const profileForm = (
    <Form
      key={userInfo?.email}
      layout="vertical"
      onFinish={handleProfileUpdate}
      initialValues={{
        username: userInfo?.username || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "", // telefon numarası
      }}
    >
      <Form.Item label="Kullanıcı Adı" name="username">
        <Input />
      </Form.Item>

      <Form.Item label="E-posta" name="email">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Eski Şifre" name="oldPassword">
        <Input.Password placeholder="******" />
      </Form.Item>

      <Form.Item label="Yeni Şifre" name="newPassword">
        <Input.Password placeholder="Yeni şifrenizi girin" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Güncelle
        </Button>
      </Form.Item>
    </Form>
  );

  const handleAddressUpdate = async (values) => {
    if (!addressData) return;
    try {
      const res = await fetchWithAuth(
        `${apiUrl}/api/address/${addressData._id}`,
        {
          method: "PUT",
          body: JSON.stringify(values),
        }
      );
      if (!res.ok) {
        return message.error("Adres güncellenemedi.");
      }
      const updated = await res.json();
      setAddressData(updated.address);
      message.success("Adres başarıyla güncellendi.");
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Adres güncelleme hatası:", error);
      message.error("Bir hata oluştu.");
    }
  };

  const handleAddressAdd = async (values) => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address/add`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        return message.error("Adres eklenemedi.");
      }
      const added = await res.json();
      setAddressData(added.address);
      message.success("Adres başarıyla eklendi.");
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Adres ekleme hatası:", error);
      message.error("Bir hata oluştu.");
    }
  };

  const hasAddress = !!addressData;
  const addressForm = (
    <Form
      layout="vertical"
      onFinish={hasAddress ? handleAddressUpdate : handleAddressAdd}
      initialValues={addressData || {}}
    >
      <Form.Item label="Ad Soyad" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="Adres" name="address">
        <Input />
      </Form.Item>

      <Form.Item label="Adres(Opsiyonel)" name="district">
        <Input />
      </Form.Item>
      <Form.Item label="Telefon Numarası" name="phone">
        <Input />
      </Form.Item>
      <Form.Item label="Şehir" name="city">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {hasAddress ? "Adres Güncelle" : "Adres Ekle"}
        </Button>
      </Form.Item>
    </Form>
  );

  const ordersData = [
    { key: "1", orderNumber: "12345", date: "2023-01-01", status: "Delivered" },
    {
      key: "2",
      orderNumber: "67890",
      date: "2023-02-01",
      status: "Processing",
    },
  ];
  const ordersColumns = [
    { title: "Sipariş Numarası", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Tarih", dataIndex: "date", key: "date" },
    { title: "Durum", dataIndex: "status", key: "status" },
  ];

  const menuItems = [
    { key: "profile", label: "Hesap Bilgilerim" },
    { key: "address", label: "Adreslerim" },
    { key: "orders", label: "Siparişlerim" },
  ];

  return (
    <Layout>
      <Sider width={200}>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          style={{ height: "100%", borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ minHeight: "10vh" }}>
        <Content style={{ padding: "24px", minHeight: 280 }}>
          {selectedMenu === "orders" && (
            <Table
              dataSource={ordersData}
              columns={ordersColumns}
              pagination={{ pageSize: 10 }}
            />
          )}

          {selectedMenu === "profile" && userInfo && profileForm}

          {selectedMenu === "profile" && isEditingProfile && profileForm}

          {selectedMenu === "address" && !isEditingAddress && (
            <>
              {hasAddress ? (
                <div>
                  <h3>Mevcut Adres</h3>
                  <p>Name: {addressData.name}</p>
                  <p>Email: {addressData.email}</p>
                  <p>Address: {addressData.address}</p>
                  <p>City: {addressData.city}</p>
                  <p>District: {addressData.district}</p>
                  <Button
                    type="primary"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    Düzenle
                  </Button>
                </div>
              ) : (
                <div>
                  <p>Adres bilgisi bulunamadı.</p>
                  <Button
                    type="primary"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    Adres Ekle
                  </Button>
                </div>
              )}
            </>
          )}

          {selectedMenu === "address" && isEditingAddress && addressForm}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserAccountPage;
