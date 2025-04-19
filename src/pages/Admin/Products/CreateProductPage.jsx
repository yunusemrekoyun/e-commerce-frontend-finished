import { Button, Form, Input, Select, Upload, message, Popover, ColorPicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

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
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Kategori alınamadı:", err));
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

  const handleAddColor = (color) => {
    if (color && !colors.includes(color)) {
      setColors([...colors, color]);
    }
    setColorPickerVisible(false); // Renk paletini kapat
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  const handleAddSize = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setSizes([...sizes, e.target.value]);
      e.target.value = ""; // Kutu içini temizle
    }
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

      const res = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        body: formData, // `Content-Type` header'ını manuel olarak eklemeyin
      });
      if (res.ok) {
        message.success("Ürün başarıyla oluşturuldu.");
        form.resetFields();
        setColors([]);
        setSizes([]);
        navigate("/admin/products");
      } else {
        message.error("Oluştururken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      message.error("Bir hata oluştu.");
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
        rules={[{ required: true, message: "Kategori seçin!" }]}
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

      <Form.Item
  label="Renkler"
  name="colors"
  tooltip="Ürünün mevcut renklerini girin"
  rules={[{ required: false }]}
>
  <Select
    mode="tags"
    placeholder="Renk ekle (örn: kırmızı, siyah)"
    value={colors}
    onChange={(newColors) => setColors(newColors)}
    style={{ width: "100%" }}
  />
</Form.Item>
<Form.Item
  label="Bedenler"
  name="sizes"
  tooltip="Ürünün mevcut bedenlerini girin"
  rules={[{ required: false }]}
>
  <Select
    mode="tags"
    placeholder="Beden ekle (örn: S, M, L)"
    value={sizes}
    onChange={(newSizes) => setSizes(newSizes)}
    style={{ width: "100%" }}
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
          Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductPage;