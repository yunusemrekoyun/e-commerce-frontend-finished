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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MAX_IMAGES = 6;

const UpdateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const params = useParams();
  const productId = params.id;

  const [fileList, setFileList] = useState([]);
  // Bu state ile anlık eklenen-silinen görselleri yönetiriz.

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // kategorileri ve tek ürünü çek
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
          // product’ın base64 resimlerini fileList’e ekleyelim
          // singleProductData.img => Array of { _id, base64 }
          const mappedFileList = singleProductData.img.map((imageObj) => ({
            uid: imageObj._id, // subdoc id
            name: "image.png",
            status: "done",
            url: imageObj.base64, // preview amaçlı base64
          }));

          setFileList(mappedFileList);

          form.setFieldsValue({
            name: singleProductData.name,
            current: singleProductData.price.current,
            discount: singleProductData.price.discount,
            description: singleProductData.description,
            colors: singleProductData.colors.join(","),
            sizes: singleProductData.sizes.join(","),
            category: singleProductData.category,
          });
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, productId, form]);

  // Upload listesi değiştiğinde
  const handleChange = (info) => {
    let newList = [...info.fileList];

    // Örnek: Kısıtlamak istiyorsak => 6 dosyadan fazlasını at.
    if (newList.length > MAX_IMAGES) {
      message.error(`En fazla ${MAX_IMAGES} görsel yükleyebilirsiniz.`);
      newList = newList.slice(0, MAX_IMAGES);
    }

    setFileList(newList);
  };

  // Submit
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("current", values.current);
      formData.append("discount", values.discount);
      formData.append("description", values.description);
      formData.append("category", values.category);

      // colors ve sizes virgülle ayrılmış string ise
      if (values.colors) {
        formData.append("colors", values.colors);
      }
      if (values.sizes) {
        formData.append("sizes", values.sizes);
      }

      // "Eski" (DB'deki) görseller -> file.url var, file.originFileObj yok
      // Bunların uid = subdoc._id
      const keepImageIds = fileList
        .filter((file) => !file.originFileObj && file.url)
        .map((file) => file.uid);

      formData.append("keepImages", JSON.stringify(keepImageIds));

      // Yeni yüklenen dosyalar -> file.originFileObj var
      const newFiles = fileList.filter((file) => file.originFileObj);
      if (newFiles.length) {
        // Yine 6 sınırına takılmamak için:
        if (newFiles.length + keepImageIds.length > MAX_IMAGES) {
          message.error(`Toplamda en fazla ${MAX_IMAGES} görsel olabilir.`);
          setLoading(false);
          return;
        }

        newFiles.forEach((file) => {
          formData.append("img", file.originFileObj);
        });
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
