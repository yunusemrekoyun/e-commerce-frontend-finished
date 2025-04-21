// /Applications/Works/e-commerce/frontend/src/pages/Admin/DiscountPage.jsx
import { useEffect, useState } from "react";
import { Table, Select, InputNumber, Button, Spin, message, Modal } from "antd";
import { fetchWithAuth } from "../../../components/Auth/fetchWithAuth";

const { Option } = Select;

const DiscountPage = () => {
  // State’ler
  const [categories, setCategories] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selCat, setSelCat] = useState();
  const [selBrands, setSelBrands] = useState(["all"]);
  const [discValue, setDiscValue] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // İlk yüklemede kategoriler + indirimli ürünler
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${apiUrl}/api/categories`),
          fetchWithAuth(`${apiUrl}/api/discounts/products`),
        ]);
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

  // Kategori seçildiğinde o kategoriye ait markaları hazırla
  const onCatChange = (catId) => {
    setSelCat(catId);
    const cat = categories.find((c) => c._id === catId);
    setBrandOptions(cat?.brands || []);
    setSelBrands(["all"]);
  };

  // İndirim uygula
  const applyDiscount = async () => {
    if (!selCat) {
      message.warning("Önce kategori seçin.");
      return;
    }

    setLoading(true);
    try {
      // Backend’in beklediği alan isimlerini kullan
      const body = {
        categoryId: selCat,
        discount: discValue,
      };
      // "all" seçili değilse brandIds gönder
      if (!selBrands.includes("all")) {
        body.brandIds = selBrands;
      }

      const res = await fetchWithAuth(`${apiUrl}/api/discounts/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Uygulama başarısız");

      message.success("İndirim güncellendi.");
      setModalVisible(false);

      // Listeyi yenile
      const updated = await fetchWithAuth(`${apiUrl}/api/discounts/products`);
      setDiscounted(await updated.json());
    } catch (err) {
      console.error(err);
      message.error("Uygulama hatası.");
    } finally {
      setLoading(false);
    }
  };

  // Tablo sütunları
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
  ];

  return (
    <Spin spinning={loading}>
      {/* İndirim Üret Butonu */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setModalVisible(true)}
      >
        İndirim Üret
      </Button>

      {/* İndirim Modalı */}
      <Modal
        title="Kategori/Marka Bazlı İndirim Oluştur"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        maskClosable
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Select
            placeholder="Kategori seç"
            value={selCat}
            onChange={onCatChange}
            style={{ width: 200 }}
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
            style={{ width: 300 }}
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
          />

          <Button type="primary" onClick={applyDiscount}>
            Uygula
          </Button>
        </div>
      </Modal>

      {/* İndirimli Ürünler Tablosu */}
      <Table
        rowKey="_id"
        dataSource={discounted}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </Spin>
  );
};

export default DiscountPage;
