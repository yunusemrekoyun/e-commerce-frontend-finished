// /Applications/Works/kozmetik/frontend/src/pages/Admin/Products/UpdateProductPage.jsx
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
const { Option } = Select;

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
  const [brandOptions, setBrandOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
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
        const [categoriesRaw, productData] = await Promise.all([
          categoriesRes.json(),
          productRes.json(),
        ]);
        setCategories(categoriesRaw.data);

        form.setFieldsValue({
          name: productData.name,
          current: productData.price.current,
          discount: productData.price.discount,
          description: productData.description,
          category:
            typeof productData.category === "string"
              ? productData.category
              : productData.category?._id,
          brand: productData.brand,
          colors: productData.colors || [],
          sizes: productData.sizes || [],
        });

        const selectedCat = categoriesRaw.data.find(
          (c) =>
            c._id ===
            (typeof productData.category === "string"
              ? productData.category
              : productData.category?._id)
        );
        setBrandOptions(selectedCat?.brands || []);

        const images = productData.img.map((img) => ({
          uid: img._id,
          name: "image.png",
          status: "done",
          thumbUrl: img.base64,
        }));
        setFileList(images);
        form.setFieldsValue({ img: images });
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        message.error("Veri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, productId, form]);

  const onCategoryChange = (value) => {
    const cat = categories.find((c) => c._id === value);
    setBrandOptions(cat?.brands || []);
    form.setFieldsValue({ brand: undefined });
  };

  const handleChange = ({ fileList: newList }) => {
    const onlyNew = newList.filter((f) => f.originFileObj);
    const existing = fileList.filter((f) => !f.originFileObj);
    const combined = [...existing, ...onlyNew];
    if (combined.length > MAX_IMAGES) {
      message.error(`En fazla ${MAX_IMAGES} görsel yükleyebilirsiniz.`);
      return;
    }
    setFileList(combined);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("brand", values.brand || "");
      formData.append("description", values.description);
      formData.append("current", values.current);
      formData.append("discount", values.discount);

      if (values.colors?.length)
        formData.append("colors", values.colors.join(","));
      if (values.sizes?.length)
        formData.append("sizes", values.sizes.join(","));

      const newImages = fileList.filter((f) => f.originFileObj);
      for (const file of newImages) {
        const compressed = await compressImage(file.originFileObj);
        formData.append("img", compressed);
      }

      const keepIds = fileList
        .filter((f) => !f.originFileObj)
        .map((f) => f.uid);
      formData.append("keepImages", JSON.stringify(keepIds));
      formData.append("deletedImages", JSON.stringify(deletedImages));

      const res = await fetchWithAuth(
        `${apiUrl}/api/products/${productId}`,
        {
          method: "PUT",
          body: formData,
        },
        false
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Ürün güncellenemedi.");
      }

      message.success("Ürün başarıyla güncellendi.");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update error:", err);
      message.error(err.message || "Güncelleme sırasında hata oluştu.");
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
        style={{ maxWidth: 800, margin: "0 auto" }}
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
          <Select onChange={onCategoryChange}>
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Marka"
          name="brand"
          rules={[{ required: true, message: "Lütfen marka seçin!" }]}
        >
          <Select placeholder="Marka seçin">
            {brandOptions.map((b) => (
              <Option key={b} value={b}>
                {b}
              </Option>
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

        <Form.Item label="İndirim Oranı" name="discount">
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

        <Form.Item
          label="Ürün Görselleri"
          name="img"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            listType="picture"
            multiple
            maxCount={MAX_IMAGES}
            beforeUpload={() => false}
            onRemove={(file) => {
              if (!file.originFileObj) {
                setDeletedImages((prev) => [...prev, file.uid]);
              }
              setFileList((prev) =>
                prev.filter((item) => item.uid !== file.uid)
              );
            }}
            onChange={handleChange}
            fileList={fileList}
          >
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

export default UpdateProductPage;
