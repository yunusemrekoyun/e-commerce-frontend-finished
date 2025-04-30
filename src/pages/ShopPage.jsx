import { Fragment, useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import CategoryHeader from "../components/Layout/Headers/CategoryHeader";
import ProductFilter from "../components/Products/ProductFilter";
import ProductList from "../components/Products/ProductList";
import "./ShopPage.css";

const ShopPage = () => {
  const { category: categorySlug } = useParams(); // Kategori Slug'ı
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onlyDiscounted = searchParams.get("discounted") === "true"; // Discount parametresi
  const brandSlug = searchParams.get("brand"); // Brand parametresi
  const [categories, setCategories] = useState([]); // Kategoriler
  const [decodedCategoryName, setDecodedCategoryName] = useState(""); // Decoded kategori adı
  const [isLoading, setIsLoading] = useState(true); // Yükleniyor durumu

  // URL'deki brand parametresini çöz
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Kategorileri çekme
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((r) => r.json())
      .then((response) => setCategories(response.data || []))
      .catch((e) => console.error("Kategori alınamadı:", e));
  }, []);

  // URL'deki marka parametresini kontrol et
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
      setIsLoading(false); // Yükleme tamamlandı
    } else {
      setDecodedCategoryName(""); // Eğer kategori slug'ı yoksa boş bırak
      setIsLoading(false); // Yükleme tamamlandı
    }
  }, [categorySlug, categories]);

  // Kategori parametresi ve marka parametresi birlikte kontrol ediliyor
  useEffect(() => {
    if (!categorySlug && !brandSlug) {
      // Eğer ne kategori ne de marka parametresi varsa
      setDecodedCategoryName("");
      setIsLoading(false);
    }
  }, [categorySlug, brandSlug]);

  // Sayfayı güncelleme işlemi
  useEffect(() => {
    // Kategori veya marka parametreleri değişirse, yeni veriler çekilecek
    if (categorySlug || brandSlug) {
      setIsLoading(true);
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

      {/* Loading durumu */}
      {isLoading ? (
        <div className="loading">Yükleniyor...</div>
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