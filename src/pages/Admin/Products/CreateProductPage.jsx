import { Button, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { fetchWithAuth } from "../../../components/Auth/fetchWithAuth";
const { Option } = Select;

const CreateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/categories`)
      .then((res) => res.json())
      .then((response) => setCategories(response.data))
      .catch((err) => console.error("Ürün kategorileri alınamadı:", err));
  }, [apiUrl]);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch {
      return file;
    }
  };

  const onCategoryChange = (value) => {
    const cat = categories.find((c) => c._id === value);
    setBrandOptions(cat?.brands || []);
    form.setFieldsValue({ brand: undefined });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("brand", values.brand);
      formData.append("current", values.current);
      formData.append("discount", values.discount || "");
      formData.append("description", values.description);
      if (colors.length > 0) formData.append("colors", colors.join(","));
      if (sizes.length > 0) formData.append("sizes", sizes.join(","));

      if (!values.img || values.img.length === 0) {
        return message.error("Ürün görsellerini seçin!");
      }
      for (let fileObj of values.img) {
        const compressed = await compressImage(fileObj.originFileObj);
        formData.append("img", compressed);
      }

      const res = await fetchWithAuth(
        `${apiUrl}/api/products`,
        {
          method: "POST",
          body: formData,
        },
        false
      ); // 👈 FormData olduğu için 3. parametreyi false yapıyoruz

      if (res.ok) {
        message.success("Ürün başarıyla oluşturuldu.");
        form.resetFields();
        setColors([]);
        setSizes([]);
        navigate("/admin/products");
      } else {
        const errorText = await res.text();
        message.error(errorText || "Ürün oluşturulurken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      message.error("Ürün oluşturma sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Ürün İsmi"
        name="name"
        rules={[{ required: true, message: "Ürün ismi gerekli!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ürün Kategorisi"
        name="category"
        rules={[{ required: true, message: "Ürün kategorisi seçin!" }]}
      >
        <Select placeholder="Kategori seçin" onChange={onCategoryChange}>
          {categories.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Marka"
        name="brand"
        rules={[{ required: true, message: "Marka seçin!" }]}
      >
        <Select placeholder="Marka seçin">
          {brandOptions.map((b) => (
            <Option key={b} value={b}>
              {b}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Fiyat" name="current" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>

      <Form.Item label="İndirim Oranı" name="discount">
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Ürün Açıklaması"
        name="description"
        rules={[{ required: true, message: "Açıklama gerekli!" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Renkler" name="colors">
        <Select
          mode="tags"
          placeholder="Renk ekle (örn: kırmızı, siyah)"
          value={colors}
          onChange={(newColors) => setColors(newColors)}
        />
      </Form.Item>

      <Form.Item label="Bedenler" name="sizes">
        <Select
          mode="tags"
          placeholder="Beden ekle (örn: S, M, L)"
          value={sizes}
          onChange={(newSizes) => setSizes(newSizes)}
        />
      </Form.Item>

      <Form.Item
        label="Ürün Görselleri"
        name="img"
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
        rules={[{ required: true }]}
      >
        <Upload
          listType="picture"
          multiple
          maxCount={6}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Dosya Seç</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Ürünü Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductPage;
