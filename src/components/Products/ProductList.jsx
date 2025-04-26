import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ProductItem from "./ProductItem";
import "./ProductList.css";
import { Spin } from "antd";

const ProductList = ({
  categoryName,
  selectedBrands,
  onlyDiscounted = false,
}) => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [allLoaded, setAllLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (categoryName) {
        params.append("category", categoryName);
      }

      if (selectedBrands.length > 0) {
        selectedBrands.forEach((b) => {
          /* özel karakterleri (& gibi) güvenli hâle getiriyoruz */
          params.append("brand", encodeURIComponent(b));
        });
      }

      const fullUrl = `${apiUrl}/api/products?${params.toString()}`;

      setIsLoading(true);
      const res = await fetch(fullUrl);
      const data = await res.json();
      setProducts(data);
      setVisibleCount(20);
      setAllLoaded(data.length <= 20);
      setIsLoading(false);
    } catch (err) {
      console.error("Ürün alınamadı:", err);
      setIsLoading(false);
    }
  }, [apiUrl, categoryName, selectedBrands]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = onlyDiscounted
    ? products.filter((p) => (p.price?.discount ?? 0) > 0)
    : products;

  const displayed = filteredProducts.slice(0, visibleCount);

  return (
    <section className="products">
      <div className="section-title">
        {categoryName && (
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              backgroundColor: "#f0f0f0",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            <strong>
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            </strong>{" "}
            Kategorisindeki Ürünler
          </div>
        )}
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <Spin tip="Yükleniyor..." size="large">
            <div style={{ minHeight: "100px" }} />{" "}
          </Spin>
        </div>
      ) : (
        <>
          <div className="product-list">
            {displayed.map((p) => (
              <ProductItem key={p._id} productItem={p} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            {!allLoaded && displayed.length < filteredProducts.length && (
              <button onClick={() => setVisibleCount((c) => c + 20)}>
                Daha Fazla Ürün
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

ProductList.propTypes = {
  categoryName: PropTypes.string,
  selectedBrands: PropTypes.array.isRequired,
  onlyDiscounted: PropTypes.bool,
};

export default ProductList;
