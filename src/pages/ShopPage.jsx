// /Applications/Works/e-commerce/frontend/src/pages/ShopPage.jsx
import { Fragment, useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom"; // ← useNavigate ekledik
import CategoryHeader from "../components/Layout/Headers/CategoryHeader";
import ProductFilter from "../components/Products/ProductFilter";
import ProductList from "../components/Products/ProductList";
import "./ShopPage.css";

const ShopPage = () => {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const onlyDiscounted = searchParams.get("discounted") === "true";
  const navigate = useNavigate(); // ← navigate

  const [categories, setCategories] = useState([]);
  const [decodedCategoryName, setDecodedCategoryName] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Kategori alınamadı:", err));
  }, []);

  useEffect(() => {
    if (categorySlug && categories.length) {
      const match = categories.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      setDecodedCategoryName(match ? match.name : "");
    } else {
      setDecodedCategoryName("");
    }
    setSelectedBrands([]);
  }, [categorySlug, categories]);

  // Kapat butonuna tıklandığında aramayı temizle
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
