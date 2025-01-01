import { useEffect, useState } from "react";
import { message } from "antd";
import ProductItem from "./ProductItem"; // Mevcut ProductItem bileşeniniz
import "./ProductList.css"; // Tüm stiller burada

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // İlk etapta 20 ürün
  const [allProductsLoaded, setAllProductsLoaded] = useState(false); // Tüm ürünler yüklendi mi?

  // API URL
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Sayfa ilk yüklendiğinde ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          message.error("Veri getirme başarısız.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
        message.error("Sunucudan ürünler alınırken bir hata oluştu.");
      }
    };
    fetchProducts();
  }, [apiUrl]);

  // Gösterilecek ürünler (slice)
  const displayedProducts = products.slice(0, visibleCount);

  // "Daha Fazla Ürün Göster" butonuna tıklanınca
  const handleLoadMore = () => {
    const newCount = visibleCount + 20;
    setVisibleCount(newCount);

    // Eğer yeni değer toplam ürün sayısını aştıysa "allProductsLoaded" true
    if (newCount >= products.length) {
      setAllProductsLoaded(true);
    }
  };

  return (
    <section className="products">
      <div className="section-title">
        <h2>Featured Products</h2>
        <p>Summer Collection New Morden Design</p>
      </div>

      {/* 4 kolonluk grid yapısı */}
      <div className="product-list">
        {displayedProducts.map((product) => (
          <ProductItem key={product._id} productItem={product} />
        ))}
      </div>

      {/* Buton ve bitiş mesajı */}
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

export default ProductList;
