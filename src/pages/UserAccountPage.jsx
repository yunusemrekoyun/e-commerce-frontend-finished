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
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [selectedMenu, setSelectedMenu] = useState("profile");
  const [userInfo, setUserInfo] = useState(null);
  const [addressData, setAddressData] = useState(null);

  /*** USER INFO ***/
  const [profileForm] = Form.useForm();
  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (!res.ok) return navigate("/");
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

  /*** ADDRESS INFO ***/
  const [addressForm] = Form.useForm();
  const fetchAddress = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/address`);
      if (res.ok) {
        const arr = await res.json();
        setAddressData(arr[0] || null);
      }
    } catch {
      message.error("Adres bilgisi alınamadı.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);
  useEffect(() => {
    if (selectedMenu === "address") {
      fetchAddress();
      addressForm.setFieldsValue({
        email: userInfo?.email,
        name: addressData?.name || "",
        address: addressData?.address || "",
        district: addressData?.district || "",
        phone: addressData?.phone || "",
        city: addressData?.city || "",
      });
    }
  }, [selectedMenu, userInfo, addressData, fetchAddress, addressForm]);

  /*** PROFİL & ŞİFRE GÜNCELLEME ***/
  const handleProfileSubmit = async (values) => {
    try {
      // 1) Kullanıcı adı güncelle
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

      // 2) Eğer eski şifre girilmişse, şifre değiştir
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
      fetchUserInfo(); // en güncel veriyi çek
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
    <Form
      form={profileForm}
      layout="vertical"
      onFinish={handleProfileSubmit}
      initialValues={{}}
    >
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
              if (!value) return Promise.reject("Yeni şifre zorunlu.");
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

  /*** ADRES FORMU ***/
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

  /*** ORDERS ***/
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
    { title: "Sipariş No", dataIndex: "orderNumber", key: "orderNumber" },
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
              pagination={{ pageSize: 5 }}
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
