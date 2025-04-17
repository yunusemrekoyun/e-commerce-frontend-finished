import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CategoryHeader from "../components/Layout/Headers/CategoryHeader";
import ProductFilter from "../components/Products/ProductFilter";
import ProductList from "../components/Products/ProductList";
import "./ShopPage.css";

const ShopPage = () => {
  const { category: categorySlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [decodedCategoryName, setDecodedCategoryName] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Tüm kategorileri çek (marka listesi için de lazım olacak)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Kategori alınamadı:", err));
  }, []);

  // URL slug'ından gerçek kategori adına dön
  useEffect(() => {
    if (categorySlug && categories.length) {
      const match = categories.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      setDecodedCategoryName(match ? match.name : "");
    } else {
      setDecodedCategoryName("");
    }
    // kategori değişince seçili markaları temizle
    setSelectedBrands([]);
  }, [categorySlug, categories]);

  return (
    <Fragment>
      <CategoryHeader />
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
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ShopPage;
