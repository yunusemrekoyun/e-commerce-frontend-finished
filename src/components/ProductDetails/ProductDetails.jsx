//burası product ile ilgili tüm detayların  olduğu sayfa

import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import PropTypes from "prop-types";
import Info from "./Info/Info";
import "./ProductDetails.css";
import Tabs from "./Tabs/Tabs";

const ProductDetails = ({ singleProduct, setSingleProduct, compact = false }) => {
  return (
    <section className="single-product">
      <div className="container">
        <div className="single-product-wrapper">
          {/* ❌ Breadcrumb sadece normal modda göster */}
          {!compact && <Breadcrumb />}

          <div className="single-content">
            <main className="site-main">
              {/* ✅ Her modda Gallery */}
              <Gallery singleProduct={singleProduct} />

              {/* ✅ Her modda Info (isim, fiyat, sepete ekle) */}
              <Info singleProduct={singleProduct} />
            </main>
          </div>

          {/* ❌ Tabs sadece normal modda göster */}
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