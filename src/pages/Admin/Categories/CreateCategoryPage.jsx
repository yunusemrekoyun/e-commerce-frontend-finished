import { Button, Form, Input, Spin, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const CreateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);

      // Doğru kontrol ve dosya alma
      if (!values.img || values.img.length === 0) {
        message.error("Lütfen kategori resmi seçin!");
        return;
      }

      const fileObj = values.img[0].originFileObj;
      formData.append("img", fileObj);

      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Kategori başarıyla oluşturuldu.");
        form.resetFields();
      } else {
        message.error("Kategori oluşturulurken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Kategori oluşturma hatası:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
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

        <Form.Item
          label="Kategori Görseli"
          name="img"
          valuePropName="fileList" // ANTD upload ile uyum
          getValueFromEvent={(e) => {
            // Upload bileşeninin onChange eventindeki fileList’i form’a aktarma
            return e?.fileList;
          }}
          rules={[
            {
              required: true,
              message: "Lütfen kategori görseli ekleyin!",
            },
          ]}
        >
          <Upload
            maxCount={1} // Tek dosya
            beforeUpload={() => false} // Otomatik upload kapalı, manuel yapacağız
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Dosya Seç</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Oluştur
        </Button>
      </Form>
    </Spin>
  );
};

export default CreateCategoryPage;
