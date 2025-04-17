/********************************************************
 * /Applications/Works/e-commerce/frontend/src/pages/UserAccountPage.jsx
 ********************************************************/
import { Layout, Menu, Table, Form, Input, Button, message } from "antd";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../components/Auth/fetchWithAuth";

// react-phone-input-2 için
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const { Sider, Content } = Layout;

const UserAccountPage = () => {
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState("profile");
  const [userInfo, setUserInfo] = useState(null);
  const [addressData, setAddressData] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // adres formu için form instance
  const [addressForm] = Form.useForm();

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [apiUrl, navigate]);

  const fetchAddress = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address`);
      if (res.ok) {
        const data = await res.json();
        setAddressData(data[0] || null);
      } else {
        message.error("Adres bilgisi alınamadı.");
      }
    } catch {
      message.error("Bir hata oluştu.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (selectedMenu === "address" && userInfo) {
      fetchAddress();
    }
  }, [selectedMenu, userInfo, fetchAddress]);

  // addressData geldiğinde formu doldur
  useEffect(() => {
    if (selectedMenu === "address") {
      addressForm.setFieldsValue({
        email: userInfo?.email,
        name: addressData?.name || "",
        address: addressData?.address || "",
        district: addressData?.district || "",
        phone: addressData?.phone || "",
        city: addressData?.city || "",
      });
    }
  }, [addressData, userInfo, selectedMenu, addressForm]);

  const handleAddressSubmit = async (values) => {
    try {
      const url = addressData
        ? `${apiUrl}/api/address/${addressData._id}`
        : `${apiUrl}/api/address/add`;
      const method = addressData ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        return message.error("Adres işlemi başarısız.");
      }
      const json = await res.json();
      // POST: json.address, PUT: json.address
      setAddressData(json.address);
      message.success("Adres başarıyla kaydedildi.");
    } catch (err) {
      console.error(err);
      message.error("Bir hata oluştu.");
    }
  };

  // Profil formu
  const [profileForm] = Form.useForm();
  const handleProfileUpdate = async (values) => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/users/${values.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        return message.error("Profil güncellenemedi.");
      }
      message.success("Profil güncellendi.");
    } catch {
      message.error("Profil güncelleme hatası.");
    }
  };

  const profileFormJsx = userInfo && (
    <Form
      form={profileForm}
      layout="vertical"
      onFinish={handleProfileUpdate}
      initialValues={{
        username: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone,
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

  // Adres formu JSX
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
          inputProps={{ name: "phone" }}
          value={addressForm.getFieldValue("phone")}
          onChange={(value) => addressForm.setFieldsValue({ phone: value })}
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
    { key: "address", label: "Adresim" },
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
        <Content style={{ padding: 24, minHeight: 280 }}>
          {selectedMenu === "orders" && (
            <Table
              dataSource={ordersData}
              columns={ordersColumns}
              pagination={{ pageSize: 10 }}
            />
          )}
          {selectedMenu === "profile" && profileFormJsx}
          {selectedMenu === "address" && addressFormJsx}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserAccountPage;
