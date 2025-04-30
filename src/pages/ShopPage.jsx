import { Fragment, useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import CategoryHeader from "../components/Layout/Headers/CategoryHeader";
import ProductFilter from "../components/Products/ProductFilter";
import ProductList from "../components/Products/ProductList";
import "./ShopPage.css";

const ShopPage = () => {
  const { category: categorySlug } = useParams(); 
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onlyDiscounted = searchParams.get("discounted") === "true";
  const brandSlug = searchParams.get("brand");
  const [categories, setCategories] = useState([]);
  const [decodedCategoryName, setDecodedCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading durumu

  const [selectedBrands, setSelectedBrands] = useState([]);

  // Kategorileri çekme
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        const data = await response.json();
        setCategories(data.data || []);
        
        // Kategoriler yüklendikten sonra bir süre bekle, sonra isLoading'i false yap
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // 1 saniye bekle, sonra loading'i false yap
      } catch (e) {
        console.error("Kategori alınamadı:", e);
        setIsLoading(false); // Hata durumunda da loading'i kaldır
      }
    };

    fetchCategories();
  }, []);

  // Marka parametresi
  useEffect(() => {
    if (brandSlug) {
      setSelectedBrands([brandSlug]);
    } else {
      setSelectedBrands([]);
    }
  }, [brandSlug]);

  // Kategori parametresini çözerek doğru kategoriyi bul
  useEffect(() => {
    if (categorySlug && categories.length) {
      const category = categories.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      setDecodedCategoryName(category ? category.name : "");
    } else {
      setDecodedCategoryName("");
    }
  }, [categorySlug, categories]);

  // Sayfa güncelleme işlemi
  useEffect(() => {
    if (!categorySlug && !brandSlug) {
      setDecodedCategoryName("");
      setIsLoading(false);
    }
  }, [categorySlug, brandSlug]);

  return (
    <Fragment>
      <CategoryHeader categories={categories} isLoading={isLoading} />

      {onlyDiscounted && (
        <div className="discount-badge">
          <span>İndirimli Ürünler</span>
          <button className="discount-badge__close" onClick={() => navigate("/shop")}>
            ×
          </button>
        </div>
      )}

      {/* Yükleniyor durumu */}
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <div className="shop-content">
          <div className="shop-layout">
            <ProductFilter
              categoryName={decodedCategoryName}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
            />
            <ProductList
              categoryName={decodedCategoryName}
              selectedBrands={selectedBrands}
              onlyDiscounted={onlyDiscounted}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ShopPage;