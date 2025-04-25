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
  const [decodedCategoryName, setDecoded] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  /* URL'deki brand parametresini bir kez çöz ------------------------------ */
  const selectedFromUrl = useMemo(() => {
    const p = searchParams.get("brand");
    return p ? p.split(",").map((b) => b.trim().toLowerCase()) : [];
  }, [searchParams]);

  useLayoutEffect(() => setSelectedBrands(selectedFromUrl), [selectedFromUrl]);

  /* kategorileri çek ------------------------------------------------------- */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch((e) => console.error("Kategori alınamadı:", e));
  }, []);

  /* slug → gerçek isim ----------------------------------------------------- */
  useEffect(() => {
    if (categorySlug && categories.length) {
      const m = categories.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      setDecoded(m ? m.name : "");
    } else setDecoded("");
  }, [categorySlug, categories]);

  /* indirim filtresini temizle -------------------------------------------- */
  const clearDiscount = () =>
    navigate(categorySlug ? `/shop/${categorySlug}` : "/shop");

  return (
    <Fragment>
      <CategoryHeader />

      {onlyDiscounted && (
        <div className="discount-badge">
          <span>İndirimli Ürünler</span>
          <button className="discount-badge__close" onClick={clearDiscount}>
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
