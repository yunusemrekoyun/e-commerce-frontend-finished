/*
 * /Applications/Works/e-commerce/frontend/src/pages/Admin/Categories/CreateCategoryPage.jsx
 */
import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// const { Option } = Select; marka önerme eklentisi

const CreateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        brands: values.brands || [],
      };
      const res = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        message.success("Kategori başarıyla oluşturuldu.");
        form.resetFields();
        navigate("/admin/categories");
      } else {
        message.error("Kategori oluşturulurken hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ brands: [] }}
    >
      <Form.Item
        label="Kategori İsmi"
        name="name"
        rules={[{ required: true, message: "Lütfen kategori adını girin!" }]}
      >
        <Input placeholder="Örn: Telefon" />
      </Form.Item>

      <Form.Item
        label="Markalar"
        name="brands"
        tooltip="Bu kategoriye ait markaları girin"
        rules={[{ required: true, message: "En az bir marka girin!" }]}
      >
        <Select mode="tags" placeholder="Marka ekle">
          {/* Kullanıcı yeni tag ekledikçe marka listesi oluşur */}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateCategoryPage;
