import { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { fetchWithAuth } from "../../../components/Auth/fetchWithAuth";

const MAX_IMAGES = 6;

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Sıkıştırma hatası:", error);
    return file;
  }
};

const UpdateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, productRes] = await Promise.all([
          fetchWithAuth(`${apiUrl}/api/categories`),
          fetchWithAuth(`${apiUrl}/api/products/${productId}`),
        ]);

        if (!categoriesRes.ok || !productRes.ok) {
          message.error("Veri getirme başarısız.");
          return;
        }

        const [categoriesData, productData] = await Promise.all([
          categoriesRes.json(),
          productRes.json(),
        ]);

        setCategories(categoriesData);

        if (productData) {
          form.setFieldsValue({
            name: productData.name,
            current: productData.price.current,
            discount: productData.price.discount,
            description: productData.description,
            category: productData.category,
            colors: productData.colors || [],
            sizes: productData.sizes || [],
          });

          const images = productData.img.map((img) => ({
            uid: img._id,
            name: "image.png",
            status: "done",
            url: img.base64,
          }));
          setFileList(images);
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        message.error("Veri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, productId, form]);

  const handleChange = ({ fileList: newList }) => {
    if (newList.length > MAX_IMAGES) {
      message.error(`En fazla ${MAX_IMAGES} görsel yükleyebilirsiniz.`);
      newList = newList.slice(0, MAX_IMAGES);
    }
    setFileList(newList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const body = {
        name: values.name,
        price: {
          current: values.current,
          discount: values.discount,
        },
        description: values.description,
        category: values.category,
        colors: values.colors || [],
        sizes: values.sizes || [],
      };

      const infoRes = await fetchWithAuth(
        `${apiUrl}/api/products/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!infoRes.ok) {
        const err = await infoRes.json();
        throw new Error(err.error || "Ürün bilgisi güncellenemedi.");
      }

      const newImages = fileList.filter((f) => f.originFileObj);
      if (newImages.length > 0) {
        const formData = new FormData();
        for (const file of newImages) {
          const compressed = await compressImage(file.originFileObj);
          formData.append("img", compressed);
        }

        const imageRes = await fetchWithAuth(
          `${apiUrl}/api/products/${productId}/upload-images`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!imageRes.ok) {
          const err = await imageRes.json();
          throw new Error(err.error || "Görsel yüklenirken hata oluştu.");
        }
      }

      message.success("Ürün başarıyla güncellendi.");
      navigate("/admin/products");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      message.error(error.message || "Güncelleme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <Form.Item
          label="Ürün İsmi"
          name="name"
          rules={[{ required: true, message: "Lütfen ürün adını girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ürün Kategorisi"
          name="category"
          rules={[{ required: true, message: "Lütfen kategori seçin!" }]}
        >
          <Select>
            {categories.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Fiyat"
          name="current"
          rules={[{ required: true, message: "Lütfen fiyat girin!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="İndirim Oranı"
          name="discount"
          rules={[{ required: true, message: "İndirim oranı zorunludur!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ürün Açıklaması"
          name="description"
          rules={[{ required: true, message: "Lütfen açıklama girin!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Ürün Renkleri" name="colors">
          <Select mode="tags" placeholder="Renk ekle (örn: kırmızı, siyah)" />
        </Form.Item>

        <Form.Item label="Ürün Bedenleri" name="sizes">
          <Select mode="tags" placeholder="Beden ekle (örn: S, M, L)" />
        </Form.Item>

        <Form.Item label="Ürün Görselleri">
          <Upload
            listType="picture"
            multiple
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleChange}
          >
            {fileList.length < MAX_IMAGES && (
              <Button icon={<UploadOutlined />}>Dosya Seç (Max 6)</Button>
            )}
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Güncelle
        </Button>
      </Form>
    </Spin>
  );
};

export default UpdateProductPage;
