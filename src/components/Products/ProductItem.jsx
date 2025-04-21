//Applications/Works/kozmetik/frontend/src/components/ProductItem.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductItem.css";
import ProductDetailsModal from "../ProductDetails/ProductDetailsModal";

const ProductItem = ({ productItem }) => {
  const averageRating = productItem?.averageRating ?? 0;

  const originalPrice = productItem?.price?.current ?? 0;
  const discountPercentage = productItem?.price?.discount ?? 0;
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const handleCardClick = () => navigate(`/product/${productItem?._id}`);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <ul className="product-star">
        {[...Array(full)].map((_, i) => (
          <li key={`f-${i}`}><i className="bi bi-star-fill" /></li>
        ))}
        {half && <li key="half"><i className="bi bi-star-half" /></li>}
        {[...Array(empty)].map((_, i) => (
          <li key={`e-${i}`}><i className="bi bi-star" /></li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div
        className="product-item glide__slide glide__slide--active"
        onClick={handleCardClick}
      >
        <div
          className="product-image"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal();
          }}
        >
          <img src={productItem?.img[0]} alt={productItem?.name} />
        </div>

        <div className="product-info">
          <a href="#!" className="product-title">
            {productItem?.name}
          </a>
          <div className="product-star">
            {renderStars(averageRating)}
          </div>
          <div className="product-prices">
            <strong className="new-price">
              ₺{discountedPrice.toFixed(2)}
            </strong>
            <span className="old-price">
              ₺{originalPrice.toFixed(2)}
            </span>
          </div>
          {/* İndirim yüzdesi 0 ise burası görünmeyecek */}
          {discountPercentage > 0 && (
            <span className="product-discount">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>

      <ProductDetailsModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        singleProduct={productItem}
        setSingleProduct={() => {}}
      />
    </>
  );
};

ProductItem.propTypes = {
  productItem: PropTypes.object.isRequired,
};

export default ProductItem;