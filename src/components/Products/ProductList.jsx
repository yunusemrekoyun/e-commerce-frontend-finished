/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Products/ProductList.jsx
 ********************************************************/
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import ProductItem from "./ProductItem";
import "./ProductList.css";

/**
 * @param {string} category => eğer null/undefined ise tüm ürünler çekilir,
 * aksi halde sadece o kategoriye ait ürünler çekilir
 */
const ProductList = ({ category}) => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 1) Kategoriye göre ürünleri fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // eğer category varsa URL'ye ?category=xxx ekle
        let endpoint = `${apiUrl}/api/products`;
        if (category) {
          endpoint += `?category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          // slice reset
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
    fetchProducts();
  }, [apiUrl, category]);

  // 2) Gösterilecek ürünler => slice
  const displayedProducts = products.slice(0, visibleCount);

  // 3) Daha Fazla Ürün Göster
  const handleLoadMore = () => {
    const newCount = visibleCount + 20;
    setVisibleCount(newCount);

    if (newCount >= products.length) {
      setAllProductsLoaded(true);
    }
  };

  return (
    <section className="products">
      <div className="section-title">
        {category ? (
          <>
            <h2>{category} Kategorisindeki Ürünler</h2>
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
    </section>
  );
};
ProductList.propTypes = {
  category: PropTypes.string,
};

export default ProductList;