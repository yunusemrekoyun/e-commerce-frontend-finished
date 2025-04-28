import { useEffect, useState } from "react";
import {
  Table,
  Select,
  InputNumber,
  Button,
  Spin,
  message,
  Modal,
  Checkbox,
} from "antd";
import { fetchWithAuth } from "../../../components/Auth/fetchWithAuth";
import './DiscountPage.css'; // CSS dosyasını import ettik

const { Option } = Select;

const DiscountPage = () => {
  const [categories, setCategories] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selCat, setSelCat] = useState(null);
  const [selBrands, setSelBrands] = useState(["all"]);
  const [discValue, setDiscValue] = useState(0);
  const [updateAll, setUpdateAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${apiUrl}/api/categories`),
          fetchWithAuth(`${apiUrl}/api/discounts/products`),
        ]);
        if (catRes.status === 401 || prodRes.status === 401) {
          window.location.reload();
          return;
        }
        if (!catRes.ok) throw new Error("Kategori alınamadı");
        setCategories(await catRes.json());
        setDiscounted(await prodRes.json());
      } catch (err) {
        console.error(err);
        message.error("Veri alınamadı.");
      } finally {
        setLoading(false);
      }
    })();
  }, [apiUrl]);

  useEffect(() => {
    if (modalVisible) {
      setSelCat(null);
      setSelBrands(["all"]);
      setDiscValue(0);
      setUpdateAll(false); // 🔥 Modal açılınca checkbox da sıfırlanmalı
    }
  }, [modalVisible]);

  const onCatChange = (catId) => {
    setSelCat(catId);
    const cat = categories.find((c) => c._id === catId);
    setBrandOptions(cat?.brands || []);
    setSelBrands(["all"]);
  };

  const applyDiscount = async () => {
    if (!selCat) {
      message.warning("Önce kategori seçin.");
      return;
    }

    setLoading(true);
    try {
      const checkBody = {
        categoryId: selCat,
      };
      if (!selBrands.includes("all")) {
        checkBody.brandIds = Array.isArray(selBrands)
          ? selBrands.map((b) => b.toLowerCase())
          : [selBrands.toLowerCase()];
      }

      const checkRes = await fetchWithAuth(`${apiUrl}/api/discounts/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkBody),
      });

      const checkData = await checkRes.json();
      if (checkData.hasDiscountedProducts && !updateAll) {
        message.warning(
          "Seçilen kategoride/markalarda zaten indirimli ürünler var. Mevcut indirimleri değiştirmek için kutucuğu işaretlemelisiniz."
        );
        setLoading(false);
        return;
      }

      // 🔥 Buraya kadar geldiyse uygula
      const body = {
        categoryId: selCat,
        discount: discValue,
        updateAll,
      };
      if (!selBrands.includes("all")) {
        body.brandIds = Array.isArray(selBrands)
          ? selBrands.map((b) => b.toLowerCase())
          : [selBrands.toLowerCase()];
      }

      const res = await fetchWithAuth(`${apiUrl}/api/discounts/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Uygulama başarısız");

      message.success("İndirim güncellendi.");
      setModalVisible(false);

      const updated = await fetchWithAuth(`${apiUrl}/api/discounts/products`);
      setDiscounted(await updated.json());
    } catch (err) {
      console.error(err);
      message.error("Uygulama hatası.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDiscount = async (productId) => {
    Modal.confirm({
      title: "İndirimi Kaldır",
      content: "Bu ürünün indirimini kaldırmak istediğinize emin misiniz?",
      okText: "Evet",
      cancelText: "İptal",
      async onOk() {
        setLoading(true);
        try {
          const res = await fetchWithAuth(
            `${apiUrl}/api/discounts/${productId}`,
            {
              method: "DELETE",
            }
          );
          if (!res.ok) throw new Error("Silme başarısız");

          message.success("İndirim kaldırıldı.");
          const updated = await fetchWithAuth(
            `${apiUrl}/api/discounts/products`
          );
          setDiscounted(await updated.json());
        } catch (err) {
          console.error(err);
          message.error("İndirim kaldırılamadı.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    { title: "Ürün Adı", dataIndex: "name", key: "name" },
    {
      title: "Görsel",
      dataIndex: "img",
      key: "img",
      render: (imgs) => imgs?.[0] && <img src={imgs[0]} alt="" width={60} />,
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (c) => c?.name || c,
    },
    { title: "Marka", dataIndex: "brand", key: "brand" },
    {
      title: "Eski İndirim",
      dataIndex: ["price", "discount"],
      key: "oldDisc",
      render: (d) => `${d}%`,
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteDiscount(record._id)}>
          İndirimi Kaldır
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Button
        type="primary"
        className="discount-btn"
        onClick={() => setModalVisible(true)}
      >
        İndirim Üret
      </Button>

      <Modal
        title="Kategori/Marka Bazlı İndirim Oluştur"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        maskClosable
      >
        <div className="discount-form">
          <Select
            placeholder="Kategori seç"
            value={selCat}
            onChange={onCatChange}
            className="select"
          >
            {categories.map((c) => (
              <Option key={c._id} value={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>

          <Select
            mode="multiple"
            placeholder="Marka seç (all=Tüm)"
            value={selBrands}
            onChange={setSelBrands}
            className="select"
            style={{ minWidth: 150 }}
          >
            <Option key="all" value="all">
              Tüm Markalar
            </Option>
            {brandOptions.map((b) => (
              <Option key={b} value={b}>
                {b}
              </Option>
            ))}
          </Select>

          <InputNumber
            min={0}
            max={100}
            placeholder="İndirim %"
            value={discValue}
            onChange={setDiscValue}
            className="input-number"
          />

          <Checkbox
            checked={updateAll}
            onChange={(e) => setUpdateAll(e.target.checked)}
            style={{ marginTop: "10px" }}
          >
            Mevcut İndirimleri Değiştir
          </Checkbox>

          <Button
            type="primary"
            onClick={applyDiscount}
            style={{ marginTop: "10px" }}
          >
            Uygula
          </Button>
        </div>
      </Modal>

      <div className="page-container">
        <Table
          rowKey="_id"
          dataSource={discounted}
          columns={columns}
          pagination={{ pageSize: 10 }}
          className="discount-table"
          scroll={{ y: "calc(100vh - 200px)" }}
        />
      </div>
    </Spin>
  );
};

export default DiscountPage;