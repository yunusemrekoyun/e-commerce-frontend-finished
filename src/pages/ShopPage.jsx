import { Fragment, useState, useEffect, useLayoutEffect, useMemo } from "react";
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
  const [categories, setCategories] = useState([]);
  const [decodedCategoryName, setDecodedCategoryName] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  // ✅ URL'den brand parametresini bir kere hesapla
  const selectedBrandsFromUrl = useMemo(() => {
    const brandParam = searchParams.get("brand");
    return brandParam ? brandParam.split(",") : [];
  }, [searchParams]);

  // ✅ Sayfa açıldığında selectedBrands state'ini URL'e göre belirle
  useLayoutEffect(() => {
    setSelectedBrands(selectedBrandsFromUrl);
  }, [selectedBrandsFromUrl]);

  // ✅ Kategorileri getir
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Kategori alınamadı:", err));
  }, []);

  // ✅ Kategori slug'ı değişince decoded halini bul
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const match = categories.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      setDecodedCategoryName(match ? match.name : "");
    } else {
      setDecodedCategoryName("");
    }
  }, [categorySlug, categories]);

  // ✅ İndirim filtresini temizle
  const clearDiscountFilter = () => {
    if (categorySlug) {
      navigate(`/shop/${categorySlug}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <Fragment>
      <CategoryHeader />

      {onlyDiscounted && (
        <div className="discount-badge">
          <span>İndirimli Ürünler</span>
          <button
            className="discount-badge__close"
            onClick={clearDiscountFilter}
          >
            ×
          </button>
        </div>
      )}

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
    </Fragment>
  );
};

export default ShopPage;
