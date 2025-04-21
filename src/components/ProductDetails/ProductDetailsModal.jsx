import { useEffect, useState } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import ProductDetails from "./ProductDetails";

const ProductDetailsModal = ({
  isVisible,
  onClose,
  singleProduct,
  setSingleProduct,
}) => {
  const [fullProduct, setFullProduct] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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

    if (isVisible) {
      fetchFullProduct();
    }
  }, [isVisible, singleProduct, apiUrl]);

  if (!fullProduct) return null;

  const convertedProduct = {
    ...fullProduct,
    img: Array.isArray(fullProduct?.img)
      ? fullProduct.img.map((img, index) =>
          typeof img === "string" ? { _id: index.toString(), base64: img } : img
        )
      : [],
    price: fullProduct.price,
    reviews: fullProduct.reviews ?? [],
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      title={null}
      closable={true}
      maskClosable={true}
      width="80vw"
      style={{ top: 20 }}
    >
      <ProductDetails
        singleProduct={convertedProduct}
        setSingleProduct={setSingleProduct}
        compact={true}
        priceSymbol="₺"
      />
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
