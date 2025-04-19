import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router'dan useNavigate'i ekledik
import "./ProductItem.css";
import ProductDetailsModal from "../ProductDetails/ProductDetailsModal";

const ProductItem = ({ productItem }) => {
  const originalPrice = productItem.price.current;
  const discountPercentage = productItem.price.discount;
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const navigate = useNavigate(); // useNavigate hook'u kullanarak sayfalar arası geçiş

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCardClick = () => {
    navigate(`/product/${productItem._id}`); // React Router ile yönlendirme
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    let totalRating = 0;
    let totalReviews = 0;

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      if (review.rating) {
        totalRating += review.rating;
        totalReviews += 1;
      }
    }

    return totalReviews === 0 ? 0 : (totalRating / totalReviews).toFixed(1);
  };

  useEffect(() => {
    if (productItem?.reviews) {
      const avgRating = calculateAverageRating(productItem.reviews);
      setAverageRating(avgRating);
    }
  }, [productItem]);

  const renderStars = () => {
    const filledStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <i key={`filled-${index}`} className="bi bi-star-fill"></i>
        ))}
        {halfStar && <i key="half" className="bi bi-star-half"></i>}
        {[...Array(emptyStars)].map((_, index) => (
          <i key={`empty-${index}`} className="bi bi-star"></i>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (window.Glide) {
      const glide = new window.Glide('.glide');
      glide.update();
    }
  }, []);

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
          <img src={productItem.img[0]} alt={productItem.name} />
        </div>

        <div className="product-info">
          <a href="#!" className="product-title">
            {productItem.name}
          </a>
          <div className="product-star">
            {renderStars()}
          </div>
          <div className="product-prices">
            <strong className="new-price">${discountedPrice.toFixed(2)}</strong>
            <span className="old-price">${originalPrice.toFixed(2)}</span>
          </div>
          <span className="product-discount">-{discountPercentage}%</span>
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