/********************************************************
 * /components/ProductDetails/ProductDetailsModal.jsx
 ********************************************************/
import { Modal } from "antd";
import PropTypes from "prop-types";
import ProductDetails from "./ProductDetails";

/**
 * Bu bileşen, ProductDetails'i bir Modal (pop-up) içinde göstermek için kullanılır.
 * - isVisible: Modal açık/kapalı kontrolü
 * - onClose: Modal kapatıldığında yapılacak eylem
 * - singleProduct, setSingleProduct => Ürün detayları (aynı props'u ProductDetails alıyor)
 */
const ProductDetailsModal = ({
  isVisible,
  onClose,
  singleProduct,
  setSingleProduct,
}) => {
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}        // Alttaki butonlar kapansın
      title={null}         // Üst başlık kapansın
      closable={true}      // X butonu görünsün
      maskClosable={true}  // Maske (arka plan) tıklanınca kapansın
      width="80vw"         // Daha geniş bir modal (istersen ayarla)
      style={{ top: 20 }}  // Biraz yukarıda açılsın istersen
    >
      <ProductDetails
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
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