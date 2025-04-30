import { useEffect, useLayoutEffect, useState } from "react";
import { Modal, message } from "antd"; // message'ı import ettik
import PropTypes from "prop-types";
import ProductDetails from "./ProductDetails";
import "./ProductDetailsModal.css";

const ProductDetailsModal = ({
  isVisible,
  onClose,
  singleProduct,
  setSingleProduct,
}) => {
  const [fullProduct, setFullProduct] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  /* --- Ürünü getir --- */
  useEffect(() => {
    const fetchFullProduct = async () => {
      if (!singleProduct?._id) return;
      try {
        const res = await fetch(`${apiUrl}/api/products/${singleProduct._id}`);
        const data = await res.json();
        setFullProduct(data);
      } catch (err) {
        console.error("Ürün detayı alınamadı", err);
      }
    };

    if (isVisible) fetchFullProduct();
  }, [isVisible, singleProduct, apiUrl]);

  /* --- DOM sıralamasını yalnız modal açıkken düzenle --- */
  useLayoutEffect(() => {
    if (!isVisible || !fullProduct) return; // veri gelmeden çalışmasın

    const modalBody = document.querySelector(".ant-modal-body");
    if (!modalBody) return;

    const reviewEl = modalBody.querySelector(".product-review"); // yıldız & yorum
    const descEl = modalBody.querySelector(".product-description"); // açıklama
    const priceEl = modalBody.querySelector(".product-price"); // fiyat
    const cartBtnEl = modalBody.querySelector(".cart-button"); // adet + Sepete Ekle

    /* 1️⃣  Açıklamayı yıldız/yorum bloğunun hemen altına taşı */
    if (reviewEl && descEl && reviewEl.nextSibling !== descEl) {
      reviewEl.parentNode.insertBefore(descEl, reviewEl.nextSibling);
    }

    /* 2️⃣  Fiyatı, CartButton’un hemen üstüne (seçeneklerden sonra) taşı */
    if (priceEl && cartBtnEl && priceEl.nextSibling !== cartBtnEl) {
      cartBtnEl.parentNode.insertBefore(priceEl, cartBtnEl);
    }
  }, [isVisible, fullProduct]);

  if (!fullProduct) return null;

  /* Resimleri { _id, base64 } formuna çevir */
  const convertedProduct = {
    ...fullProduct,
    img: Array.isArray(fullProduct.img)
      ? fullProduct.img.map((img, idx) =>
          typeof img === "string" ? { _id: idx.toString(), base64: img } : img
        )
      : [],
    reviews: fullProduct.reviews ?? [],
  };

  /* Sepete Ekle butonuna tıklama işlemi */
  const handleAddToCart = () => {
    // Sepete ekleme işlemi burada yapılacak
    // Örneğin, sepete ekleme API çağrısı yapılabilir veya bir state güncellenebilir

    // Başarıyla sepete eklendi mesajı
    message.success(`${convertedProduct.name} başarıyla sepete eklendi.`);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      title={null}
      closable
      maskClosable
      destroyOnClose
      width="80vw"
      style={{ top: 20 }}
    >
      <ProductDetails
        singleProduct={convertedProduct}
        setSingleProduct={setSingleProduct}
        compact={false} /* yıldız & yorum bloğu görünür */
        priceSymbol="₺"
      />
      <button onClick={handleAddToCart} className="cart-button">
        
      </button>
    </Modal>
  );
};

ProductDetailsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  singleProduct: PropTypes.object,
  setSingleProduct: PropTypes.func,
};

export default ProductDetailsModal;