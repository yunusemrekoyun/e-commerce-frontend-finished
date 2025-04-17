/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Products/ProductList.jsx
 ********************************************************/
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ProductItem from "./ProductItem";
import "./ProductList.css";

const ProductList = ({ categoryName, selectedBrands }) => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [allLoaded, setAllLoaded] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (categoryName) params.append("category", categoryName);
      if (selectedBrands.length)
        params.append("brand", selectedBrands.join(","));

      const res = await fetch(`${apiUrl}/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
      setVisibleCount(20);
      setAllLoaded(data.length <= 20);
    } catch (err) {
      console.error("Ürün alınamadı:", err);
    }
  }, [apiUrl, categoryName, selectedBrands]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayed = products.slice(0, visibleCount);

  return (
    <section className="products">
      <div className="section-title">
        {categoryName && (
          <>
            <h2>{categoryName} Kategorisindeki Ürünler</h2>
            <p>Summer Collection New Modern Design</p>
          </>
        )}
      </div>
      <div className="product-list">
        {displayed.map((p) => (
          <ProductItem key={p._id} productItem={p} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        {!allLoaded && displayed.length < products.length && (
          <button onClick={() => setVisibleCount((c) => c + 20)}>
            Daha Fazla Ürün
          </button>
        )}
        {allLoaded && <p>Başka ürün yok</p>}
      </div>
    </section>
  );
};

ProductList.propTypes = {
  categoryName: PropTypes.string,
  selectedBrands: PropTypes.array.isRequired,
};

export default ProductList;
