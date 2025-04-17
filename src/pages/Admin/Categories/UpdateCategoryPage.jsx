/*
 * /Applications/Works/e-commerce/frontend/src/pages/Admin/Categories/UpdateCategoryPage.jsx
 */
import { Button, Form, Input, Select, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/categories/${categoryId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        form.setFieldsValue({ name: data.name, brands: data.brands });
      } catch {
        message.error("Kategori yükleme hatası.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [apiUrl, categoryId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        message.success("Kategori güncellendi.");
        navigate("/admin/categories");
      } else {
        message.error("Güncelleme başarısız.");
      }
    } catch {
      message.error("Güncelleme hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
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
          <Input />
        </Form.Item>
        <Form.Item
          label="Markalar"
          name="brands"
          rules={[{ required: true, message: "En az bir marka girin!" }]}
        >
          <Select mode="tags" placeholder="Marka ekle" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Güncelle
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default UpdateCategoryPage;
