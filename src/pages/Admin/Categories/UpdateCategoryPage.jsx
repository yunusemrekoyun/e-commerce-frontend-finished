import { Button, Form, Input, Spin, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const params = useParams();
  const categoryId = params.id;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Tek kategoriyi çekip formu dolduruyoruz.
  useEffect(() => {
    const fetchSingleCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error("Verileri getirme hatası");
        }
        const data = await response.json();
        if (data) {
          // data.img => "data:image/...base64"
          form.setFieldsValue({
            name: data.name,
            // Kategori görselini anında input’a göstermek istersen,
            // dummy bir fileList oluşturup preview verebilirsin:
            img: [
              {
                uid: "-1",
                name: "category.jpg",
                status: "done",
                url: data.img, // Base64 string
              },
            ],
          });
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleCategory();
  }, [apiUrl, categoryId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", values.name);

      // Eğer resim seçildiyse (yeni resim yüklenecekse) ekleyelim
      // (User belki resmi değiştirmek istemeyebilir, o zaman fileList url bazlı olabilir)
      if (values.img && values.img.length > 0) {
        // eğer user yeni bir file seçtiyse => originFileObj olur
        const fileObj = values.img[0].originFileObj;
        if (fileObj) {
          formData.append("img", fileObj);
        }
      }

      const response = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        message.success("Kategori başarıyla güncellendi.");
      } else {
        message.error("Kategori güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Kategori güncelleme hatası:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Kategori İsmi"
          name="name"
          rules={[
            {
              required: true,
              message: "Lütfen kategori adını girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Resim alanı */}
        <Form.Item
          label="Kategori Görseli"
          name="img"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Dosya Seç</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Güncelle
        </Button>
      </Form>
    </Spin>
  );
};

export default UpdateCategoryPage;
