import { useLayoutEffect } from "react";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import PropTypes from "prop-types";
import Info from "./Info/Info";
import "./ProductDetails.css";
import Tabs from "./Tabs/Tabs";

const ProductDetails = ({
  singleProduct,
  setSingleProduct,
  compact = false,
}) => {
  // DOM sıralamasını yalnızca ürün yüklendiğinde düzenle
  useLayoutEffect(() => {
    if (!singleProduct) return; // Ürün gelmeden işlem yapma

    const productContent = document.querySelector(".single-content");
    if (!productContent) return;

    const galleryEl = productContent.querySelector(".gallery"); // Gallery
    const infoEl = productContent.querySelector(".info"); // Info
    const tabsEl = productContent.querySelector(".tabs"); // Tabs

    // 1️⃣ Gallery'i, Info'dan önce taşı
    if (galleryEl && infoEl && galleryEl !== infoEl.previousElementSibling) {
      productContent.insertBefore(galleryEl, infoEl);
    }

    // 2️⃣ Tabs'i, Info'nun altına taşı
    if (tabsEl && infoEl && tabsEl !== infoEl.nextElementSibling) {
      productContent.appendChild(tabsEl);
    }
  }, [singleProduct]);

  return (
    <section className="single-product">
      <div className="container">
        <div className="single-product-wrapper">
          {/* Breadcrumb sadece normal modda ve ürün yüklendiğinde */}
          {!compact && singleProduct && (
            <Breadcrumb
              category={singleProduct.category}
              brand={singleProduct.brand}
              productName={singleProduct.name} // ← burayı ekledik
            />
          )}

          <div className="single-content">
            <main className="site-main">
              <Gallery singleProduct={singleProduct} />
              <Info singleProduct={singleProduct} />
            </main>
          </div>

          {!compact && (
            <Tabs
              singleProduct={singleProduct}
              setSingleProduct={setSingleProduct}
            />
          )}
        </div>
      </div>
    </section>
  );
};

ProductDetails.propTypes = {
  singleProduct: PropTypes.object,
  setSingleProduct: PropTypes.func,
  compact: PropTypes.bool,
};

export default ProductDetails;