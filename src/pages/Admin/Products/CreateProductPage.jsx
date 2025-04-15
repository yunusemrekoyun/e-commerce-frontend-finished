import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";


const CreateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${apiUrl}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          message.error("Kategori verileri alınamadı.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("description", values.description);
      formData.append("current", values.current);
      formData.append("discount", values.discount);

      // colors, sizes -> henüz basit şekilde virgülle ayırıyoruz
      // (ya da satır satır okursun, sana kalmış)
      if (values.colors) {
        formData.append("colors", values.colors);
      }
      if (values.sizes) {
        formData.append("sizes", values.sizes);
      }

      // Resimler (multiple)
      if (!values.img || values.img.length === 0) {
        message.error("En az bir ürün resmi eklenmeli!");
        return;
      }
      for (let fileObj of values.img) {
        if (fileObj.originFileObj) {
          formData.append("img", fileObj.originFileObj);
        }
      }

      const response = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Ürün başarıyla oluşturuldu.");
        form.resetFields();
      } else {
        message.error("Ürün oluşturulurken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Ürün oluşturma hatası:", error);
      message.error("Bir hata meydana geldi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="Ürün İsmi"
          name="name"
          rules={[
            {
              required: true,
              message: "Lütfen Ürün adını girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ürün Kategorisi"
          name="category"
          rules={[
            {
              required: true,
              message: "Lütfen 1 kategori seçin!",
            },
          ]}
        >
          <Select>
            {categories.map((category) => (
              <Select.Option value={category._id} key={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Fiyat"
          name="current"
          rules={[
            {
              required: true,
              message: "Lütfen ürün fiyatını girin!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="İndirim Oranı"
          name="discount"
          rules={[
            {
              required: true,
              message: "Lütfen bir ürün indirim oranı girin!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ürün Açıklaması"
          name="description"
          rules={[
            {
              required: true,
              message: "Lütfen bir ürün açıklaması girin!",
            },
          ]}
        >
          <ReactQuill theme="snow" style={{ backgroundColor: "white" }} />
        </Form.Item>

        <Form.Item
          label="Ürün Renkleri (virgülle ayır)"
          name="colors"
          rules={[
            {
              required: true,
              message: "Lütfen en az 1 ürün rengi girin!",
            },
          ]}
        >
          <Input placeholder="Örn: Red,Blue,Green" />
        </Form.Item>

        <Form.Item
          label="Ürün Bedenleri (virgülle ayır)"
          name="sizes"
          rules={[
            {
              required: true,
              message: "Lütfen en az 1 ürün beden ölçüsü girin!",
            },
          ]}
        >
          <Input placeholder="Örn: S,M,L,XL" />
        </Form.Item>

        <Form.Item
          label="Ürün Görselleri"
          name="img"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
          rules={[
            {
              required: true,
              message: "Lütfen ürün görsellerini ekleyin!",
            },
          ]}
        >
          <Upload
            multiple
            listType="picture"
            maxCount={6}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Dosya Seç (Max 6)</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Oluştur
        </Button>
      </Form>
    </Spin>
  );
};

export default CreateProductPage;
