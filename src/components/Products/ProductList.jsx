/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Products/ProductList.jsx
 ********************************************************/
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { message, Collapse, Checkbox, Slider, Select, Row, Col } from "antd";
import ProductItem from "./ProductItem";
import "./ProductList.css";

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 1) Kategoriler, Renkler, Bedenler => Dinamik
  const [allCategories, setAllCategories] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  // 2) Filtre State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortValue, setSortValue] = useState("dateDesc");

  // 3) useEffect -> Kategorileri ve distinct Colors/Sizes çek
  useEffect(() => {
    fetchAllCategories();
    fetchDistinctFilters();
  }, [apiUrl]);

  const fetchAllCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/categories`);
      if (!res.ok) {
        return message.error("Kategoriler alınamadı");
      }
      const data = await res.json();
      setAllCategories(data);
    } catch (error) {
      console.error("Kategori çekme hatası:", error);
      message.error("Sunucudan kategoriler alınırken bir hata oluştu.");
    }
  };

  const fetchDistinctFilters = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products/filters`);
      if (!res.ok) {
        return message.error("Renk/Beden bilgileri alınamadı");
      }
      const data = await res.json(); // { colors: [...], sizes: [...] }
      setColorOptions(data.colors || []);
      setSizeOptions(data.sizes || []);
    } catch (error) {
      console.error("filters endpoint error:", error);
      message.error("Sunucudan renk/beden bilgisi alınırken bir hata oluştu.");
    }
  };

  // 4) Filtreler/Sıralama değişince ürünleri fetch
  useEffect(() => {
    fetchProducts();
  }, [
    category,
    selectedCategory,
    selectedColors,
    selectedSizes,
    priceRange,
    sortValue,
  ]);

  const fetchProducts = async () => {
    try {
      let endpoint = `${apiUrl}/api/products?`;
      const queryParams = [];

      // Kategori: props.category varsa sabit, yoksa selectedCategory
      const finalCategory = category || selectedCategory;
      if (finalCategory) {
        queryParams.push(`category=${encodeURIComponent(finalCategory)}`);
      }

      // Renkler => "Red,Blue"
      if (selectedColors.length > 0) {
        queryParams.push(`colors=${selectedColors.join(",")}`);
      }

      // Bedenler => "M,L"
      if (selectedSizes.length > 0) {
        queryParams.push(`sizes=${selectedSizes.join(",")}`);
      }

      // Fiyat aralığı
      queryParams.push(`priceMin=${priceRange[0]}`);
      queryParams.push(`priceMax=${priceRange[1]}`);

      // Sıralama
      queryParams.push(`sort=${sortValue}`);

      if (queryParams.length > 0) {
        endpoint += queryParams.join("&");
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setVisibleCount(20);
        setAllProductsLoaded(data.length <= 20);
      } else {
        message.error("Veri getirme başarısız.");
      }
    } catch (error) {
      console.log("Veri hatası:", error);
      message.error("Sunucudan ürünler alınırken bir hata oluştu.");
    }
  };

  // 5) Slice
  const displayedProducts = products.slice(0, visibleCount);

  // 6) "Daha fazla ürün"
  const handleLoadMore = () => {
    const newCount = visibleCount + 20;
    setVisibleCount(newCount);
    if (newCount >= products.length) {
      setAllProductsLoaded(true);
    }
  };

  // 7) Handler'lar
  const handleCategoryChange = (val) => setSelectedCategory(val);
  const handleColorChange = (vals) => setSelectedColors(vals);
  const handleSizeChange = (vals) => setSelectedSizes(vals);
  const handlePriceChange = (val) => setPriceRange(val);
  const handleSortChange = (val) => setSortValue(val);

  // Sıralama opsiyonları sabit
  const sortOptions = [
    { value: "priceAsc", label: "Fiyata Göre (Artan)" },
    { value: "priceDesc", label: "Fiyata Göre (Azalan)" },
    { value: "nameAsc", label: "İsme Göre (A-Z)" },
    { value: "nameDesc", label: "İsme Göre (Z-A)" },
    { value: "dateAsc", label: "Tarihe Göre (Eski-Önce)" },
    { value: "dateDesc", label: "Tarihe Göre (Yeni-Önce)" },
  ];

  return (
    <section className="products" style={{ display: "flex", gap: "16px" }}>
      {/* Filtre Paneli */}
      <div style={{ width: "250px" }}>
        <Collapse defaultActiveKey={["sort-panel", "cat-panel", "color-panel"]}>
          {/* Sıralama */}
          <Collapse.Panel header="Sıralama" key="sort-panel">
            <Select
              style={{ width: "100%" }}
              value={sortValue}
              onChange={handleSortChange}
              options={sortOptions}
            />
          </Collapse.Panel>

          {/* Kategori filtresi => Sadece props.category YOKSA */}
          {!category && (
            <Collapse.Panel header="Kategori" key="cat-panel">
              <p>Kategori seç:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Select a category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                // Tüm kategoriler => allCategories => map
                options={allCategories.map((cat) => ({
                  value: cat.name,
                  label: cat.name,
                }))}
              />
            </Collapse.Panel>
          )}

          {/* Renk */}
          <Collapse.Panel header="Renk" key="color-panel">
            <Checkbox.Group value={selectedColors} onChange={handleColorChange}>
              {colorOptions.map((col) => (
                <Checkbox key={col} value={col} style={{ display: "block" }}>
                  {col}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Collapse.Panel>

          {/* Beden */}
          <Collapse.Panel header="Beden" key="size-panel">
            <Checkbox.Group value={selectedSizes} onChange={handleSizeChange}>
              {sizeOptions.map((sz) => (
                <Checkbox key={sz} value={sz} style={{ display: "block" }}>
                  {sz}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Collapse.Panel>

          {/* Fiyat */}
          <Collapse.Panel header="Fiyat Aralığı" key="price-panel">
            <Row gutter={16}>
              <Col span={24}>
                <Slider
                  range
                  min={0}
                  max={2000}
                  step={10}
                  value={priceRange}
                  onChange={handlePriceChange}
                />
                <div>
                  Min: {priceRange[0]} - Max: {priceRange[1]}
                </div>
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
      </div>

      {/* Ürün Listesi */}
      <div style={{ flex: 1 }}>
        <div className="section-title">
          {category || selectedCategory ? (
            <>
              <h2>{category || selectedCategory} Kategorisindeki Ürünler</h2>
              <p>Summer Collection New Modern Design</p>
            </>
          ) : (
            <>
              <h2>Tüm Ürünler</h2>
              <p>Summer Collection New Modern Design</p>
            </>
          )}
        </div>

        <div className="product-list">
          {displayedProducts.map((product) => (
            <ProductItem key={product._id} productItem={product} />
          ))}
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {!allProductsLoaded && displayedProducts.length < products.length && (
            <button
              onClick={handleLoadMore}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Daha Fazla Ürün Göster
            </button>
          )}

          {allProductsLoaded && (
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
              Listelenecek başka ürün yok
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

ProductList.propTypes = {
  category: PropTypes.string,
};

export default ProductList;
