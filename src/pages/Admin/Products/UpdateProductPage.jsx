import { useState } from "react";
import { Button, Form, Input, InputNumber, Select, Spin, message, Upload } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

const MAX_IMAGES = 6;

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Sıkıştırma hatası:", error);
    return file;
  }
};

const UpdateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const params = useParams();
  const productId = params.id;

  const [fileList, setFileList] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, singleProductResponse] = await Promise.all([
          fetch(`${apiUrl}/api/categories`),
          fetch(`${apiUrl}/api/products/${productId}`),
        ]);

        if (!categoriesResponse.ok || !singleProductResponse.ok) {
          message.error("Veri getirme başarısız.");
          return;
        }

        const [categoriesData, singleProductData] = await Promise.all([
          categoriesResponse.json(),
          singleProductResponse.json(),
        ]);

        setCategories(categoriesData);

        if (singleProductData) {
          const mappedFileList = singleProductData.img.map((imageObj) => ({
            uid: imageObj._id,
            name: "image.png",
            status: "done",
            url: imageObj.base64,
          }));

          setFileList(mappedFileList);

          form.setFieldsValue({
            name: singleProductData.name,
            current: singleProductData.price.current,
            discount: singleProductData.price.discount,
            description: singleProductData.description,
            category: singleProductData.category,
          });

          setColors(singleProductData.colors);
          setSizes(singleProductData.sizes);
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, productId, form]);

  const handleChange = (info) => {
    let newList = [...info.fileList];

    if (newList.length > MAX_IMAGES) {
      message.error(`En fazla ${MAX_IMAGES} görsel yükleyebilirsiniz.`);
      newList = newList.slice(0, MAX_IMAGES);
    }

    setFileList(newList);
  };

  const handleAddColor = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setColors([...colors, e.target.value]);
      e.target.value = ""; // Kutu içini temizle
    }
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
      formData.append("current", values.current);
      formData.append("discount", values.discount);
      formData.append("description", values.description);
      formData.append("category", values.category);

      formData.append("colors", colors.join(","));
      formData.append("sizes", sizes.join(","));

      const keepImageIds = fileList
        .filter((file) => !file.originFileObj && file.url)
        .map((file) => file.uid);

      formData.append("keepImages", JSON.stringify(keepImageIds));

      const newFiles = fileList.filter((file) => file.originFileObj);
      if (newFiles.length) {
        if (newFiles.length + keepImageIds.length > MAX_IMAGES) {
          message.error(`Toplamda en fazla ${MAX_IMAGES} görsel olabilir.`);
          setLoading(false);
          return;
        }

        for (const file of newFiles) {
          const compressed = await compressImage(file.originFileObj);
          formData.append("img", compressed);
        }
      }

      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        message.success("Ürün başarıyla güncellendi.");
        navigate("/admin/products");
      } else {
        const errData = await response.json();
        message.error(errData.error || "Ürün güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Ürün güncelleme hatası:", error);
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
            {categories.map((cat) => (
              <Select.Option value={cat._id} key={cat._id}>
                {cat.name}
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
          label="Ürün Renkleri"
          name="colors"
        >
          <Input
            placeholder="Örn: Red,Blue,Green"
            onKeyDown={handleAddColor}
          />
          <div>
            {colors.map((color, index) => (
              <span key={index} style={{ marginRight: 10 }}>
                {color}
              </span>
            ))}
          </div>
        </Form.Item>

        <Form.Item
          label="Ürün Bedenleri"
          name="sizes"
        >
          <Input
            placeholder="Örn: S,M,L,XL"
            onKeyDown={handleAddSize}
          />
          <div>
            {sizes.map((size, index) => (
              <span key={index} style={{ marginRight: 10 }}>
                {size}
              </span>
            ))}
          </div>
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